import React from 'react';

// Empty string = same-origin relative requests. The Worker serves the API
// and the static site from the same domain, so this works in production
// as-is; in dev, Vite's server.proxy forwards /api to `wrangler dev`.
export const API_BASE = import.meta.env.VITE_API_BASE || '';

/* ───────────────────────────────────────────────────────────────────────────
   VITARKA LABS — Editorial product design aesthetic
   Fonts: Fraunces (display) · Inter Tight (UI) · JetBrains Mono (technical)
   Palette: warm bone paper · deep ink · tactical olive · signal amber · steel
   Shared across Home + all product/POC subpages.
   ─────────────────────────────────────────────────────────────────────────── */

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    :root {
      /* Light palette — editorial paper */
      --paper:      #F2EEE2;
      --paper-2:    #E9E3D2;
      --paper-warm: #EFE9D8;
      --ink:        #0E1410;
      --ink-2:      #1F2A22;
      --olive:      #4A5B30;
      --olive-2:    #5F7340;
      --olive-dim:  #8B9870;
      --signal:     #C66A0E;
      --signal-2:   #E89230;
      --steel:      #1F3B5C;
      --steel-2:    #2D4F73;
      --rule:       #CFC8B3;
      --rule-2:     #B8AF96;
      --muted:      #6F695C;
      --muted-2:    #8F8775;

      /* Dark palette — POC / labs sections */
      --carbon:     #080A09;
      --carbon-2:   #11140F;
      --carbon-3:   #1A1F18;
      --carbon-4:   #232A21;
      --phosphor:   #6FB088;
      --phosphor-2: #4A7E5E;
      --signal-d:   #DEA046;
      --alert:      #C8513F;
      --steel-d:    #6B7E96;
      --rule-d:     #2A2F25;
      --text-d:     #C4BFA8;
      --text-dim:   #8A8775;
    }

    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--paper);
      color: var(--ink);
      font-family: 'Inter Tight', sans-serif;
      font-feature-settings: 'ss01', 'cv11';
      -webkit-font-smoothing: antialiased;
    }

    .vl-page { background: var(--paper); }
    .serif { font-family: 'Fraunces', serif; font-feature-settings: 'ss01'; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    /* ── Editorial labels with rule lines ────────────────────────────────── */
    .ed-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--olive);
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    .ed-label::before {
      content: '';
      width: 28px; height: 1px;
      background: var(--olive);
    }
    .ed-label.no-rule::before { display: none; }
    .ed-label.dark { color: var(--phosphor); }
    .ed-label.dark::before { background: var(--phosphor); }

    /* ── Typography ──────────────────────────────────────────────────────── */
    .display-1 {
      font-family: 'Fraunces', serif;
      font-weight: 400;
      font-size: clamp(40px, 6.5vw, 84px);
      line-height: 0.98;
      letter-spacing: -0.025em;
      font-variation-settings: 'opsz' 96, 'SOFT' 50, 'WONK' 0;
      color: var(--ink);
    }
    .display-1 em {
      font-style: italic;
      font-weight: 300;
      color: var(--olive);
      font-variation-settings: 'opsz' 144, 'SOFT' 100;
    }
    .display-2 {
      font-family: 'Fraunces', serif;
      font-weight: 400;
      font-size: clamp(30px, 4.2vw, 52px);
      line-height: 1.05;
      letter-spacing: -0.02em;
      font-variation-settings: 'opsz' 72, 'SOFT' 30;
      color: var(--ink);
    }
    .display-2 em {
      font-style: italic;
      font-weight: 300;
      color: var(--olive);
    }
    .display-3 {
      font-family: 'Fraunces', serif;
      font-weight: 500;
      font-size: clamp(22px, 2.6vw, 30px);
      line-height: 1.15;
      letter-spacing: -0.01em;
      color: var(--ink);
    }
    .body-lg { font-size: 17px; line-height: 1.65; color: var(--muted); font-weight: 400; }
    .body-md { font-size: 15px; line-height: 1.65; color: var(--muted); }
    .body-sm { font-size: 13px; line-height: 1.6; color: var(--muted); }
    .body-xs { font-size: 12px; line-height: 1.5; color: var(--muted); }

    /* ── Buttons ─────────────────────────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 22px;
      font-family: 'Inter Tight', sans-serif;
      font-size: 14px; font-weight: 500;
      letter-spacing: 0.01em;
      border: none; cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-ink {
      background: var(--ink); color: var(--paper);
      border: 1px solid var(--ink);
    }
    .btn-ink:hover { background: var(--ink-2); transform: translateY(-1px); }
    .btn-line {
      background: transparent; color: var(--ink);
      border: 1px solid var(--ink);
    }
    .btn-line:hover { background: var(--ink); color: var(--paper); }
    .btn-lg {
      padding: 16px 26px;
      font-size: 16px;
      font-weight: 600;
    }
    .btn-olive {
      background: var(--olive); color: var(--paper);
      border: 1px solid var(--olive);
    }
    .btn-olive:hover { background: var(--olive-2); }
    .btn-phosphor {
      background: var(--phosphor); color: var(--carbon);
      border: 1px solid var(--phosphor);
      font-weight: 600;
    }
    .btn-phosphor:hover { background: #8ECCA6; }
    .btn-ghost-dark {
      background: transparent; color: var(--phosphor);
      border: 1px solid rgba(111,176,136,0.35);
    }
    .btn-ghost-dark:hover { background: rgba(111,176,136,0.08); }

    /* ── Navigation ──────────────────────────────────────────────────────── */
    .vl-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(242,238,226,0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--rule);
    }
    .vl-nav-inner {
      max-width: 1320px; margin: 0 auto;
      padding: 0 32px; height: 76px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .vl-logo {
      display: flex; align-items: center; gap: 14px;
      text-decoration: none; color: var(--ink);
    }
    .vl-logo-mark {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
    }
    .vl-logo-name {
      font-family: 'Fraunces', serif;
      font-weight: 500;
      font-size: 22px;
      letter-spacing: -0.015em;
      font-variation-settings: 'opsz' 36, 'SOFT' 30;
    }
    .vl-logo-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: -1px;
    }
    .nav-list {
      display: flex; gap: 36px; align-items: center;
    }
    .nav-link {
      font-size: 14px; color: var(--ink); text-decoration: none;
      font-weight: 400;
      position: relative;
      transition: color 0.2s;
      background: none; border: none; cursor: pointer;
      font-family: 'Inter Tight', sans-serif;
      padding: 0;
    }
    .nav-link::after {
      content: ''; position: absolute;
      left: 0; right: 100%; bottom: -4px;
      height: 1px; background: var(--olive);
      transition: right 0.2s ease;
    }
    .nav-link:hover { color: var(--olive); }
    .nav-link:hover::after { right: 0; }
    .nav-link.is-active { color: var(--olive); }
    .nav-link.is-active::after { right: 0; }

    /* ── Section structure ───────────────────────────────────────────────── */
    .section {
      max-width: 1320px; margin: 0 auto;
      padding: 96px 32px;
    }
    .section-divider {
      max-width: 1320px; margin: 0 auto;
      padding: 0 32px;
    }
    .section-divider hr {
      border: none;
      border-top: 1px solid var(--rule);
      margin: 0;
    }

    /* ── Hero ────────────────────────────────────────────────────────────── */
    .hero {
      position: relative;
      background: var(--paper);
      padding: 64px 0 96px;
      overflow: hidden;
    }
    .hero-grid {
      max-width: 1320px; margin: 0 auto;
      padding: 0 32px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 64px;
      align-items: center;
    }
    .hero-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 28px; }
    .hero-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 5px 11px;
      border: 1px solid var(--rule);
      color: var(--ink);
      background: rgba(255,255,255,0.4);
    }
    .hero-tag.accent { color: var(--signal); border-color: var(--signal); }

    .hero-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      margin-top: 48px;
      border-top: 1px solid var(--ink);
      border-bottom: 1px solid var(--rule);
    }
    .hero-meta-cell {
      padding: 20px 24px 20px 0;
      border-right: 1px solid var(--rule);
    }
    .hero-meta-cell:last-child { border-right: none; padding-right: 0; }
    .hero-meta-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .hero-meta-value {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 500;
      color: var(--ink);
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }
    .hero-meta-desc {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
    }

    /* Hero visual — surveillance / aerial mood */
    .hero-visual {
      position: relative;
      aspect-ratio: 4 / 5;
      border: 1px solid var(--ink);
      overflow: hidden;
      background:
        radial-gradient(ellipse at 30% 20%, rgba(74,91,48,0.25), transparent 55%),
        radial-gradient(ellipse at 70% 80%, rgba(198,106,14,0.18), transparent 60%),
        linear-gradient(160deg, #1A2114 0%, #0E1410 100%);
    }
    .hero-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      filter: grayscale(0.4) contrast(1.05) brightness(0.85) sepia(0.12);
      mix-blend-mode: luminosity;
      opacity: 0.78;
    }
    .hero-visual-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 30%, rgba(8,10,9,0.75) 100%);
      pointer-events: none;
    }
    .hero-visual-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(to right, rgba(111,176,136,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(111,176,136,0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .hero-visual-marks {
      position: absolute; inset: 0; padding: 20px;
      display: flex; flex-direction: column; justify-content: space-between;
      pointer-events: none;
    }
    .hero-corner {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--phosphor);
      text-transform: uppercase;
    }
    .hero-crosshair {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 80px; height: 80px;
    }
    .hero-readout {
      position: absolute;
      bottom: 24px; left: 24px; right: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--phosphor);
      line-height: 1.5;
      letter-spacing: 0.05em;
    }
    .hero-readout-line { display: flex; justify-content: space-between; gap: 16px; }
    .hero-readout-line span:last-child { color: var(--text-dim); }

    /* ── Cards (light) ───────────────────────────────────────────────────── */
    .ed-card {
      background: var(--paper-warm);
      border: 1px solid var(--rule);
      padding: 28px;
      transition: all 0.22s ease;
      position: relative;
    }
    .ed-card:hover {
      border-color: var(--ink);
      transform: translateY(-2px);
      box-shadow: 0 1px 0 0 var(--ink);
    }
    .ed-card-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--muted);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ed-card-icon {
      width: 44px; height: 44px;
      border: 1px solid var(--ink);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      color: var(--ink);
      background: var(--paper);
    }
    .ed-card-title {
      font-family: 'Fraunces', serif;
      font-size: 21px;
      font-weight: 500;
      color: var(--ink);
      margin-bottom: 8px;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
    .ed-card-body {
      font-size: 14px;
      line-height: 1.65;
      color: var(--muted);
    }

    /* ── Grids ───────────────────────────────────────────────────────────── */
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
    .grid-3 > * { background: var(--paper-warm); border: none; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
    .grid-4 > * { background: var(--paper-warm); border: none; }

    /* ── About block ─────────────────────────────────────────────────────── */
    .quote-block {
      background: var(--ink);
      color: var(--paper);
      padding: 40px 36px;
      position: relative;
    }
    .quote-block::before {
      content: '"';
      position: absolute;
      top: -10px; left: 24px;
      font-family: 'Fraunces', serif;
      font-size: 120px;
      line-height: 1;
      color: var(--olive);
      opacity: 0.8;
    }
    .quote-text {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 400;
      font-style: italic;
      line-height: 1.35;
      letter-spacing: -0.01em;
      font-variation-settings: 'opsz' 72, 'SOFT' 100;
      position: relative;
      z-index: 1;
    }
    .quote-attr {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--olive-dim);
      margin-top: 20px;
    }

    .principle-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 18px 0;
      border-bottom: 1px solid var(--rule);
    }
    .principle-row:last-child { border-bottom: none; }
    .principle-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      color: var(--olive);
      flex-shrink: 0;
      padding-top: 2px;
      min-width: 28px;
    }
    .principle-text {
      font-size: 15px;
      color: var(--ink);
      line-height: 1.55;
    }

    /* ── Product / POC teaser cards (home) ───────────────────────────────── */
    .product-card {
      background: var(--carbon);
      color: var(--text-d);
      border: 1px solid var(--rule-d);
      padding: 36px;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      display: block;
      transition: all 0.25s ease;
    }
    .product-card:hover {
      border-color: var(--phosphor-2);
      transform: translateY(-3px);
    }
    .product-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--phosphor), transparent);
      opacity: 0.35;
    }
    .product-card-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--phosphor);
      margin-bottom: 18px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .product-card-title {
      font-family: 'Fraunces', serif;
      font-size: 26px;
      font-weight: 500;
      color: #F2EEE2;
      letter-spacing: -0.01em;
      margin-bottom: 10px;
      line-height: 1.15;
    }
    .product-card-body {
      font-size: 14px;
      line-height: 1.65;
      color: var(--text-d);
      margin-bottom: 22px;
    }
    .product-card-cta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--phosphor);
      display: flex; align-items: center; gap: 8px;
    }

    /* ── ARC-NODE / POC Dark section ─────────────────────────────────────── */
    .arc-section {
      background: var(--carbon);
      padding: 0;
      color: var(--text-d);
      position: relative;
      overflow: hidden;
    }
    .arc-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--phosphor), transparent);
      opacity: 0.4;
    }
    .arc-inner {
      max-width: 1320px; margin: 0 auto;
      padding: 96px 32px;
    }

    .arc-h1 {
      font-family: 'Fraunces', serif;
      font-weight: 400;
      font-size: clamp(40px, 5.5vw, 72px);
      line-height: 1;
      letter-spacing: -0.025em;
      color: #F2EEE2;
      font-variation-settings: 'opsz' 96;
      margin: 0;
    }
    .arc-h1 em {
      font-style: italic;
      font-weight: 300;
      color: var(--phosphor);
      font-variation-settings: 'opsz' 144, 'SOFT' 100;
    }
    .arc-h2 {
      font-family: 'Fraunces', serif;
      font-weight: 500;
      font-size: clamp(22px, 2.8vw, 32px);
      line-height: 1.15;
      letter-spacing: -0.015em;
      color: #F2EEE2;
      margin: 0;
    }
    .arc-body { font-size: 15px; line-height: 1.7; color: var(--text-d); }
    .arc-body-sm { font-size: 13px; line-height: 1.65; color: var(--text-dim); }

    .arc-card {
      background: var(--carbon-2);
      border: 1px solid var(--rule-d);
      padding: 24px;
      transition: all 0.2s;
    }
    .arc-card:hover {
      border-color: var(--phosphor-2);
      background: var(--carbon-3);
    }

    .arc-divider {
      border: none;
      border-top: 1px solid var(--rule-d);
      margin: 56px 0;
      position: relative;
    }
    .arc-divider-glyph {
      position: absolute;
      left: 50%; top: -8px;
      transform: translateX(-50%);
      background: var(--carbon);
      padding: 0 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.3em;
      color: var(--text-dim);
    }

    .arc-tag {
      display: inline-block;
      padding: 4px 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .arc-tag-phosphor {
      background: rgba(111,176,136,0.1);
      color: var(--phosphor);
      border: 1px solid rgba(111,176,136,0.3);
    }
    .arc-tag-signal {
      background: rgba(222,160,70,0.08);
      color: var(--signal-d);
      border: 1px solid rgba(222,160,70,0.25);
    }
    .arc-tag-alert {
      background: rgba(200,81,63,0.08);
      color: var(--alert);
      border: 1px solid rgba(200,81,63,0.25);
    }

    /* ── Schematic architecture diagram ──────────────────────────────────── */
    .schematic {
      border: 1px solid var(--rule-d);
      background:
        linear-gradient(var(--carbon-2), var(--carbon-2)),
        repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(111,176,136,0.04) 23px, rgba(111,176,136,0.04) 24px),
        repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(111,176,136,0.04) 23px, rgba(111,176,136,0.04) 24px);
      background-blend-mode: normal;
      padding: 0;
    }
    .schematic-corner {
      position: relative;
    }
    .schematic-tag {
      position: absolute;
      top: 12px; left: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--phosphor);
      z-index: 2;
    }
    .schematic-coord {
      position: absolute;
      top: 12px; right: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      z-index: 2;
    }

    .arch-layer {
      display: flex; gap: 0;
      border-bottom: 1px solid var(--rule-d);
      position: relative;
    }
    .arch-layer:last-child { border-bottom: none; }
    .arch-layer-label {
      width: 140px; min-width: 140px;
      padding: 24px 16px;
      border-right: 1px solid var(--rule-d);
      display: flex; flex-direction: column;
      gap: 8px;
      background: rgba(111,176,136,0.025);
    }
    .arch-layer-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--phosphor);
    }
    .arch-layer-name {
      font-family: 'Fraunces', serif;
      font-size: 17px;
      font-weight: 500;
      color: #F2EEE2;
      line-height: 1.15;
      letter-spacing: -0.01em;
    }
    .arch-components {
      display: flex; gap: 10px; padding: 18px;
      flex-wrap: wrap; align-items: center;
      flex: 1;
    }
    .arch-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 12px;
      border: 1px solid var(--rule-d);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-d);
      background: var(--carbon);
    }
    .arch-chip strong {
      font-weight: 500;
      color: #F2EEE2;
    }
    .arch-chip.phosphor {
      border-color: rgba(111,176,136,0.4);
      color: var(--phosphor);
    }
    .arch-chip.phosphor strong { color: var(--phosphor); }
    .arch-chip.signal {
      border-color: rgba(222,160,70,0.35);
      color: var(--signal-d);
    }
    .arch-chip.signal strong { color: var(--signal-d); }

    /* ── Roadmap ─────────────────────────────────────────────────────────── */
    .roadmap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--rule-d); border: 1px solid var(--rule-d); }
    .roadmap-item {
      background: var(--carbon-2);
      padding: 24px 20px;
      position: relative;
      transition: background 0.2s;
    }
    .roadmap-item:hover { background: var(--carbon-3); }
    .roadmap-item.active {
      background: rgba(111,176,136,0.06);
    }
    .roadmap-item.active::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: var(--phosphor);
    }
    .roadmap-version {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--phosphor);
      margin-bottom: 6px;
    }
    .roadmap-version.dim { color: var(--text-dim); }
    .roadmap-title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 500;
      color: #F2EEE2;
      letter-spacing: -0.01em;
      margin-bottom: 14px;
    }
    .roadmap-items { list-style: none; padding: 0; margin: 0; }
    .roadmap-items li {
      font-size: 12px;
      color: var(--text-d);
      line-height: 1.55;
      padding: 5px 0;
      border-bottom: 1px solid rgba(42,47,37,0.6);
      display: flex; gap: 8px;
    }
    .roadmap-items li:last-child { border-bottom: none; }
    .roadmap-items li::before {
      content: '→';
      color: var(--phosphor);
      flex-shrink: 0;
    }

    /* ── Metrics ─────────────────────────────────────────────────────────── */
    .metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--rule-d); border: 1px solid var(--rule-d); }
    .metric-cell {
      background: var(--carbon-2);
      padding: 24px 18px;
    }
    .metric-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--text-dim);
      margin-bottom: 12px;
    }
    .metric-value {
      font-family: 'Fraunces', serif;
      font-size: 32px;
      font-weight: 500;
      color: var(--phosphor);
      letter-spacing: -0.015em;
      line-height: 1;
      margin-bottom: 10px;
      font-variation-settings: 'opsz' 96;
    }
    .metric-label { font-size: 12px; color: var(--text-d); line-height: 1.55; }

    /* ── Precision corrections ───────────────────────────────────────────── */
    .precision-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .precision-card {
      background: var(--carbon-2);
      border: 1px solid var(--rule-d);
      padding: 24px;
      position: relative;
    }
    .precision-num {
      position: absolute;
      top: 24px; right: 24px;
      font-family: 'Fraunces', serif;
      font-size: 42px;
      font-style: italic;
      font-weight: 300;
      color: var(--rule-d);
      line-height: 1;
    }
    .precision-claim {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--signal-d);
      margin-bottom: 18px;
    }
    .precision-row {
      display: flex; gap: 10px;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .precision-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.15em;
      color: var(--text-dim);
      width: 30px;
      flex-shrink: 0;
      padding-top: 3px;
    }
    .precision-not {
      font-size: 13px;
      color: var(--alert);
      text-decoration: line-through;
      opacity: 0.85;
      flex: 1;
    }
    .precision-is {
      font-family: 'Fraunces', serif;
      font-size: 16px;
      font-weight: 500;
      color: #F2EEE2;
      letter-spacing: -0.005em;
      line-height: 1.3;
      flex: 1;
    }
    .precision-why {
      font-size: 12px;
      color: var(--text-d);
      line-height: 1.65;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--rule-d);
    }

    /* ── BOM table ───────────────────────────────────────────────────────── */
    .bom-wrap {
      border: 1px solid var(--rule-d);
      overflow: hidden;
      background: var(--carbon-2);
    }
    .bom-table { width: 100%; border-collapse: collapse; }
    .bom-table th {
      text-align: left;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--phosphor);
      padding: 14px 18px;
      border-bottom: 1px solid var(--rule-d);
      font-weight: 500;
      background: rgba(111,176,136,0.04);
    }
    .bom-table td {
      padding: 16px 18px;
      border-bottom: 1px solid rgba(42,47,37,0.6);
      font-size: 13px;
      color: var(--text-d);
    }
    .bom-table tbody tr:last-child td { border-bottom: none; }
    .bom-table tbody tr:hover td { color: #F2EEE2; background: rgba(111,176,136,0.02); }
    .bom-table .total td {
      background: var(--carbon-3);
      border-top: 1px solid var(--phosphor-2);
      color: #F2EEE2;
      font-weight: 500;
    }
    .bom-table .total .price {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      color: var(--phosphor);
      font-weight: 500;
    }

    /* ── Status pill ─────────────────────────────────────────────────────── */
    .status-pill {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 7px 14px;
      border: 1px solid rgba(111,176,136,0.3);
      background: rgba(111,176,136,0.06);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      color: var(--phosphor);
      text-transform: uppercase;
    }
    .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--phosphor);
      box-shadow: 0 0 8px var(--phosphor);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }

    /* ── Contact ─────────────────────────────────────────────────────────── */
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 0;
      border: 1px solid var(--ink);
    }
    .contact-l {
      background: var(--ink);
      color: var(--paper);
      padding: 56px 48px;
      position: relative;
      overflow: hidden;
    }
    .contact-l::after {
      content: '';
      position: absolute;
      right: -120px; bottom: -120px;
      width: 360px; height: 360px;
      border: 1px solid var(--olive);
      border-radius: 50%;
      opacity: 0.4;
    }
    .contact-l::before {
      content: '';
      position: absolute;
      right: -40px; bottom: -40px;
      width: 200px; height: 200px;
      border: 1px solid var(--signal);
      border-radius: 50%;
      opacity: 0.3;
    }
    .contact-r {
      background: var(--paper-warm);
      padding: 56px 48px;
      display: flex; flex-direction: column;
      gap: 0;
    }
    .contact-item {
      display: flex; align-items: center; gap: 16px;
      padding: 18px 0;
      border-bottom: 1px solid var(--rule);
      font-size: 14px;
      color: var(--ink);
    }
    .contact-item:last-child { border-bottom: none; }
    .contact-item-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
      width: 80px;
      flex-shrink: 0;
    }

    /* ── Footer ──────────────────────────────────────────────────────────── */
    .footer {
      background: var(--ink);
      color: var(--paper-warm);
      padding: 32px 0;
    }
    .footer-inner {
      max-width: 1320px; margin: 0 auto;
      padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
    }

    /* ── Animations ──────────────────────────────────────────────────────── */
    @keyframes scan {
      0%, 100% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translateY(100%); opacity: 1; }
      60% { opacity: 0; }
    }
    .scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: var(--phosphor);
      opacity: 0.4;
      animation: scan 4s ease-in-out infinite;
      pointer-events: none;
    }

    /* ── Responsive ──────────────────────────────────────────────────────── */
    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; }
      .grid-3, .grid-4, .roadmap-grid, .precision-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .contact-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .vl-nav-inner, .section, .arc-inner, .section-divider, .hero-grid { padding-left: 20px; padding-right: 20px; }
      .grid-3, .grid-4, .roadmap-grid, .precision-grid, .metrics-grid { grid-template-columns: 1fr; }
      .arch-layer { flex-direction: column; }
      .arch-layer-label { width: 100%; border-right: none; border-bottom: 1px solid var(--rule-d); }
      .nav-list { display: none; }
      .vl-mobile-btn { display: flex !important; }
      .contact-l, .contact-r { padding: 36px 24px; }
      .hero-meta { grid-template-columns: 1fr; }
      .hero-meta-cell { border-right: none; border-bottom: 1px solid var(--rule); padding: 16px 0; }
    }

    /* ── Mobile nav drawer ───────────────────────────────────────────────── */
    .mobile-nav {
      position: fixed;
      top: 76px; left: 0; right: 0;
      background: rgba(242,238,226,0.97);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--rule);
      padding: 20px 20px 28px;
      z-index: 49;
      display: flex; flex-direction: column; gap: 4px;
    }
    .mobile-nav .nav-link { padding: 12px 0; font-size: 16px; border-bottom: 1px solid var(--rule-2); }
    .mobile-nav .nav-link:last-of-type { border-bottom: none; }
  `}</style>
);

/* ─── CUSTOM SVG MARKS ──────────────────────────────────────────────────────── */

export const VitarkaMark = ({ size = 40, color = "#0E1410" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="0.5" y="0.5" width="39" height="39" stroke={color} strokeWidth="1" />
    <path d="M8 8 L20 28 L32 8" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="miter" />
    <circle cx="20" cy="20" r="2" fill={color} />
    <line x1="20" y1="2" x2="20" y2="6" stroke={color} strokeWidth="1" />
    <line x1="20" y1="34" x2="20" y2="38" stroke={color} strokeWidth="1" />
    <line x1="2" y1="20" x2="6" y2="20" stroke={color} strokeWidth="1" />
    <line x1="34" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1" />
  </svg>
);

export const Crosshair = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="30" stroke="#6FB088" strokeWidth="0.8" opacity="0.6" />
    <circle cx="40" cy="40" r="18" stroke="#6FB088" strokeWidth="0.8" opacity="0.4" />
    <circle cx="40" cy="40" r="2" fill="#6FB088" />
    <line x1="40" y1="0" x2="40" y2="20" stroke="#6FB088" strokeWidth="0.8" opacity="0.6" />
    <line x1="40" y1="60" x2="40" y2="80" stroke="#6FB088" strokeWidth="0.8" opacity="0.6" />
    <line x1="0" y1="40" x2="20" y2="40" stroke="#6FB088" strokeWidth="0.8" opacity="0.6" />
    <line x1="60" y1="40" x2="80" y2="40" stroke="#6FB088" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

/* ─── SHARED SUB-COMPONENTS ─────────────────────────────────────────────────── */

export function ArchLayerRow({ layer, idx, total }) {
  return (
    <div className="arch-layer">
      <div className="arch-layer-label">
        <div className="arch-layer-id">LAYER {layer.id}</div>
        <div className="arch-layer-name">{layer.name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>
      <div className="arch-components">
        {layer.chips.map((chip, i) => (
          <div key={i} className={`arch-chip ${chip.type}`}>
            <strong>{chip.label}</strong>
            {chip.detail && <span>· {chip.detail}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
