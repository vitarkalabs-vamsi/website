import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ArchLayerRow } from '../lib/theme.jsx';
import { useContactModal } from '../components/Layout.jsx';

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

const oiMetrics = [
  { name: 'SNR',      value: '> 3:1',   label: 'Extracellular spike SNR required for reliable sorting' },
  { name: 'VIABILITY',value: '21-day',  label: 'Target sustained culture viability under closed-loop protocol' },
  { name: 'LATENCY',  value: '< 50ms',  label: 'Stimulus-to-response closed-loop latency, electrode to actuator' },
  { name: 'ELECTRODES', value: '60/well', label: 'Active MEA recording sites per culture well' },
  { name: 'COHORT',   value: 'n = 6',   label: 'Minimum parallel wells for a statistically legible pilot' },
];

const oiArchLayers = [
  {
    id: 'A', name: 'Culture Layer',
    chips: [
      { label: 'iPSC-derived Organoid', type: 'phosphor', detail: '8–12 wk maturation' },
      { label: 'Certified Partner Lab', type: 'phosphor', detail: 'BSL-1/2, IBC-reviewed' },
      { label: 'Perfusion + Gas Control', type: '', detail: 'O₂ / CO₂ / temp' },
    ]
  },
  {
    id: 'B', name: 'Interface Layer',
    chips: [
      { label: '60-Channel MEA', type: 'phosphor', detail: 'Extracellular array' },
      { label: 'Incubator Headstage', type: '', detail: 'In-situ amplifier' },
      { label: 'Stimulation Driver', type: 'signal', detail: 'Biphasic current pulses' },
    ]
  },
  {
    id: 'C', name: 'Signal Layer',
    chips: [
      { label: 'Tier 0', type: 'phosphor', detail: 'Spike detection · always-on' },
      { label: 'Tier 1', type: 'phosphor', detail: 'Closed-loop stimulation · on trigger' },
      { label: 'Tier 2', type: 'signal', detail: 'Response classification · on task epoch' },
    ]
  },
  {
    id: 'D', name: 'Dashboard',
    chips: [
      { label: 'Open Ephys / Python', type: '', detail: 'Acquisition pipeline' },
      { label: 'Session Dashboard', type: 'phosphor', detail: 'Per-well response trace' },
      { label: 'Confidence Score', type: '', detail: 'Task-response classifier' },
      { label: 'Culture Health', type: '', detail: 'Viability · firing-rate drift' },
    ]
  },
];

const oiRoadmap = [
  { v: 'Phase 0', active: true,  title: 'Foundation',     items: ['Partner-lab selection', 'Ethics / biosafety review', 'Baseline culture protocol', 'Single-well spike recording'] },
  { v: 'Phase 1', active: false, title: 'Closed Loop',    items: ['Stimulation-driver integration', 'Loop latency validation', 'Spike-sort pipeline', 'Culture health telemetry'] },
  { v: 'Phase 2', active: false, title: 'Task Learning',  items: ['Simple associative paradigm', 'Response classification model', 'Session dashboard', 'Single-well pilot trial'] },
  { v: 'Phase 3', active: false, title: 'Replication',    items: ['n = 6 parallel wells', 'Statistical validation', 'Independent replication', 'Public write-up of findings'] },
];

const oiPrecisionClaims = [
  { num: '01', claim: 'Cognition Scope',
    not: 'Artificial general intelligence substrate',
    is: 'Closed-loop stimulus-response electrophysiology',
    why: 'Published organoid/wetware research (e.g. dish-based closed-loop paradigms) demonstrates measurable, trainable changes in spike response to stimulation — not reasoning, language, or general intelligence. This program reports response-classification accuracy on narrow tasks, nothing broader.' },
  { num: '02', claim: 'Sentience Claim',
    not: 'A sentient or conscious system',
    is: 'A closely monitored research subject, unproven either way',
    why: 'There is no scientific consensus that cortical organoids at this scale and maturity possess sentience. The program runs under institutional bioethics and biosafety review, follows published organoid-research ethics guidance, and makes no consciousness claims in either direction.' },
  { num: '03', claim: 'Facility Ownership',
    not: 'An in-house wet lab from day one',
    is: 'Partnership-based access to a certified cell-culture / MEA facility',
    why: 'Vitarka Labs is a software, embedded, and AI practice — not a biology lab. Phase 0–1 work runs through a certified academic or contract-research partner with proper cell-culture, biosafety, and ethics oversight, not an internal facility.' },
];

const oiBom = [
  { component: '60-Electrode MEA Plate',              function: 'Extracellular recording substrate, single well', cost: '₹ 45,000' },
  { component: 'iPSC-derived Cortical Organoid',      function: '8-week maturation protocol, partner-sourced',   cost: '₹ 60,000' },
  { component: 'Closed-loop DAQ + Stim Driver',       function: 'Recording + biphasic stimulation interface',     cost: '₹ 1,20,000' },
  { component: 'Incubator + Perfusion (per month)',   function: 'Environmental control, partner facility',        cost: '₹ 25,000' },
  { component: 'Bioinformatics Compute',              function: 'Spike sorting, response classifier',              cost: '₹ 15,000' },
  { component: 'Biosafety & Ethics Review',           function: 'IBC / institutional review overhead',             cost: '₹ 20,000' },
];

