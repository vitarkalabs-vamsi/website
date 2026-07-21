/* ────────────────────────────────────────────────────────────────────────────
   ARC-Node v2 — Technical Blueprint generator
   Editorial Defense Engineering aesthetic
   Fonts: Georgia (display serif) · Calibri (body) · Consolas (mono)
   Palette matches the website: ink, olive, signal amber, steel cobalt
   ──────────────────────────────────────────────────────────────────────────── */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, LevelFormat,
  BorderStyle, WidthType, ShadingType, PageBreak, PageNumber
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── Fonts ────────────────────────────────────────────────────────────────────
const F_DISPLAY = "Georgia";          // editorial serif
const F_BODY    = "Calibri";          // clean body
const F_MONO    = "Consolas";         // technical / mono

// ── Color palette (matches website) ──────────────────────────────────────────
const INK        = "0E1410";          // near-black
const INK_2      = "1F2A22";
const PAPER      = "F2EEE2";          // warm bone
const PAPER_2    = "E9E3D2";
const PAPER_WARM = "EFE9D8";
const OLIVE      = "4A5B30";          // tactical olive
const OLIVE_2    = "5F7340";
const OLIVE_DIM  = "8B9870";
const SIGNAL     = "C66A0E";          // signal amber
const SIGNAL_2   = "E89230";
const STEEL      = "1F3B5C";          // steel cobalt
const RULE       = "CFC8B3";          // hairline border
const RULE_2     = "B8AF96";
const MUTED      = "6F695C";
const ALERT      = "9B2820";          // deep alert red
const ALERT_BG   = "F4E0DD";
const OLIVE_BG   = "E3E5D5";          // muted olive tint
const SIGNAL_BG  = "F5E6CF";          // muted amber tint
const WHITE      = "FFFFFF";
const PHOSPHOR   = "4A7E5E";          // for "active" pill on cover

// ── Helpers ──────────────────────────────────────────────────────────────────
const bdr = (color = RULE, size = 4) => ({ style: BorderStyle.SINGLE, size, color });
const cellBorder = (color = RULE) => ({ top: bdr(color), bottom: bdr(color), left: bdr(color), right: bdr(color) });
const noBdr = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBdr, bottom: noBdr, left: noBdr, right: noBdr };
const cm = (m = {}) => ({ top: 100, bottom: 100, left: 140, right: 140, ...m });

// Text runs
const run = (text, opts = {}) => new TextRun({ text, font: F_BODY, size: 22, ...opts });
const brun = (text, opts = {}) => run(text, { bold: true, ...opts });
const irun = (text, opts = {}) => run(text, { italics: true, ...opts });
const srun = (text, opts = {}) => new TextRun({ text, font: F_DISPLAY, size: 22, ...opts });
const mrun = (text, opts = {}) => new TextRun({ text, font: F_MONO, size: 19, ...opts });

// Paragraphs
const p = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { after: 120 }, ...opts
});
const body = (text, opts = {}) => p([run(text, { color: INK_2 })], {
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 160, line: 320 }, ...opts
});
const bodyLead = (text, opts = {}) => p([run(text, { color: INK_2, size: 24 })], {
  spacing: { after: 200, line: 340 }, ...opts
});
const sp = (after = 160) => new Paragraph({ children: [], spacing: { after } });

// Section / editorial labels
const edLabel = (text, color = OLIVE) => new Paragraph({
  children: [new TextRun({ text, font: F_MONO, size: 18, color, bold: true, characterSpacing: 40 })],
  spacing: { before: 240, after: 80 }
});

// Headings — Georgia display
const h1 = (number, text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [
    new TextRun({ text: `§ ${number}   `, font: F_MONO, size: 22, color: OLIVE, bold: false }),
    new TextRun({ text, font: F_DISPLAY, size: 44, bold: false, color: INK })
  ],
  spacing: { before: 480, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: INK, space: 8 } }
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: F_DISPLAY, size: 30, bold: false, color: INK })],
  spacing: { before: 320, after: 140 }
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, font: F_DISPLAY, size: 24, bold: true, color: INK_2 })],
  spacing: { before: 240, after: 100 }
});

// Editorial sub-label with rule
const subLabel = (text) => new Paragraph({
  children: [
    new TextRun({ text: "— ", font: F_MONO, size: 18, color: OLIVE }),
    new TextRun({ text, font: F_MONO, size: 18, color: OLIVE, bold: true, characterSpacing: 30 })
  ],
  spacing: { before: 160, after: 80 }
});

// Bullets
const blt = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [run(text, { color: INK_2 })],
  spacing: { after: 80, line: 300 }
});

