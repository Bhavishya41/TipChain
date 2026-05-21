'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Zap,
  Coins,
  Users,
  Chrome,
  TrendingUp,
  Shield,
  BadgeCheck,
  Loader2,
} from 'lucide-react';
import CreatorCard from '@/components/ui/creator-card';
import { getTrending } from '@/lib/api';
import type { ApiCreator } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/mock-data';
import type { Creator } from '@/lib/types';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

/** Map backend creator onto frontend Creator type for CreatorCard */
function apiToCreator(api: ApiCreator): Creator {
  return {
    id: api.handle,
    username: api.handle,
    displayName: api.handle,
    avatar: '',
    bio: '',
    category: 'other',
    verified: api.isClaimed,
    socials: {},
    stats: {
      supporters: 0,
      totalTips: 0,
      totalEarnings: api.totalReserveUSD,
      weeklyGrowth: 0,
    },
    token: {
      id: api.tokenAddress ?? api.handle,
      name: api.handle,
      symbol: `$${api.handle.toUpperCase().slice(0, 6)}`,
      price: 0,
      priceChange24h: 0,
      marketCap: api.totalReserveUSD,
      totalSupply: 0,
      circulatingSupply: 0,
      holders: 0,
      volume24h: 0,
      chartData: [],
      createdAt: new Date().toISOString(),
    },
    joinedAt: new Date().toISOString(),
  };
}

