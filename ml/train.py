"""Train Clarivex-1 from scratch on the Clarivex.AI instruction corpus.

Run:  python ml/train.py [--steps 3000] [--batch-size 32]

The script writes:
  ml/artifacts/model.pt        PyTorch checkpoint (weights + config)
  ml/artifacts/model.json      Weights exported for the Node.js runtime
  ml/artifacts/train_log.json  Loss curve and final metrics
"""

from __future__ import annotations

import argparse
import json
import math
import time
from pathlib import Path

import numpy as np
import torch
from tokenizers import Tokenizer

from model import ClarivexGPT, ModelConfig

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
ART_DIR = ROOT / "artifacts"

USER_ID, ASSISTANT_ID, END_ID = 1, 2, 3
IGNORE_INDEX = -1


def load_tokenizer() -> Tokenizer:
    return Tokenizer.from_file(str(ART_DIR / "tokenizer.json"))


def encode_corpus(tokenizer: Tokenizer, path: Path) -> tuple[np.ndarray, np.ndarray]:
    """Tokenise the corpus and mask everything except assistant answers."""
    ids: list[int] = []
    labels: list[int] = []

    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue

        sample = json.loads(line)
        text = f"<|user|>{sample['q']}<|assistant|>{sample['a']}<|end|>"
        toks = tokenizer.encode(text).ids
        ids.extend(toks)

        # Loss is only computed on the assistant answer and the end token.
        in_answer = False
        for tok in toks:
            if tok == ASSISTANT_ID:
                in_answer = True
                labels.append(IGNORE_INDEX)
                continue
            if tok == END_ID:
                labels.append(tok)
                in_answer = False
                continue
            labels.append(tok if in_answer else IGNORE_INDEX)

    return np.array(ids, dtype=np.int32), np.array(labels, dtype=np.int32)


def get_batch(
    ids: np.ndarray,
    labels: np.ndarray,
    block_size: int,
    batch_size: int,
    generator: np.random.Generator,
) -> tuple[torch.Tensor, torch.Tensor]:
    max_start = len(ids) - block_size - 1
    starts = generator.integers(0, max_start, size=batch_size)

    x = np.stack([ids[s : s + block_size] for s in starts])
    y = np.stack([labels[s + 1 : s + block_size + 1] for s in starts])

    return torch.from_numpy(x.astype(np.int64)), torch.from_numpy(y.astype(np.int64))


@torch.no_grad()
def evaluate(
    model: ClarivexGPT,
    ids: np.ndarray,
    labels: np.ndarray,
    block_size: int,
    batch_size: int,
    iters: int,
    generator: np.random.Generator,
) -> float:
    model.eval()
    losses = []
    for _ in range(iters):
        x, y = get_batch(ids, labels, block_size, batch_size, generator)
        _, loss = model(x, y)
        losses.append(loss.item())
    model.train()
    return float(np.mean(losses))


