import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Ring with one node per substrate, in the chip colours.
function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--ink)" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="var(--alu)" strokeWidth="2" />
      <circle cx="16" cy="7" r="3" fill="#E0A21A" />
      <circle cx="25" cy="16" r="3" fill="#4C8DF5" />
      <circle cx="16" cy="25" r="3" fill="#9B6BF2" />
      <circle cx="7" cy="16" r="3" fill="#22B07F" />
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
            <h2 className="h3" style={{ fontStretch: '118%', fontWeight: 750, fontSize: 'var(--t-xl)' }}>Talk to us</h2>
            <p className="small" style={{ marginTop: 4 }}>Hardware partners, research labs and early users. We reply within two working days.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {status === 'sent' ? (
          <div style={{ padding: '32px 0' }}>
            <p className="h3">Message sent.</p>
            <p className="body" style={{ marginTop: 8 }}>Thanks. We'll reply to the email address you gave.</p>
            <button className="btn btn-line" style={{ marginTop: 24 }} onClick={() => { setStatus('idle'); onClose(); }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="form">
            <div className="form-row">
              <label>Name<input required maxLength={120} autoComplete="name" value={form.name} onChange={set('name')} /></label>
              <label>Email<input required type="email" maxLength={200} autoComplete="email" value={form.email} onChange={set('email')} /></label>
            </div>
            <label>Organisation <span className="small">optional</span><input maxLength={160} autoComplete="organization" value={form.org} onChange={set('org')} /></label>
            <label>What are you working on?<textarea required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={set('message')} /></label>
            {/* Honeypot: hidden from people, filled in by bots */}
            <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
            {error && <p role="alert" style={{ color: 'var(--warn)', fontSize: 'var(--t-sm)' }}>{error}</p>}
            <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </dialog>
  );
}

const links = [
  { to: '/console', label: 'Console' },
  { to: '/platform', label: 'Platform' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const openContact = () => { setMenuOpen(false); setContactOpen(true); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="masthead">
        <nav className="wrap masthead-row" aria-label="Main">
          <Link to="/" className="brand" aria-label="Vitarka home">
            <Mark />
            <span>Vitarka</span>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'on' : ''}`}>{l.label}</NavLink>
            ))}
            <button className="btn" style={{ minHeight: 38 }} onClick={openContact}>Talk to us</button>
          </div>
          <button className="icon-btn nav-toggle" aria-expanded={menuOpen} aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="wrap nav-sheet">
            {links.map((l) => <NavLink key={l.to} to={l.to} className="nav-sheet-link">{l.label}</NavLink>)}
            <button className="btn" onClick={openContact}>Talk to us</button>
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
              Fabric is one runtime for NPUs, TPUs, quantum and organoid processors. Built in Pune, India.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/console">Console</Link>
            <Link to="/platform">Platform</Link>
            <a href="mailto:hello@vitarkalabs.com">hello@vitarkalabs.com</a>
          </div>
        </div>
        <div className="wrap small" style={{ paddingTop: 24, marginTop: 32, borderTop: '1px solid var(--line)' }}>
          © 2026 Vitarka Labs. The console runs a simulation; no real hardware is contacted.
        </div>
      </footer>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
