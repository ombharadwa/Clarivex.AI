import type { ServiceItem } from '../types';

export const AI_SERVICES: ServiceItem[] = [
  {
    id: 'ai-chatbots',
    num: '01',
    tag: 'AI SERVICE',
    name: 'AI Chatbots',
    desc: 'Intelligent conversational agents for customer support, sales, and internal workflows. Multilingual and domain-trained.',
    icon: 'Bot',
    detail: {
      overview:
        'We build conversational agents trained on your own documents, tickets, and product knowledge — not a generic model with a prompt bolted on. Every bot ships with retrieval over your knowledge base, guardrails against off-topic answers, and a full transcript pipeline so you can audit and improve it.',
      deliverables: [
        'Domain-tuned model or RAG pipeline over your knowledge base',
        'Multilingual support (English, Hindi, and additional locales)',
        'Handoff to a human agent with full conversation context',
        'Admin console for knowledge ingestion and answer review',
        'Analytics on deflection rate, containment, and CSAT',
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'Vector search', 'Clarivex-1 runtime'],
      timeline: '4–8 weeks to production',
      outcomes: [
        { label: 'Support deflection', value: 'up to 68%' },
        { label: 'First response', value: 'under 2s' },
        { label: 'Languages', value: 'EN + HI + more' },
      ],
    },
  },
  {
    id: 'ai-automation',
    num: '02',
    tag: 'AI SERVICE',
    name: 'AI Automation',
    desc: 'End-to-end intelligent process automation. Eliminate manual work and let AI handle complex decision-making.',
    icon: 'Zap',
    detail: {
      overview:
        'We map the manual process, identify the decision points that actually need judgement, and automate the rest. The result is a pipeline that reads unstructured input, applies your business rules, and escalates only the genuinely ambiguous cases to a person.',
      deliverables: [
        'Process discovery and automation opportunity map',
        'Document and email ingestion with structured extraction',
        'Rules engine plus model-based decision layer',
        'Human-in-the-loop review queue for edge cases',
        'Audit trail for every automated decision',
      ],
      stack: ['Node.js', 'Python', 'OCR', 'Workflow orchestration', 'PostgreSQL'],
      timeline: '6–10 weeks to production',
      outcomes: [
        { label: 'Manual effort', value: '−70%' },
        { label: 'Processing time', value: '−85%' },
        { label: 'Accuracy', value: '99%+ on rules' },
      ],
    },
  },
  {
    id: 'ai-agents',
    num: '03',
    tag: 'AI SERVICE',
    name: 'AI Agents',
    desc: 'Autonomous AI agents that execute multi-step tasks, integrate with your enterprise systems, and learn from outcomes.',
    icon: 'Cpu',
    detail: {
      overview:
        'Agents that do work rather than describe it. Each agent gets a scoped toolset, an explicit permission boundary, and a step budget so it cannot run away. Every action is logged and reversible where the underlying system allows it.',
      deliverables: [
        'Tool and API integration layer for your enterprise systems',
        'Planning loop with step budget and hard stop conditions',
        'Scoped credentials and per-action permission checks',
        'Replayable execution traces for every run',
        'Evaluation harness with regression scenarios',
      ],
      stack: ['TypeScript', 'Node.js', 'REST/GraphQL', 'Queue workers', 'Redis'],
      timeline: '8–14 weeks to production',
      outcomes: [
        { label: 'Tasks per run', value: 'multi-step' },
        { label: 'Traceability', value: '100% logged' },
        { label: 'Rollback', value: 'per action' },
      ],
    },
  },
  {
    id: 'predictive-analytics',
    num: '04',
    tag: 'AI SERVICE',
    name: 'Predictive Analytics',
    desc: 'ML-powered forecasting systems for revenue, churn, demand, risk, and key business metrics.',
    icon: 'TrendingUp',
    detail: {
      overview:
        'Forecasting that ships with its own error bars. We start from your historical data, establish a naive baseline, and only keep a model if it beats that baseline on held-out data. Every dashboard shows confidence intervals, not just a single number.',
      deliverables: [
        'Data audit and feature engineering pipeline',
        'Baseline plus candidate model comparison',
        'Backtested accuracy report with confidence intervals',
        'Scheduled retraining and drift monitoring',
        'Dashboard with forecast, actuals, and error bands',
      ],
      stack: ['Python', 'pandas', 'scikit-learn', 'PostgreSQL', 'React dashboards'],
      timeline: '5–9 weeks to production',
      outcomes: [
        { label: 'Forecast horizon', value: '1–12 months' },
        { label: 'Baseline beaten', value: 'required to ship' },
        { label: 'Retraining', value: 'automated' },
      ],
    },
  },
  {
    id: 'generative-ai',
    num: '05',
    tag: 'AI SERVICE',
    name: 'Generative AI',
    desc: 'Custom generative AI solutions, LLM fine-tuning, RAG retrieval-augmented generation systems, and AI content pipelines.',
    icon: 'Sparkles',
    detail: {
      overview:
        'We train and fine-tune models on your corpus so output matches your voice, terminology, and format. Where a smaller in-house model is enough, we use one — Clarivex-1 runs entirely on your infrastructure with no external API calls.',
      deliverables: [
        'Corpus preparation, cleaning, and deduplication',
        'Fine-tuning or from-scratch training run',
        'RAG retrieval layer with citation back to source',
        'Output validation and brand-voice checks',
        'Self-hosted inference with no third-party API dependency',
      ],
      stack: ['PyTorch', 'Custom transformer', 'Vector search', 'Node.js', 'Docker'],
      timeline: '6–12 weeks to production',
      outcomes: [
        { label: 'Hosting', value: 'self-hosted' },
        { label: 'External APIs', value: 'zero' },
        { label: 'Model size', value: '6.1M params (Clarivex-1)' },
      ],
    },
  },
  {
    id: 'nlp-solutions',
    num: '06',
    tag: 'AI SERVICE',
    name: 'NLP Solutions',
    desc: 'Natural language processing for document analysis, sentiment detection, entity extraction, and text classification.',
    icon: 'FileText',
    detail: {
      overview:
        'Structured data out of unstructured text. We handle the messy parts — scanned PDFs, mixed languages, inconsistent formats — and return clean, typed records your systems can consume directly.',
      deliverables: [
        'Document ingestion for PDF, DOCX, scans, and email',
        'Entity extraction with configurable schemas',
        'Sentiment and intent classification',
        'Multilingual text handling',
        'Confidence scores and low-confidence review queue',
      ],
      stack: ['Python', 'spaCy', 'Transformers', 'OCR', 'FastAPI'],
      timeline: '4–8 weeks to production',
      outcomes: [
        { label: 'Extraction accuracy', value: '95%+ on typed fields' },
        { label: 'Formats', value: 'PDF, DOCX, scans' },
        { label: 'Review queue', value: 'low-confidence only' },
      ],
    },
  },
];

