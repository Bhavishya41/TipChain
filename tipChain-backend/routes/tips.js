// routes/tips.js — Record a tip and upsert the creator profile
'use strict';

const express = require('express');
const Creator = require('../models/Creator');
const Tip = require('../models/Tip');

const router = express.Router();

// ─── POST /api/tips ──────────────────────────────────────────────────────────
// Called by the browser extension after a successful on-chain tipAndMint tx.
// Body: { txHash, creatorHandle, fanWallet, rawAmount, formattedAmount, timestamp, platform? }
router.post('/', async (req, res) => {
  try {
    const { txHash, creatorHandle, fanWallet, rawAmount, formattedAmount, timestamp, platform } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!txHash || !creatorHandle || !fanWallet || !rawAmount || !formattedAmount) {
      return res.status(400).json({
        error: 'Missing required fields: txHash, creatorHandle, fanWallet, rawAmount, formattedAmount.',
      });
    }

    const normalizedHandle = creatorHandle.replace(/^@/, '').toLowerCase().trim();

    // ── 1. Save the Tip (idempotent via unique txHash) ────────────────────────
    let tip;
    try {
      tip = await Tip.create({
        txHash: txHash.toLowerCase().trim(),
        creatorHandle: normalizedHandle,
        fanWallet: fanWallet.toLowerCase().trim(),
        rawAmount: String(rawAmount),
        formattedAmount,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });
      console.log(`[Tips] Saved tip ${txHash} for @${normalizedHandle}`);
    } catch (err) {
      // Duplicate txHash — tip already recorded (idempotency guard)
      if (err.code === 11000) {
        console.log(`[Tips] Duplicate txHash ${txHash} — already recorded.`);
        return res.status(200).json({ message: 'Tip already recorded.', duplicate: true });
      }
      throw err;
    }

    // ── 2. Upsert the Creator ─────────────────────────────────────────────────
    // Parse the USD amount from the formattedAmount string (e.g. "$5" → 5)
    const usdValue = parseFloat(formattedAmount.replace(/[^0-9.]/g, '')) || 0;

    const validPlatform = ['youtube', 'twitter', 'tiktok', 'other'].includes(platform)
      ? platform
      : 'youtube';

    await Creator.findOneAndUpdate(
      { handle: normalizedHandle },
      {
        $inc: { totalReserveUSD: usdValue },
        $setOnInsert: {
          handle: normalizedHandle,
          platform: validPlatform,
          isClaimed: false,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`[Tips] Upserted creator @${normalizedHandle} (+$${usdValue})`);

    return res.status(201).json({
      message: 'Tip recorded successfully.',
      tip: {
        txHash: tip.txHash,
        creatorHandle: tip.creatorHandle,
        fanWallet: tip.fanWallet,
        formattedAmount: tip.formattedAmount,
        timestamp: tip.timestamp,
      },
    });
  } catch (err) {
    console.error('[Route] POST /tips —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
