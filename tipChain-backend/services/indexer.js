// services/indexer.js — Ethers.js v6 event listener for TipChain contract
'use strict';

const { ethers } = require('ethers');
const Creator = require('../models/Creator');
const Tip = require('../models/Tip');

// ─── Contract Configuration ───────────────────────────────────────────────────

const CONTRACT_ADDRESS = '0xB735cd5C016Ca44e0281F48AB6c5198e3D0B65d2';
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC_URL;

/**
 * Minimal ABI — only the events we index.
 * tipAndMint: fan tips ETH → creator vault, mints fan tokens.
 * VaultClaimed: creator claims their vault to a wallet.
 */
const CONTRACT_ABI = [
  // event tipAndMint(address indexed fan, string creatorHandle, uint256 amount, address tokenAddress)
  'event tipAndMint(address indexed fan, string creatorHandle, uint256 amount, address tokenAddress)',
  // event VaultClaimed(string creatorHandle, address indexed creatorWallet, address tokenAddress)
  'event VaultClaimed(string creatorHandle, address indexed creatorWallet, address tokenAddress)',
];

// ETH/USD price — refreshed periodically to avoid stale data
let ethPriceUSD = 3000; // bootstrap fallback

// ─── Price Oracle ─────────────────────────────────────────────────────────────

async function refreshEthPrice() {
  try {
    const resp = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    if (!resp.ok) throw new Error(`CoinGecko ${resp.status}`);
    const json = await resp.json();
    ethPriceUSD = json.ethereum.usd;
    console.log(`[Indexer] ETH price updated: $${ethPriceUSD}`);
  } catch (err) {
    console.warn('[Indexer] ETH price refresh failed, using cached value:', err.message);
  }
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

/**
 * Handle tipAndMint events.
 * Upserts the Creator record and inserts the Tip record idempotently.
 */
async function handleTipAndMint(fan, creatorHandle, amount, tokenAddress, event) {
  const txHash = event.log.transactionHash.toLowerCase();
  const handle = creatorHandle.toLowerCase();

  try {
    // Resolve block timestamp
    const block = await event.log.getBlock();
    const timestamp = new Date(block.timestamp * 1000);

    const rawAmount = amount.toString();
    const ethAmount = ethers.formatEther(amount);
    const usdValue = parseFloat(ethAmount) * ethPriceUSD;
    const formattedAmount = `${parseFloat(ethAmount).toFixed(6)} ETH ($${usdValue.toFixed(2)})`;

    // Idempotent tip insert
    const existingTip = await Tip.findOne({ txHash });
    if (!existingTip) {
      await Tip.create({
        txHash,
        creatorHandle: handle,
        fanWallet: fan.toLowerCase(),
        rawAmount,
        formattedAmount,
        timestamp,
      });
      console.log(`[Indexer] TipAndMint indexed — handle:${handle} tx:${txHash}`);
    }

    // Upsert creator: accumulate USD reserve, track token address
    await Creator.findOneAndUpdate(
      { handle },
      {
        $inc: { totalReserveUSD: usdValue },
        $setOnInsert: { handle },
        $set: tokenAddress !== ethers.ZeroAddress ? { tokenAddress: tokenAddress.toLowerCase() } : {},
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error(`[Indexer] handleTipAndMint error (tx:${txHash}):`, err.message);
  }
}

/**
 * Handle VaultClaimed events.
 * Marks the creator as claimed and stores their wallet address.
 */
async function handleVaultClaimed(creatorHandle, creatorWallet, tokenAddress, event) {
  const handle = creatorHandle.toLowerCase();
  const txHash = event.log.transactionHash.toLowerCase();

  try {
    const updated = await Creator.findOneAndUpdate(
      { handle },
      {
        $set: {
          isClaimed: true,
          creatorWallet: creatorWallet.toLowerCase(),
          tokenAddress: tokenAddress !== ethers.ZeroAddress ? tokenAddress.toLowerCase() : undefined,
        },
      },
      { new: true }
    );

    if (!updated) {
      console.warn(`[Indexer] VaultClaimed — no Creator doc found for handle:${handle}. Creating stub.`);
      await Creator.create({
        handle,
        isClaimed: true,
        creatorWallet: creatorWallet.toLowerCase(),
        tokenAddress: tokenAddress !== ethers.ZeroAddress ? tokenAddress.toLowerCase() : null,
      });
    }

    console.log(`[Indexer] VaultClaimed indexed — handle:${handle} wallet:${creatorWallet} tx:${txHash}`);
  } catch (err) {
    console.error(`[Indexer] handleVaultClaimed error (tx:${txHash}):`, err.message);
  }
}

// ─── Listener Bootstrap ───────────────────────────────────────────────────────

let provider = null;
let contract = null;

/**
 * Attach contract listeners to a WebSocket or HTTP polling provider.
 * Automatically reconnects on provider disconnect.
 */
async function attachListeners() {
  const rpcUrl = BASE_SEPOLIA_RPC;

  // Prefer WSS for push-based events; fall back to polling via JsonRpcProvider
  if (rpcUrl.startsWith('wss://') || rpcUrl.startsWith('ws://')) {
    provider = new ethers.WebSocketProvider(rpcUrl);
  } else {
    provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  contract.on('tipAndMint', handleTipAndMint);
  contract.on('VaultClaimed', handleVaultClaimed);

  // Detect provider going stale (applies mainly to WSS)
  if (provider._websocket) {
    provider._websocket.on('close', () => {
      console.warn('[Indexer] WebSocket closed. Reconnecting in 5s…');
      setTimeout(startIndexer, 5000);
    });
  }

  console.log(`[Indexer] Listening on contract ${CONTRACT_ADDRESS} (Base Sepolia)`);
}

/**
 * Entry point — called once from server.js after DB is ready.
 */
async function startIndexer() {
  // Gracefully remove stale listeners before reattaching
  if (contract) {
    try { contract.removeAllListeners(); } catch (_) { }
  }
  if (provider) {
    try { await provider.destroy(); } catch (_) { }
  }

  await refreshEthPrice();
  // Refresh price every 5 minutes
  setInterval(refreshEthPrice, 5 * 60 * 1000);

  await attachListeners();
}

module.exports = { startIndexer };
