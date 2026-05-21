// routes/creator.js — Creator stats (Extension) and Trending (Marketplace)
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Creator = require('../models/Creator');
const Tip = require('../models/Tip');

const router = express.Router();

// ─── GET /api/creator/trending ────────────────────────────────────────────────
// Marketplace feed — top creators by total reserve, with optional filters.
router.get('/trending', async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * limit;
    const platform = req.query.platform; // optional filter e.g. "youtube"
    const onlyUnclaimed = req.query.unclaimed === 'true'; // surface unclaimed vaults

    const filter = {};
    if (platform) filter.platform = platform;
    if (onlyUnclaimed) filter.isClaimed = false;

    const [creators, total] = await Promise.all([
      Creator.find(filter)
        .sort({ totalReserveUSD: -1 })
        .skip(skip)
        .limit(limit)
        .select('handle platform tokenAddress totalReserveUSD isClaimed youtubeChannelId -_id')
        .lean(),
      Creator.countDocuments(filter),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      creators,
    });
  } catch (err) {
    console.error('[Route] GET /creator/trending —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /api/creator/:handle ─────────────────────────────────────────────────
// Used by the browser extension to display real-time creator tip stats.
router.get('/:handle', async (req, res) => {
  try {
    const handle = req.params.handle.toLowerCase().trim();

    const creator = await Creator.findOne({ handle }).lean();

    if (!creator) {
      return res.status(404).json({ error: `Creator "${handle}" not found.` });
    }

    // Last 5 tips for activity feed
    const recentTips = await Tip.find({ creatorHandle: handle })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('txHash fanWallet formattedAmount timestamp -_id')
      .lean();

    return res.json({
      handle: creator.handle,
      platform: creator.platform,
      tokenAddress: creator.tokenAddress,
      totalReserveUSD: creator.totalReserveUSD,
      isClaimed: creator.isClaimed,
      creatorWallet: creator.creatorWallet,
      youtubeChannelId: creator.youtubeChannelId,
      recentTips,
    });
  } catch (err) {
    console.error('[Route] GET /creator/:handle —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /api/creator/:handle/tips ───────────────────────────────────────────
// Paginated full tip history for a creator.
router.get('/:handle/tips', async (req, res) => {
  try {
    const handle = req.params.handle.toLowerCase().trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [tips, total] = await Promise.all([
      Tip.find({ creatorHandle: handle })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .select('txHash fanWallet formattedAmount timestamp -_id')
        .lean(),
      Tip.countDocuments({ creatorHandle: handle }),
    ]);

    return res.json({
      handle,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tips,
    });
  } catch (err) {
    console.error('[Route] GET /creator/:handle/tips —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