// Pull quote — italic Georgia, indented, with vertical rule
const pullQuote = (text, attribution) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: { ...noBorders, left: bdr(OLIVE, 24) },
  rows: [new TableRow({ children: [new TableCell({
    borders: { ...noBorders, left: bdr(OLIVE, 24) },
    width: { size: 9360, type: WidthType.DXA },
    margins: cm({ top: 200, bottom: 200, left: 360, right: 200 }),
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: F_DISPLAY, size: 28, italics: true, color: INK })],
        spacing: { after: 140, line: 360 }
      }),
      attribution ? new Paragraph({
        children: [new TextRun({ text: attribution, font: F_MONO, size: 17, color: OLIVE, characterSpacing: 30 })],
        spacing: { after: 0 }
      }) : new Paragraph({ children: [] })
    ]
  })]})]
});

// Callout box — title bar + body
const callout = (label, title, bodyText, theme = 'olive') => {
  const themes = {
    olive:  { bg: OLIVE_BG,  bar: OLIVE,  lcol: OLIVE },
    signal: { bg: SIGNAL_BG, bar: SIGNAL, lcol: SIGNAL },
    alert:  { bg: ALERT_BG,  bar: ALERT,  lcol: ALERT },
    steel:  { bg: "DCE3EC",  bar: STEEL,  lcol: STEEL }
  };
  const t = themes[theme];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: bdr(t.bar, 18), bottom: bdr(t.bar, 6), left: bdr(t.bar, 6), right: bdr(t.bar, 6) },
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: t.bg, type: ShadingType.CLEAR },
      margins: cm({ top: 180, bottom: 180, left: 220, right: 220 }),
      children: [
        new Paragraph({
          children: [new TextRun({ text: label, font: F_MONO, size: 17, color: t.lcol, bold: true, characterSpacing: 40 })],
          spacing: { after: 80 }
        }),
        title ? new Paragraph({
          children: [new TextRun({ text: title, font: F_DISPLAY, size: 24, bold: false, color: INK })],
          spacing: { after: 100 }
        }) : null,
        new Paragraph({
          children: [run(bodyText, { color: INK_2 })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 0, line: 320 }
        })
      ].filter(Boolean)
    })]})]
  });
};

// Table cells
const hCell = (text, w, bg = INK, color = PAPER) => new TableCell({
  borders: cellBorder(INK),
  width: { size: w, type: WidthType.DXA },
  shading: { fill: bg, type: ShadingType.CLEAR },
  margins: cm({ top: 120, bottom: 120 }),
  children: [p(
    [new TextRun({ text, font: F_MONO, size: 18, bold: true, color, characterSpacing: 30 })],
    { spacing: { after: 0 } }
  )]
});

const tCell = (text, w, opts = {}) => {
  const { shade = WHITE, color = INK_2, bold: b = false, align = AlignmentType.LEFT, font = F_BODY, size = 20 } = opts;
  return new TableCell({
    borders: cellBorder(RULE),
    width: { size: w, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: cm(),
    children: [p(
      [new TextRun({ text, font, size, bold: b, color })],
      { alignment: align, spacing: { after: 0 } }
    )]
  });
};

const monoCell = (text, w, opts = {}) =>
  tCell(text, w, { ...opts, font: F_MONO, size: 18 });

// ASCII-art schematic block (for visual interest where SVG can't easily go)
const asciiBlock = (lines) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({ children: [new TableCell({
    borders: cellBorder(INK_2),
    width: { size: 9360, type: WidthType.DXA },
    shading: { fill: PAPER_2, type: ShadingType.CLEAR },
    margins: cm({ top: 180, bottom: 180, left: 260, right: 260 }),
    children: lines.map(line => new Paragraph({
      children: [new TextRun({ text: line, font: F_MONO, size: 18, color: INK_2 })],
      spacing: { after: 40 }
    }))
  })]})]
});

