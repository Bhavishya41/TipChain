// server.js — TipChain API entry point
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./middlewares/db');
const { startIndexer } = require('./services/indexer');
const creatorRoutes = require('./routes/creator');
const claimRoutes = require('./routes/claim');
const tipsRoutes = require('./routes/tips');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Global Middlewares ───────────────────────────────────────────────────────

// CORS — wide open, let the whole world in 🌍
app.use(cors());

// Body parsing
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${ms}ms) from ${req.headers.origin || 'no-origin'}`);
  });
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString(), chain: 'Base Sepolia (84532)' })
);

// ─── Route Registration ───────────────────────────────────────────────────────

app.use('/api/creator', creatorRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/tips', tipsRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

(async () => {
  try {
    // 1. Establish DB connection before accepting traffic
    await connectDB();

    // 2. Start the on-chain event indexer (non-blocking, runs in background)
    startIndexer().catch((err) =>
      console.error('[Server] Indexer failed to start:', err.message)
    );

    // 3. Bind HTTP server
    app.listen(PORT, () => {
      console.log(`[Server] TipChain API running on port ${PORT}`);
      console.log(`[Server] Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('[Server] Fatal startup error:', err.message);
    process.exit(1);
  }
})();

module.exports = app; // for testing
