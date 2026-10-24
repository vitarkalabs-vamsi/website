import { Hono } from 'hono';

const app = new Hono();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 8 * 1024;

// Kept in sync with public/_headers, which covers static assets served without the Worker.
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

app.use('*', async (c, next) => {
  await next();
  // Asset responses can be immutable; copy before adding headers.
  const res = new Response(c.res.body, c.res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  if (c.req.path.startsWith('/api/')) res.headers.set('Cache-Control', 'no-store');
  c.res = res;
});

app.get('/health', (c) => c.json({ ok: true }));

const hostOf = (u) => {
  try { return new URL(u).host; } catch { return null; }
};

const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max + 1) : '');

app.post('/api/contact', async (c) => {
  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = c.req.header('Origin');
  if (origin && hostOf(origin) !== new URL(c.req.url).host) {
    return c.json({ error: 'Cross-origin requests are not allowed.' }, 403);
  }
  if (!(c.req.header('Content-Type') || '').includes('application/json')) {
    return c.json({ error: 'Send the form as JSON.' }, 415);
  }
  if (Number(c.req.header('Content-Length') || 0) > MAX_BODY_BYTES) {
    return c.json({ error: 'Message is too large.' }, 413);
  }

  if (c.env.CONTACT_LIMITER) {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const { success } = await c.env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) return c.json({ error: 'Too many messages. Wait a minute and try again.' }, 429);
  }

  let body;
  try {
    const raw = await c.req.text();
    if (raw.length > MAX_BODY_BYTES) return c.json({ error: 'Message is too large.' }, 413);
    body = JSON.parse(raw);
  } catch {
    return c.json({ error: 'The form data could not be read.' }, 400);
  }

  // Honeypot field is invisible to people; anything in it is a bot. Pretend success.
  if (typeof body?.website === 'string' && body.website.trim()) {
    return c.json({ ok: true });
  }

  const name = clean(body?.name, 120);
  const email = clean(body?.email, 200);
  const org = clean(body?.org, 160);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  const errors = [];
  if (!name) errors.push({ msg: 'Enter your name.' });
  else if (name.length > 120) errors.push({ msg: 'Name must be under 120 characters.' });
  if (!EMAIL_RE.test(email) || email.length > 200) errors.push({ msg: 'Enter a valid email address.' });
  if (org.length > 160) errors.push({ msg: 'Organisation must be under 160 characters.' });
  if (message.length < 10) errors.push({ msg: 'Message must be at least 10 characters.' });
  else if (message.length > 2000) errors.push({ msg: 'Message must be under 2,000 characters.' });
  if (errors.length) return c.json({ errors }, 422);

  // Log metadata only, never names, addresses or message text.
  console.log(`[contact] received · ${message.length} chars`);

  if (c.env.RESEND_API_KEY && c.env.CONTACT_TO_EMAIL) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: c.env.CONTACT_FROM_EMAIL || 'Vitarka Labs <onboarding@resend.dev>',
          to: [c.env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: `[Vitarka Fabric] ${name}${org ? ` (${org})` : ''}`,
          text: `${message}\n\n${name} <${email}>${org ? `\n${org}` : ''}`,
        }),
      });
      if (!res.ok) console.error('[contact] email send failed', res.status);
    } catch (err) {
      console.error('[contact] email send error', err?.message);
    }
  }

  return c.json({ ok: true });
});

app.all('/api/*', (c) => c.json({ error: 'Not found.' }, 404));

app.notFound((c) => c.env.ASSETS.fetch(c.req.raw));

app.onError((err, c) => {
  console.error('[worker] unhandled', err?.message);
  return c.json({ error: 'Something went wrong on our side.' }, 500);
});

export default app;
