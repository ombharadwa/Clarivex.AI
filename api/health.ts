export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'Clarivex.AI API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