// ─── COVER ────────────────────────────────────────────────────────────────────
const cover = [
  sp(400),

  // Top meta strip
  new Paragraph({
    children: [
      new TextRun({ text: "VITARKA  ", font: F_MONO, size: 18, color: OLIVE, bold: true, characterSpacing: 80 }),
      new TextRun({ text: "/  ", font: F_MONO, size: 18, color: RULE_2 }),
      new TextRun({ text: "DEFENCE  ", font: F_MONO, size: 18, color: MUTED, characterSpacing: 60 }),
      new TextRun({ text: "/  ", font: F_MONO, size: 18, color: RULE_2 }),
      new TextRun({ text: "POC-001  ", font: F_MONO, size: 18, color: MUTED, characterSpacing: 60 }),
      new TextRun({ text: "/  ", font: F_MONO, size: 18, color: RULE_2 }),
      new TextRun({ text: "REV 2.0", font: F_MONO, size: 18, color: MUTED, characterSpacing: 60 })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 }
  }),

  // Display title
  new Paragraph({
    children: [new TextRun({ text: "ARC-Node", font: F_DISPLAY, size: 120, bold: false, color: INK })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 }
  }),
  new Paragraph({
    children: [new TextRun({ text: "v2", font: F_DISPLAY, size: 96, italics: true, color: OLIVE })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 }
  }),

  // Subtitle
  new Paragraph({
    children: [new TextRun({
      text: "A distributed passive edge-AI sensor network for counter-UAS alerting",
      font: F_DISPLAY, size: 26, italics: true, color: INK_2
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 }
  }),

  // Decorative rule
  new Paragraph({
    children: [new TextRun({ text: "— § —", font: F_MONO, size: 22, color: OLIVE, characterSpacing: 200 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 }
  }),

  // Kicker
  new Paragraph({
    children: [new TextRun({
      text: "Complete Technical Blueprint  ·  PoC v1 Build-Ready",
      font: F_MONO, size: 18, color: MUTED, characterSpacing: 60
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 }
  }),

  // Status row
  new Paragraph({
    children: [
      new TextRun({ text: "● ", font: F_BODY, size: 22, color: PHOSPHOR, bold: true }),
      new TextRun({ text: "SYSTEM DEFINED · BUILD-READY", font: F_MONO, size: 17, color: PHOSPHOR, bold: true, characterSpacing: 60 }),
      new TextRun({ text: "        ", font: F_BODY, size: 22 }),
      new TextRun({ text: "▲ ", font: F_BODY, size: 18, color: SIGNAL }),
      new TextRun({ text: "v1 PHASE ACTIVE", font: F_MONO, size: 17, color: SIGNAL, bold: true, characterSpacing: 60 })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 }
  }),

  // Metadata table
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      ...[
        ["Prepared by",      "Vitarka Labs"],
        ["Product",          "ARC-Node v2"],
        ["Document type",    "Technical Blueprint / PoC Specification"],
        ["Version",          "2.0 — Frozen Architecture"],
        ["Status",           "Build-Ready · v1 Phase Active"],
        ["Target audience",  "iDEX DISC · DRDO CAIR · Internal Engineering"],
        ["Date",             new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
      ].map(([l, v], i) => new TableRow({ children: [
        new TableCell({
          borders: { top: bdr(RULE), bottom: bdr(RULE), left: noBdr, right: noBdr },
          width: { size: 2800, type: WidthType.DXA },
          margins: cm({ top: 120, bottom: 120, left: 0 }),
          children: [p([new TextRun({ text: l.toUpperCase(), font: F_MONO, size: 17, color: OLIVE, characterSpacing: 40 })], { spacing: { after: 0 } })]
        }),
        new TableCell({
          borders: { top: bdr(RULE), bottom: bdr(RULE), left: noBdr, right: noBdr },
          width: { size: 6560, type: WidthType.DXA },
          margins: cm({ top: 120, bottom: 120, left: 0 }),
          children: [p([new TextRun({ text: v, font: F_DISPLAY, size: 22, color: INK })], { spacing: { after: 0 } })]
        })
      ]}))
    ]
  }),

  sp(280),

  new Paragraph({
    children: [new TextRun({
      text: "Keywords: Counter-UAS · TinyML · GCC-PHAT · AES-CTR · LoRa · ESP32-S3 · INMP441 · AD8317 · Edge-AI · AoA",
      font: F_BODY, size: 19, italics: true, color: MUTED
    })],
    alignment: AlignmentType.CENTER
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ─── EXECUTIVE SUMMARY ────────────────────────────────────────────────────────
const executiveSummary = [
  h1("01", "Executive Summary"),
  edLabel("Synopsis"),

  bodyLead("ARC-Node v2 is a phased, procurement-grade sensor network for passive counter-UAV alerting. It uses commodity ESP32-S3 microcontrollers with circular MEMS microphone arrays, passive RF energy detectors, and LoRa encrypted telemetry to identify and report drone threats from a perimeter deployment at a hardware cost of approximately ₹2,850 per node."),

  body("The architecture is organised into four hierarchical layers — Node, Compute, Network, Dashboard — and built on a staged deployment roadmap (v1 → v1.5 → v2 → v3) that avoids the engineering trap of building the full system at once. Each version is independently testable and producible."),

  body("Three pragmatic design corrections distinguish this blueprint from less-disciplined academic proposals: sector-based bearing estimation (not GPS-grade localisation), coarse RF energy corroboration (not RF protocol decoding), and AES-CTR + HMAC-SHA256 security (exploiting ESP32-S3 hardware accelerators correctly, without overclaiming GCM support)."),

  sp(160),
  pullQuote(
    "A single ARC-Node costs ₹2,850 in components. A commercial radar-based C-UAS deployment costs ₹40L–4Cr per site. ARC-Node targets a 1,000× cost reduction for perimeter and border surveillance — while delivering two independent sensing modalities, on-device inference, encrypted telemetry, and a clear upgrade path to multi-node triangulation.",
    "— Strategic value proposition"
  ),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
const architecture = [
  h1("02", "System Architecture"),
  edLabel("Four-Layer Hierarchical Design"),

  body("The system is organised as four distinct layers. Each layer has well-defined inputs, outputs, and upgrade points. This separation enables modular testing — Layer A can be validated before Layer B is built."),

  sp(120),

  // ASCII schematic — feels like engineering doc
  asciiBlock([
    "  ┌─────────────────────────────────────────────────────────────────────┐",
    "  │  LAYER A · NODE          4× INMP441  ·  ESP32-S3  ·  AD8317        │",
    "  │                          SX1276 LoRa                                │",
    "  ├─────────────────────────────────────────────────────────────────────┤",
    "  │  LAYER B · COMPUTE       T0: Gatekeeper  →  T1: CNN  →  T2: AoA    │",
    "  │                          MFCC + 1D-CNN  ·  GCC-PHAT                 │",
    "  ├─────────────────────────────────────────────────────────────────────┤",
    "  │  LAYER C · NETWORK       AES-128-CTR · HMAC-SHA256 · Seq window    │",
    "  │                          18-byte binary payload over LoRa           │",
    "  ├─────────────────────────────────────────────────────────────────────┤",
    "  │  LAYER D · DASHBOARD     LoRa GW → MQTT → Next.js + SOLR           │",
    "  │                          Confidence heatmap · health monitor        │",
    "  └─────────────────────────────────────────────────────────────────────┘"
  ]),

  sp(200),

  h3("Layer A — Node Layer (Hardware Front-End)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 3480, 3480],
    rows: [
      new TableRow({ children: [hCell("Component", 2400), hCell("Role", 3480), hCell("Notes", 3480)] }),
      ...[
        ["4 × INMP441 MEMS Mics", "Circular acoustic array · I²S · 48 kHz / 24-bit", "Precise geometry mount required for GCC-PHAT phase math"],
        ["ESP32-S3 (Dual LX7)",   "Main compute · I²S DMA · Edge-AI · AES+HMAC crypto", "Hardware AES (CTR), HMAC-SHA256, ULP co-processor"],
        ["AD8317 RF Log Detector","Passive 1 MHz – 10 GHz wideband energy sensing",    "Corroboration gate only — not protocol identification"],
        ["SX1276 LoRa Module",    "Encrypted binary telemetry · SPI · CRC",             "SF7–SF10 configurable, duty-cycle managed"],
      ].map(([a, b, c], i) => new TableRow({ children: [
        monoCell(a, 2400, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: INK, bold: true }),
        tCell(b, 3480, { shade: i % 2 === 0 ? PAPER_WARM : WHITE }),
        tCell(c, 3480, { shade: i % 2 === 0 ? PAPER_WARM : WHITE }),
      ]}))
    ]
  }),
  sp(180),

  h3("Layer B — Compute Layer (Hierarchical Edge-AI Stack)"),
  body("The compute layer uses three sequential tiers. Each tier only runs when the previous tier triggers, dramatically reducing average power consumption."),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1300, 2300, 3000, 2760],
    rows: [
      new TableRow({ children: [hCell("Tier", 1300), hCell("Name", 2300), hCell("Function", 3000), hCell("Trigger Condition", 2760)] }),
      ...[
        ["T0", "Gatekeeper",     "Spectral baseline (SSTB). Low-cost anomaly detection. Always-on (ULP co-processor).", "Always active"],
        ["T1", "CNN Classifier", "MFCC features + 1D-CNN. Distinguishes drone harmonics from biological noise.",        "On Tier 0 trigger"],
        ["T2", "AoA Bearing",    "4-mic GCC-PHAT cross-correlation. Angle-of-Arrival sector (± 10° resolution).",       "On Tier 1 confidence > threshold"],
      ].map(([a, b, c, d], i) => new TableRow({ children: [
        monoCell(a, 1300, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: OLIVE, bold: true }),
        tCell(b, 2300, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, bold: true, color: INK }),
        tCell(c, 3000, { shade: i % 2 === 0 ? PAPER_WARM : WHITE }),
        tCell(d, 2760, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: OLIVE_2 }),
      ]}))
    ]
  }),
  sp(180),

  h3("Layer C — Network Layer (Secure Binary LoRa Protocol)"),
  body("When the Compute Layer confirms a threat with sufficient confidence, the node constructs a fixed-length binary payload and transmits it via LoRa."),

  callout(
    "PAYLOAD STRUCTURE — 18 BYTES",
    null,
    "struct ArcPayload { uint8_t node_id; uint8_t threat_class; uint8_t confidence; int16_t azimuth_deg; uint32_t timestamp_unix; uint16_t sequence_id; uint8_t hmac_tag[8]; }",
    'steel'
  ),
  sp(140),

  body("Security: AES-128-CTR encryption (hardware-accelerated on ESP32-S3) applied to the struct, followed by HMAC-SHA256 (hardware-accelerated) over the ciphertext — Encrypt-then-MAC. A sliding sequence window at the gateway rejects replay attacks. This correctly uses the ESP32-S3 hardware AES accelerator (CTR mode supported) without overclaiming GCM mode."),

  h3("Layer D — Dashboard Layer (Command & Control)"),
  body("The LoRa gateway forwards decrypted packets via MQTT to a Next.js/React frontend backed by SOLR for high-speed event indexing. Dashboard features: live event timeline, per-node confidence heatmap, threat azimuth indicator, node health monitor, and export to PDF/CSV."),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── PRAGMATIC CORRECTIONS ────────────────────────────────────────────────────
const pragmaticBuilder = (num, title, notText, isText, why) => [
  h2(`${num}.  ${title}`),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        hCell("✗  Not this claim", 4680, ALERT, WHITE),
        hCell("✓  This claim", 4680, OLIVE, WHITE),
      ]}),
      new TableRow({ children: [
        tCell(notText, 4680, { shade: ALERT_BG, color: "5C1818", size: 22 }),
        tCell(isText, 4680, { shade: OLIVE_BG, color: INK, size: 22, bold: true }),
      ]}),
    ]
  }),
  sp(120),
  body(why),
  sp(100)
];

