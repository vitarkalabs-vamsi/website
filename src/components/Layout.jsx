import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// A sindoor core on a ring, with one node per compute family.
function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="10" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.2" fill="var(--sindoor)" />
      <circle cx="16" cy="6" r="2.6" fill="var(--haldi)" />
      <circle cx="26" cy="16" r="2.6" fill="var(--neel)" />
      <circle cx="16" cy="26" r="2.6" fill="var(--jamun)" />
      <circle cx="6" cy="16" r="2.6" fill="var(--mor)" />
    </svg>
  );
}

function ContactDialog({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '', website: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'fabric' }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', org: '', message: '', website: '' });
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.errors?.[0]?.msg || data.error || 'The message was not sent. Try again in a minute.');
      setStatus('idle');
    } catch {
      setError('No connection. Check your network and try again.');
      setStatus('idle');
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <dialog ref={ref} className="contact" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="contact-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
          <div>
            <h2 className="h2" style={{ fontSize: 'var(--t-xl)' }}>Become a design partner</h2>
            <p className="small" style={{ marginTop: 6 }}>Researchers, developers and compute providers. Tell us about a real workflow that slowed you down.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {status === 'sent' ? (
          <div style={{ padding: '32px 0' }}>
            <p className="h3">Message sent.</p>
            <p className="body" style={{ marginTop: 8 }}>Thanks. We'll reply to the email address you gave.</p>
            <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => { setStatus('idle'); onClose(); }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="form">
            <div className="form-row">
              <label>Name<input required maxLength={120} autoComplete="name" value={form.name} onChange={set('name')} /></label>
              <label>Email<input required type="email" maxLength={200} autoComplete="email" value={form.email} onChange={set('email')} /></label>
            </div>
            <label>Organisation <span className="small">optional</span><input maxLength={160} autoComplete="organization" value={form.org} onChange={set('org')} /></label>
            <label>Which workflow, on which systems?<textarea required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={set('message')} /></label>
            {/* Honeypot: hidden from people, filled in by bots */}
            <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
            {error && <p role="alert" style={{ color: 'var(--warn)', fontSize: 'var(--t-sm)' }}>{error}</p>}
            <button className="btn btn-ember" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </dialog>
  );
}

const links = [
  { to: '/console', label: 'Workbench' },
  { to: '/platform', label: 'How it works' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const openContact = () => { setMenuOpen(false); setContactOpen(true); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="backdrop" aria-hidden="true" />
      <header className={`masthead ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <nav className="wrap masthead-row" aria-label="Main">
          <Link to="/" className="brand" aria-label="Vitarka home">
            <Mark />
            <span>Vitarka Fabric</span>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'on' : ''}`}>{l.label}</NavLink>
            ))}
            <button className="btn" style={{ minHeight: 40 }} onClick={openContact}>Become a design partner</button>
          </div>
          <button className="icon-btn nav-toggle" aria-expanded={menuOpen} aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="wrap nav-sheet">
            {links.map((l) => <NavLink key={l.to} to={l.to} className="nav-sheet-link">{l.label}</NavLink>)}
            <button className="btn" onClick={openContact}>Become a design partner</button>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet context={{ openContact }} />
      </main>

      <footer className="footer">
        <div className="wrap footer-row">
          <div>
            <div className="brand" style={{ marginBottom: 12 }}>
              <Mark size={24} />
              <span>Vitarka Labs</span>
            </div>
            <p className="small" style={{ maxWidth: 34 + 'em' }}>
              An open research compute fabric for AI accelerators, quantum systems and neuroscience workflows. Built in Pune, India, for researchers everywhere.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/console">Workbench</Link>
            <Link to="/platform">How it works</Link>
            <a href="mailto:hello@vitarkalabs.com">hello@vitarkalabs.com</a>
          </div>
        </div>
        <div className="wrap small" style={{ paddingTop: 24, marginTop: 32, borderTop: '1px solid var(--line)' }}>
          © 2026 Vitarka Labs. Validation stage. The workbench on this site is a simulation; no provider, price or result shown is live.
        </div>
        <div className="wrap" aria-hidden="true"><div className="footer-word">वितर्क</div></div>
      </footer>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
