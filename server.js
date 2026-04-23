const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Credentials from environment variables
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || 'correia.njaqueline@gmail.com';
const LOGIN_PASS  = process.env.LOGIN_PASS  || 'q1w2e3r4@JZ';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'booktok-secret-2026';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/login');
}

// ── Routes ────────────────────────────────────────────────────

// Login page
app.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login POST
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === LOGIN_EMAIL && password === LOGIN_PASS) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Main app (protected)
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// API proxy (protected) — keeps Anthropic key on the server
app.post('/api/generate', requireAuth, async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`BookTok Generator rodando na porta ${PORT}`));
