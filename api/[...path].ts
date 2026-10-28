import type { Request, Response } from 'express';
import app from '../server';

// Vercel can pass a function-relative URL; normalize it to the Express route prefix.
export default function handler(req: Request, res: Response) {
  if (req.url && !req.url.startsWith('/api/')) {
    req.url = `/api/${req.url.replace(/^\\/+/, '')}`;
  }
  return app(req, res);
}
