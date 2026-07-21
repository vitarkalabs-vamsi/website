# Vitarka Labs Website

A multi-page React + Vite site for Vitarka Labs, plus supporting tooling:

- `src/pages/HomePage.jsx` — company overview: about, practice areas, method, and a Products section linking to each POC.
- `src/pages/ArcNodePage.jsx` — the ARC-Node product page (edge acoustic/RF sensing POC).
- `src/pages/OrganoidIntelligencePage.jsx` — the Organoid Intelligence product page (applied research POC).
- `src/components/Layout.jsx` — shared nav, footer, and contact modal used across all pages.
- `src/lib/theme.jsx` — shared design system: global CSS, palette, and reusable marks/components.
- `backend/` — Express API for the contact form and the ARC-Node blueprint download.
- `generate_blueprint.js` — Node script that generates the ARC-Node `.docx` blueprint using `docx`.

## Setup

```bash
npm install
```

## Run the website locally

```bash
npm run dev
```

Open the URL shown in the terminal, usually `http://localhost:4173`.

The contact form and ARC-Node download call the API at `VITE_API_BASE` (defaults to `http://localhost:3001`
in dev — see `.env.example`). Run the backend separately:

```bash
cd backend
npm install
npm start
```

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

Creates `ARC_Node_v2_Technical_Blueprint.generated.docx`.

## Deploying to Cloudflare Pages

1. Connect this GitHub repo in the Cloudflare Pages dashboard.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Set the `VITE_API_BASE` environment variable to your deployed backend's public URL.
5. `public/_redirects` is already set up (`/* /index.html 200`) so client-side routes like
   `/arc-node` and `/organoid-intelligence` resolve correctly on direct load/refresh.

The backend (`backend/`) is a plain Express app — Cloudflare Pages only serves the static frontend, so it
needs to be hosted separately (e.g. Render, Railway, Fly.io, or a VPS). Set `FRONTEND_URL` on that host to
your Cloudflare Pages domain so CORS allows the deployed frontend to call it.
