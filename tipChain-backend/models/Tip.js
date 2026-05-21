// models/Tip.js — Immutable on-chain tip event record
'use strict';

const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema(
  {
    // Transaction hash — single source of truth, enforces idempotency
    txHash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    creatorHandle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    // Fan's EOA address
    fanWallet: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Raw wei / token-unit amount as string to avoid BigInt precision loss
    rawAmount: {
      type: String,
      required: true,
    },
    // Human-readable formatted amount (e.g. "0.05 ETH")
    formattedAmount: {
      type: String,
      required: true,
    },
    // Block timestamp from the chain event
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

// Compound index: fast per-creator feed sorted by time
TipSchema.index({ creatorHandle: 1, timestamp: -1 });

module.exports = mongoose.model('Tip', TipSchema);
