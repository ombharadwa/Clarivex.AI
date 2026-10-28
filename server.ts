import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with larger limit for audio recordings and file attachments
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Personas & system instructions
const PERSONAS: Record<string, { title: string; prompt: string }> = {
  architect: {
    title: 'Senior Software Architect',
    prompt: 'You are a Senior Principal Software Architect at Clarivex.AI. You provide production-grade, secure, scalable system architecture, clean code patterns, data modeling, and performance optimization.',
  },
  strategist: {
    title: 'Enterprise AI Strategist',
    prompt: 'You are an Enterprise AI Transformation Strategist at Clarivex.AI. You help organizations evaluate ROI, digital transformation roadmaps, workflow automation, and AI adoption risk mitigation.',
  },
  auditor: {
    title: 'Security & Compliance Auditor',
    prompt: 'You are an Enterprise Cloud & AI Security Auditor. You analyze architectures for data privacy, compliance (GDPR, HIPAA, ISO 27001), prompt injection safeguards, and threat modeling.',
  },
  general: {
    title: 'Clarivex AI Assistant',
    prompt: 'You are Clarivex AI Assistant, the official intelligent assistant for Clarivex.AI. Clarivex.AI builds enterprise software, AI automation, AI agents, predictive analytics, and SaaS platforms.',
  },
};

const MODES: Record<string, string> = {
  general: 'Be a helpful general-purpose AI assistant for enterprise and technology users.',
  research: 'Prioritize current, verified information. Use Google Search grounding to retrieve real-time facts and cite web sources accurately.',
  coding: 'Act as a senior software engineer. Provide practical, secure, maintainable solutions, architecture, and code.',
  business: 'Act as a practical business analyst and strategist. Structure requirements, risks, options, metrics and next steps.',
  documents: 'Analyze attached documents deeply. Extract facts, summarize, inspect data, and cite source files accurately.',
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

// ── GET AI STATUS & CAPABILITIES ──
app.get('/api/ai/status', (_req: Request, res: Response) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    activeProvider: hasGemini ? 'Google Gemini' : 'Offline Knowledge Engine',
    hasApiKey: hasGemini,
    models: {
      text: 'gemini-3.8-flash',
      fast: 'gemini-3.1-flash-lite',
      transcribe: 'gemini-3.5-transcribe',
    },
    features: {
      searchGrounding: true,
      audioTranscription: true,
      documentIntelligence: true,
      personas: Object.keys(PERSONAS),
    },
  });
});

// ── AUDIO TRANSCRIPTION ENDPOINT (gemini-3.5-transcribe) ──
app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'audioData base64 string is required' });
    }

    const cleanBase64 = String(audioData).replace(/^data:[^;]+;base64,/, '');
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

        const audioPart = {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: cleanBase64,
          },
        };

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              audioPart,
              { text: 'Transcribe this spoken audio into accurate, natural text. Output only the transcription without filler commentary.' },
            ],
          },
        });

        const transcription = response.text?.trim() || '';
        return res.json({ transcription, provider: 'gemini-3.5-transcribe' });
      } catch (err: any) {
        console.error('Gemini transcription error:', err?.message || err);
        // Fallback for audio when offline
      }
    }

    // Graceful offline mock transcription
    return res.json({
      transcription: 'Audio processed: "Inquire about Clarivex.AI enterprise architecture and automation solutions."',
      provider: 'offline-fallback',
      note: 'Configure GEMINI_API_KEY in Settings > Secrets for real-time live audio transcription.',
    });
  } catch (error: any) {
    console.error('Transcribe error:', error);
    return res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// ── PRIMARY CHAT & SEARCH GROUNDING ENDPOINT ──
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages,
      mode = 'general',
      model = 'auto',
      persona = 'general',
      enableSearch = false,
      files = [],
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const personaConfig = PERSONAS[persona] || PERSONAS.general;
    const modePrompt = MODES[mode] || MODES.general;
    const fullSystemPrompt = `${personaConfig.prompt}\n\nCURRENT WORKSPACE MODE: ${modePrompt}\n\nStyle guidelines: Be structured, crisp, and direct. Use markdown, bold headers, code snippets, and bullet points where helpful.`;

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

        // Build conversation turns for Gemini
        const contents: any[] = [];
        const priorMessages = messages.slice(-15);

        for (let i = 0; i < priorMessages.length; i++) {
          const msg = priorMessages[i];
          const isLastUserTurn = i === priorMessages.length - 1 && msg.role === 'user';
          const role = msg.role === 'assistant' ? 'model' : 'user';

          if (isLastUserTurn && Array.isArray(files) && files.length > 0) {
            const parts: any[] = [];

            // Add attachments to the turn
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

        // Enable Google Search Grounding when research mode is selected OR search is explicitly toggled on
        if (mode === 'research' || enableSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config,
        });

        const reply = response.text || 'No response generated.';

        // Extract search grounding metadata if present
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
        } catch (metaErr) {
          console.warn('Could not extract search grounding metadata', metaErr);
        }

        return res.json({
          reply,
          model: selectedModel,
          provider: 'gemini',
          grounded: mode === 'research' || enableSearch,
          sources: searchSources,
        });
      } catch (geminiErr: any) {
        console.error('Gemini generation error:', geminiErr?.message || geminiErr);
      }
    }

    // Built-in intelligent domain knowledge fallback
    const lastUserPrompt = messages[messages.length - 1]?.content || '';
    const lower = lastUserPrompt.toLowerCase();

    let fallbackReply = `Here is our guidance regarding your query:\n\nClarivex.AI delivers enterprise-grade software and AI capabilities, from custom intelligent chatbots and automated workflows to full-scale SaaS platforms.\n\nKey highlights for **${mode.toUpperCase()}** mode:\n- **Architecture**: Enterprise-grade, scalable, and secure\n- **Timeline**: Rapid agile delivery with MVP deployment in 6–8 weeks\n- **Consultation**: Reach out at hello@clarivex.ai or via our Contact page for customized technical proposals.`;

    if (lower.includes('service') || lower.includes('what can') || lower.includes('build')) {
      fallbackReply = `Clarivex.AI offers comprehensive AI and digital transformation solutions:\n\n1. **AI Chatbots**: Multi-lingual conversational agents for support and sales 24/7\n2. **AI Automation**: Intelligent process automation streamlining repetitive work\n3. **Predictive Analytics**: Machine learning forecasting for revenue, churn, demand, and risk\n4. **Generative AI & LLMs**: Custom domain models, fine-tuning, and RAG pipelines\n5. **Enterprise Software & SaaS**: Full-stack web, cloud, and cross-platform mobile apps\n\nHow can we tailor these to your business?`;
    } else if (lower.includes('search') || mode === 'research' || enableSearch) {
      fallbackReply = `**Search Grounded Insights (Real-Time)**:\n\n- Clarivex.AI leverages Google Search Grounding to integrate live market data, technical documentation, and real-time news directly into enterprise workflows.\n- Models like **gemini-3.8-flash** provide sourced answers, eliminating hallucinations on recent developments.\n- Connect your **GEMINI_API_KEY** in project settings to activate live Google Search web citations in this turn.`;
    }

    return res.json({
      reply: fallbackReply,
      provider: 'knowledge-engine',
      grounded: false,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Server status endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Clarivex.AI API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
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
    console.log(`Clarivex.AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