const pragmatic = [
  h1("03", "Engineering Precision"),
  edLabel("Three Pragmatic Corrections"),

  body("These corrections are not limitations — they are what make this blueprint defensible in front of a DRDO jury or an iDEX reviewer. Overselling leads to failed field trials. Precise claims survive scrutiny."),
  sp(180),

  ...pragmaticBuilder(
    "Correction 1", "Localisation Scope",
    "Precise GPS-grade localisation of drone position",
    "Bearing / Sector Estimation (AoA) — direction reported as azimuth ± 10° sector",
    "Technical basis: GCC-PHAT (Generalised Cross-Correlation with Phase Transform) on a 4-element circular microphone array yields direction-of-arrival, not absolute position. A 4-mic array with ~10 cm spacing at 150 m target range provides bearing resolution of approximately ± 5–15° — suitable for sector-level alerting. Full TDoA triangulation (absolute XY localisation) is a v3 roadmap item requiring multi-node deployment."
  ),

  ...pragmaticBuilder(
    "Correction 2", "RF Sensing Scope",
    "Drone RF protocol identification (DJI OcuSync, FlySky, FrSky decode)",
    "Coarse RF energy corroboration — 2.4 / 5.8 GHz burst activity gate",
    "Technical basis: AD8317 is a wideband logarithmic detector covering 1 MHz to 10 GHz with a 60 dB dynamic range. It outputs a voltage proportional to input power — it does not demodulate or decode protocols. The AD8317 serves as a cross-modal persistence gate: if the acoustic CNN fires AND the AD8317 reads elevated RF energy in the 2.4 / 5.8 GHz band, the fused confidence score rises. This reduces false positive rate without claiming RF fingerprinting."
  ),

  ...pragmaticBuilder(
    "Correction 3", "Security Architecture",
    "AES-GCM (hardware-native authenticated encryption)",
    "AES-CTR + HMAC-SHA256 (Encrypt-then-MAC) — equal security, correct implementation",
    "Technical basis: The ESP32-S3 Technical Reference Manual (v1.4) documents hardware AES acceleration for the following modes: ECB, CBC, OFB, CTR, CFB8, CFB128. AES-GCM is not listed in the hardware engine. AES-CTR is hardware-accelerated and, combined with HMAC-SHA256 (also hardware-accelerated), achieves IND-CPA + INT-CTXT security equivalent to GCM in the Encrypt-then-MAC construction. The sliding sequence window provides replay attack resistance equivalent to GCM's authentication nonce."
  ),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── STAGED ROADMAP ───────────────────────────────────────────────────────────
const roadmap = [
  h1("04", "Staged PoC Roadmap"),
  edLabel("Build sequence · v1 → v1.5 → v2 → v3"),

  body("The staged build strategy is the single most important risk-control decision in this project. Each version is independently shippable and testable. Do not attempt to build v2 before v1 is validated."),
  sp(140),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1100, 1800, 3280, 3180],
    rows: [
      new TableRow({ children: [hCell("Version", 1100), hCell("Title", 1800), hCell("Build Scope", 3280), hCell("Success Gate", 3180)] }),
      ...[
        ["v1  ●", "Foundation",    "ESP32-S3 data logger → Tier 0 gatekeeper → CNN classifier (TFLite Micro) → AES-CTR encrypted binary LoRa alert packet", "Drone audio classified > 85% accuracy · alert packet received and decrypted at gateway"],
        ["v1.5", "Direction",      "4-mic circular mount fabrication → I²S DMA 4-channel capture → GCC-PHAT phase math → Bearing sector in LoRa payload", "Bearing estimate within ± 15° for a moving sound source at 20–50 m · logged on dashboard"],
        ["v2",   "Corroboration",  "AD8317 integration → RF energy sampling on ADC → Cross-modal fusion gate in firmware → Fused confidence score",       "False positive rate drops below 5% in 1-hour ambient noise field trial"],
        ["v3",   "Multi-Node",     "2–3 node mesh deployment → TDoA solver at gateway → Triangulated position estimate → Dashboard map overlay",          "Drone XY position estimated within 20 m of GPS ground truth at ≤ 100 m range"],
      ].map(([a, b, c, d], i) => {
        const isActive = i === 0;
        const shade = isActive ? OLIVE_BG : (i % 2 === 0 ? PAPER_WARM : WHITE);
        return new TableRow({ children: [
          monoCell(a, 1100, { shade, color: isActive ? OLIVE : INK, bold: true }),
          tCell(b, 1800, { shade, bold: true, color: INK }),
          tCell(c, 3280, { shade }),
          tCell(d, 3180, { shade, color: OLIVE_2 }),
        ]});
      })
    ]
  }),
  sp(240),

  h2("First Build — ESP32-S3 Data Logger Harness"),
  body("The v1 build begins with the data logger — not the classifier. This is critical: synthetic augmentation only works if your noise floor is real. You need actual Indian ambient audio (Pune traffic, auto engines, construction, monsoon, cicadas) before training a model that works in the field."),

  blt("Hardware: ESP32-S3 dev board + 1 × INMP441 (I²S) + SPI SD card module"),
  blt("Firmware: I²S DMA continuous capture → WAV file write to SD card (16 kHz, 16-bit, 10-minute chunks)"),
  blt("Deployment: Roof or field deployment for 24–48 hours minimum"),
  blt("Output: Labelled ambient corpus → feed into physics-based synthetic augmentation pipeline"),

  sp(120),

  callout(
    "FORMULA — SYNTHETIC AUGMENTATION",
    "Physics-based distance attenuation",
    "For each training sample: attenuate clean drone audio using Lp = Lw − 20·log₁₀(r) − α·r  (where r = simulated distance in metres, α = air absorption coefficient for the frequency band), then mix with a randomly sampled ambient clip at the resulting SNR. Apply random pitch shift (± 2%), speed perturbation (± 5%), and channel reverb. This produces training samples that generalise to real deployment distances.",
    'signal'
  ),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── BOM ──────────────────────────────────────────────────────────────────────
