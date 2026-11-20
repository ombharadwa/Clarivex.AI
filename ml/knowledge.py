"""Domain knowledge for the Clarivex-1 model.

Every entry is a (question variants, answer) pair. `build_corpus.py` expands
these into the instruction-tuning corpus used by `train.py`.
"""

# Each item: (list of question paraphrases, canonical answer)
KNOWLEDGE = [
    # ── Identity ──────────────────────────────────────────────────────────
    (
        ["who are you", "what are you", "what is your name", "introduce yourself"],
        "I am Clarivex-1, the in-house AI model of Clarivex.AI. I run directly inside this workspace, so I answer without calling an external provider. I know our services, industries, pricing, process, and careers, and I can also help with general engineering and business questions.",
    ),
    (
        ["what is clarivex", "what is clarivex.ai", "tell me about clarivex", "what does clarivex do"],
        "Clarivex.AI is an AI-driven software and digital transformation company headquartered in Ahmedabad, India. We help enterprises modernise operations, automate workflows, and ship intelligent products — from AI chatbots and agents to full SaaS platforms.",
    ),
    (
        ["where are you based", "where is clarivex located", "what is your headquarters", "office location"],
        "Our headquarters is in Ahmedabad, India. We work with clients globally and most engineering roles are remote-friendly with an Ahmedabad option.",
    ),
    (
        ["when was clarivex founded", "how old is the company", "founding year"],
        "Clarivex.AI was founded in 2025 and already serves clients across 7+ industries.",
    ),
    (
        ["what is your mission", "what is the company mission"],
        "Our mission is to make enterprise-grade AI practical: we take proven models, ground them in your data, and ship them inside the systems your teams already use.",
    ),
    (
        ["who is the founder", "who is the ceo", "leadership"],
        "Clarivex.AI is led by its Founder and CEO, who sets the technical direction for our AI and software practice. You can find the leadership profile on the About page.",
    ),
    (
        ["what are your core values", "company values"],
        "Our core values are engineering rigour, radical transparency with clients, measurable outcomes over demos, and pride in our roots — delivering world-class AI from Ahmedabad to the globe.",
    ),

    # ── Services ──────────────────────────────────────────────────────────
    (
        ["what services do you offer", "what can you build", "list your services", "what do you do"],
        "We deliver ten core capabilities:\n\n**AI Services**\n1. AI Chatbots — multilingual, domain-trained conversational agents\n2. AI Automation — end-to-end intelligent process automation\n3. AI Agents — autonomous multi-step task execution\n4. Predictive Analytics — forecasting for revenue, churn, demand and risk\n5. Generative AI — LLM fine-tuning, RAG pipelines, content systems\n6. NLP Solutions — document analysis, sentiment, entity extraction\n\n**Software Solutions**\n7. Web Applications\n8. ERP / CRM Systems\n9. SaaS Platforms\n10. Mobile Applications",
    ),
    (
        ["tell me about ai chatbots", "do you build chatbots", "chatbot service"],
        "Our AI Chatbots are multilingual conversational agents trained on your domain knowledge. They handle customer support, sales qualification, and internal helpdesk workflows 24/7, and they can escalate to a human when confidence is low.",
    ),
    (
        ["what is ai automation", "tell me about automation", "process automation"],
        "AI Automation replaces manual, rule-heavy work with intelligent pipelines that learn and adapt. Typical wins are invoice processing, ticket triage, data reconciliation, and report generation — usually cutting handling time by 60-80%.",
    ),
    (
        ["what are ai agents", "tell me about agents", "autonomous agents"],
        "AI Agents are autonomous systems that plan and execute multi-step tasks. They call your internal APIs, read from your systems of record, verify their own output, and learn from outcomes. Good first use cases are research assistants, procurement agents, and ops copilots.",
    ),
    (
        ["tell me about predictive analytics", "forecasting", "can you do forecasting"],
        "Predictive Analytics uses machine learning to forecast revenue, demand, churn, and risk. We start from your historical data, validate with backtesting, and expose the output through dashboards or APIs so the forecast actually drives decisions.",
    ),
    (
        ["tell me about generative ai", "llm fine tuning", "do you do rag", "custom llm"],
        "Our Generative AI practice covers custom LLM integration, fine-tuning, and retrieval-augmented generation (RAG). We build the ingestion pipeline, the vector index, the evaluation harness, and the guardrails so answers stay grounded in your documents.",
    ),
    (
        ["tell me about nlp", "natural language processing", "document analysis"],
        "Our NLP solutions handle document analysis, sentiment detection, entity extraction, and text classification. They are commonly used for contract review, claims processing, and voice-of-customer analytics.",
    ),
    (
        ["do you build web applications", "web app development"],
        "Yes. We build scalable web applications with React and modern frameworks on cloud-native architecture, with accessibility, SEO, and performance budgets baked in from day one.",
    ),
    (
        ["do you build erp or crm", "erp crm systems"],
        "Yes. We build custom ERP and CRM platforms tailored to your workflows instead of forcing your team into a rigid off-the-shelf product. Typical scope covers records, approvals, reporting, and integrations with existing finance or HR systems.",
    ),
    (
        ["do you build saas platforms", "saas development", "multi tenant"],
        "Yes. We take SaaS products from MVP to production-ready multi-tenant platforms — billing, role-based access, tenant isolation, usage metering, and observability included.",
    ),
    (
        ["do you build mobile apps", "mobile application development", "ios android"],
        "Yes. We build cross-platform mobile applications for iOS and Android with AI features built in, such as on-device assistants, image analysis, and offline-first sync.",
    ),

    # ── Industries ────────────────────────────────────────────────────────
    (
        ["which industries do you serve", "what industries", "industry experience"],
        "We serve seven industries: Healthcare, Finance & Banking, Government, Retail & E-Commerce, Education, Manufacturing, and Logistics.",
    ),
    (
        ["healthcare solutions", "do you work with healthcare"],
        "In Healthcare we build medical record AI, predictive diagnostics, automated scheduling, and clinical NLP. Everything is designed around patient-data privacy and audit trails.",
    ),
    (
        ["finance solutions", "banking solutions", "do you work with banks"],
        "In Finance & Banking we deliver real-time fraud detection, credit risk models, automated KYC, and intelligent regulatory reporting.",
    ),
    (
        ["government solutions", "public sector"],
        "For Government we build citizen AI portals, document automation, predictive resource planning, and multilingual chatbots that reduce case backlogs.",
    ),
    (
        ["retail solutions", "ecommerce solutions"],
        "In Retail & E-Commerce we work on demand forecasting, recommendation engines, churn prevention, and inventory AI.",
    ),
    (
        ["education solutions", "edtech"],
        "In Education we build adaptive learning systems, student performance analytics, automated grading, and student-support chatbots.",
    ),
    (
        ["manufacturing solutions", "factory ai"],
        "In Manufacturing we focus on predictive maintenance, vision-based quality control, and supply chain optimisation.",
    ),
    (
        ["logistics solutions", "supply chain ai"],
        "In Logistics we build AI route optimisation, delivery ETA prediction, and automated warehouse management.",
    ),

    # ── Pricing & engagement ──────────────────────────────────────────────
    (
        ["how much does it cost", "what is your pricing", "pricing", "cost of a project"],
        "We use three engagement tiers:\n\n- **Starter** — from ₹4,999/month for core AI applications\n- **Growth** — comprehensive AI workflows and system integrations\n- **Enterprise Custom** — tailored architecture, private cloud deployment, and dedicated SLAs\n\nEvery engagement starts with a free consultation and an itemised proposal, so you see scope and cost before committing.",
    ),
    (
        ["how long does a project take", "timeline", "how fast can you deliver"],
        "A focused MVP typically ships in 6-8 weeks. Larger platform work runs in 2-3 week increments so you get working software continuously rather than a single big-bang delivery.",
    ),
    (
        ["what is your development process", "how do you work", "your process"],
        "Our process has seven steps: discovery and goal setting, data and system audit, architecture design, iterative build in 2-3 week sprints, evaluation and QA, deployment, and post-launch monitoring with continuous improvement.",
    ),
    (
        ["do you offer a free consultation", "can i book a consultation", "book a call"],
        "Yes. Book a free consultation from the Contact page or the Book Consultation button in the header. We will review your goals and come back with an itemised technical proposal.",
    ),
    (
        ["how do i contact you", "contact details", "email address", "phone number"],
        "You can reach us at hello@clarivex.ai, or use the Contact page to book a consultation. We usually reply within one business day.",
    ),
    (
        ["do you sign ndas", "nda", "confidentiality"],
        "Yes. We sign NDAs before discovery, and client data never leaves the agreed environment. For regulated clients we can deploy entirely inside your own cloud tenancy.",
    ),
    (
        ["can you work with our existing systems", "integration", "do you integrate with our stack"],
        "Yes. Integration is usually the core of the work — we connect to your existing APIs, databases, ERPs, and identity providers rather than replacing them.",
    ),
    (
        ["do you provide support after launch", "maintenance", "post launch support"],
        "Yes. Every engagement includes a post-launch monitoring window, and Enterprise clients get dedicated SLAs covering uptime, response time, and model-drift reviews.",
    ),

    # ── Careers ───────────────────────────────────────────────────────────
    (
        ["are you hiring", "open positions", "job openings", "careers"],
        "We currently have four open roles:\n\n1. **AI / ML Engineer** — Remote / Ahmedabad, 2+ years\n2. **Full Stack Developer** — Remote / Ahmedabad, 2+ years\n3. **Product Designer (UI/UX)** — Remote / Ahmedabad, 2+ years\n4. **Business Development Executive** — Ahmedabad (Hybrid), 1-3 years\n\nAll are full-time. Apply from the Careers page.",
    ),
    (
        ["how do i apply for a job", "application process"],
        "Open the Careers page, pick the role, and use the apply link — it opens a pre-filled email with the right subject line. Attach your CV and any relevant work samples.",
    ),
    (
        ["do you offer remote work", "is remote allowed"],
        "Yes. Engineering and design roles are remote-friendly, with an Ahmedabad office option. The Business Development role is hybrid in Ahmedabad.",
    ),

    # ── AI Workspace ──────────────────────────────────────────────────────
    (
        ["what is the ai workspace", "how does the workspace work"],
        "The AI Workspace is a multi-conversation assistant with five specialised modes: Ask Anything, Research, Code & Debug, Business Strategy, and Document Intelligence. Conversations are saved in your browser, and you can attach PDFs, Office files, source code, and images.",
    ),
    (
        ["what modes are available", "workspace modes"],
        "There are five modes: **Ask Anything** for general questions, **Research** for web-grounded answers, **Code & Debug** for engineering work, **Business Strategy** for analysis and planning, and **Document Intelligence** for analysing attached files.",
    ),
    (
        ["what files can i attach", "supported file types", "can i upload a pdf"],
        "You can attach PDF, Word, Excel, source code, and images. Text-based files are read directly, while PDFs and images are passed to the model as native multimodal input.",
    ),
    (
        ["which model powers this", "what model do you use", "are you gemini"],
        "This workspace can run on Clarivex-1, our own in-house model, or on Google Gemini when an API key is configured. Clarivex-1 runs locally with no external calls, which is useful for privacy-sensitive work.",
    ),
    (
        ["is my data stored", "do you save my conversations", "privacy of my chats"],
        "Workspace conversations are stored in your own browser storage, not on our servers. When Clarivex-1 answers, inference happens on the server and the prompt is not persisted.",
    ),

    # ── Technical ─────────────────────────────────────────────────────────
    (
        ["what is your tech stack", "what technologies do you use"],
        "Our default stack is React and TypeScript on the front end, Node.js and Express on the API layer, Tailwind for styling, and cloud-native deployment. On the AI side we work with PyTorch, transformer models, vector databases, and evaluation harnesses.",
    ),
    (
        ["how do you handle security", "security and compliance", "is it secure"],
        "We design for least privilege, encrypt data in transit and at rest, keep secrets out of source control, and validate all model input to reduce prompt-injection risk. For regulated clients we support GDPR, HIPAA, and ISO 27001 aligned deployments.",
    ),
    (
        ["how do you prevent hallucinations", "is the ai accurate"],
        "We ground answers in retrieved source documents, evaluate against a labelled test set, and return citations so users can verify claims. When confidence is low the assistant says so instead of guessing.",
    ),
    (
        ["what is rag", "explain retrieval augmented generation"],
        "RAG, or retrieval-augmented generation, retrieves the most relevant passages from your documents and passes them to the model as context. It keeps answers grounded in your data and avoids retraining the model whenever content changes.",
    ),
    (
        ["what is fine tuning", "explain fine tuning"],
        "Fine-tuning continues training a pretrained model on your own examples so it adopts your tone, formats, and domain vocabulary. It is best for style and task specialisation; for factual recall, RAG is usually the better tool.",
    ),
    (
        ["how do you evaluate a model", "model evaluation"],
        "We build a labelled evaluation set from real user questions, then track accuracy, groundedness, refusal correctness, latency, and cost per request. Every model or prompt change has to beat the current baseline before it ships.",
    ),

    # ── Conversational ────────────────────────────────────────────────────
    (
        ["hello", "hi", "hey", "good morning", "good evening"],
        "Hello! I am Clarivex-1, running locally inside this workspace. I can explain our services, industries, pricing, and process, or help with engineering and business questions. What would you like to explore?",
    ),
    (
        ["thank you", "thanks", "appreciate it"],
        "You are welcome. If you want a tailored proposal, book a free consultation from the Contact page and our team will follow up.",
    ),
    (
        ["bye", "goodbye", "see you"],
        "Goodbye! You can reopen this workspace any time, and the Contact page is there whenever you want to talk to the team.",
    ),
    (
        ["what can you help with", "what are your capabilities", "how can you help me"],
        "I can help in four ways: explain Clarivex.AI services, industries, pricing, and process; reason through architecture and code questions; structure business analysis and strategy; and summarise attached documents. Ask me anything to get started.",
    ),
    (
        ["i need help with a project", "i have a project idea"],
        "Great — tell me the problem you want to solve, the systems involved, and your target timeline. I can sketch an approach, and if it fits, our team can turn it into an itemised proposal after a free consultation.",
    ),
    (
        ["can you write code", "help me debug", "code review"],
        "Yes. Paste the code or the error and tell me the expected behaviour. I will point at the root cause, propose a minimal fix, and flag any security or performance issues I notice.",
    ),
    (
        ["what is the best ai approach for my business", "which ai should i use"],
        "Start from the decision you want to improve, not the technology. If you need to answer questions over documents, use RAG. If you need to classify or forecast, use a supervised model. If you need to automate a multi-step workflow, use an agent with explicit tool permissions. Tell me your use case and I will narrow it down.",
    ),
    (
        ["do you work with startups", "small business"],
        "Yes. The Starter tier is designed for smaller teams, and we scope the first release tightly so you get a working system before committing to a larger build.",
    ),
    (
        ["what makes you different", "why choose clarivex"],
        "Three things: we ship working software in short increments instead of long discovery phases, we ground AI in your data with measurable evaluation, and we deploy inside your environment when compliance requires it.",
    ),
]

# Short factual snippets used for retrieval grounding.
FACTS = [
    "Clarivex.AI is headquartered in Ahmedabad, India and was founded in 2025.",
    "Clarivex.AI serves 7+ industries including healthcare, finance, government, retail, education, manufacturing and logistics.",
    "Clarivex.AI offers AI chatbots, AI automation, AI agents, predictive analytics, generative AI and NLP solutions.",
    "Clarivex.AI also builds web applications, ERP and CRM systems, SaaS platforms and mobile applications.",
    "Pricing starts at Rs 4,999 per month for the Starter tier, with Growth and Enterprise Custom tiers above it.",
    "A focused MVP typically ships in 6 to 8 weeks using 2 to 3 week delivery increments.",
    "Contact Clarivex.AI at hello@clarivex.ai or through the Contact page to book a free consultation.",
    "Open roles are AI/ML Engineer, Full Stack Developer, Product Designer and Business Development Executive.",
    "The AI Workspace has five modes: Ask Anything, Research, Code and Debug, Business Strategy and Document Intelligence.",
    "Clarivex-1 is the in-house model that runs locally without calling an external AI provider.",
]
