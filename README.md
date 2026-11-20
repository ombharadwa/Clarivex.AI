# Clarivex.AI

Clarivex.AI is an AI-driven software and digital transformation platform built as a modern full-stack React SPA with Express and Vite.

## Features

- **Enterprise Landing & Multi-View Navigation**:
  - **Home**: Interactive hero with particles, animated KPI counters, live Clarivex Intelligence Dashboard, trust ticker, services cards, live AI experience chat preview, real-time analytics graphs, 7-step development process, and enterprise value propositions.
  - **About Us**: Company mission, geometric branding visual, key milestones (2025 Founded, Ahmedabad HQ, 7+ industries), core values, and Founder & CEO leadership profile.
  - **Services**: Detailed catalog of Artificial Intelligence Services (Chatbots, Automation, Agents, Predictive Analytics, Generative AI, NLP) and Software Development Solutions (Web apps, ERP/CRM, SaaS, Mobile).
  - **Industries**: Dedicated solutions for Healthcare, Finance & Banking, Government, Retail & E-Commerce, Education, Manufacturing, and Logistics.
  - **Careers**: Active job listings (AI/ML Engineer, Full Stack Developer, Product Designer, Business Development Executive) with direct application links.
  - **Contact**: Interactive consultation booking form with validation and confirmation.

- **AI Workspace**:
  - Specialized AI Modes: *Ask Anything (General)*, *Research*, *Code & Debug*, *Business Strategy*, and *Document Intelligence*.
  - Multi-conversation history with persistent browser storage.
  - Multi-format file attachment analyzer (PDF, Word, Excel, source code, images).
  - Model selection (Balanced, Fast, Deep), token counter, regenerate and copy responses.

- **Floating AI Assistant**:
  - Global floating chat widget with speech synthesis (Text-to-Speech) and on-device voice input.
  - Connected to backend `/api/chat`, answered by the locally-run Clarivex-1 model.

- **Clarivex-1 (local model)**:
  - A 5.4M-parameter decoder-only transformer trained from scratch on Clarivex.AI domain knowledge.
  - Pure-TypeScript inference runtime — no external AI provider, no API keys, no network calls.
  - Full training pipeline in [`ml/`](./ml): corpus builder, BPE tokenizer, PyTorch trainer, weight exporter.

- **Design & Theme**:
  - Dark mode by default with seamless Light mode toggle.
  - Responsive layout for desktop, tablet, and mobile.
  - Interactive mouse cursor follower.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

No environment variables are required. Clarivex-1 loads its weights from `ml/artifacts/` at startup.

## Training Clarivex-1

All model knowledge lives in [`ml/knowledge.py`](./ml/knowledge.py). To change what the model knows, edit that file and re-run the pipeline:

```bash
python ml/build_corpus.py        # expand knowledge into a JSONL corpus
python ml/train_tokenizer.py     # train the BPE tokenizer
python ml/train.py --steps 2500  # train and export weights to ml/artifacts/
```

The exported `model.json` + `model.bin` are consumed directly by [`server/clarivex1.ts`](./server/clarivex1.ts).

