# Vitarka Labs Website

A multi-page React + Vite site for Vitarka Labs, deployed as a single Cloudflare Worker that serves both
the static frontend and the API — no separate backend hosting needed.

- `src/pages/HomePage.jsx` — company overview: about, practice areas, method, and a Products section linking to each POC.
- `src/pages/ArcNodePage.jsx` — the ARC-Node product page (edge acoustic/RF sensing POC).
- `src/pages/OrganoidIntelligencePage.jsx` — the Organoid Intelligence product page (applied research POC).
- `src/components/Layout.jsx` — shared nav, footer, and contact modal used across all pages.
- `src/lib/theme.jsx` — shared design system: global CSS, palette, and reusable marks/components.
- `worker/index.js` — Cloudflare Worker (Hono) handling `/api/contact` and `/health`; everything else falls
  through to the built static site via the `ASSETS` binding.
- `generate_blueprint.js` — Node script that generates the ARC-Node `.docx` blueprint (output lives in `public/`
  so it's served as a plain static file — see the download link on the ARC-Node page).

## Setup

```bash
npm install
```

## Run the website locally

Two dev servers, both required for the API to work locally:

```bash
npm run worker:dev   # runs the Worker (API) on http://localhost:8787
npm run dev           # runs Vite on http://localhost:4173, proxying /api and /health to the Worker
```

Open `http://localhost:4173`.

## Build the website

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Validate JSX syntax

```bash
npm run validate:jsx
```

Parses every `.jsx` file under `src/` with Babel.

## Generate the ARC-Node blueprint document

```bash
npm run generate
```

Writes `public/ARC_Node_v2_Technical_Blueprint.docx`, which ships as a static asset and is linked directly
from the ARC-Node page — no API round-trip.

## Deploying to Cloudflare

This repo deploys as a Cloudflare Worker with static assets (`wrangler.jsonc`), not classic Pages:

1. Connect this GitHub repo as a Worker project in the Cloudflare dashboard, with the deploy command
   `npx wrangler deploy`. `wrangler.jsonc`'s `build.command` runs `npm run build` automatically before
   every deploy, so no separate build-command setting is needed.
2. To send real contact-form emails, set these as Worker secrets/vars (dashboard → Settings → Variables):
   - `RESEND_API_KEY` — a [Resend](https://resend.com) API key
   - `CONTACT_TO_EMAIL` — where submissions should be sent
   - `CONTACT_FROM_EMAIL` — optional; defaults to Resend's sandbox sender
   Without these, submissions are still validated and logged (visible via `wrangler tail` or the dashboard),
   just not emailed.
3. `VITE_API_BASE` is not needed in production — the frontend calls `/api/*` on the same origin the Worker
   serves. Only set it if you split the API onto a different domain.

You can also deploy manually with `npm run deploy` (runs the build, then `wrangler deploy`) once you're
logged in via `npx wrangler login`.
