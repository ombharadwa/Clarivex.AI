function clean(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const name = clean(body.name, 120);
    const company = clean(body.company, 160);
    const industry = clean(body.industry, 120);
    const type = clean(body.type, 120);
    const budget = clean(body.budget, 120);
    const timeline = clean(body.timeline, 100);
    const message = clean(body.message, 2000);

    if (!name || !company) {
      return res.status(400).json({ error: 'Name and company are required.' });
    }

    const lead = {
      source: 'clarivex.ai',
      createdAt: new Date().toISOString(),
      name, company, industry, type, budget, timeline, message
    };

    const webhook = process.env.CLARIVEX_LEAD_WEBHOOK_URL;
    if (!webhook) {
      console.error('Lead webhook is not configured', { company });
      return res.status(503).json({ error: 'Lead service is not configured yet. Please contact us directly.' });
    }

    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });

    if (!upstream.ok) {
      console.error('Lead webhook failed', upstream.status);
      return res.status(502).json({ error: 'Unable to submit your request right now.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact handler error', error?.message || error);
    return res.status(500).json({ error: 'Unable to submit your request right now.' });
  }
};
