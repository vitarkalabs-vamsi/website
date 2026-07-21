import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { ArchLayerRow } from '../lib/theme.jsx';
import { useContactModal } from '../components/Layout.jsx';

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

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
  { v: 'Phase 1', active: true,  title: 'Foundation',     items: ['Anomaly Gate (Tier 0)', 'CNN Classifier (Tier 1)', 'Encrypted Binary LoRa', 'ESP32-S3 Data Logger'] },
  { v: 'Phase 2', active: false, title: 'Direction',      items: ['4-Mic Circular Mount', 'GCC-PHAT Phase Math', 'Bearing ± 10° Estimation', 'Moving-source Validation'] },
  { v: 'Phase 3', active: false, title: 'Corroboration',  items: ['AD8317 RF Integration', 'Cross-modal Persistence Gate', 'Fused Confidence Score', 'FPR Reduction Trial'] },
  { v: 'Phase 4', active: false, title: 'Multi-Node',     items: ['2–3 Node Mesh', 'TDOA Triangulation', 'Dashboard Aggregation', 'Collision Handling'] },
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
  { component: 'ESP32-S3-WROOM-1',           function: 'Edge-AI compute · I²S DMA · HW crypto', cost: '₹ 400' },
  { component: '4 × INMP441',                function: 'Omnidirectional MEMS array (I²S)',      cost: '₹ 600' },
  { component: 'SX1276 LoRa',                function: 'Encrypted binary telemetry (SPI)',      cost: '₹ 500' },
  { component: 'AD8317 Eval Board',          function: 'Passive RF burst corroboration gate',   cost: '₹ 800' },
  { component: '18650 Li-ion + TP4056',      function: 'Power management (PoC scale)',          cost: '₹ 300' },
  { component: 'Custom 3D-Printed Housing',  function: '4-Mic precision geometry mount',        cost: '₹ 250' },
];

/* ─── PAGE ──────────────────────────────────────────────────────────────────── */

export default function ArcNodePage() {
  const openContact = useContactModal();

  return (
    <section className="arc-section">
      <div className="arc-inner">

        <Link to="/#products" className="arc-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, color: 'var(--phosphor)', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div className="status-pill" style={{ marginBottom: 24 }}>
          <span className="status-dot" /> Phase 1 · Foundation · Active
        </div>

        <h1 className="arc-h1">
          <em>ARC-Node.</em><br />
          Acoustic + RF edge sensing.
        </h1>

        <p className="arc-body" style={{ maxWidth: 680, marginTop: 28 }}>
          A compact, low-power sensor node for perimeter, site, and asset monitoring — acoustic and RF signal fused
          on-device, classified at the edge, and reported over encrypted telemetry. This page is the concise view;
          the downloadable DOCX carries the complete architecture, BOM, and validation plan.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginTop: 40 }}>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Core capability</div>
            <div className="arc-body-sm">Acoustic + RF sensing, edge inference, and secure telemetry in a low-power node.</div>
          </div>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Deployment</div>
            <div className="arc-body-sm">Designed for perimeter, site, and asset monitoring with a short pilot validation path.</div>
          </div>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Scope</div>
            <div className="arc-body-sm">This page shows the shortlist. The DOCX carries the complete design, BOM, and validation plan.</div>
          </div>
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ METRICS</span></div>

        <div className="metrics-grid">
          {arcMetrics.map(m => (
            <div className="metric-cell" key={m.name}>
              <div className="metric-name">{m.name}</div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ ARCHITECTURE</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Four layers, edge to dashboard.</div>
        <div className="schematic schematic-corner">
          <div className="schematic-tag">System Architecture</div>
          <div className="schematic-coord">ARC-NODE / V2</div>
          <div style={{ paddingTop: 44 }}>
            {archLayers.map((layer, idx) => (
              <ArchLayerRow key={layer.id} layer={layer} idx={idx} total={archLayers.length} />
            ))}
          </div>
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ ROADMAP</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Four phases, honestly sequenced.</div>
        <div className="roadmap-grid">
          {roadmap.map(r => (
            <div key={r.v} className={`roadmap-item ${r.active ? 'active' : ''}`}>
              <div className={`roadmap-version ${r.active ? '' : 'dim'}`}>{r.v}{r.active ? ' · ACTIVE' : ''}</div>
              <div className="roadmap-title">{r.title}</div>
              <ul className="roadmap-items">
                {r.items.map(it => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ PRECISION</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Where the claims stop.</div>
        <div className="precision-grid">
          {precisionClaims.map(c => (
            <div key={c.num} className="precision-card">
              <div className="precision-num">{c.num}</div>
              <div className="precision-claim">{c.claim}</div>
              <div className="precision-row">
                <div className="precision-label">NOT</div>
                <div className="precision-not">{c.not}</div>
              </div>
              <div className="precision-row">
                <div className="precision-label">IS</div>
                <div className="precision-is">{c.is}</div>
              </div>
              <div className="precision-why">{c.why}</div>
            </div>
          ))}
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ BOM</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Bill of materials, PoC scale.</div>
        <div className="bom-wrap">
          <table className="bom-table">
            <thead>
              <tr><th>Component</th><th>Function</th><th>Est. Cost</th></tr>
            </thead>
            <tbody>
              {bom.map(b => (
                <tr key={b.component}>
                  <td>{b.component}</td>
                  <td>{b.function}</td>
                  <td>{b.cost}</td>
                </tr>
              ))}
              <tr className="total">
                <td colSpan={2}>Estimated total (single-node PoC)</td>
                <td className="price">₹ 2,850</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{
          border: '1px solid var(--rule-d)',
          background: 'var(--carbon-2)',
          padding: '36px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
          marginTop: 56,
        }}>
          <div style={{ maxWidth: 620 }}>
            <div className="ed-label dark" style={{ marginBottom: 10 }}>Full technical content</div>
            <div className="arc-h2" style={{ marginBottom: 8 }}>Complete ARC-Node design in DOCX</div>
            <p className="arc-body-sm" style={{ margin: 0 }}>
              This page is deliberately concise. Download the document for the full system architecture, BOM, risk notes, and validation criteria — or start a conversation to talk through a pilot.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost-dark btn-lg" onClick={openContact}>
              Discuss a pilot
            </button>
            <a
              className="btn btn-phosphor btn-lg"
              href="/ARC_Node_v2_Technical_Blueprint.docx"
              download="ARC_Node_v2_Technical_Blueprint.docx"
            >
              <Download size={15} />
              Download ARC-Node DOCX
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
