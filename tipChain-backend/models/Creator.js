// models/Creator.js — Mongoose schema for on-chain creator profiles
'use strict';

const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['youtube', 'twitter', 'tiktok', 'other'],
      default: 'youtube',
    },
    // ERC-20 fan-token minted for this creator's vault
    tokenAddress: {
      type: String,
      trim: true,
      default: null,
    },
    // Aggregated USD value of all tips received (updated by indexer)
    totalReserveUSD: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Whether the creator has claimed their vault via OAuth
    isClaimed: {
      type: Boolean,
      default: false,
    },
    // Wallet that will receive the vault upon claim
    creatorWallet: {
      type: String,
      trim: true,
      default: null,
    },
    // YouTube channel ID linked during OAuth flow
    youtubeChannelId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  }
);

// Compound index for marketplace trending queries
CreatorSchema.index({ totalReserveUSD: -1, isClaimed: 1 });

module.exports = mongoose.model('Creator', CreatorSchema);