export default function HomePage() {
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [tableCreators, setTableCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending(10)
      .then((data) => {
        if (data.creators.length > 0) {
          const mapped = data.creators.map(apiToCreator);
          setFeaturedCreators(mapped.slice(0, 3));
          setTableCreators(mapped);
        }
      })
      .catch(() => {
        // Backend unavailable — leave lists empty
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#F5F5F5 1px, transparent 1px), linear-gradient(90deg, #F5F5F5 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-4xl">
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2 border-2 border-[#6D28FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6D28FF]">
                <Zap className="h-3.5 w-3.5" strokeWidth={3} />
                Decentralized Creator Protocol
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter text-[#F5F5F5] mb-8">
              YOUR FANS
              <br />
              <span className="text-[#6D28FF]">OWN A STAKE</span>
              <br />
              IN YOUR SUCCESS
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-[#A1A1AA] max-w-xl leading-relaxed mb-10">
              Launch your custom creator token. Let fans tip you directly via gas-abstracted micro-tips, and align community incentives through bonding curve appreciation. Reclaim your social capital.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/launch-token" className="flex items-center gap-2 bg-[#6D28FF] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#F5F5F5]">
                Launch Your Token
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/marketplace" className="flex items-center gap-2 bg-transparent px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#F5F5F5] border-2 border-[#27272A] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#27272A] hover:border-[#F5F5F5]">
                Explore Creators
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-16 flex flex-wrap gap-8 sm:gap-14 border-t-2 border-[#27272A] pt-8">
              {[
                { label: 'CREATORS', value: '2,400+' },
                { label: 'TOTAL TIPPED', value: '$4.2M' },
                { label: 'TOKENS MINTED', value: '890' },
                { label: 'TOKEN HOLDERS', value: '52K' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-black text-[#F5F5F5] tabular-nums tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============== FEATURED CREATORS ============== */}
      <section className="border-t-2 border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">Trending Now</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">FEATURED CREATORS</h2>
            </div>
            <Link href="/marketplace" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#111113] border-2 border-[#27272A] h-48 animate-pulse" />
              ))}
            </div>
          ) : featuredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCreators.map((creator, i) => (
                <CreatorCard key={creator.id} creator={creator} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-[#111113] border-2 border-[#27272A] p-16 text-center">
              <p className="text-sm text-[#52525B] font-bold uppercase tracking-wider">No creators yet</p>
              <p className="text-xs text-[#3F3F46] mt-2">Be the first to launch your token.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="border-t-2 border-[#27272A] bg-[#111113]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">TOKEN ECONOMY</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Coins, step: '01', title: 'MINT YOUR TOKEN', desc: 'Create your custom ERC-20 creator token in seconds. Define your symbol, supply, and launch on a custom bonding curve.' },
              { icon: Users, step: '02', title: 'ALIGN COMMUNITY INCENTIVES', desc: 'Fans purchase your token to support you. As demand increases, the token value scales with community growth.' },
              { icon: Zap, step: '03', title: 'GAS-ABSTRACTED TIPPING', desc: 'Receive direct, real-time tips from supporters. Fully gas-abstracted for frictionless community support.' },
              { icon: TrendingUp, step: '04', title: 'ASYMMETRIC YIELD', desc: 'Build a shared economy. Early supporters share in your on-chain growth as your community flourishes.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0B0B0C] border-2 border-[#27272A] p-6 relative group transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#6D28FF]">
                <span className="absolute top-4 right-4 text-[40px] font-black text-[#18181B] leading-none select-none">{item.step}</span>
                <div className="h-10 w-10 border-2 border-[#6D28FF] flex items-center justify-center mb-5">
                  <item.icon className="h-5 w-5 text-[#6D28FF]" strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F5F5F5] mb-2">{item.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MARKETPLACE PREVIEW ============== */}
      <section className="border-t-2 border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">Discover</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">MARKETPLACE</h2>
            <p className="text-sm text-[#A1A1AA] mt-3 max-w-md">Browse trending creators, discover new tokens, and join communities that matter to you.</p>
          </motion.div>

          {loading ? (
            <div className="border-2 border-[#27272A] p-10 flex items-center justify-center gap-2 text-[#52525B]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading…</span>
            </div>
          ) : tableCreators.length > 0 ? (
            <div className="border-2 border-[#27272A]">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b-2 border-[#27272A] bg-[#111113]">
                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">#</div>
                <div className="col-span-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Creator</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">Price</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">24h</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] hidden sm:block">MCap</div>
                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] hidden sm:block">Holders</div>
              </div>

              {tableCreators.map((creator, i) => {
                const isPositive = creator.token.priceChange24h >= 0;
                return (
                  <motion.div key={creator.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/creator/${creator.username}`} className="grid grid-cols-12 gap-4 px-5 py-4 border-b-2 border-[#1E1E22] hover:bg-[#111113] transition-colors group">
                      <div className="col-span-1 text-sm font-bold text-[#52525B] tabular-nums self-center">{i + 1}</div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="h-8 w-8 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-sm font-black text-[#6D28FF] shrink-0">
                          {creator.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-bold text-[#F5F5F5] truncate group-hover:text-[#6D28FF] transition-colors">{creator.displayName}</p>
                            {creator.verified && <BadgeCheck className="h-3.5 w-3.5 text-[#6D28FF] shrink-0" />}
                          </div>
                          <p className="text-xs text-[#52525B]">{creator.token.symbol}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm font-bold text-[#F5F5F5] tabular-nums self-center">
                        {creator.token.price > 0 ? `$${creator.token.price.toFixed(4)}` : '—'}
                      </div>
                      <div className={`col-span-2 text-sm font-bold tabular-nums self-center ${isPositive ? 'text-[#4ADE80]' : 'text-[#F97316]'}`}>
                        {creator.token.priceChange24h !== 0 ? `${isPositive ? '+' : ''}${creator.token.priceChange24h.toFixed(1)}%` : '—'}
                      </div>
                      <div className="col-span-2 text-sm font-bold text-[#A1A1AA] tabular-nums self-center hidden sm:block">
                        {creator.token.marketCap > 0 ? formatCurrency(creator.token.marketCap) : '—'}
                      </div>
                      <div className="col-span-1 text-sm font-bold text-[#A1A1AA] tabular-nums self-center hidden sm:block">
                        {creator.token.holders > 0 ? formatNumber(creator.token.holders) : '—'}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="border-2 border-[#27272A] bg-[#111113] p-16 text-center">
              <p className="text-sm text-[#52525B] font-bold uppercase tracking-wider">No creators yet</p>
              <p className="text-xs text-[#3F3F46] mt-2">Launch the first creator token to get started.</p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link href="/marketplace" className="flex items-center gap-2 border-2 border-[#27272A] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all">
              View Full Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== EXTENSION SHOWCASE ============== */}
      <section className="border-t-2 border-[#27272A] bg-[#111113]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">Browser Extension</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5] mb-6">TIP DIRECTLY<br />FROM TWITTER/X</h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-8 max-w-md">Install the TipChain extension and tip creators directly from their Twitter/X posts. No need to leave the platform.</p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Chrome, text: 'Chrome extension — one-click install' },
                  { icon: Zap, text: 'Gas abstracted via UGF SDK' },
                  { icon: Shield, text: 'Secure, non-custodial tipping' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="h-8 w-8 border-2 border-[#27272A] flex items-center justify-center bg-[#0B0B0C]">
                      <item.icon className="h-4 w-4 text-[#6D28FF]" />
                    </div>
                    <span className="text-sm text-[#A1A1AA]">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/extension" className="inline-flex items-center gap-2 bg-[#6D28FF] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="border-2 border-[#27272A] bg-[#0B0B0C] p-6">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b-2 border-[#1E1E22]">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 bg-[#F97316]" /><div className="h-3 w-3 bg-[#4ADE80]" /><div className="h-3 w-3 bg-[#6D28FF]" />
                  </div>
                  <div className="flex-1 bg-[#18181B] border-2 border-[#27272A] px-3 py-1.5 text-xs text-[#52525B] font-mono">x.com/your_handle</div>
                </div>
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-[#18181B] border-2 border-[#27272A] flex items-center justify-center text-sm font-black text-[#6D28FF] shrink-0">C</div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-bold text-[#F5F5F5]">Creator</span>
                        <BadgeCheck className="h-3.5 w-3.5 text-[#6D28FF]" />
                        <span className="text-xs text-[#52525B]">@creator_handle</span>
                      </div>
                      <p className="text-sm text-[#A1A1AA] leading-relaxed">Just shipped something big 🚀 Join the community.</p>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-[#6D28FF] bg-[#111113] p-4 shadow-[4px_4px_0px_0px_#6D28FF]">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-[#1E1E22]">
                    <Zap className="h-4 w-4 text-[#6D28FF]" strokeWidth={3} />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">TipChain</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#A1A1AA]">Tip @creator_handle</span>
                    <span className="text-sm font-bold text-[#F5F5F5] tabular-nums">$TOKEN</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['$1', '$5', '$10', '$25'].map((amt) => (
                      <button key={amt} className={`py-2 text-xs font-bold border-2 transition-colors ${amt === '$5' ? 'border-[#6D28FF] bg-[#6D28FF]/10 text-[#6D28FF]' : 'border-[#27272A] text-[#A1A1AA] hover:border-[#6D28FF]'}`}>{amt}</button>
                    ))}
                  </div>
                  <button className="w-full py-2.5 bg-[#6D28FF] text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF]">Send Tip</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== CTA FOOTER ============== */}
      <section className="border-t-2 border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[#F5F5F5] mb-6">
              READY TO BUILD<br /><span className="text-[#6D28FF]">YOUR ECONOMY?</span>
            </h2>
            <p className="text-base text-[#A1A1AA] max-w-md mx-auto mb-10">Join thousands of creators who are tokenizing their communities and earning on their own terms.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/claim" className="flex items-center gap-2 bg-[#6D28FF] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#F5F5F5]">
                Claim Your Vault <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/marketplace" className="flex items-center gap-2 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#F5F5F5] border-2 border-[#27272A] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#27272A] hover:border-[#F5F5F5]">
                Explore Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
