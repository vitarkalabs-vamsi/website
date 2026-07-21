import React, { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, ChevronRight, Menu, X,
  Mic, Cpu, Brain, Radio, Shield, Workflow, SatelliteDish,
  Bot, Wrench, Search, Zap, TrendingUp, Download, Plus
} from 'lucide-react';

/* ───────────────────────────────────────────────────────────────────────────
   VITARKA LABS — Editorial product design aesthetic
   Fonts: Fraunces (display) · Inter Tight (UI) · JetBrains Mono (technical)
   Palette: warm bone paper · deep ink · tactical olive · signal amber · steel
   ─────────────────────────────────────────────────────────────────────────── */

const GlobalStyles = () => (
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

      /* Dark palette — ARC-Node */
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

    /* ── ARC-NODE Dark section ───────────────────────────────────────────── */
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

const VitarkaMark = ({ size = 40, color = "#0E1410" }) => (
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

const Crosshair = () => (
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

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

const expertise = [
  { num: '§ 01', icon: Brain, title: 'AI & Generative Systems', desc: 'Practical AI products, agentic workflows, and inference systems engineered for deployment — not demos.' },
  { num: '§ 02', icon: Bot, title: 'Software Products', desc: 'Modern web platforms, internal tooling, and SaaS — built to ship, scale, and stay maintainable.' },
  { num: '§ 03', icon: Cpu, title: 'Embedded & Edge', desc: 'Firmware, on-device inference, and connected hardware. Real engineering at the silicon-to-cloud boundary.' },
  { num: '§ 04', icon: SatelliteDish, title: 'IoT & Sensing', desc: 'Multi-modal sensor fusion, telemetry pipelines, and decision systems grounded in physical signal.' },
  { num: '§ 05', icon: Mic, title: 'Acoustic & RF Systems', desc: 'Signal-domain POCs — MFCC pipelines, GCC-PHAT bearing math, RF energy gating, edge classifiers.' },
  { num: '§ 06', icon: Workflow, title: 'Productivity Tooling', desc: 'Software that removes operational friction — internal dashboards, automation, decision aids.' },
];

const workSteps = [
  { num: 'I.',   icon: Search,     title: 'Understand',  text: 'The problem first. The user, the constraint, the why. No solutioning until the question is clear.' },
  { num: 'II.',  icon: Zap,        title: 'Shape',       text: 'Concept becomes a technical thesis with named risks and a falsifiable plan.' },
  { num: 'III.', icon: Wrench,     title: 'Build',       text: 'A working prototype or validated slice — not a deck, not a mock, an actual measurable artefact.' },
  { num: 'IV.',  icon: TrendingUp, title: 'Refine',      text: 'Production hardening, field iteration, and the unglamorous work that separates demo from deployment.' },
];

const arcMetrics = [
  { name: 'FPR',     value: '< 5%',   label: 'False positive rate in dynamic ambient environment' },
  { name: 'RECALL',  value: '> 90%',  label: 'Detection probability at distances up to 150 m' },
  { name: 'BEARING', value: '± 10°',  label: 'Sector resolution via 4-mic GCC-PHAT array' },
  { name: 'LATENCY', value: '< 1.5s', label: 'Acoustic breach to dashboard visualisation' },
  { name: 'POWER',   value: '< 500mW',label: 'Average continuous draw with Tier 0 sleep gating' },
];

const archLayers = [
  {
    id: 'A', name: 'Node Layer',
    chips: [
      { label: '4× INMP441', type: 'phosphor', detail: 'I²S MEMS array' },
      { label: 'Circular Mount', type: 'phosphor', detail: '8–12 cm Ø' },
      { label: 'ESP32-S3', type: '', detail: 'Dual LX7 + DMA' },
      { label: 'AD8317', type: 'signal', detail: '1 MHz – 10 GHz' },
      { label: 'SX1276', type: '', detail: 'LoRa, SPI' },
    ]
  },
  {
    id: 'B', name: 'Compute Layer',
    chips: [
      { label: 'Tier 0', type: 'phosphor', detail: 'Spectral baseline · always-on' },
      { label: 'Tier 1', type: 'phosphor', detail: 'MFCC + 1D-CNN · on trigger' },
      { label: 'Tier 2', type: 'signal', detail: 'GCC-PHAT · on high confidence' },
    ]
  },
  {
    id: 'C', name: 'Network Layer',
    chips: [
      { label: 'Binary Payload', type: 'phosphor', detail: '18 bytes, fixed-length struct' },
      { label: 'AES-128-CTR', type: 'signal', detail: 'HW accelerated' },
      { label: 'HMAC-SHA256', type: 'signal', detail: 'Encrypt-then-MAC' },
      { label: 'Replay Window', type: '', detail: 'Seq-id sliding gate' },
    ]
  },
  {
    id: 'D', name: 'Dashboard',
    chips: [
      { label: 'LoRa Gateway', type: '', detail: '→ MQTT broker' },
      { label: 'Next.js / SOLR', type: 'phosphor', detail: 'Event index' },
      { label: 'Confidence Map', type: '', detail: 'Per-node heatmap' },
      { label: 'Health Monitor', type: '', detail: 'Battery · uptime · RSSI' },
    ]
  },
];

const roadmap = [
  { v: 'Phase 1',   active: true,  title: 'Foundation',  items: ['Anomaly Gate (Tier 0)', 'CNN Classifier (Tier 1)', 'Encrypted Binary LoRa', 'ESP32-S3 Data Logger'] },
  { v: 'Phase 2', active: false, title: 'Direction',   items: ['4-Mic Circular Mount', 'GCC-PHAT Phase Math', 'Bearing ± 10° Estimation', 'Moving-source Validation'] },
  { v: 'Phase 3',   active: false, title: 'Corroboration', items: ['AD8317 RF Integration', 'Cross-modal Persistence Gate', 'Fused Confidence Score', 'FPR Reduction Trial'] },
  { v: 'Phase 4',   active: false, title: 'Multi-Node',  items: ['2–3 Node Mesh', 'TDOA Triangulation', 'Dashboard Aggregation', 'Collision Handling'] },
];

const precisionClaims = [
  { num: '01', claim: 'Localisation Scope',
    not: 'Precise GPS-grade localisation',
    is: 'Bearing Sector Estimation',
    why: 'GCC-PHAT on a small 4-mic array gives direction-of-arrival (AoA), not absolute position. The first prototype reports bearing as a sector (e.g. 045° ± 10°). Full triangulation is a later roadmap item requiring multi-node deployment.' },
  { num: '02', claim: 'RF Sensing Scope',
    not: 'Drone protocol identification',
    is: 'Coarse RF energy corroboration',
    why: 'AD8317 is a wideband log-detector (1 MHz – 10 GHz). It cannot decode DJI OcuSync or FlySky packets. It verifies whether RF burst energy is present when the acoustic classifier fires — reducing false positives without claiming protocol-level ID.' },
  { num: '03', claim: 'Security Architecture',
    not: 'AES-GCM hardware-native',
    is: 'AES-CTR + HMAC-SHA256',
    why: 'ESP32-S3 hardware AES supports ECB, CBC, OFB, CTR, CFB8, CFB128 — not GCM. AES-CTR (hardware-accelerated) with HMAC-SHA256 (Encrypt-then-MAC) provides authenticated encryption with replay rejection. Equivalent security, honest implementation.' },
];

const bom = [
  { component: 'ESP32-S3-WROOM-1', function: 'Edge-AI compute · I²S DMA · HW crypto', cost: '₹ 400' },
  { component: '4 × INMP441',      function: 'Omnidirectional MEMS array (I²S)',     cost: '₹ 600' },
  { component: 'SX1276 LoRa',      function: 'Encrypted binary telemetry (SPI)',     cost: '₹ 500' },
  { component: 'AD8317 Eval Board',function: 'Passive RF burst corroboration gate',  cost: '₹ 800' },
  { component: '18650 Li-ion + TP4056', function: 'Power management (PoC scale)',    cost: '₹ 300' },
  { component: 'Custom 3D-Printed Housing', function: '4-Mic precision geometry mount', cost: '₹ 250' },
];

/* ─── SUB-COMPONENTS ────────────────────────────────────────────────────────── */

function ArchLayerRow({ layer, idx, total }) {
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

/* ─── ARC-NODE SECTION ──────────────────────────────────────────────────────── */

function ARCNodeSection({ onClose, onContact, dlStatus, onDownload }) {
  return (
    <section id="arcnode" className="section">
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <div className="ed-label" style={{ marginBottom: 18 }}>ARC-Node</div>
            <h2 className="display-2">ARC-Node summary</h2>
          </div>
          <button className="btn btn-line btn-lg" onClick={onClose} style={{ minWidth: 180 }}>
            Close ARC-Node
          </button>
        </div>

        <p className="body-lg" style={{ maxWidth: 680, marginBottom: 36 }}>
          A compact, precise overview of the sensor node concept. Full technical scope and design are available in the downloadable DOCX.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 40 }}>
          <div className="ed-card">
            <div className="ed-card-title">Core capability</div>
            <div className="ed-card-body">Acoustic + RF sensing, edge inference, and secure telemetry in a low-power node.</div>
          </div>
          <div className="ed-card">
            <div className="ed-card-title">Deployment</div>
            <div className="ed-card-body">Designed for perimeter, site, and asset monitoring with a short pilot validation path.</div>
          </div>
          <div className="ed-card">
            <div className="ed-card-title">Scope</div>
            <div className="ed-card-body">The website shows the shortlist. The DOCX carries the complete design, BOM, and validation plan.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { title: 'Sensor stack', body: '4-mic acoustic array, RF energy gate, ESP32-S3 compute, LoRa telemetry.' },
            { title: 'Validation signal', body: 'GCC-PHAT bearing, MFCC classification, confidence scoring with false-positive filtering.' },
            { title: 'Security', body: 'AES-CTR encryption, HMAC-SHA256 authentication, replay protection for node telemetry.' },
            { title: 'Pilot output', body: 'BOM estimate, deployment checklist, and performance targets in the DOCX.' },
          ].map((item) => (
            <div key={item.title} className="ed-card">
              <div className="ed-card-title">{item.title}</div>
              <div className="ed-card-body">{item.body}</div>
            </div>
          ))}
        </div>

        <div style={{
          border: '1px solid var(--ink)',
          background: 'rgba(242,238,226,0.7)',
          padding: '36px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24
        }}>
          <div style={{ maxWidth: 620 }}>
            <div className="ed-label" style={{ marginBottom: 10 }}>Full technical content</div>
            <div className="display-3" style={{ marginBottom: 8 }}>Complete ARC-Node design in DOCX</div>
            <p className="body-md" style={{ margin: 0 }}>
              The website is deliberately concise. Download the document for the full system architecture, BOM, risk notes, and validation criteria.
            </p>
          </div>
          <button
            className="btn btn-phosphor btn-lg"
            onClick={onDownload}
            disabled={dlStatus === 'loading'}
          >
            <Download size={15} />
            {dlStatus === 'loading' ? 'Downloading…' : dlStatus === 'done' ? 'Downloaded ✓' : dlStatus === 'error' ? 'Try again' : 'Download ARC-Node DOCX'}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── DOWNLOAD HELPER ───────────────────────────────────────────────────────── */

async function downloadBlueprint(setStatus) {
  setStatus('loading');
  try {
    const res = await fetch(`${API_BASE}/api/download/arc-node-blueprint`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Download failed');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ARC_Node_v2_Technical_Blueprint.docx';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('done');
  } catch (err) {
    console.error(err);
    setStatus('error');
  }
}

/* ─── CONTACT MODAL ─────────────────────────────────────────────────────────── */

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', type: 'other' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState([]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrors([]);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || [{ msg: data.error || 'Something went wrong.' }]);
        setStatus('error');
      } else {
        setStatus('sent');
      }
    } catch {
      setErrors([{ msg: 'Could not reach the server. Please try email directly.' }]);
      setStatus('error');
    }
  }, [form]);

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--paper-warm)', border: '1px solid var(--rule)',
    padding: '12px 14px', fontSize: 14, fontFamily: "'Inter Tight', sans-serif",
    color: 'var(--ink)', outline: 'none', resize: 'vertical',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,20,16,0.72)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: 'var(--paper)', border: '1px solid var(--ink)', maxWidth: 560, width: '100%', padding: '40px 36px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20, lineHeight: 1 }}>
          ×
        </button>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: 'var(--ink)', marginBottom: 12 }}>Message received.</div>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65 }}>
              We will respond to <strong>{form.email}</strong> shortly.
            </p>
            <button className="btn btn-ink" style={{ marginTop: 24 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="ed-label" style={{ marginBottom: 20 }}>Start a Conversation</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 500, color: 'var(--ink)', marginBottom: 28, letterSpacing: '-0.01em' }}>
              Bring the idea, the challenge.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Name *</label>
                <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name" required />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Email *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" required />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Topic</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.type} onChange={set('type')}>
                {[['software','Software / Web'], ['ai','AI / GenAI'], ['embedded','Embedded / Edge'], ['iot','IoT / Sensing'], ['poc','ARC-Node POC'], ['other','Other']].map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Message *</label>
              <textarea style={{ ...inputStyle, minHeight: 120 }} value={form.message} onChange={set('message')} placeholder="Describe your idea, challenge, or question…" required />
            </div>

            {errors.length > 0 && (
              <div style={{ background: 'rgba(200,81,63,0.06)', border: '1px solid rgba(200,81,63,0.3)', padding: '10px 14px', marginBottom: 16 }}>
                {errors.map((err, i) => <div key={i} style={{ fontSize: 13, color: '#C8513F' }}>{err.msg}</div>)}
              </div>
            )}

            <button className="btn btn-ink btn-lg" type="submit" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────────────────────── */

export default function VitarkaLabsWebsite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [arcOpen, setArcOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [dlStatus, setDlStatus] = useState('idle'); // idle | loading | done | error

  const navItems = [
    { label: 'About',      id: 'about' },
    { label: 'Practice',   id: 'expertise' },
    { label: 'Method',     id: 'work' },
    { label: 'ARC-Node',   id: 'arcnode',  highlight: true },
    { label: 'Contact',    id: 'contact' },
  ];

  return (
    <div className="vl-page">
      <GlobalStyles />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="vl-nav">
        <div className="vl-nav-inner">
          <a href="#home" className="vl-logo">
            <div className="vl-logo-mark"><img src="./vitarka_labs_final_logo.svg" alt="Vitarka Labs" style={{ width: 120, height: 120, display: 'block' }} /></div>
            <div>
              <div className="vl-logo-name">Vitarka Labs</div>
              <div className="vl-logo-tag">Precision · Permanence</div>
            </div>
          </a>
          <div className="nav-list">
            {navItems.map(item => (
              <a key={item.id} href={`#${item.id}`}
                 className={`nav-link ${item.highlight ? 'is-active' : ''}`}>
                {item.label}
              </a>
            ))}
            <button className="btn btn-ink" style={{ marginLeft: 8 }} onClick={() => setContactOpen(true)}>
              Partner with us <ArrowRight size={14} />
            </button>
          </div>
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
            className="vl-mobile-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE NAV DRAWER ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="mobile-nav">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${item.highlight ? 'is-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button className="btn btn-ink" style={{ marginTop: 12 }} onClick={() => { setMobileOpen(false); setContactOpen(true); }}>
            Partner with us <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="home" className="hero">
        <div className="hero-grid">

          <div>
            <div className="hero-tags">
              <span className="hero-tag">AI / GenAI</span>
              <span className="hero-tag">Software</span>
              <span className="hero-tag">Embedded</span>
              <span className="hero-tag">IoT · Sensing</span>
              <span className="hero-tag accent">Sensor POC</span>
            </div>

            <div className="ed-label" style={{ marginBottom: 28 }}>Engineering Practice / Est. 2025</div>

            <h1 className="display-1">
              A modern firm for <em>software,</em><br />
              AI, embedded systems<br />
              & <em>product innovation.</em>
            </h1>

            <p className="body-lg" style={{ maxWidth: 540, marginTop: 28, marginBottom: 32 }}>
              Vitarka Labs builds useful technology across multiple fields — from production AI products and SaaS to sensor systems engineered for real deployment.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-ink" onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}>Explore the practice <ArrowRight size={14} /></button>
              <button className="btn btn-line" onClick={() => setContactOpen(true)}>Open to collaboration</button>
              <button
                className="btn btn-ink btn-lg"
                onClick={() => setArcOpen(o => !o)}
                style={{ minWidth: 220 }}
              >
                {arcOpen ? 'Close ARC-Node' : 'Open ARC-Node'}
              </button>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-cell">
                <div className="hero-meta-label">Focus</div>
                <div className="hero-meta-value">Intelligence</div>
                <div className="hero-meta-desc">AI, automation, productivity systems</div>
              </div>
              <div className="hero-meta-cell">
                <div className="hero-meta-label">Domain</div>
                <div className="hero-meta-value">Edge & Hardware</div>
                <div className="hero-meta-desc">Embedded firmware, connected devices</div>
              </div>
              <div className="hero-meta-cell">
                <div className="hero-meta-label">Output</div>
                <div className="hero-meta-value">Deployable</div>
                <div className="hero-meta-desc">Ideas to usable, measurable systems</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              className="hero-img"
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80"
              alt="Aerial drone surveillance"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="hero-visual-grid" />
            <div className="hero-visual-overlay" />
            <div className="hero-crosshair"><Crosshair /></div>
            <div className="hero-visual-marks">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="hero-corner">N · 18.5204° / E · 73.8567°</span>
                <span className="hero-corner">REC · LIVE</span>
              </div>
              <div />
            </div>
            <div className="hero-readout">
              <div className="hero-readout-line"><span>SIG</span><span>ACOUSTIC · MFCC + 1D-CNN</span></div>
              <div className="hero-readout-line"><span>STATE</span><span>TIER-1 / NOMINAL</span></div>
              <div className="hero-readout-line"><span>NODES</span><span>003 / ONLINE</span></div>
            </div>
          </div>

        </div>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── ABOUT ───────────────────────────────────────────────────────────── */}
      <section id="about" className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="ed-label" style={{ marginBottom: 24 }}>About</div>
            <h2 className="display-2">
              A practice built to communicate <em>breadth</em> without confusion.
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: 480 }}>
              Vitarka Labs is a technology practice working across software, AI, embedded systems, IoT, and product innovation. Focus is on practical execution and useful outcomes — not slogans.
            </p>
            <p className="body-lg" style={{ marginTop: 16, maxWidth: 480 }}>
              The firm supports many kinds of ideas without becoming vague: from production SaaS to advanced sensor prototypes like PoC1.
            </p>
          </div>

          <div>
            <div className="quote-block">
              <div className="quote-text">
                We help ideas become products, systems, and opportunities — engineered with the same standard whether for commercial software or advanced sensing systems.
              </div>
              <div className="quote-attr">— Practice Brief, 2025</div>
            </div>

            <div style={{ marginTop: 28 }}>
              {[
                'Broad technology focus, unified brand',
                'Open to companies, founders, partners, and investors',
                'Built for practical value, not just concepts',
                'Software, AI, embedded, IoT — ready for each',
              ].map((msg, i) => (
                <div key={msg} className="principle-row">
                  <div className="principle-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="principle-text">{msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── EXPERTISE ───────────────────────────────────────────────────────── */}
      <section id="expertise" className="section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="ed-label" style={{ marginBottom: 18 }}>Practice areas</div>
            <h2 className="display-2">
              Six disciplines, <em>one execution standard.</em>
            </h2>
          </div>
          <p className="body-lg" style={{ maxWidth: 360 }}>
            Multiple technology directions, one cohesive engineering practice.
          </p>
        </div>

        <div className="grid-3">
          {expertise.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="ed-card">
                <div className="ed-card-num">
                  {item.num}
                  <span style={{ flex: 1, height: 1, background: 'var(--rule-2)' }} />
                </div>
                <div className="ed-card-icon"><Icon size={20} strokeWidth={1.5} /></div>
                <div className="ed-card-title">{item.title}</div>
                <div className="ed-card-body">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── HOW WE WORK ─────────────────────────────────────────────────────── */}
      <section id="work" className="section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="ed-label" style={{ marginBottom: 18 }}>Method</div>
            <h2 className="display-2">
              A simple structure that <em>delivers results.</em>
            </h2>
          </div>
          <p className="body-lg" style={{ maxWidth: 360 }}>
            Organised and execution-ready from first conversation to final product.
          </p>
        </div>

        <div className="grid-4">
          {workSteps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="ed-card">
                <div className="ed-card-num">
                  {step.num}
                  <span style={{ flex: 1, height: 1, background: 'var(--rule-2)' }} />
                </div>
                <div className="ed-card-icon"><Icon size={20} strokeWidth={1.5} /></div>
                <div className="ed-card-title">{step.title}</div>
                <div className="ed-card-body">{step.text}</div>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', color: 'var(--olive)', textTransform: 'uppercase' }}>
                  Learn more <ChevronRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ARC-NODE POC ────────────────────────────────────────────────────── */}
      {arcOpen ? (
        <ARCNodeSection
          onClose={() => setArcOpen(false)}
          onContact={() => setContactOpen(true)}
          dlStatus={dlStatus}
          onDownload={() => downloadBlueprint(setDlStatus)}
        />
      ) : (
        <section id="arcnode" className="section">
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 0', textAlign: 'center' }}>
            <div className="ed-label" style={{ marginBottom: 18 }}>ARC-Node</div>
            <h2 className="display-2">ARC-Node overview</h2>
            <p className="body-lg" style={{ marginTop: 24, marginBottom: 32 }}>
              A short, precise summary of the sensor node concept. Full technical scope and design are available in the downloadable DOCX.
            </p>
            <div className="ed-card" style={{ padding: '28px 32px', marginBottom: 24 }}>
              <div className="ed-card-title">ARC-Node in brief</div>
              <div className="ed-card-body">
                Edge sensor node with acoustic and RF capture, onboard inference, and secure telemetry. The website keeps it light; the DOCX carries the complete specification.
              </div>
            </div>
            <button
              className="btn btn-ink btn-lg"
              onClick={() => setArcOpen(true)}
              style={{ minWidth: 220 }}
            >
              Open ARC-Node
            </button>
          </div>
        </section>
      )}

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="section">
        <div className="ed-label" style={{ marginBottom: 28 }}>Contact</div>

        <div className="contact-grid">
          <div className="contact-l">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ed-label dark" style={{ marginBottom: 28, color: 'var(--olive-dim)' }}>Open to collaboration</div>
              <h3 className="display-2" style={{ color: 'var(--paper)' }}>
                Bring the idea, the challenge, or the <em style={{ color: 'var(--signal-2)' }}>product direction.</em>
              </h3>
              <p className="body-lg" style={{ color: 'rgba(242,238,226,0.7)', marginTop: 24, marginBottom: 32, maxWidth: 480 }}>
                Vitarka Labs is open to software work, AI initiatives, embedded solutions, IoT concepts, and strategic collaborations across industry and research.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" style={{ background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--paper)' }} onClick={() => setContactOpen(true)}>
                  Start a conversation <ArrowRight size={14} />
                </button>
                <button className="btn" style={{ background: 'transparent', color: 'var(--paper)', border: '1px solid rgba(242,238,226,0.4)' }} onClick={() => setContactOpen(true)}>
                  Send a brief
                </button>
              </div>
            </div>
          </div>

          <div className="contact-r">
            <div style={{ marginBottom: 20 }}>
              <div className="ed-label" style={{ marginBottom: 12 }}>Reach</div>
              <div className="display-3">Direct channels</div>
            </div>
            {[
              { label: 'Email',   value: 'hello@vitarkalabs.com' },
              { label: 'Phone',   value: '+91 · on request' },
              { label: 'Partner', value: 'Strategic introductions welcome' },
              { label: 'POC', value: 'Pilot collaboration · briefing available' },
            ].map(c => (
              <div key={c.label} className="contact-item">
                <div className="contact-item-label">{c.label}</div>
                <div>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VitarkaMark size={28} color="#F2EEE2" />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: 'var(--paper)', fontWeight: 500 }}>Vitarka Labs</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: 'rgba(242,238,226,0.5)', marginLeft: 8 }}>
              © {new Date().getFullYear()} · PUNE · IN
            </span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(242,238,226,0.45)', letterSpacing: '0.14em' }}>
            AI · SOFTWARE · EMBEDDED · IOT · PoC
          </div>
        </div>
      </footer>

      {/* ── CONTACT MODAL ───────────────────────────────────────────────────── */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
