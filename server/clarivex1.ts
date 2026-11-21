/**
 * Clarivex-1 inference runtime.
 *
 * The implementation lives in `api/_lib/clarivex1.ts` so Vercel's function
 * tracer bundles it with the serverless handlers. This module re-exports it for
 * the local Express server.
 */

export * from '../api/_lib/clarivex1.js';