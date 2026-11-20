import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClarivex1, ChatTurn } from './server/clarivex1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with a larger limit for file attachments
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const MAX_ATTACHMENT_CHARS = 6000;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface IncomingFile {
  name?: string;
  mime?: string;
  text?: string;
}

/** Fold readable attachment text into the final user turn. */
function withAttachments(messages: IncomingMessage[], files: IncomingFile[]): ChatTurn[] {
  const turns: ChatTurn[] = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content ?? ''),
  }));

  const readable = files.filter(f => typeof f?.text === 'string' && f.text.trim());
  if (readable.length === 0) return turns;

  const lastUser = [...turns].reverse().find(t => t.role === 'user');
  if (!lastUser) return turns;

  const context = readable
    .map(f => `[Attached file: ${f.name || 'document'}]\n${f.text!.slice(0, MAX_ATTACHMENT_CHARS)}`)
    .join('\n\n');

  lastUser.content = `${context}\n\n${lastUser.content}`;
  return turns;
}

// ── AI STATUS & CAPABILITIES ──
app.get('/api/ai/status', (_req: Request, res: Response) => {
  const model = getClarivex1();

  res.json({
    activeProvider: 'Clarivex-1 (local)',
    externalProviders: false,
    ready: Boolean(model),
    model: model
      ? {
          name: model.name,
          parameters: model.totalParams,
          layers: model.config.n_layer,
          heads: model.config.n_head,
          embedding: model.config.n_embd,
          contextWindow: model.config.block_size,
          vocabSize: model.config.vocab_size,
        }
      : null,
    features: {
      localInference: true,
      documentIntelligence: true,
      personas: ['general', 'architect', 'strategist', 'auditor'],
    },
  });
});

// ── CHAT ENDPOINT (Clarivex-1, fully local) ──
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, files = [] } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const model = getClarivex1();
    if (!model) {
      return res.status(503).json({
        error:
          'Clarivex-1 weights are not built yet. Run "python ml/train.py" to train and export the model.',
      });
    }

    const turns = withAttachments(messages as IncomingMessage[], files as IncomingFile[]);
    const result = model.generate(turns, {
      maxNewTokens: 260,
      temperature: 0.4,
      topK: 12,
      repetitionPenalty: 1.1,
    });

    return res.json({
      reply: result.text || 'I could not produce an answer for that. Please rephrase the question.',
      model: 'clarivex-1',
      provider: 'clarivex-1',
      grounded: false,
      sources: [],
      usage: {
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        latencyMs: result.ms,
      },
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// ── HEALTH ──
app.get('/api/health', (_req, res) => {
  const model = getClarivex1();
  res.json({
    status: 'ok',
    service: 'Clarivex.AI API',
    model: model ? model.name : 'not-loaded',
    externalProviders: false,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const model = getClarivex1();
    console.log(`Clarivex.AI server listening on http://0.0.0.0:${PORT}`);
    console.log(
      model
        ? `Clarivex-1 loaded: ${model.totalParams.toLocaleString()} parameters`
        : 'Clarivex-1 not loaded — run "python ml/train.py" to build the weights.'
    );
  });
}

startServer();