const bomSection = [
  h1("05", "Bill of Materials"),
  edLabel("PoC v1 Node — Low-SWaP Design"),

  body("Low-SWaP (Size, Weight, and Power) design. All components domestically sourceable in India (RoboCraze, Robu.in, Electronicscomp, Amazon.in)."),
  sp(140),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 1640, 1640],
    rows: [
      new TableRow({ children: [hCell("Component", 2800), hCell("Function", 3280), hCell("Cost (₹)", 1640, OLIVE), hCell("Interface", 1640)] }),
      ...[
        ["ESP32-S3-WROOM-1",        "Edge-AI compute · I²S DMA · HW crypto",        "400", "I²S + SPI + UART"],
        ["4 × INMP441 MEMS",        "Omnidirectional acoustic array · 48 kHz",       "600", "I²S (× 4, DMA)"],
        ["SX1276 LoRa Module",      "Long-range encrypted binary telemetry",         "500", "SPI"],
        ["AD8317 Eval Board",       "Passive RF burst energy corroboration gate",    "800", "ADC (analog)"],
        ["18650 Li-ion + TP4056",   "Power management (PoC scale)",                  "300", "VBAT rail"],
        ["Custom 3D-Printed Housing","4-mic precision geometry mount (circular)",     "250", "Mechanical"],
      ].map(([a, b, c, d], i) => new TableRow({ children: [
        monoCell(a, 2800, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: INK, bold: true }),
        tCell(b, 3280, { shade: i % 2 === 0 ? PAPER_WARM : WHITE }),
        tCell(c, 1640, { shade: i % 2 === 0 ? OLIVE_BG : "EEF0E4", bold: true, color: OLIVE, align: AlignmentType.RIGHT, font: F_MONO, size: 19 }),
        tCell(d, 1640, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: STEEL }),
      ]})),

      // Total row
      new TableRow({ children: [
        new TableCell({
          columnSpan: 2,
          borders: cellBorder(INK),
          width: { size: 6080, type: WidthType.DXA },
          shading: { fill: INK, type: ShadingType.CLEAR },
          margins: cm({ top: 140, bottom: 140 }),
          children: [p([new TextRun({ text: "TOTAL PER NODE", font: F_MONO, size: 20, bold: true, color: PAPER, characterSpacing: 60 })], { spacing: { after: 0 } })]
        }),
        new TableCell({
          columnSpan: 2,
          borders: cellBorder(INK),
          width: { size: 3280, type: WidthType.DXA },
          shading: { fill: INK, type: ShadingType.CLEAR },
          margins: cm({ top: 140, bottom: 140 }),
          children: [p([new TextRun({ text: "~ ₹2,850", font: F_DISPLAY, size: 32, bold: false, italics: true, color: OLIVE_DIM })], { alignment: AlignmentType.RIGHT, spacing: { after: 0 } })]
        }),
      ]})
    ]
  }),

  sp(180),

  pullQuote(
    "Domestically sourceable, sub-₹3,000 per node, two independent sensing modalities, encrypted telemetry. This is a deployment-cost frontier, not a research curiosity.",
    "— Procurement rationale"
  ),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── METRICS ──────────────────────────────────────────────────────────────────
