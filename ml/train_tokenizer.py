"""Train a byte-level BPE tokenizer for Clarivex-1.

Run:  python ml/train_tokenizer.py
"""

from __future__ import annotations

import json
from pathlib import Path

from tokenizers import Tokenizer, decoders, models, pre_tokenizers, trainers

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "artifacts"

SPECIAL_TOKENS = ["<|pad|>", "<|user|>", "<|assistant|>", "<|end|>"]
VOCAB_SIZE = 4096


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    tokenizer = Tokenizer(models.BPE(unk_token=None))
    tokenizer.pre_tokenizer = pre_tokenizers.ByteLevel(add_prefix_space=False)
    tokenizer.decoder = decoders.ByteLevel()

    trainer = trainers.BpeTrainer(
        vocab_size=VOCAB_SIZE,
        special_tokens=SPECIAL_TOKENS,
        initial_alphabet=pre_tokenizers.ByteLevel.alphabet(),
        show_progress=False,
    )

    tokenizer.train([str(DATA_DIR / "train.jsonl")], trainer)
    tokenizer.save(str(OUT_DIR / "tokenizer.json"))

    meta = {
        "vocab_size": tokenizer.get_vocab_size(),
        "special_tokens": SPECIAL_TOKENS,
        "token_ids": {tok: tokenizer.token_to_id(tok) for tok in SPECIAL_TOKENS},
    }
    (OUT_DIR / "tokenizer_meta.json").write_text(
        json.dumps(meta, indent=2), encoding="utf-8"
    )

    print(f"vocab size: {meta['vocab_size']}")
    print(f"special ids: {meta['token_ids']}")

    sample = "What services does Clarivex.AI offer?"
    ids = tokenizer.encode(sample).ids
    print(f"sample: {len(sample)} chars -> {len(ids)} tokens")
    print(f"roundtrip ok: {tokenizer.decode(ids) == sample}")


if __name__ == "__main__":
    main()
