import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Bot, Brain, Cpu, Mic, SatelliteDish, Search,
  TrendingUp, Workflow, Wrench, Zap,
} from 'lucide-react';
import { Crosshair } from '../lib/theme.jsx';
import { useContactModal } from '../components/Layout.jsx';

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

const expertise = [
  { num: '§ 01', icon: Brain, title: 'AI & Generative Systems', desc: 'Practical AI products, agentic workflows, and inference systems engineered for deployment — not demos.' },
  { num: '§ 02', icon: Workflow, title: 'AI Automation', desc: 'Automation pipelines that remove operational friction — internal tooling, agentic workflows, decision systems that actually run in production.' },
  { num: '§ 03', icon: Bot, title: 'Software Products', desc: 'Modern web platforms, internal tooling, and SaaS — built to ship, scale, and stay maintainable.' },
  { num: '§ 04', icon: Cpu, title: 'Embedded & Edge', desc: 'Firmware, on-device inference, and connected hardware. Real engineering at the silicon-to-cloud boundary.' },
  { num: '§ 05', icon: SatelliteDish, title: 'IoT & Sensing', desc: 'Multi-modal sensor fusion, telemetry pipelines, and decision systems grounded in physical signal.' },
  { num: '§ 06', icon: Mic, title: 'Applied Research POCs', desc: 'Named, falsifiable proofs of concept — from acoustic sensing to biological computing — with honest scope, not hype.' },
];

const workSteps = [
  { num: 'I.',   icon: Search,     title: 'Understand',  text: 'The problem first. The user, the constraint, the why. No solutioning until the question is clear.' },
  { num: 'II.',  icon: Zap,        title: 'Shape',       text: 'Concept becomes a technical thesis with named risks and a falsifiable plan.' },
  { num: 'III.', icon: Wrench,     title: 'Build',       text: 'A working prototype or validated slice — not a deck, not a mock, an actual measurable artefact.' },
  { num: 'IV.',  icon: TrendingUp, title: 'Refine',      text: 'Production hardening, field iteration, and the unglamorous work that separates demo from deployment.' },
];

const products = [
  {
    to: '/arc-node',
    tag: 'Edge Sensing · POC',
    status: 'Phase 1 · Active',
    title: 'ARC-Node',
    body: 'A low-power edge sensor node fusing acoustic and RF signal for perimeter and site monitoring — on-device inference, encrypted telemetry, honest performance targets.',
  },
  {
    to: '/organoid-intelligence',
    tag: 'Applied Neuro-Compute · POC',
    status: 'Phase 0 · Research',
    title: 'Organoid Intelligence',
    body: 'An early-stage applied research track into closed-loop electrophysiology with cultured neural organoids as a computing substrate — scoped honestly, one experiment at a time.',
  },
];

/* ─── HOME PAGE ─────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const openContact = useContactModal();
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="home" className="hero">
        <div className="hero-grid">

          <div>
            <div className="hero-tags">
              <span className="hero-tag">AI / GenAI</span>
              <span className="hero-tag">Automation</span>
              <span className="hero-tag">Software</span>
              <span className="hero-tag">Embedded</span>
              <span className="hero-tag">IoT · Sensing</span>
              <span className="hero-tag accent">2 Active POCs</span>
            </div>

            <div className="ed-label" style={{ marginBottom: 28 }}>Vitarka Labs / Innovation Practice · Est. 2025</div>

            <h1 className="display-1">
              A labs for <em>software,</em><br />
              AI automation &<br />
              applied <em>innovation.</em>
            </h1>

            <p className="body-lg" style={{ maxWidth: 540, marginTop: 28, marginBottom: 32 }}>
              Vitarka Labs is a technology and innovation practice — production AI products, automation platforms, embedded and connected hardware, and named proofs of concept, all built to one execution standard.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-ink" onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}>Explore the practice <ArrowRight size={14} /></button>
              <button className="btn btn-line" onClick={openContact}>Open to collaboration</button>
              <button className="btn btn-line" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>View products</button>
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
              alt="Applied research and signal engineering"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="hero-visual-grid" />
            <div className="hero-visual-overlay" />
            <div className="hero-crosshair"><Crosshair /></div>
            <div className="hero-visual-marks">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="hero-corner">N · 18.5204° / E · 73.8567°</span>
                <span className="hero-corner">R&D · LIVE</span>
              </div>
              <div />
            </div>
            <div className="hero-readout">
              <div className="hero-readout-line"><span>PRACTICE</span><span>SOFTWARE + SIGNAL + BIO</span></div>
              <div className="hero-readout-line"><span>STATE</span><span>ACTIVE R&D</span></div>
              <div className="hero-readout-line"><span>POCS</span><span>002 / IN PROGRESS</span></div>
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
              A labs built to communicate <em>breadth</em> without confusion.
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: 480 }}>
              Vitarka Labs is a technology and innovation practice working across software, AI automation, embedded systems, IoT, and applied research. Focus is on practical execution and useful outcomes — not slogans.
            </p>
            <p className="body-lg" style={{ marginTop: 16, maxWidth: 480 }}>
              The lab supports many kinds of ideas without becoming vague: from production SaaS and AI automation platforms to named research proofs of concept like <Link to="/arc-node" style={{ color: 'var(--olive)' }}>ARC-Node</Link> and <Link to="/organoid-intelligence" style={{ color: 'var(--olive)' }}>Organoid Intelligence</Link>.
            </p>
          </div>

          <div>
            <div className="quote-block">
              <div className="quote-text">
                We help ideas become products, systems, and opportunities — engineered with the same standard whether for commercial software, AI automation, or applied-research proofs of concept.
              </div>
              <div className="quote-attr">— Practice Brief, 2025</div>
            </div>

            <div style={{ marginTop: 28 }}>
              {[
                'Broad technology focus, unified brand',
                'Open to companies, founders, partners, and investors',
                'Built for practical value, not just concepts',
                'Software, AI automation, embedded, IoT, applied research — ready for each',
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
              </div>
            );
          })}
        </div>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── PRODUCTS / POCS ─────────────────────────────────────────────────── */}
      <section id="products" className="section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="ed-label" style={{ marginBottom: 18 }}>Products</div>
            <h2 className="display-2">
              Two proofs of concept, <em>one honest standard.</em>
            </h2>
          </div>
          <p className="body-lg" style={{ maxWidth: 360 }}>
            Each product gets its own page: full scope, architecture, roadmap, and where the claims stop.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
          {products.map(p => (
            <Link key={p.to} to={p.to} className="product-card">
              <div className="product-card-tag">
                <span>{p.tag}</span>
                <span style={{ color: 'var(--text-dim)' }}>{p.status}</span>
              </div>
              <div className="product-card-title">{p.title}</div>
              <div className="product-card-body">{p.body}</div>
              <div className="product-card-cta">Open {p.title} <ArrowUpRight size={13} /></div>
            </Link>
          ))}
        </div>
      </section>

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
                Vitarka Labs is open to software work, AI automation initiatives, embedded solutions, IoT concepts, applied research, and strategic collaborations across industry and research.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" style={{ background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--paper)' }} onClick={openContact}>
                  Start a conversation <ArrowRight size={14} />
                </button>
                <button className="btn" style={{ background: 'transparent', color: 'var(--paper)', border: '1px solid rgba(242,238,226,0.4)' }} onClick={openContact}>
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
              { label: 'POCs', value: 'ARC-Node & Organoid Intelligence · briefing available' },
            ].map(c => (
              <div key={c.label} className="contact-item">
                <div className="contact-item-label">{c.label}</div>
                <div>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
