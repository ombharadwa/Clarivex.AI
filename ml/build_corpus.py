"""Expand the domain knowledge base into an instruction-tuning corpus.

Output is JSONL (one {"q","a"} object per line) so that answers containing
newlines survive intact. `train.py` turns these pairs into the token stream:

    <|user|>question<|assistant|>answer<|end|>

Run:  python ml/build_corpus.py
"""

from __future__ import annotations

import json
import random
from pathlib import Path

from knowledge import FACTS, KNOWLEDGE

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"

# Question shapes used to paraphrase each canonical question.
PREFIXES = [
    "",
    "hey, ",
    "hi, ",
    "quick question: ",
    "i wanted to ask, ",
    "can you tell me ",
    "please explain ",
    "i need to know ",
    "just wondering, ",
    "for context, ",
]

SUFFIXES = [
    "",
    "?",
    " please",
    " thanks",
    " for my team",
    " in simple terms",
    " briefly",
    " in detail",
]

# Extra phrasings that only make sense for some intents.
EXTRA_TEMPLATES = [
    "{q}",
    "tell me {q}",
    "explain {q}",
    "what about {q}",
    "i want to know about {q}",
    "could you describe {q}",
    "give me details on {q}",
    "summarise {q}",
    "help me understand {q}",
    "any info on {q}",
]

# Follow-up turns so the model learns multi-turn context.
FOLLOW_UPS = [
    ("can you elaborate", "Sure. Tell me which part you want expanded and I will go deeper on that specific area."),
    ("give me an example", "A typical example: a support team replaces its manual ticket triage with an AI classifier that routes each ticket, drafts a first reply, and escalates anything ambiguous to a human."),
    ("what would that cost", "Pricing depends on scope. Starter starts at ₹4,999/month, Growth covers full workflow integration, and Enterprise Custom adds private deployment and SLAs. A free consultation gives you an itemised quote."),
    ("how long would it take", "A focused MVP ships in 6-8 weeks, delivered in 2-3 week increments so you see working software throughout."),
    ("who would work on it", "A typical team is a solution architect, one or two engineers, a designer, and an AI specialist, with a delivery lead as your single point of contact."),
    ("is it secure", "Yes. We use least-privilege access, encrypt data in transit and at rest, and can deploy entirely inside your own cloud tenancy for regulated workloads."),
    ("can we start small", "Absolutely. We usually start with one high-value workflow, prove the outcome, then expand once the numbers are clear."),
    ("what do you need from us", "Access to sample data, a subject-matter expert for a few hours a week, and clarity on the decision you want to improve. That is enough to scope a first release."),
]


def _clean(text: str) -> str:
    return " ".join(text.split())


def _variants(question: str) -> list[str]:
    """Generate paraphrases of a single canonical question."""
    q = question.strip().rstrip("?")
    out: set[str] = set()

    for template in EXTRA_TEMPLATES:
        out.add(template.format(q=q))

    for prefix in PREFIXES:
        for suffix in SUFFIXES:
            out.add(f"{prefix}{q}{suffix}")

    # Capitalised variants teach the model to ignore casing.
    out.add(q.capitalize())
    out.add(q.capitalize() + "?")

    return sorted({_clean(v) for v in out if v.strip()})


def build_samples() -> list[tuple[str, str]]:
    samples: list[tuple[str, str]] = []

    for questions, answer in KNOWLEDGE:
        for question in questions:
            for variant in _variants(question):
                samples.append((variant, answer))

    # Multi-turn follow-ups, anchored on a plausible opening question.
    anchors = [q for qs, _ in KNOWLEDGE for q in qs[:1]]
    for follow_up, reply in FOLLOW_UPS:
        for anchor in anchors:
            samples.append((f"{anchor}\n{follow_up}", reply))

    # Fact recall: the model should be able to restate a fact when asked.
    for fact in FACTS:
        subject = fact.split(" is ")[0].split(" offers ")[0].split(" also ")[0]
        samples.append((f"what do you know about {subject.lower()}", fact))
        samples.append((f"give me a fact about {subject.lower()}", fact))

    return samples


def render(question: str, answer: str) -> str:
    return f"<|user|>{question}<|assistant|>{answer}<|end|>"


def write_jsonl(path: Path, samples: list[tuple[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for question, answer in samples:
            handle.write(json.dumps({"q": question, "a": answer}, ensure_ascii=False) + "\n")


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    samples = build_samples()
    random.Random(1337).shuffle(samples)

    split = max(1, int(len(samples) * 0.03))
    val, train = samples[:split], samples[split:]

    write_jsonl(DATA_DIR / "train.jsonl", train)
    write_jsonl(DATA_DIR / "val.jsonl", val)

    train_chars = sum(len(render(q, a)) for q, a in train)
    print(f"samples: {len(samples)} (train {len(train)} / val {len(val)})")
    print(f"train characters: {train_chars:,}")


if __name__ == "__main__":
    main()