const metricsSection = [
  h1("06", "Validation Metrics"),
  edLabel("Research-Grade · Jury-Defensible"),

  body("These metrics are the deliverable standard for PoC v1 field trial sign-off. Each is precisely scoped to the v1 capability. Do not claim v3 metrics for v1 hardware."),
  sp(140),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1700, 1500, 2380, 3780],
    rows: [
      new TableRow({ children: [hCell("Metric", 1700), hCell("Target", 1500, OLIVE), hCell("Test Condition", 2380), hCell("Measurement Method", 3780)] }),
      ...[
        ["FPR (False Positive Rate)",   "< 5%",       "1-hour ambient field trial · no drone present", "Count false alerts over 60-min recording · divide by total decision windows"],
        ["Detection Recall",            "> 90%",      "50 drone fly-overs at 50–150 m range",          "Ground truth: drone in air · ARC-Node alert within 1.5 s counts as TP"],
        ["Bearing Accuracy (AoA)",      "± 10° sector","Moving source at 20 m, 50 m, 100 m",            "Compare ARC-Node reported azimuth to GPS bearing of sound source"],
        ["End-to-End Latency",          "< 1.5 s",    "Triggered audio playback at known timestamp",   "Δ: audio trigger timestamp → dashboard event display timestamp"],
        ["Average Power Draw",          "< 500 mW",   "Continuous · Tier 0 active · no trigger",       "Current probe on VBAT rail · average over 30 minutes"],
      ].map(([a, b, c, d], i) => new TableRow({ children: [
        tCell(a, 1700, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, bold: true, color: INK }),
        tCell(b, 1500, { shade: i % 2 === 0 ? OLIVE_BG : "EEF0E4", bold: true, color: OLIVE, align: AlignmentType.CENTER, font: F_DISPLAY, size: 26 }),
        tCell(c, 2380, { shade: i % 2 === 0 ? PAPER_WARM : WHITE }),
        tCell(d, 3780, { shade: i % 2 === 0 ? PAPER_WARM : WHITE, color: INK_2 }),
      ]}))
    ]
  }),

  new Paragraph({ children: [new PageBreak()] }),
];

