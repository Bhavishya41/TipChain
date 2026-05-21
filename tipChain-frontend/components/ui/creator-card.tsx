'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, TrendingDown, BadgeCheck } from 'lucide-react';
import type { Creator } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/mock-data';

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

export default function CreatorCard({ creator, index = 0 }: CreatorCardProps) {
  const isPositive = creator.token.priceChange24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link href={`/creator/${creator.username}`} className="block group">
        <div className="bg-[#111113] border-2 border-[#27272A] p-5 transition-all duration-150 group-hover:translate-x-[-3px] group-hover:translate-y-[-3px] group-hover:shadow-[6px_6px_0px_0px_#6D28FF]">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar placeholder */}
            <div className="h-12 w-12 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-lg font-black text-[#6D28FF] shrink-0">
              {creator.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-[#F5F5F5] truncate">
                  {creator.displayName}
                </h3>
                {creator.verified && (
                  <BadgeCheck className="h-4 w-4 text-[#6D28FF] shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#71717A] font-medium">
                @{creator.username}
              </p>
            </div>
          </div>

          {/* Token Info */}
          <div className="flex items-end justify-between mb-4 pb-4 border-b-2 border-[#1E1E22]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#71717A]">
                {creator.token.symbol}
              </span>
              <p className="text-xl font-black text-[#F5F5F5] tabular-nums">
                ${creator.token.price.toFixed(4)}
              </p>
            </div>
            <span
              className={`flex items-center gap-1 text-xs font-bold tabular-nums px-2 py-1 border-2 ${
                isPositive
                  ? 'text-[#4ADE80] border-[#4ADE80]/20 bg-[#4ADE80]/5'
                  : 'text-[#F97316] border-[#F97316]/20 bg-[#F97316]/5'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? '+' : ''}
              {creator.token.priceChange24h.toFixed(1)}%
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                MCap
              </span>
              <p className="text-sm font-bold text-[#A1A1AA] tabular-nums">
                {formatCurrency(creator.token.marketCap)}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                Holders
              </span>
              <p className="text-sm font-bold text-[#A1A1AA] tabular-nums">
                {formatNumber(creator.token.holders)}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                Tips
              </span>
              <p className="text-sm font-bold text-[#A1A1AA] tabular-nums">
                {formatNumber(creator.stats.totalTips)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