/* ─── PAGE ──────────────────────────────────────────────────────────────────── */

export default function OrganoidIntelligencePage() {
  const openContact = useContactModal();

  return (
    <section className="arc-section">
      <div className="arc-inner">

        <Link to="/#products" className="arc-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, color: 'var(--phosphor)', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div className="status-pill" style={{ marginBottom: 24 }}>
          <span className="status-dot" /> Phase 0 · Research Partnership · Exploratory
        </div>

        <h1 className="arc-h1">
          <em>Organoid Intelligence.</em><br />
          Biological signal as a substrate.
        </h1>

        <p className="arc-body" style={{ maxWidth: 680, marginTop: 28 }}>
          An early-stage applied research track investigating whether cultured neural organoids on a multi-electrode
          array can be trained, via closed-loop electrical stimulation, to produce measurable, repeatable responses
          to a simple task. This is a proof of concept in the strictest sense — one experiment, honestly scoped, run
          through a certified research partner rather than claimed as a finished product.
        </p>

        <div style={{
          border: '1px solid rgba(222,160,70,0.3)', background: 'rgba(222,160,70,0.06)',
          padding: '20px 24px', marginTop: 28, maxWidth: 680,
        }}>
          <div className="arc-tag arc-tag-signal" style={{ marginBottom: 10 }}>Research &amp; Ethics Note</div>
          <div className="arc-body-sm">
            This track runs under institutional biosafety and ethics review at a certified partner facility. It makes
            no claims of sentience, consciousness, or general intelligence — see the Precision section below for
            exactly where the scope stops.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginTop: 40 }}>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Core capability</div>
            <div className="arc-body-sm">Closed-loop electrophysiology: stimulate, record, classify — on a cultured neural organoid, via MEA.</div>
          </div>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Partnership model</div>
            <div className="arc-body-sm">Executed through a certified cell-culture / MEA facility, not an in-house wet lab. Vitarka Labs leads the signal, software, and protocol design.</div>
          </div>
          <div className="arc-card">
            <div className="arc-h2" style={{ fontSize: 18, marginBottom: 10 }}>Scope</div>
            <div className="arc-body-sm">Phase 0–1 only: baseline recording and closed-loop validation. Task-learning claims wait for Phase 2 data.</div>
          </div>
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ TARGETS</span></div>

        <div className="metrics-grid">
          {oiMetrics.map(m => (
            <div className="metric-cell" key={m.name}>
              <div className="metric-name">{m.name}</div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ ARCHITECTURE</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Four layers, culture to dashboard.</div>
        <div className="schematic schematic-corner">
          <div className="schematic-tag">System Architecture</div>
          <div className="schematic-coord">ORGANOID-INTELLIGENCE / PHASE 0</div>
          <div style={{ paddingTop: 44 }}>
            {oiArchLayers.map((layer, idx) => (
              <ArchLayerRow key={layer.id} layer={layer} idx={idx} total={oiArchLayers.length} />
            ))}
          </div>
        </div>

        <div className="arc-divider"><span className="arc-divider-glyph">§ ROADMAP</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Four phases, honestly sequenced.</div>
        <div className="roadmap-grid">
          {oiRoadmap.map(r => (
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
          {oiPrecisionClaims.map(c => (
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

        <div className="arc-divider"><span className="arc-divider-glyph">§ BUDGET</span></div>

        <div className="arc-h2" style={{ marginBottom: 20 }}>Estimated cost, single-well pilot.</div>
        <div className="bom-wrap">
          <table className="bom-table">
            <thead>
              <tr><th>Item</th><th>Function</th><th>Est. Cost</th></tr>
            </thead>
            <tbody>
              {oiBom.map(b => (
                <tr key={b.component}>
                  <td>{b.component}</td>
                  <td>{b.function}</td>
                  <td>{b.cost}</td>
                </tr>
              ))}
              <tr className="total">
                <td colSpan={2}>Estimated total (single-well pilot, Phase 0–1)</td>
                <td className="price">₹ 2,85,000</td>
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
            <div className="ed-label dark" style={{ marginBottom: 10 }}>Full research brief</div>
            <div className="arc-h2" style={{ marginBottom: 8 }}>This is a research conversation, not a sales pitch.</div>
            <p className="arc-body-sm" style={{ margin: 0 }}>
              If you're a lab, university, or research partner interested in the protocol, ethics framework, or
              collaborating on Phase 0, get in touch — we'll share the full research brief directly.
            </p>
          </div>
          <button className="btn btn-phosphor btn-lg" onClick={openContact}>
            Request research brief
          </button>
        </div>

      </div>
    </section>
  );
}