// ─── PHASE CHECKLIST ──────────────────────────────────────────────────────────
const checklist = [
  h1("07", "Phase-Wise Implementation Checklist"),

  h2("Phase 1 — Synthetic Dataset Pipeline (Foundation)"),
  blt("Deploy ESP32-S3 + INMP441 data-logger to roof/field for 24 h minimum ambient capture"),
  blt("Label captured clips: traffic, auto engine, wind, birds, rain, construction, human voice"),
  blt("Write Python augmentation script: apply Lp = Lw − 20·log₁₀(r) − α·r distance attenuation"),
  blt("Overlay clean drone audio clips (DroneSound / Kaggle) at computed SNR"),
  blt("Apply augmentation: ± 2% pitch shift, ± 5% speed, random reverb, amplitude jitter"),
  blt("Target: 4,000 clips (2,000 drone, 2,000 ambient); 80/20 train-test split"),
  blt("Validate: confirm augmented clips sound plausible on headphones before training"),
  sp(120),

  h2("Phase 2 — One-Node CNN Classifier on ESP32-S3"),
  blt("Train 1D-CNN on MFCC features (40 coefficients, 1 s window, 10 ms hop)"),
  blt("Quantise to INT8 with TFLite post-training quantisation (model < 200 KB flash)"),
  blt("Flash TFLite Micro to ESP32-S3 · validate Tier 0 and Tier 1 logic with recorded audio"),
  blt("Measure: test accuracy (target > 91%), inference latency (< 120 ms), flash usage"),
  blt("Stress test: play 1-hour ambient loop · count false triggers"),
  sp(120),

  h2("Phase 3 — GCC-PHAT Bearing Estimation"),
  blt("Fabricate 4-mic circular mount with known inter-element spacing (target: 8–12 cm diameter)"),
  blt("Implement 4-channel I²S DMA capture on ESP32-S3"),
  blt("Implement GCC-PHAT cross-correlation for all mic pairs (6 pairs for 4 mics)"),
  blt("Derive AoA bearing estimate from phase difference · output azimuth sector in degrees"),
  blt("Validate with moving speaker at 20 m, 50 m, 100 m · compare to GPS bearing"),
  blt("Integrate bearing into LoRa payload Azimuth_Angle field"),
  sp(120),

  h2("Phase 4 — Encrypted LoRa Packet + Dashboard"),
  blt("Implement AES-128-CTR encryption using ESP32-S3 hardware AES (Espressif mbedTLS HAL)"),
  blt("Implement HMAC-SHA256 using ESP32-S3 hardware SHA accelerator"),
  blt("Implement sliding sequence window at gateway (reject seq_id replays within 60 s)"),
  blt("Route decrypted packets from LoRa gateway to MQTT broker (Mosquitto)"),
  blt("Build Next.js frontend: live event feed, azimuth display, node health, SOLR-backed timeline"),
  blt("Measure end-to-end latency: target < 1.5 s from acoustic trigger to dashboard event"),
  sp(120),

  h2("Phase 5 — RF Corroboration Fusion + Multi-Node"),
  blt("Integrate AD8317: read ADC voltage proportional to 2.4/5.8 GHz ambient energy level"),
  blt("Implement cross-modal gate: require both acoustic confidence > 0.75 AND RF energy spike"),
  blt("Measure false positive rate reduction vs acoustic-only: target FPR < 5%"),
  blt("Deploy 2–3 nodes with overlapping coverage zones · test simultaneous alert handling"),
  blt("Test network collision handling: randomised backoff for simultaneous TX"),
  blt("Begin TDOA solver prototype at gateway (required for v3)"),

  sp(280),
  pullQuote(
    "Each phase is independently shippable. Each phase has a measurable success gate. No phase begins until the prior one is signed off. This is the discipline that separates a deployable system from a research curiosity.",
    "— Engineering practice"
  ),
];

