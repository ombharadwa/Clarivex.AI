# Clarivex.AI

Premium AI-driven software and digital transformation website.

## Production setup

### AI assistant
Set the following Vercel environment variables:

- `OPENAI_API_KEY` — required
- `OPENAI_MODEL` — optional; defaults to `gpt-5-mini`

The frontend calls `/api/chat`; the API key is never exposed to the browser.

### Contact leads
Set:

- `CLARIVEX_LEAD_WEBHOOK_URL`

The contact form posts validated lead data to `/api/contact`, which forwards it to your CRM, automation platform, or internal webhook.

Payload fields:
`name`, `company`, `industry`, `type`, `budget`, `timeline`, `message`, `source`, `createdAt`.

## Branch

The current modernization work is on `upgrade/production-modernization`. The `main` branch is intentionally unchanged until the pull request is merged.

## SEO

- Canonical URL
- Open Graph metadata
- Twitter card metadata
- `robots.txt`
- `sitemap.xml`

## Brand direction

Clarivex.AI positions itself around AI engineering, enterprise software, automation, SaaS, and digital transformation, with a premium dark AI-native visual identity.