def lr_at(step: int, total: int, peak: float, warmup: int, min_ratio: float = 0.1) -> float:
    if step < warmup:
        return peak * (step + 1) / warmup
    progress = (step - warmup) / max(1, total - warmup)
    cosine = 0.5 * (1 + math.cos(math.pi * progress))
    return peak * (min_ratio + (1 - min_ratio) * cosine)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--steps", type=int, default=3000)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=3e-3)
    parser.add_argument("--warmup", type=int, default=150)
    parser.add_argument("--eval-interval", type=int, default=250)
    parser.add_argument("--eval-iters", type=int, default=40)
    parser.add_argument("--seed", type=int, default=1337)
    parser.add_argument("--threads", type=int, default=0)
    args = parser.parse_args()

    torch.manual_seed(args.seed)
    np.random.seed(args.seed)
    if args.threads:
        torch.set_num_threads(args.threads)

    ART_DIR.mkdir(parents=True, exist_ok=True)
    tokenizer = load_tokenizer()

    print("tokenising corpus...")
    train_ids, train_labels = encode_corpus(tokenizer, DATA_DIR / "train.jsonl")
    val_ids, val_labels = encode_corpus(tokenizer, DATA_DIR / "val.jsonl")
    print(f"train tokens: {len(train_ids):,}  val tokens: {len(val_ids):,}")

    cfg = ModelConfig(vocab_size=tokenizer.get_vocab_size())
    model = ClarivexGPT(cfg)
    print(f"parameters: {model.num_params():,}")

    optimizer = torch.optim.AdamW(
        model.parameters(), lr=args.lr, betas=(0.9, 0.95), weight_decay=0.1
    )

    rng = np.random.default_rng(args.seed)
    history: list[dict] = []
    best_val = float("inf")
    started = time.time()

    for step in range(args.steps):
        lr = lr_at(step, args.steps, args.lr, args.warmup)
        for group in optimizer.param_groups:
            group["lr"] = lr

        x, y = get_batch(train_ids, train_labels, cfg.block_size, args.batch_size, rng)
        _, loss = model(x, y)

        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()

        if step % 50 == 0 or step == args.steps - 1:
            elapsed = time.time() - started
            print(
                f"step {step:5d}/{args.steps}  loss {loss.item():.4f}  "
                f"lr {lr:.2e}  {elapsed:6.1f}s"
            )

        if (step + 1) % args.eval_interval == 0 or step == args.steps - 1:
            val_loss = evaluate(
                model,
                val_ids,
                val_labels,
                cfg.block_size,
                args.batch_size,
                args.eval_iters,
                rng,
            )
            entry = {
                "step": step + 1,
                "train_loss": round(loss.item(), 4),
                "val_loss": round(val_loss, 4),
                "val_perplexity": round(math.exp(val_loss), 2),
            }
            history.append(entry)
            print(f"  eval -> val_loss {val_loss:.4f}  ppl {math.exp(val_loss):.2f}")

            if val_loss < best_val:
                best_val = val_loss
                torch.save(
                    {"model": model.state_dict(), "config": cfg.__dict__},
                    ART_DIR / "model.pt",
                )

    # Always keep the final weights if no eval improved on the best.
    if not (ART_DIR / "model.pt").exists():
        torch.save({"model": model.state_dict(), "config": cfg.__dict__}, ART_DIR / "model.pt")

    checkpoint = torch.load(ART_DIR / "model.pt", map_location="cpu", weights_only=False)
    model.load_state_dict(checkpoint["model"])

    export_weights(model, tokenizer)
    write_log(history, model, args, time.time() - started, best_val)

    print(f"done in {time.time() - started:.1f}s  best val loss {best_val:.4f}")


def export_weights(model: ClarivexGPT, tokenizer: Tokenizer) -> None:
    """Export float32 weights as flat arrays for the Node.js inference runtime."""
    state = {k: v.detach().cpu().numpy() for k, v in model.state_dict().items()}

    tensors: dict[str, dict] = {}
    blobs: list[np.ndarray] = []
    offset = 0

    for name, array in state.items():
        flat = array.astype(np.float32).reshape(-1)
        tensors[name] = {"shape": list(array.shape), "offset": offset, "length": int(flat.size)}
        blobs.append(flat)
        offset += flat.size

    payload = np.concatenate(blobs).astype("<f4")

    vocab = tokenizer.get_vocab()
    id_to_token = {idx: tok for tok, idx in vocab.items()}

    meta = {
        "name": "Clarivex-1",
        "config": model.cfg.__dict__,
        "tensors": tensors,
        "total_params": int(offset),
        "vocab": [id_to_token[i] for i in range(len(id_to_token))],
        "special_tokens": {"pad": 0, "user": 1, "assistant": 2, "end": 3},
    }

    (ART_DIR / "model.json").write_text(json.dumps(meta), encoding="utf-8")
    payload.tofile(str(ART_DIR / "model.bin"))

    print(f"exported {offset:,} params -> model.json + model.bin")


def write_log(
    history: list[dict],
    model: ClarivexGPT,
    args: argparse.Namespace,
    seconds: float,
    best_val: float,
) -> None:
    log = {
        "model": "Clarivex-1",
        "params": model.num_params(),
        "steps": args.steps,
        "batch_size": args.batch_size,
        "peak_lr": args.lr,
        "block_size": model.cfg.block_size,
        "train_seconds": round(seconds, 1),
        "best_val_loss": round(best_val, 4),
        "best_val_perplexity": round(math.exp(best_val), 2),
        "history": history,
    }
    (ART_DIR / "train_log.json").write_text(json.dumps(log, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
