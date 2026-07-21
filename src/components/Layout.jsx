import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { API_BASE, GlobalStyles, VitarkaMark } from '../lib/theme.jsx';

/* ─── CONTACT MODAL CONTEXT ──────────────────────────────────────────────────
   Lets any page (Home or a product subpage) open the shared contact modal
   without re-implementing it. */

const ContactModalCtx = createContext(() => {});
export const useContactModal = () => useContext(ContactModalCtx);

/* ─── NAV LINKS ───────────────────────────────────────────────────────────── */

const sectionLinks = [
  { label: 'About',    hash: 'about' },
  { label: 'Practice',  hash: 'expertise' },
  { label: 'Method',    hash: 'work' },
  { label: 'Products',  hash: 'products' },
];

/** A nav item that scrolls to a section on the home page. Works from any
 *  route: if already home, does a native in-page hash jump; otherwise
 *  navigates home first and scrolls once mounted. */
function SectionLink({ hash, className, onNavigate, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <a href={`#${hash}`} className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }
  return (
    <button
      className={className}
      onClick={() => { onNavigate?.(); navigate('/', { state: { scrollTo: hash } }); }}
    >
      {children}
    </button>
  );
}

/* ─── NAV + FOOTER + MODAL LAYOUT ────────────────────────────────────────── */

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const openContact = useCallback(() => setContactOpen(true), []);

  return (
    <ContactModalCtx.Provider value={openContact}>
      <div className="vl-page">
        <GlobalStyles />

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="vl-nav">
          <div className="vl-nav-inner">
            <Link to="/" className="vl-logo">
              <div className="vl-logo-mark"><img src="/vitarka_labs_final_logo.svg" alt="Vitarka Labs" style={{ width: 120, height: 120, display: 'block' }} /></div>
              <div>
                <div className="vl-logo-name">Vitarka Labs</div>
                <div className="vl-logo-tag">Precision · Permanence</div>
              </div>
            </Link>
            <div className="nav-list">
              {sectionLinks.map(item => (
                <SectionLink key={item.hash} hash={item.hash} className="nav-link">
                  {item.label}
                </SectionLink>
              ))}
              <button className="btn btn-ink" style={{ marginLeft: 8 }} onClick={openContact}>
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

        {/* ── MOBILE NAV DRAWER ──────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="mobile-nav">
            {sectionLinks.map(item => (
              <SectionLink key={item.hash} hash={item.hash} className="nav-link" onNavigate={() => setMobileOpen(false)}>
                {item.label}
              </SectionLink>
            ))}
            <button className="btn btn-ink" style={{ marginTop: 12 }} onClick={() => { setMobileOpen(false); openContact(); }}>
              Partner with us <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
        <Outlet />

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
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
              LABS · AI AUTOMATION · SOFTWARE · EMBEDDED · IOT · POCS
            </div>
          </div>
        </footer>

        {/* ── CONTACT MODAL ──────────────────────────────────────────────── */}
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </div>
    </ContactModalCtx.Provider>
  );
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
                {[['software','Software / Web'], ['ai','AI / GenAI'], ['embedded','Embedded / Edge'], ['iot','IoT / Sensing'], ['arcnode','ARC-Node POC'], ['organoid','Organoid Intelligence POC'], ['other','Other']].map(([v, l]) => (
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
