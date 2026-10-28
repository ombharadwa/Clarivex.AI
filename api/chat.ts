import { GoogleGenAI } from '@google/genai';

const MODES: Record<string, string> = {
  general: 'Be a helpful general-purpose AI assistant for enterprise and technology users.',
  research: 'Prioritize current, verified information. Use Google Search grounding to retrieve real-time facts and cite web sources accurately.',
  coding: 'Act as a senior software engineer. Provide practical, secure, maintainable solutions, architecture, and code.',
  business: 'Act as a practical business analyst and strategist. Structure requirements, risks, options, metrics and next steps.',
  documents: 'Analyze attached documents deeply. Extract facts, summarize, inspect data, and cite source files accurately.',
};

const PERSONAS: Record<string, string> = {
  architect: 'You are a Senior Principal Software Architect at Clarivex.AI. You provide production-grade, secure, scalable system architecture, clean code patterns, data modeling, and performance optimization.',
  strategist: 'You are an Enterprise AI Transformation Strategist at Clarivex.AI. You help organizations evaluate ROI, digital transformation roadmaps, workflow automation, and AI adoption risk mitigation.',
  auditor: 'You are an Enterprise Cloud & AI Security Auditor. You analyze architectures for data privacy, compliance (GDPR, HIPAA, ISO 27001), prompt injection safeguards, and threat modeling.',
  general: 'You are Clarivex AI Assistant, the official intelligent assistant for Clarivex.AI. Clarivex.AI builds enterprise software, AI automation, AI agents, predictive analytics, and SaaS platforms.',
};

function getGeminiModel(preference: string): string {
  switch (preference) {
    case 'fast':
      return 'gemini-3.1-flash-lite';
    case 'deep':
      return 'gemini-3.8-flash';
    case 'auto':
    default:
      return 'gemini-3.8-flash';
  }
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      messages,
      mode = 'general',
      model = 'auto',
      persona = 'general',
      enableSearch = false,
      files = [],
    } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const personaPrompt = PERSONAS[persona] || PERSONAS.general;
    const modePrompt = MODES[mode] || MODES.general;
    const fullSystemPrompt = `${personaPrompt}\n\nCURRENT WORKSPACE MODE: ${modePrompt}\n\nStyle guidelines: Be structured, crisp, and direct. Use markdown, bold headers, code snippets, and bullet points where helpful.`;

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const selectedModel = getGeminiModel(model);

        // Build conversation turns
        const contents: any[] = [];
        const priorMessages = messages.slice(-15);

        for (let i = 0; i < priorMessages.length; i++) {
          const msg = priorMessages[i];
          const isLastUserTurn = i === priorMessages.length - 1 && msg.role === 'user';
          const role = msg.role === 'assistant' ? 'model' : 'user';

          if (isLastUserTurn && Array.isArray(files) && files.length > 0) {
            const parts: any[] = [];

            for (const file of files) {
              if (file?.data) {
                const cleanData = String(file.data).replace(/^data:[^;]+;base64,/, '');
                const mime = file.mime || 'application/octet-stream';

                if (/^image\/(png|jpeg|webp|gif|heic)$/i.test(mime) || mime === 'application/pdf') {
                  parts.push({
                    inlineData: {
                      mimeType: mime,
                      data: cleanData,
                    },
                  });
                } else if (file.text) {
                  parts.push({
                    text: `[Attached Document: ${file.name}]\n${file.text}`,
                  });
                }
              }
            }

            parts.push({ text: msg.content });
            contents.push({ role, parts });
          } else {
            contents.push({
              role,
              parts: [{ text: msg.content }],
            });
          }
        }

        const config: any = {
          systemInstruction: fullSystemPrompt,
        };

        if (mode === 'research' || enableSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config,
        });

        const reply = response.text || 'No response generated.';

        let searchSources: Array<{ title: string; url: string }> = [];
        try {
          const candidate = response.candidates?.[0];
          const groundingMetadata = candidate?.groundingMetadata;
          if (groundingMetadata && Array.isArray(groundingMetadata.groundingChunks)) {
            searchSources = groundingMetadata.groundingChunks
              .filter((chunk: any) => chunk.web?.uri)
              .map((chunk: any) => ({
                title: chunk.web?.title || chunk.web?.uri,
                url: chunk.web?.uri,
              }));
          }
        } catch {
          // Ignore metadata parse error
        }

        return res.status(200).json({
          reply,
          model: selectedModel,
          provider: 'gemini',
          grounded: mode === 'research' || enableSearch,
          sources: searchSources,
        });
      } catch (geminiErr: any) {
        console.error('Gemini error:', geminiErr?.message || geminiErr);
      }
    }

    // Built-in intelligent fallback when API key is not configured or offline
    const lastUserPrompt = messages[messages.length - 1]?.content || '';
    const lower = lastUserPrompt.toLowerCase();

    let fallbackReply = `Hello! 👋 Welcome to Clarivex.AI.\n\nClarivex.AI builds enterprise-grade software and intelligent automation solutions — including custom AI chatbots, predictive analytics, domain LLMs, and modern web & cloud platforms.\n\nHow can we help your business today?`;

    if (lower.includes('service') || lower.includes('what can') || lower.includes('build')) {
      fallbackReply = `Clarivex.AI provides end-to-end AI & software engineering services:\n\n1. **AI Chatbots**: 24/7 intelligent conversational agents with custom domain knowledge\n2. **AI Automation**: Intelligent process automation streamlining enterprise operations\n3. **Predictive Analytics**: Machine learning forecasting for revenue, demand, and risk\n4. **Generative AI & LLMs**: Custom domain models, fine-tuning, and RAG pipelines\n5. **Enterprise Software & SaaS**: Modern full-stack cloud and mobile platforms\n\nWould you like to explore a consultation for a specific project?`;
    } else if (lower.includes('pricing') || lower.includes('cost')) {
      fallbackReply = `Clarivex.AI provides tiered transparent engagement models:\n\n- **Starter Tier**: Starting from ₹4,999/month for core AI applications\n- **Growth Tier**: Comprehensive AI workflows and integrations\n- **Enterprise Custom**: Tailored architectures, private cloud deployment, and dedicated SLAs\n\nBook a free consultation on our Contact page to receive an itemized proposal!`;
    } else if (lower.includes('code') || lower.includes('debug')) {
      fallbackReply = `As a Senior Software Architect at Clarivex.AI, here is our recommended pattern:\n\n- **Architecture**: Modular React SPA + Node.js/Express API layer\n- **Performance**: Zero-runtime CSS with Tailwind v4, sub-second route transitions\n- **AI Integration**: Server-side @google/genai SDK with streaming or search grounding\n\nFeel free to paste your code or requirements for an in-depth review!`;
    }

    return res.status(200).json({
      reply: fallbackReply,
      provider: 'knowledge-engine',
      grounded: false,
      note: !geminiKey ? 'To enable real-time Gemini responses, set GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.' : undefined,
    });
  } catch (error: any) {
    console.error('API chat handler error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
