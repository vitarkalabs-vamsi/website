# Vitarka Fabric website

Marketing site and interactive console for **Vitarka Fabric**, one runtime that connects NPUs, TPUs,
quantum processors (QPUs) and organoid processors (OPUs), and lets a running job switch between them.

Live: https://website.vitarkalabs.workers.dev

React + Vite frontend, served together with a small API by a single Cloudflare Worker (Hono).

## Structure

| Path | What it is |
|------|------------|
| `src/pages/HomePage.jsx` | Landing page: hero, live console, chip datasheet, call to action |
| `src/pages/ConsolePage.jsx` | Full-page console with things to try |
| `src/pages/PlatformPage.jsx` | Architecture, live-handoff steps, routing weights, limits |
| `src/components/FabricConsole.jsx` | The rack-style console UI |
| `src/lib/fabric.js` | Client-side simulation of the runtime: chips, workloads, routing, checkpoint and handoff |
| `src/components/Layout.jsx` | Header, footer, contact dialog |
| `src/lib/theme.css` | Design system and all styles |
| `worker/index.js` | Worker: `/api/contact`, `/health`, security headers; everything else falls through to static assets |
| `public/_headers` | Security and cache headers for static assets |

The console is a simulation. No real hardware is contacted, and the site says so.

## Develop

```bash
npm install
npm run worker:dev   # Worker + API on http://localhost:8787
npm run dev          # Vite on http://localhost:4173, proxying /api and /health to the Worker
```

## Deploy

```bash
npm run deploy       # vite build, then wrangler deploy
```

## Contact form

`POST /api/contact` accepts JSON `{ name, email, org?, message }`. It rejects cross-origin requests,
non-JSON bodies and bodies over 8 KB, rate-limits to 5 submissions per IP per minute, silently drops bots
that fill the hidden honeypot field, and logs no personal data.

To have submissions emailed, set these Worker secrets (sent through [Resend](https://resend.com)):

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_TO_EMAIL
npx wrangler secret put CONTACT_FROM_EMAIL   # optional, a verified sender
```

Without them, submissions are accepted but only a metadata line is logged.

## Security

- Strict Content Security Policy (scripts from self only), HSTS, `X-Frame-Options: DENY`, `nosniff`,
  a locked-down Permissions Policy and `Cross-Origin-Opener-Policy`, on both Worker and asset responses.
- No secrets in the repo; `.env` is git-ignored.
