import { Hono } from 'hono';

const app = new Hono();

const CONTACT_TYPES = ['software', 'ai', 'embedded', 'iot', 'arcnode', 'organoid', 'other'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/health', (c) => c.json({ ok: true, ts: new Date().toISOString() }));

app.post('/api/contact', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body.' }, 400);
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const type = CONTACT_TYPES.includes(body?.type) ? body.type : 'other';

  const errors = [];
  if (!name) errors.push({ msg: 'Name is required' });
  else if (name.length > 120) errors.push({ msg: 'Name must be under 120 characters' });

  if (!EMAIL_RE.test(email)) errors.push({ msg: 'Valid email is required' });

  if (message.length < 10) errors.push({ msg: 'Message must be at least 10 characters' });
  else if (message.length > 2000) errors.push({ msg: 'Message must be under 2000 characters' });

  if (errors.length) return c.json({ errors }, 422);

  console.log(`[CONTACT] ${new Date().toISOString()} | ${type} | ${name} <${email}>`);
  console.log(`[CONTACT] Message: ${message.slice(0, 120)}…`);

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
          subject: `[Vitarka Labs] ${type} — ${name}`,
          text: `${message}\n\n— ${name} <${email}>`,
        }),
      });
      if (!res.ok) console.error('[CONTACT] Resend send failed', res.status, await res.text());
    } catch (err) {
      console.error('[CONTACT] Resend send error', err);
    }
  }

  return c.json({ ok: true, message: 'Your message has been received. We will respond shortly.' });
});

app.notFound((c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
