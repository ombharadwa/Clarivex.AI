import { getClarivex1, ChatTurn } from './_lib/clarivex1.js';

const MAX_ATTACHMENT_CHARS = 6000;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface IncomingFile {
  name?: string;
  text?: string;
}

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
    const { messages, files = [] } = req.body || {};

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

    return res.status(200).json({
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
    console.error('API chat handler error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
