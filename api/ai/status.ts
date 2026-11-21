import { getClarivex1 } from '../_lib/clarivex1.js';

export default function handler(_req: any, res: any) {
  const model = getClarivex1();

  res.status(200).json({
    activeProvider: 'Clarivex-1 (local)',
    externalProviders: false,
    ready: Boolean(model),
    model: model
      ? {
          name: model.name,
          parameters: model.totalParams,
          layers: model.config.n_layer,
          heads: model.config.n_head,
          embedding: model.config.n_embd,
          contextWindow: model.config.block_size,
          vocabSize: model.config.vocab_size,
        }
      : null,
    features: {
      localInference: true,
      documentIntelligence: true,
      personas: ['general', 'architect', 'strategist', 'auditor'],
    },
  });
}