export const SOFTWARE_SOLUTIONS: ServiceItem[] = [
  {
    id: 'web-applications',
    num: '07',
    tag: 'SOFTWARE',
    name: 'Web Applications',
    desc: 'Scalable, modern web applications built with React, modern frameworks, and cloud-native architecture.',
    icon: 'Globe',
    detail: {
      overview:
        'Production web applications with typed end-to-end code, real test coverage, and a deployment pipeline you can actually operate. We build for the team that inherits the codebase, not just for the demo.',
      deliverables: [
        'React + TypeScript front end with a design system',
        'Typed API layer with validation at the boundary',
        'Automated test suite and CI pipeline',
        'Accessibility pass (keyboard, contrast, screen reader)',
        'Deployment, monitoring, and runbook handover',
      ],
      stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'PostgreSQL'],
      timeline: '8–16 weeks to production',
      outcomes: [
        { label: 'Lighthouse', value: '90+ target' },
        { label: 'Type safety', value: 'end-to-end' },
        { label: 'Handover', value: 'docs + runbook' },
      ],
    },
  },
  {
    id: 'erp-crm',
    num: '08',
    tag: 'SOFTWARE',
    name: 'ERP / CRM Systems',
    desc: 'Custom enterprise resource planning and customer relationship management platforms tailored to your workflows.',
    icon: 'Layers',
    detail: {
      overview:
        'Off-the-shelf ERP forces your business into someone else\'s process. We build around how your teams actually work, with role-based access, approval chains, and reporting that matches your existing definitions.',
      deliverables: [
        'Workflow modelling with your operations team',
        'Role-based access control and approval chains',
        'Module coverage for the functions you actually use',
        'Data migration from existing systems',
        'Reporting and export layer',
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
      timeline: '12–24 weeks to production',
      outcomes: [
        { label: 'Fit', value: 'built to your process' },
        { label: 'Migration', value: 'included' },
        { label: 'Access control', value: 'role-based' },
      ],
    },
  },
  {
    id: 'saas-platforms',
    num: '09',
    tag: 'SOFTWARE',
    name: 'SaaS Platforms',
    desc: 'End-to-end SaaS product development — from MVP to production-ready multi-tenant enterprise platforms.',
    icon: 'Cloud',
    detail: {
      overview:
        'From first commit to paying customers. We handle multi-tenancy, billing, onboarding, and the operational concerns that separate a demo from a product people pay for.',
      deliverables: [
        'Multi-tenant data model with isolation guarantees',
        'Subscription billing and plan enforcement',
        'Self-serve onboarding and account management',
        'Usage metering and admin console',
        'Infrastructure-as-code deployment',
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
      timeline: '10–20 weeks to launch',
      outcomes: [
        { label: 'Tenancy', value: 'isolated' },
        { label: 'Billing', value: 'integrated' },
        { label: 'Deploy', value: 'infra-as-code' },
      ],
    },
  },
  {
    id: 'mobile-applications',
    num: '10',
    tag: 'SOFTWARE',
    name: 'Mobile Applications',
    desc: 'Cross-platform mobile applications for iOS and Android with intelligent AI-powered features built in.',
    icon: 'Smartphone',
    detail: {
      overview:
        'One codebase, both platforms, native-feeling interactions. AI features run on-device where latency matters and on your backend where the model is too large — with a clean fallback when connectivity drops.',
      deliverables: [
        'Cross-platform app for iOS and Android',
        'Offline-first data sync',
        'On-device or backend AI feature integration',
        'Push notifications and deep linking',
        'Store submission and release pipeline',
      ],
      stack: ['React Native', 'TypeScript', 'Node.js', 'SQLite', 'Fastlane'],
      timeline: '8–16 weeks to store release',
      outcomes: [
        { label: 'Platforms', value: 'iOS + Android' },
        { label: 'Offline', value: 'supported' },
        { label: 'Release', value: 'automated' },
      ],
    },
  },
];

export const ALL_SERVICES: ServiceItem[] = [...AI_SERVICES, ...SOFTWARE_SOLUTIONS];