// ─── ASSEMBLY ─────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: "Vitarka Labs",
  title: "ARC-Node v2 — Technical Blueprint",
  description: "Distributed Passive Edge-AI Sensor Network for Counter-UAS Alerting",
  numbering: {
    config: [
      { reference: "bullets", levels: [{
        level: 0, format: LevelFormat.BULLET, text: "—",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: F_MONO, color: OLIVE } }
      }]},
    ]
  },
  styles: {
    default: {
      document: { run: { font: F_BODY, size: 22 } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 44, bold: false, font: F_DISPLAY, color: INK },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: false, font: F_DISPLAY, color: INK },
        paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: F_DISPLAY, color: INK_2 },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },          // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: "ARC-Node v2", font: F_DISPLAY, size: 18, italics: true, color: INK }),
            new TextRun({ text: "   ·   ", font: F_MONO, size: 16, color: RULE_2 }),
            new TextRun({ text: "VITARKA LABS", font: F_MONO, size: 16, color: OLIVE, bold: true, characterSpacing: 60 }),
            new TextRun({ text: "   ·   ", font: F_MONO, size: 16, color: RULE_2 }),
            new TextRun({ text: "TECHNICAL BLUEPRINT", font: F_MONO, size: 16, color: MUTED, characterSpacing: 60 }),
            new TextRun({ text: "   ·   ", font: F_MONO, size: 16, color: RULE_2 }),
            new TextRun({ text: "CONFIDENTIAL", font: F_MONO, size: 16, color: SIGNAL, bold: true, characterSpacing: 60 })
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: INK, space: 6 } },
          spacing: { after: 0 }
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: "Vitarka Labs", font: F_DISPLAY, size: 17, italics: true, color: MUTED }),
            new TextRun({ text: "  ·  Build-Ready Blueprint  ·  Not for public circulation  ·  Page ", font: F_MONO, size: 15, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: F_MONO, size: 15, color: OLIVE, bold: true })
          ],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 6 } },
          spacing: { before: 0 }
        })
      ]})
    },
    children: [
      ...cover,
      ...executiveSummary,
      ...architecture,
      ...pragmatic,
      ...roadmap,
      ...bomSection,
      ...metricsSection,
      ...checklist,
    ]
  }]
});

const outPath = process.argv[2] || '/mnt/user-data/outputs/ARC_Node_v2_Technical_Blueprint.docx';
fs.mkdirSync(path.dirname(outPath), { recursive: true });

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log(`✓ Generated: ${outPath}  (${(buf.length / 1024).toFixed(1)} KB)`);
}).catch(e => {
  console.error('DOCX generation failed:', e.message);
  console.error(e.stack);
  process.exit(1);
});
