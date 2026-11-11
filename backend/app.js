'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const API_BASE = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.AI_MODEL || '';
const API_KEY = process.env.AI_API_KEY || '';
const origins = (process.env.FRONTEND_ORIGINS || '')
  .split(',').map(value => value.trim()).filter(Boolean);

// Vercel sits behind a trusted proxy. One hop is used for client IP rate limiting.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  // Same-origin requests do not need CORS headers. Only allow cross-origin
  // browser access when an exact frontend origin has been configured.
  origin: origins.length ? origins : false,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '32kb' }));
app.use('/api/', rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi sebentar.' }
}));

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  service: 'CodeMind AI API',
  aiConfigured: Boolean(API_KEY && MODEL && !MODEL.startsWith('CHANGE_ME'))
}));

app.post('/api/chat', async (req, res) => {
  if (!API_KEY || !MODEL || MODEL.startsWith('CHANGE_ME')) {
    return res.status(503).json({ error: 'Backend belum dikonfigurasi. Atur AI_API_KEY dan AI_MODEL pada Environment Variables hosting.' });
  }

  const incoming = req.body && req.body.messages;
  if (!Array.isArray(incoming) || incoming.length < 1 || incoming.length > 20) {
    return res.status(400).json({ error: 'Format percakapan tidak valid (maksimal 20 pesan).' });
  }

  const messages = [];
  for (const item of incoming) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') {
      return res.status(400).json({ error: 'Setiap pesan harus memiliki role user/assistant dan content teks.' });
    }
    const content = item.content.trim();
    if (!content || content.length > 6000) {
      return res.status(400).json({ error: 'Pesan kosong atau terlalu panjang (maksimal 6000 karakter).' });
    }
    messages.push({ role: item.role, content });
  }
  if (messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Pesan terakhir harus berasal dari user.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const upstream = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are CodeMind AI, a helpful coding assistant. Explain clearly, prefer safe and maintainable code, and state uncertainty when needed.' },
          ...messages
        ],
        temperature: 0.4
      }),
      signal: controller.signal
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('AI provider returned status:', upstream.status);
      return res.status(502).json({ error: 'Penyedia AI belum dapat memproses permintaan. Periksa konfigurasi model/provider di hosting.' });
    }
    const reply = payload.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) {
      return res.status(502).json({ error: 'Provider AI mengembalikan jawaban kosong atau format yang tidak dikenali.' });
    }
    return res.json({ reply: reply.trim(), model: MODEL });
  } catch (error) {
    const timedOut = error.name === 'AbortError';
    console.error('AI request failed:', timedOut ? 'timeout' : error.message);
    return res.status(502).json({
      error: timedOut
        ? 'Permintaan AI melewati batas waktu. Coba lagi.'
        : 'Tidak dapat terhubung ke penyedia AI. Periksa koneksi dan konfigurasi server.'
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ error: 'Origin tidak diizinkan.' });
  }
  console.error('Request error:', err.message);
  return res.status(400).json({ error: 'Permintaan tidak dapat diproses.' });
});

module.exports = app;
