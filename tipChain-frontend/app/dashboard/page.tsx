'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Coins,
  ArrowUpRight,
  Activity,
  Zap,
  Send,
  Plus,
  TrendingUp,
  LogOut,
  Loader2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import StatCard from '@/components/ui/stat-card';
import { getCreator, getCreatorTips } from '@/lib/api';
import type { ApiCreatorDetail, ApiTip } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthContext';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/mock-data';

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();

  const [creator, setCreator] = useState<ApiCreatorDetail | null>(null);
  const [tips, setTips] = useState<ApiTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.handle) return;
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      getCreator(user.handle),
      getCreatorTips(user.handle, 1, 6),
    ]).then(([creatorRes, tipsRes]) => {
      if (cancelled) return;
      if (creatorRes.status === 'fulfilled') setCreator(creatorRes.value);
      if (tipsRes.status === 'fulfilled') setTips(tipsRes.value.tips);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [isAuthenticated, user?.handle]);

  // ─── Unauthenticated Gate ─────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="h-16 w-16 border-2 border-[#6D28FF] flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-[#6D28FF]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#F5F5F5] mb-3">
            DASHBOARD
          </h1>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm mx-auto mb-8">
            The dashboard is only available to creators who have claimed their
            vault via Google/YouTube OAuth. Verify your channel to access your
            earnings, tip history, and analytics.
          </p>
          <Link
            href="/claim"
            className="inline-flex items-center gap-2 bg-[#6D28FF] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]"
          >
            <Zap className="h-4 w-4" />
            Claim Your Vault
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Authenticated Dashboard ──────────────────────────────────────────────

  const totalEarnings = creator?.totalReserveUSD ?? 0;
  const tipCount = tips.length;
  const handle = user?.handle ?? '';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">DASHBOARD</h1>
          <p className="text-sm text-[#52525B] mt-1">
            Welcome back,{' '}
            <span className="text-[#A1A1AA] font-bold">@{handle}</span>
            {creator?.isClaimed && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] border border-[#4ADE80]/30 px-1.5 py-0.5">
                Verified
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-2 border-2 border-[#27272A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F97316] hover:border-[#F97316] transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
          <button className="flex items-center gap-2 bg-[#6D28FF] border-2 border-[#6D28FF] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]">
            <Send className="h-3.5 w-3.5" />
            Withdraw
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#111113] border-2 border-[#27272A] h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Vault Reserve"
            value={formatCurrency(totalEarnings)}
            change={0}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            label="Token Holders"
            value="—"
            change={0}
            icon={<Users className="h-4 w-4" />}
            accentColor="#4ADE80"
          />
          <StatCard
            label="Token Valuation"
            value="—"
            change={0}
            icon={<Coins className="h-4 w-4" />}
          />
          <StatCard
            label="Tips Received"
            value={formatNumber(tipCount)}
            change={0}
            icon={<Activity className="h-4 w-4" />}
            accentColor="#F97316"
          />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vault Info */}
        <div className="lg:col-span-2 bg-[#111113] border-2 border-[#27272A]">
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#6D28FF] flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#6D28FF]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#F5F5F5]">Vault Analytics</h3>
                <p className="text-xs text-[#52525B]">Live on-chain data</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-6 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Vault Reserve (USD)</span>
                <p className="text-3xl font-black text-[#F5F5F5] tabular-nums">
                  {loading ? '—' : formatCurrency(totalEarnings)}
                </p>
              </div>
              {creator?.isClaimed && (
                <span className="flex items-center gap-1 text-xs font-bold tabular-nums mb-1 text-[#4ADE80]">
                  <ArrowUpRight className="h-3 w-3" />
                  Claimed
                </span>
              )}
            </div>

            {/* Token Address */}
            {creator?.tokenAddress && (
              <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-4 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] block mb-1">Token Contract</span>
                <a
                  href={`https://sepolia.basescan.org/token/${creator.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-[#6D28FF] hover:underline break-all"
                >
                  {creator.tokenAddress}
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-5 border-t-2 border-[#1E1E22]">
              {[
                { label: 'Vault Reserve', value: formatCurrency(totalEarnings) },
                { label: 'Tips Received', value: formatNumber(tipCount) },
                { label: 'Claim Status', value: creator?.isClaimed ? 'Claimed ✓' : 'Unclaimed' },
                { label: 'Platform', value: creator?.platform ?? '—' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">{stat.label}</span>
                  <p className="text-sm font-bold text-[#A1A1AA] tabular-nums mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="bg-[#111113] border-2 border-[#27272A]">
            <div className="px-5 py-4 border-b-2 border-[#27272A]">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: 'View Profile', color: '#6D28FF', href: `/creator/${handle}` },
                { icon: Coins, label: 'Marketplace', color: '#4ADE80', href: '/marketplace' },
                { icon: Send, label: 'Withdraw', color: '#F97316', href: '#' },
                { icon: Plus, label: 'Get Extension', color: '#7C3AED', href: '/extension' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-[#27272A] bg-[#0B0B0C] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all"
                >
                  <action.icon className="h-5 w-5" style={{ color: action.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Creator Wallet */}
          {creator?.creatorWallet && (
            <div className="bg-[#111113] border-2 border-[#27272A]">
              <div className="px-5 py-4 border-b-2 border-[#27272A]">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Creator Wallet</h3>
              </div>
              <div className="p-5">
                <a
                  href={`https://sepolia.basescan.org/address/${creator.creatorWallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#6D28FF] hover:underline break-all"
                >
                  {creator.creatorWallet}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tips — Live */}
      <div className="mt-5 bg-[#111113] border-2 border-[#27272A]">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#27272A]">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Recent Tips</h3>
          <Link
            href={`/creator/${handle}`}
            className="text-xs font-bold text-[#6D28FF] hover:text-[#7C3AED] transition-colors flex items-center gap-1"
          >
            View Profile <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-[#52525B]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading…</span>
          </div>
        ) : tips.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[#52525B] font-bold uppercase tracking-wider">No tips yet</p>
            <p className="text-xs text-[#3F3F46] mt-2">Share your creator profile to start receiving tips.</p>
          </div>
        ) : (
          <div>
            {tips.map((tip, i) => (
              <motion.div
                key={tip.txHash}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 border-b-2 border-[#1E1E22] last:border-b-0 hover:bg-[#18181B] transition-colors"
              >
                <div className="h-8 w-8 border-2 border-[#4ADE80]/30 text-[#4ADE80] flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#F5F5F5]">
                    <span className="text-[#A1A1AA]">
                      {tip.fanWallet.slice(0, 6)}…{tip.fanWallet.slice(-4)}
                    </span>{' '}
                    tipped
                  </p>
                  <p className="text-xs text-[#52525B]">{timeAgo(tip.timestamp)}</p>
                </div>
                <a
                  href={`https://sepolia.basescan.org/tx/${tip.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black tabular-nums text-[#4ADE80] hover:underline"
                >
                  +{tip.formattedAmount.split(' (')[0]}
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
