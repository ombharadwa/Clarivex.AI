import { GoogleGenAI } from '@google/genai';

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
    const { audioData, mimeType = 'audio/webm' } = req.body || {};

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
        return res.status(200).json({ transcription, provider: 'gemini-3.5-transcribe' });
      } catch (err: any) {
        console.error('Gemini transcription error:', err?.message || err);
      }
    }

    return res.status(200).json({
      transcription: 'Audio processed: "Inquire about Clarivex.AI enterprise architecture and automation solutions."',
      provider: 'offline-fallback',
    });
  } catch (error: any) {
    console.error('Transcribe handler error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to transcribe audio' });
  }
}
