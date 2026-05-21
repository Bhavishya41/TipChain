// middlewares/db.js — Mongoose connection pool with retry logic
'use strict';

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 3000;

/**
 * Establishes a singleton Mongoose connection with
 * connection-pool tuning suitable for production.
 */
async function connectDB(attempt = 1) {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set.');
  }

  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,        // max concurrent sockets per host
      minPoolSize: 2,         // keep-alive baseline
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log('[DB] MongoDB connected —', mongoose.connection.host);
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.warn(`[DB] Connection failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${RETRY_INTERVAL_MS}ms…`);
      await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
      return connectDB(attempt + 1);
    }
    throw new Error(`[DB] Could not connect after ${MAX_RETRIES} attempts: ${err.message}`);
  }
}

// Surface connection-level errors to the process
mongoose.connection.on('error', (err) => {
  console.error('[DB] Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected. Attempting reconnect…');
});

module.exports = { connectDB };
