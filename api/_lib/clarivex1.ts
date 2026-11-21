/**
 * Clarivex-1 inference runtime.
 *
 * Loads the weights exported by `ml/train.py` (model.json + model.bin) and runs
 * a decoder-only transformer forward pass in pure TypeScript. No native
 * dependencies, no external API calls.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Tokenizer } from '@huggingface/tokenizers';

export interface Clarivex1Config {
  vocab_size: number;
  n_layer: number;
  n_head: number;
  n_embd: number;
  block_size: number;
  dropout: number;
  tie_weights: boolean;
}

interface TensorMeta {
  shape: number[];
  offset: number;
  length: number;
}

interface ModelFile {
  name: string;
  config: Clarivex1Config;
  tensors: Record<string, TensorMeta>;
  total_params: number;
  vocab: string[];
  special_tokens: { pad: number; user: number; assistant: number; end: number };
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  maxNewTokens?: number;
  temperature?: number;
  topK?: number;
  repetitionPenalty?: number;
}

export interface GenerateResult {
  text: string;
  promptTokens: number;
  completionTokens: number;
  ms: number;
}

const ARTIFACT_FILES = ['model.json', 'model.bin', 'tokenizer.json'] as const;

function hasArtifacts(dir: string): boolean {
  try {
    return ARTIFACT_FILES.every(file => fs.existsSync(path.join(dir, file)));
  } catch {
    return false;
  }
}

/**
 * Locate the exported weights.
 *
 * On Vercel the function is bundled into /var/task and `ml/artifacts` is copied
 * alongside it by vercel.json `includeFiles`, so cwd resolves. The module-relative
 * candidates cover bundled layouts where cwd differs from the project root.
 */
function resolveArtifactsDir(): string {
  const candidates: string[] = [];

  const override = process.env.CLARIVEX_ARTIFACTS_DIR;
  if (override) candidates.push(path.resolve(override));

  candidates.push(path.resolve(process.cwd(), 'ml', 'artifacts'));
  candidates.push(path.resolve(process.cwd(), '..', 'ml', 'artifacts'));

  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    // api/_lib -> project root, and the bundled /var/task layout
    candidates.push(path.resolve(here, '..', '..', 'ml', 'artifacts'));
    candidates.push(path.resolve(here, '..', 'ml', 'artifacts'));
    candidates.push(path.resolve(here, 'ml', 'artifacts'));
  } catch {
    // import.meta.url is unavailable under some bundlers
  }

  for (const dir of candidates) {
    if (hasArtifacts(dir)) return dir;
  }

  throw new Error(
    `Clarivex-1 artifacts not found. Looked in:\n${candidates.map(c => `  - ${c}`).join('\n')}\n` +
      'Run "python ml/train.py" to build them, or set CLARIVEX_ARTIFACTS_DIR.'
  );
}

function gelu(x: number): number {
  // tanh approximation, matching torch's default GELU closely enough for inference
  return 0.5 * x * (1 + Math.tanh(0.7978845608028654 * (x + 0.044715 * x * x * x)));
}

export class Clarivex1 {
  private readonly cfg: Clarivex1Config;
  private readonly weights = new Map<string, Float32Array>();
  private readonly tokenizer: Tokenizer;
  private readonly special: ModelFile['special_tokens'];
  readonly totalParams: number;
  readonly name: string;

  private constructor(meta: ModelFile, blob: Float32Array, tokenizer: Tokenizer) {
    this.cfg = meta.config;
    this.special = meta.special_tokens;
    this.totalParams = meta.total_params;
    this.name = meta.name;
    this.tokenizer = tokenizer;

    for (const [name, info] of Object.entries(meta.tensors)) {
      this.weights.set(name, blob.subarray(info.offset, info.offset + info.length));
    }
  }

