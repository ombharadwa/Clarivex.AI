import { getClarivex1 } from '../server/clarivex1';

export default function handler(_req: any, res: any) {
  const model = getClarivex1();

  res.status(200).json({
    status: 'ok',
    service: 'Clarivex.AI API',
    model: model ? model.name : 'not-loaded',
    externalProviders: false,
    timestamp: new Date().toISOString(),
  });
}
