// routes/claim.js — Creator vault claim via OAuth + cryptographic signature
'use strict';

const express = require('express');
const { ethers } = require('ethers');
const Creator = require('../models/Creator');
const { authenticateJWT, signCreatorJWT } = require('../middlewares/auth');
const { exchangeCodeForProfile, getAuthorizationUrl } = require('../middlewares/oauth');

const router = express.Router();

// Server-side signing key (the backend EOA that calls claimVault on-chain or signs EIP-712 messages)
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
if (!SERVER_PRIVATE_KEY) {
  throw new Error('SERVER_PRIVATE_KEY environment variable is not set.');
}
const signingWallet = new ethers.Wallet(SERVER_PRIVATE_KEY);

// ─── GET /api/claim/auth-url ──────────────────────────────────────────────────
// Returns the Google OAuth consent URL.
// Query param: handle (the creator handle requesting claim)
router.get('/auth-url', (req, res) => {
  const { handle } = req.query;
  if (!handle) {
    return res.status(400).json({ error: 'Missing required query param: handle' });
  }

  // state = handle acts as a CSRF/session binding token
  const url = getAuthorizationUrl(handle.toLowerCase().trim());
  return res.json({ url });
});

// ─── POST /api/claim/oauth-callback ──────────────────────────────────────────
// Receives the OAuth authorization code from Google redirect.
// Validates identity → matches YouTube channel → issues JWT.
router.post('/oauth-callback', async (req, res) => {
  const { code, state: handle } = req.body;

  if (!code || !handle) {
    return res.status(400).json({ error: 'Missing required fields: code, state (handle).' });
  }

  try {
    const { channelId, channelTitle, email } = await exchangeCodeForProfile(code);

    if (!channelId) {
      return res.status(400).json({ error: 'No YouTube channel associated with this Google account.' });
    }

    const normalizedHandle = handle.toLowerCase().trim();

    // Upsert creator with verified YouTube identity
    let creator = await Creator.findOneAndUpdate(
      { handle: normalizedHandle },
      {
        $set: { youtubeChannelId: channelId },
        $setOnInsert: { handle: normalizedHandle, platform: 'youtube' },
      },
      { upsert: true, new: true }
    );

    // Issue a short-lived JWT scoped to this creator
    const token = signCreatorJWT({
      handle: normalizedHandle,
      youtubeChannelId: channelId,
      wallet: creator.creatorWallet,
    });

    return res.json({
      message: 'OAuth verified. Use the returned JWT to call /api/claim/sign.',
      token,
      channelId,
      channelTitle,
      email,
      handle: normalizedHandle,
    });
  } catch (err) {
    console.error('[Route] POST /claim/oauth-callback —', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/claim/sign ─────────────────────────────────────────────────────
// Protected by JWT. Verifies channel ownership then produces a server-signed
// EIP-191 message that the smart contract accepts as proof-of-authorization.
//
// Body: { creatorWallet: "0x..." }
// Returns: { signature, message, signerAddress }
router.post('/sign', authenticateJWT, async (req, res) => {
  const { creatorWallet } = req.body;
  const { handle, youtubeChannelId } = req.user;

  if (!creatorWallet || !ethers.isAddress(creatorWallet)) {
    return res.status(400).json({ error: 'Invalid or missing creatorWallet address.' });
  }

  if (!youtubeChannelId) {
    return res.status(403).json({ error: 'JWT missing youtubeChannelId. Re-authenticate via OAuth.' });
  }

  try {
    // Verify the handle ↔ channel mapping is still consistent in DB
    const creator = await Creator.findOne({ handle });
    if (!creator) {
      return res.status(404).json({ error: `Creator "${handle}" not found.` });
    }

    if (creator.isClaimed && creator.creatorWallet.toLowerCase() !== creatorWallet.toLowerCase()) {
      return res.status(409).json({
        error: 'Vault already claimed by a different wallet.',
        claimedWallet: creator.creatorWallet,
      });
    }

    if (creator.youtubeChannelId && creator.youtubeChannelId !== youtubeChannelId) {
      return res.status(403).json({ error: 'YouTube channel mismatch. Re-authenticate.' });
    }

    // Build deterministic claim message (mirrors what the contract verifies)
    // Format: "TipChain Claim: <handle> -> <wallet> @ <nonce>"
    const nonce = Date.now().toString();
    const message = `TipChain Claim: ${handle} -> ${creatorWallet.toLowerCase()} @ ${nonce}`;

    // EIP-191 personal_sign compatible signature
    const signature = await signingWallet.signMessage(message);

    // Persist the claimed wallet and mark as claimed
    await Creator.findOneAndUpdate(
      { handle },
      {
        $set: {
          creatorWallet: creatorWallet.toLowerCase(),
          isClaimed: true,
        },
      }
    );

    console.log(`[Route] Claim signed — handle:${handle} wallet:${creatorWallet}`);

    return res.json({
      message,
      signature,
      signerAddress: signingWallet.address,
      handle,
      creatorWallet: creatorWallet.toLowerCase(),
      nonce,
    });
  } catch (err) {
    console.error('[Route] POST /claim/sign —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /api/claim/status/:handle ───────────────────────────────────────────
// Public endpoint — check if a vault is claimed (for extension UI).
router.get('/status/:handle', async (req, res) => {
  try {
    const handle = req.params.handle.toLowerCase().trim();
    const creator = await Creator.findOne({ handle })
      .select('isClaimed creatorWallet youtubeChannelId -_id')
      .lean();

    if (!creator) {
      return res.json({ handle, isClaimed: false, exists: false });
    }

    return res.json({
      handle,
      exists: true,
      isClaimed: creator.isClaimed,
      creatorWallet: creator.isClaimed ? creator.creatorWallet : null,
    });
  } catch (err) {
    console.error('[Route] GET /claim/status/:handle —', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
