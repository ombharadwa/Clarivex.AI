"""Dump reference logits from the trained checkpoint for parity testing.

Run:  python ml/dump_reference.py
"""

from __future__ import annotations

import json
from pathlib import Path

import torch
from tokenizers import Tokenizer

from model import ClarivexGPT, ModelConfig

ROOT = Path(__file__).resolve().parent
ART = ROOT / "artifacts"

PROMPT = "<|user|>what services do you offer<|assistant|>"


def main() -> None:
    tokenizer = Tokenizer.from_file(str(ART / "tokenizer.json"))
    checkpoint = torch.load(ART / "model.pt", map_location="cpu", weights_only=False)

    cfg = ModelConfig(**checkpoint["config"])
    model = ClarivexGPT(cfg)
    model.load_state_dict(checkpoint["model"])
    model.eval()

    ids = tokenizer.encode(PROMPT).ids
    with torch.no_grad():
        logits, _ = model(torch.tensor([ids]))

    last = logits[0, -1]
    top = torch.topk(last, 5)

    reference = {
        "prompt": PROMPT,
        "ids": ids,
        "last_logits": [round(float(v), 5) for v in last.tolist()],
        "top5_ids": top.indices.tolist(),
        "top5_tokens": [tokenizer.id_to_token(int(i)) for i in top.indices],
        "top5_logits": [round(float(v), 5) for v in top.values.tolist()],
    }

    (ART / "reference.json").write_text(json.dumps(reference, indent=2), encoding="utf-8")
    print(f"prompt ids: {ids}")
    print(f"top5 ids: {reference['top5_ids']}")
    print(f"top5 logits: {reference['top5_logits']}")


if __name__ == "__main__":
    main()
