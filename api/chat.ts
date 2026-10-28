import type { Request, Response } from 'express';
import app from '../server';

export default function handler(req: Request, res: Response) {
  const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  req.url = '/api/chat' + query;
  return app(req, res);
}