  static load(artifactsDir?: string): Clarivex1 {
    const dir = artifactsDir ?? resolveArtifactsDir();
    const metaPath = path.join(dir, 'model.json');
    const binPath = path.join(dir, 'model.bin');
    const tokPath = path.join(dir, 'tokenizer.json');

    for (const file of [metaPath, binPath, tokPath]) {
      if (!fs.existsSync(file)) {
        throw new Error(
          `Clarivex-1 artifacts missing: ${file}. Run "python ml/train.py" to build them.`
        );
      }
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as ModelFile;

    const buffer = fs.readFileSync(binPath);
    // A Float32Array view requires a 4-byte aligned offset. Node's Buffer pool
    // does not guarantee that, so copy into a fresh aligned ArrayBuffer when needed.
    const blob =
      buffer.byteOffset % Float32Array.BYTES_PER_ELEMENT === 0
        ? new Float32Array(
            buffer.buffer,
            buffer.byteOffset,
            buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          )
        : new Float32Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

    const rawTokenizer = JSON.parse(fs.readFileSync(tokPath, 'utf8'));
    const tokenizer = new Tokenizer(rawTokenizer, rawTokenizer);

    return new Clarivex1(meta, blob, tokenizer);
  }

  get config(): Clarivex1Config {
    return this.cfg;
  }

  /**
   * Build the prompt the model was trained on.
   *
   * The corpus is single-turn: `<|user|>question<|assistant|>answer<|end|>`.
   * Feeding prior assistant turns makes the model continue the transcript
   * instead of answering, so only the latest user turn is used. Multi-line
   * user content is preserved because the corpus stacks follow-ups with "\n".
   */
  buildPrompt(turns: ChatTurn[]): string {
    const lastUser = [...turns].reverse().find(t => t.role === 'user');
    if (!lastUser) return '<|assistant|>';

    // Collapse runs of spaces/tabs but keep newlines: the corpus uses "\n"
    // to separate stacked user lines within a single turn.
    const content = lastUser.content
      .replace(/\r\n?/g, '\n')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();

    return `<|user|>${content}<|assistant|>`;
  }

  /**
   * Encode the conversation into token ids that fit `maxPrompt`.
   *
   * The prompt always keeps priority over the completion budget: the oldest
   * turns are dropped first, and only if a single turn still overflows is its
   * content trimmed. The trailing `<|assistant|>` marker is never cut, because
   * losing it makes the model continue the user's question instead of answering.
   */
  private encodePrompt(turns: ChatTurn[], maxPrompt: number): number[] {
    const ids = this.tokenizer.encode(this.buildPrompt(turns)).ids as number[];
    if (ids.length <= maxPrompt) return ids;

    const lastUser = [...turns].reverse().find(t => t.role === 'user');
    if (!lastUser) return ids.slice(ids.length - maxPrompt);

    // Trim the user content from the left, keeping the marker overhead intact.
    const contentIds = this.tokenizer.encode(lastUser.content).ids as number[];
    const overhead = Math.max(0, ids.length - contentIds.length);
    const keep = Math.max(1, maxPrompt - overhead);
    const trimmed = this.tokenizer
      .decode(contentIds.slice(contentIds.length - keep), { skip_special_tokens: true })
      .trim();

    const finalIds = this.tokenizer
      .encode(this.buildPrompt([{ role: 'user', content: trimmed }]))
      .ids as number[];

    return finalIds.length <= maxPrompt ? finalIds : finalIds.slice(finalIds.length - maxPrompt);
  }

  generate(turns: ChatTurn[], options: GenerateOptions = {}): GenerateResult {
    const started = Date.now();
    const temperature = options.temperature ?? 0.55;
    const topK = options.topK ?? 20;
    const repetitionPenalty = options.repetitionPenalty ?? 1.12;

    const { block_size } = this.cfg;

    // The prompt must always fit, so reserve a floor of generation room and let
    // the prompt claim the rest. Previously a maxNewTokens larger than
    // block_size collapsed the prompt to a handful of tokens, which silently
    // discarded the user's question.
    const MIN_GEN_TOKENS = 96;
    const promptBudget = Math.max(8, block_size - MIN_GEN_TOKENS);
    const ids = this.encodePrompt(turns, promptBudget);
    const maxNewTokens = Math.max(1, Math.min(options.maxNewTokens ?? 220, block_size - ids.length));

    const cache = this.createCache();
    const logits = new Float32Array(this.cfg.vocab_size);

    let pos = 0;
    for (const id of ids) {
      this.forward(id, pos, cache, logits);
      pos += 1;
    }

    const produced: number[] = [];
    const counts = new Map<number, number>();

    for (let step = 0; step < maxNewTokens && pos < block_size; step++) {
      const next = this.sample(logits, counts, temperature, topK, repetitionPenalty);
      if (next === this.special.end) break;

      produced.push(next);
      counts.set(next, (counts.get(next) ?? 0) + 1);

      this.forward(next, pos, cache, logits);
      pos += 1;
    }

    const text = this.tokenizer
      .decode(produced, { skip_special_tokens: true })
      .trim();

    return {
      text,
      promptTokens: ids.length,
      completionTokens: produced.length,
      ms: Date.now() - started,
    };
  }

  private createCache() {
    const { n_layer, n_embd, block_size } = this.cfg;
    return Array.from({ length: n_layer }, () => ({
      k: new Float32Array(block_size * n_embd),
      v: new Float32Array(block_size * n_embd),
    }));
  }

  private sample(
    logits: Float32Array,
    counts: Map<number, number>,
    temperature: number,
    topK: number,
    repetitionPenalty: number
  ): number {
    const vocab = logits.length;
    const scaled = new Float32Array(vocab);

    for (let i = 0; i < vocab; i++) {
      let value = logits[i] / temperature;
      const seen = counts.get(i);
      if (seen) {
        value = value > 0 ? value / repetitionPenalty : value * repetitionPenalty;
      }
      scaled[i] = value;
    }

    // top-k filtering
    const k = Math.min(topK, vocab);
    const indices = Array.from({ length: vocab }, (_, i) => i);
    indices.sort((a, b) => scaled[b] - scaled[a]);
    const keep = indices.slice(0, k);

    let max = -Infinity;
    for (const i of keep) if (scaled[i] > max) max = scaled[i];

    let sum = 0;
    const probs = new Float32Array(k);
    for (let j = 0; j < k; j++) {
      const p = Math.exp(scaled[keep[j]] - max);
      probs[j] = p;
      sum += p;
    }

    let r = Math.random() * sum;
    for (let j = 0; j < k; j++) {
      r -= probs[j];
      if (r <= 0) return keep[j];
    }
    return keep[k - 1];
  }

  private w(name: string): Float32Array {
    const tensor = this.weights.get(name);
    if (!tensor) throw new Error(`Missing tensor: ${name}`);
    return tensor;
  }

  /** y = x @ W^T, where W has shape [out, in]. */
  private linear(
    x: Float32Array,
    w: Float32Array,
    out: number,
    inp: number,
    y: Float32Array,
    bias?: Float32Array
  ): void {
    for (let o = 0; o < out; o++) {
      const row = o * inp;
      let acc = bias ? bias[o] : 0;
      for (let i = 0; i < inp; i++) {
        acc += x[i] * w[row + i];
      }
      y[o] = acc;
    }
  }

  private layerNorm(
    x: Float32Array,
    weight: Float32Array,
    bias: Float32Array,
    out: Float32Array
  ): void {
    const n = x.length;
    let mean = 0;
    for (let i = 0; i < n; i++) mean += x[i];
    mean /= n;

    let variance = 0;
    for (let i = 0; i < n; i++) {
      const d = x[i] - mean;
      variance += d * d;
    }
    variance /= n;

    const inv = 1 / Math.sqrt(variance + 1e-5);
    for (let i = 0; i < n; i++) {
      out[i] = (x[i] - mean) * inv * weight[i] + bias[i];
    }
  }

  private forward(
    tokenId: number,
    pos: number,
    cache: ReturnType<Clarivex1['createCache']>,
    logits: Float32Array
  ): void {
    const { n_layer, n_embd, n_head } = this.cfg;
    const headDim = n_embd / n_head;
    const scale = 1 / Math.sqrt(headDim);

    const tokEmb = this.w('tok_emb.weight');
    const posEmb = this.w('pos_emb.weight');

    const x = new Float32Array(n_embd);
    const embOffset = tokenId * n_embd;
    const posOffset = pos * n_embd;
    for (let i = 0; i < n_embd; i++) {
      x[i] = tokEmb[embOffset + i] + posEmb[posOffset + i];
    }

    const normed = new Float32Array(n_embd);
    const qkv = new Float32Array(3 * n_embd);
    const attnOut = new Float32Array(n_embd);
    const proj = new Float32Array(n_embd);
    const hidden = new Float32Array(4 * n_embd);
    const mlpOut = new Float32Array(n_embd);
    const scores = new Float32Array(pos + 1);

    for (let layer = 0; layer < n_layer; layer++) {
      const prefix = `blocks.${layer}`;

      // ── attention ──
      this.layerNorm(x, this.w(`${prefix}.ln1.weight`), this.w(`${prefix}.ln1.bias`), normed);
      this.linear(normed, this.w(`${prefix}.attn.qkv.weight`), 3 * n_embd, n_embd, qkv);

      const { k, v } = cache[layer];
      const kOffset = pos * n_embd;
      for (let i = 0; i < n_embd; i++) {
        k[kOffset + i] = qkv[n_embd + i];
        v[kOffset + i] = qkv[2 * n_embd + i];
      }

      for (let h = 0; h < n_head; h++) {
        const qBase = h * headDim;
        let maxScore = -Infinity;

        for (let t = 0; t <= pos; t++) {
          const kBase = t * n_embd + h * headDim;
          let dot = 0;
          for (let d = 0; d < headDim; d++) {
            dot += qkv[qBase + d] * k[kBase + d];
          }
          const s = dot * scale;
          scores[t] = s;
          if (s > maxScore) maxScore = s;
        }

        let sum = 0;
        for (let t = 0; t <= pos; t++) {
          const e = Math.exp(scores[t] - maxScore);
          scores[t] = e;
          sum += e;
        }

        const outBase = h * headDim;
        for (let d = 0; d < headDim; d++) attnOut[outBase + d] = 0;

        for (let t = 0; t <= pos; t++) {
          const p = scores[t] / sum;
          const vBase = t * n_embd + h * headDim;
          for (let d = 0; d < headDim; d++) {
            attnOut[outBase + d] += p * v[vBase + d];
          }
        }
      }

      this.linear(attnOut, this.w(`${prefix}.attn.proj.weight`), n_embd, n_embd, proj);
      for (let i = 0; i < n_embd; i++) x[i] += proj[i];

      // ── mlp ──
      this.layerNorm(x, this.w(`${prefix}.ln2.weight`), this.w(`${prefix}.ln2.bias`), normed);
      this.linear(normed, this.w(`${prefix}.mlp.fc.weight`), 4 * n_embd, n_embd, hidden);
      for (let i = 0; i < hidden.length; i++) hidden[i] = gelu(hidden[i]);
      this.linear(hidden, this.w(`${prefix}.mlp.proj.weight`), n_embd, 4 * n_embd, mlpOut);
      for (let i = 0; i < n_embd; i++) x[i] += mlpOut[i];
    }

    this.layerNorm(x, this.w('ln_f.weight'), this.w('ln_f.bias'), normed);
    this.linear(normed, this.w('head.weight'), this.cfg.vocab_size, n_embd, logits);
  }
}

let cached: Clarivex1 | null = null;
let loadError: Error | null = null;

/** Load the model once per process. Returns null when artifacts are absent. */
export function getClarivex1(): Clarivex1 | null {
  if (cached) return cached;
  if (loadError) return null;

  try {
    cached = Clarivex1.load();
    return cached;
  } catch (err) {
    loadError = err as Error;
    console.warn(`[clarivex-1] ${loadError.message}`);
    return null;
  }
}
