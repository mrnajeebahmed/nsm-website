# Deploying to Vercel

Deployment uses Vercel's GitHub integration: every push to `main` deploys to production, and every pull request gets a preview URL. GitHub Actions (`.github/workflows/ci.yml`) runs typecheck and build on every PR so broken code never reaches `main`.

## One-time setup (≈5 minutes)
1. Go to https://vercel.com/new and **Import** this GitHub repository.
2. Framework preset: **Next.js** (auto-detected; `vercel.json` pins install/build commands).
3. Add environment variables (Project → Settings → Environment Variables). Set them for **Production** and **Preview**:

| Variable | Required | Example / notes |
|---|---|---|
| `DEFAULT_LLM_PROVIDER` | yes | `anthropic` (or `openai`, `gemini`) |
| `LLM_FALLBACK_ORDER` | yes | `openai,gemini` |
| `ANTHROPIC_API_KEY` | ≥1 key | Mark as **Sensitive** |
| `ANTHROPIC_MODEL` | no | default `claude-sonnet-5-5` |
| `OPENAI_API_KEY` | ≥1 key | Sensitive |
| `OPENAI_MODEL` | no | default `gpt-4o` |
| `GEMINI_API_KEY` | optional | Sensitive |
| `LLM_TIMEOUT_MS` | no | `20000` |
| `LEAD_WEBHOOK_URL` | recommended | HubSpot / n8n / Make / Zapier webhook. Without it, leads are only logged |
| `BOOKING_URL` | recommended | Your Cal.com / Calendly link |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://www.yourdomain.com` (used for SEO metadata) |

4. Click **Deploy**. Then add your custom domain under Project → Settings → Domains.

## Production hardening (recommended before launch)
- **Rate limiting:** the in-memory limiter in `lib/rate-limit.ts` is per serverless instance. Swap it for Upstash Redis (Vercel Marketplace) for a global limit.
- **Spend caps:** set monthly spend limits on each LLM provider account.
- **Preview deployments:** consider using separate, lower-limit API keys for the Preview environment.
- **Monitoring:** enable Vercel Analytics + Log Drains; the gateway logs `[llm-gateway] provider failed` on every failover, which is worth alerting on.
