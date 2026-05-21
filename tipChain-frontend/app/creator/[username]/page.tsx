'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Twitter,
  Youtube,
  Globe,
  ExternalLink,
  Copy,
  Trophy,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import MiniChart from '@/components/ui/mini-chart';
import {
  getCreatorByUsername,
  mockCreators,
  mockSupporters,
  formatCurrency,
  formatNumber,
  timeAgo,
} from '@/lib/mock-data';
import { getCreator, getCreatorTips, getClaimStatus } from '@/lib/api';
import type { ApiCreatorDetail, ApiTip, ApiClaimStatus } from '@/lib/api';

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  // Mock creator data used for UI fields not in the backend (bio, socials, chart, etc.)
  const mockCreator = getCreatorByUsername(username) ?? mockCreators[0];

  const [apiCreator, setApiCreator] = useState<ApiCreatorDetail | null>(null);
  const [tips, setTips] = useState<ApiTip[]>([]);
  const [claimStatus, setClaimStatus] = useState<ApiClaimStatus | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [loadingTips, setLoadingTips] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const [tipAmount, setTipAmount] = useState(5);
  const [buyAmount, setBuyAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'activity' | 'supporters'>('about');

  const isPositive = mockCreator.token.priceChange24h >= 0;

  // Fetch live creator data
  useEffect(() => {
    let cancelled = false;
    setLoadingCreator(true);

    Promise.allSettled([
      getCreator(username),
      getClaimStatus(username),
    ]).then(([creatorResult, claimResult]) => {
      if (cancelled) return;
      if (creatorResult.status === 'fulfilled') setApiCreator(creatorResult.value);
      if (claimResult.status === 'fulfilled') setClaimStatus(claimResult.value);
      setLoadingCreator(false);
    });

    return () => { cancelled = true; };
  }, [username]);

  // Fetch tips when activity tab opens
  useEffect(() => {
    if (activeTab !== 'activity') return;
    let cancelled = false;
    setLoadingTips(true);
    getCreatorTips(username, 1, 20)
      .then((data) => { if (!cancelled) setTips(data.tips); })
      .catch(() => { if (!cancelled) setTips([]); })
      .finally(() => { if (!cancelled) setLoadingTips(false); });
    return () => { cancelled = true; };
  }, [activeTab, username]);

  // Live stats — prefer API data, fall back to mock
  const totalReserveUSD = apiCreator?.totalReserveUSD ?? mockCreator.stats.totalEarnings;
  const tokenAddress = apiCreator?.tokenAddress ?? null;
  const isClaimed = claimStatus?.isClaimed ?? false;

  function copyContract() {
    if (!tokenAddress) return;
    navigator.clipboard.writeText(tokenAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ============== Creator Header ============== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Banner */}
        <div className="h-32 sm:h-48 bg-[#111113] border-2 border-[#27272A] mb-5 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(#6D28FF 1px, transparent 1px), linear-gradient(90deg, #6D28FF 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 border-3 border-[#6D28FF] bg-[#111113] flex items-center justify-center text-3xl font-black text-[#6D28FF] -mt-12 sm:-mt-16 relative z-10 shrink-0">
            {mockCreator.displayName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
                {mockCreator.displayName}
              </h1>
              {mockCreator.verified && (
                <BadgeCheck className="h-6 w-6 text-[#6D28FF]" />
              )}
              {/* Live claim badge */}
              {!loadingCreator && (
                isClaimed ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] border border-[#4ADE80]/30 px-2 py-0.5">
                    <ShieldCheck className="h-3 w-3" /> Claimed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F97316] border border-[#F97316]/30 px-2 py-0.5">
                    <ShieldOff className="h-3 w-3" /> Unclaimed
                  </span>
                )
              )}
            </div>
            <p className="text-sm text-[#52525B] mb-3">@{mockCreator.username}</p>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xl mb-4">
              {mockCreator.bio}
            </p>

            {/* Socials */}
            <div className="flex gap-2 flex-wrap">
              {mockCreator.socials.twitter && (
                <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#27272A] text-xs text-[#52525B] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all">
                  <Twitter className="h-3 w-3" />
                  {mockCreator.socials.twitter}
                </a>
              )}
              {mockCreator.socials.youtube && (
                <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#27272A] text-xs text-[#52525B] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all">
                  <Youtube className="h-3 w-3" />
                  {mockCreator.socials.youtube}
                </a>
              )}
              {mockCreator.socials.website && (
                <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#27272A] text-xs text-[#52525B] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all">
                  <Globe className="h-3 w-3" />
                  Website
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats — live where available */}
          <div className="flex gap-6 sm:gap-8 mt-2 sm:mt-0">
            {[
              { label: 'Supporters', value: formatNumber(mockCreator.stats.supporters), icon: Users },
              { label: 'Reserve', value: formatCurrency(totalReserveUSD), icon: DollarSign },
              { label: 'Growth', value: `+${mockCreator.stats.weeklyGrowth}%`, icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-right">
                <p className="text-lg sm:text-xl font-black text-[#F5F5F5] tabular-nums">
                  {stat.value}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ============== Main Grid ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Chart + Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Token Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111113] border-2 border-[#27272A]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#27272A]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-[#F5F5F5]">
                  {mockCreator.token.symbol}
                </span>
                <span className="text-xl font-black text-[#F5F5F5] tabular-nums">
                  ${mockCreator.token.price.toFixed(4)}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-bold tabular-nums ${isPositive ? 'text-[#4ADE80]' : 'text-[#F97316]'}`}>
                  {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isPositive ? '+' : ''}{mockCreator.token.priceChange24h.toFixed(1)}%
                </span>
              </div>
              <div className="flex gap-1">
                {['7D', '30D', '90D'].map((period) => (
                  <button
                    key={period}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 ${period === '30D' ? 'border-[#6D28FF] text-[#6D28FF]' : 'border-transparent text-[#52525B]'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              <MiniChart data={mockCreator.token.chartData} width={650} height={180} color="auto" />
            </div>
            <div className="grid grid-cols-4 gap-4 px-5 pb-5 pt-3 border-t-2 border-[#1E1E22]">
              {[
                { label: 'Reserve USD', value: formatCurrency(totalReserveUSD) },
                { label: 'Volume 24h', value: formatCurrency(mockCreator.token.volume24h) },
                { label: 'Holders', value: formatNumber(mockCreator.token.holders) },
                { label: 'Supply', value: formatNumber(mockCreator.token.circulatingSupply) },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                    {stat.label}
                  </span>
                  <p className="text-sm font-bold text-[#A1A1AA] tabular-nums mt-0.5">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 border-b-2 border-[#27272A]">
            {(['about', 'activity', 'supporters'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-[2px] transition-colors ${
                  activeTab === tab
                    ? 'border-[#6D28FF] text-[#F5F5F5]'
                    : 'border-transparent text-[#52525B] hover:text-[#A1A1AA]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111113] border-2 border-[#27272A] p-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F5F5F5] mb-4">About</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">{mockCreator.bio}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[#1E1E22]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Category</span>
                  <p className="text-sm font-bold text-[#F5F5F5] capitalize mt-0.5">{mockCreator.category}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Joined</span>
                  <p className="text-sm font-bold text-[#F5F5F5] mt-0.5">
                    {new Date(mockCreator.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tab — LIVE tips from backend */}
          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111113] border-2 border-[#27272A]">
              {loadingTips ? (
                <div className="flex items-center justify-center gap-2 p-10 text-[#52525B]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider">Loading tips…</span>
                </div>
              ) : tips.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm text-[#52525B] font-bold uppercase tracking-wider">No tips yet</p>
                  <p className="text-xs text-[#3F3F46] mt-2">Be the first to tip this creator!</p>
                </div>
              ) : (
                tips.map((tip) => (
                  <div key={tip.txHash} className="flex items-center gap-3 px-5 py-4 border-b-2 border-[#1E1E22] last:border-b-0">
                    <div className="h-8 w-8 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-xs font-black text-[#6D28FF] shrink-0">
                      {tip.fanWallet.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F5F5F5]">
                        <span className="font-bold text-[#A1A1AA]">
                          {tip.fanWallet.slice(0, 6)}…{tip.fanWallet.slice(-4)}
                        </span>{' '}
                        <span className="text-[#A1A1AA]">tipped</span>
                      </p>
                      <p className="text-xs text-[#52525B]">{timeAgo(tip.timestamp)}</p>
                    </div>
                    <a
                      href={`https://sepolia.basescan.org/tx/${tip.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#4ADE80] tabular-nums hover:underline"
                    >
                      {tip.formattedAmount.split(' (')[0]}
                    </a>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Supporters Tab — static mock (no per-fan aggregate in backend yet) */}
          {activeTab === 'supporters' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111113] border-2 border-[#27272A]">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b-2 border-[#27272A]">
                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">#</div>
                <div className="col-span-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Supporter</div>
                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Total Tipped</div>
                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Tokens Held</div>
              </div>
              {mockSupporters.map((supporter) => (
                <div key={supporter.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b-2 border-[#1E1E22] last:border-b-0 hover:bg-[#18181B] transition-colors">
                  <div className="col-span-1 flex items-center">
                    {supporter.rank <= 3 ? (
                      <Trophy className={`h-4 w-4 ${supporter.rank === 1 ? 'text-[#F97316]' : supporter.rank === 2 ? 'text-[#A1A1AA]' : 'text-[#92400E]'}`} />
                    ) : (
                      <span className="text-sm font-bold text-[#52525B] tabular-nums">{supporter.rank}</span>
                    )}
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <div className="h-7 w-7 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-[10px] font-black text-[#6D28FF] shrink-0">
                      {supporter.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-[#F5F5F5] truncate">@{supporter.username}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm font-bold text-[#4ADE80] tabular-nums">${supporter.totalTipped.toLocaleString()}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm font-bold text-[#A1A1AA] tabular-nums">{formatNumber(supporter.tokensHeld)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right: Buy + Tip Panels */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111113] border-2 border-[#27272A] sticky top-24"
          >
            {/* Live Reserve Banner */}
            {!loadingCreator && apiCreator && (
              <div className="px-5 py-3 border-b-2 border-[#27272A] bg-[#0B0B0C]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Live Vault Reserve</span>
                  <span className="text-sm font-black text-[#4ADE80] tabular-nums">
                    {formatCurrency(apiCreator.totalReserveUSD)}
                  </span>
                </div>
              </div>
            )}

            {/* Buy Panel */}
            <div className="px-5 py-4 border-b-2 border-[#27272A]">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
                Buy {mockCreator.token.symbol}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] block mb-1.5">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#52525B] font-bold">$</span>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0B0B0C] border-2 border-[#27272A] pl-8 pr-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors tabular-nums"
                  />
                </div>
              </div>

              <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#52525B]">You receive</span>
                  <span className="font-bold text-[#F5F5F5] tabular-nums">
                    {buyAmount ? `~${(Number(buyAmount) / mockCreator.token.price).toFixed(0)} ${mockCreator.token.symbol}` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-[#52525B]">Price per token</span>
                  <span className="text-[#A1A1AA] tabular-nums">${mockCreator.token.price.toFixed(4)}</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#6D28FF] py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]">
                Buy {mockCreator.token.symbol}
              </button>
            </div>

            {/* Tip Section */}
            <div className="border-t-2 border-[#27272A]">
              <div className="px-5 py-4 border-b-2 border-[#27272A]">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Tip Creator</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 25].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`py-2.5 text-xs font-bold border-2 transition-all ${
                        tipAmount === amt
                          ? 'border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/5'
                          : 'border-[#27272A] text-[#52525B] hover:border-[#4ADE80]'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-[#4ADE80] py-3 text-sm font-bold uppercase tracking-wider text-[#0B0B0C] border-2 border-[#4ADE80] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]">
                  <Zap className="h-4 w-4" strokeWidth={3} />
                  Tip ${tipAmount}
                </button>
              </div>
            </div>

            {/* Token Address — live */}
            <div className="px-5 py-3 border-t-2 border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Contract</span>
                {tokenAddress ? (
                  <button
                    onClick={copyContract}
                    className="flex items-center gap-1 text-xs text-[#52525B] hover:text-[#6D28FF] transition-colors"
                  >
                    {tokenAddress.slice(0, 6)}…{tokenAddress.slice(-4)}
                    <Copy className="h-3 w-3" />
                    {copiedContract && <span className="text-[#4ADE80]">✓</span>}
                  </button>
                ) : (
                  <span className="text-xs text-[#3F3F46]">Not deployed</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
