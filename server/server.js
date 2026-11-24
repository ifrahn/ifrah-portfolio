import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { buildIndex, answer } from './rag.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;
const app = express();
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'", 'https://unpkg.com', 'https://cdn.jsdelivr.net', 'http://127.0.0.1:8000', 'http://localhost:8000'],
      workerSrc: ["'self'", 'blob:'],
    },
  },
}));

if (process.env.CORS_ORIGIN) app.use(cors({ origin: process.env.CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '10kb' }));

/* ---------- static frontend (only public folders, never server/ or .env) ---------- */
for (const dir of ['css', 'js', 'assets']) app.use('/' + dir, express.static(path.join(ROOT, dir), { maxAge: '1h' }));
app.get('/', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));

/* ---------- helpers ---------- */
const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const oneLine = (s) => s.replace(/[\r\n]+/g, ' '); // prevents email header injection
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- email ---------- */
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 465), secure: Number(SMTP_PORT || 465) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transporter;
}

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many messages. Please try again in a few minutes.' } });
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false, message: { error: 'Slow down a little! Try again in a minute.' } });

app.post('/api/contact', contactLimiter, async (req, res) => {
  const b = req.body || {};
  // spam protection: honeypot + minimum fill time (bots submit instantly)
  if (b.website) return res.json({ ok: true }); // pretend success
  const elapsed = Date.now() - Number(b.ts || 0);
  if (!Number.isFinite(elapsed) || elapsed < 3000) return res.status(400).json({ error: 'That was fast! Please take a moment and try again.' });

  const name = clean(b.name, 80), email = clean(b.email, 120), subject = clean(b.subject, 120), message = clean(b.message, 2000);
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (subject.length < 3) return res.status(400).json({ error: 'Please enter a subject.' });
  if (message.length < 10) return res.status(400).json({ error: 'Your message is too short.' });
  if ((message.match(/https?:\/\//gi) || []).length > 3) return res.status(400).json({ error: 'Too many links in the message.' });

  const t = getTransporter();
  if (!t) { console.error('[mail] SMTP not configured'); return res.status(503).json({ error: 'Email service is not configured yet.' }); }
  try {
    const info = await t.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: `"${oneLine(name).replace(/"/g, '')}" <${email}>`,
      subject: `[Portfolio] ${oneLine(subject)}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<h3>New portfolio message</h3><p><b>From:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><b>Subject:</b> ${escapeHtml(subject)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    console.log('[mail] sent', info.messageId);
    res.json({ ok: true });
  } catch (e) {
    console.error('[mail] failed:', e.message);
    res.status(502).json({ error: 'Could not send your message right now. Please try again later.' });
  }
});

/* ---------- chatbot ---------- */
app.post('/api/chat', chatLimiter, async (req, res) => {
  const question = clean(req.body?.question, 400);
  if (question.length < 2) return res.status(400).json({ error: 'Please type a question.' });
  try { res.json(await answer(question, Array.isArray(req.body.history) ? req.body.history : [])); }
  catch (e) { console.error('[chat]', e); res.status(500).json({ error: 'Something went wrong. Please try again.' }); }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

await buildIndex();
app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
