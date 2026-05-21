'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Zap,
  BarChart3,
  Loader2,
} from 'lucide-react';
import CreatorCard from '@/components/ui/creator-card';
import { getTrending, type ApiCreator } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/mock-data';
import type { Creator, CreatorCategory } from '@/lib/types';

const sortOptions = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'recent', label: 'Recently Launched', icon: Clock },
  { value: 'top-tipped', label: 'Top Tipped', icon: Zap },
  { value: 'market-cap', label: 'Market Cap', icon: BarChart3 },
] as const;

const categoryFilters: { value: CreatorCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'music', label: 'Music' },
  { value: 'art', label: 'Art' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tech' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'education', label: 'Education' },
  { value: 'fitness', label: 'Fitness' },
];

/** Map backend ApiCreator onto the frontend Creator shape for CreatorCard */
function apiToCreator(api: ApiCreator): Creator {
  const holders = api.holdersCount ?? 0;
  const tips = api.tipsCount ?? 0;
  // Deterministic price based on reserve, e.g. reserve / 100 or a minimum fallback of 0.0001
  const price = api.totalReserveUSD > 0 ? (api.totalReserveUSD / 100) : 0.0001;

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
      supporters: holders,
      totalTips: tips,
      totalEarnings: api.totalReserveUSD,
      weeklyGrowth: 0,
    },
    token: {
      id: api.tokenAddress ?? api.handle,
      name: api.handle,
      symbol: `$${api.handle.toUpperCase().slice(0, 6)}`,
      price,
      priceChange24h: 0,
      marketCap: api.totalReserveUSD,
      totalSupply: 0,
      circulatingSupply: 0,
      holders,
      volume24h: 0,
      chartData: [],
      createdAt: new Date().toISOString(),
    },
    joinedAt: new Date().toISOString(),
  };
}

export default function MarketplacePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CreatorCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'top-tipped' | 'market-cap'>('trending');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getTrending(50)
      .then((data) => {
        if (cancelled) return;
        setCreators(data.creators.map(apiToCreator));
      })
      .catch(() => {
        if (cancelled) return;
        setError('Could not reach the backend. Please try again later.');
        setCreators([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredCreators = useMemo(() => {
    let result = [...creators];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.displayName.toLowerCase().includes(query) ||
          c.username.toLowerCase().includes(query) ||
          c.token.symbol.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    switch (sortBy) {
      case 'trending':
        result.sort((a, b) => b.stats.weeklyGrowth - a.stats.weeklyGrowth);
        break;
      case 'recent':
        result.sort(
          (a, b) =>
            new Date(b.token.createdAt).getTime() -
            new Date(a.token.createdAt).getTime()
        );
        break;
      case 'top-tipped':
        result.sort((a, b) => b.stats.totalEarnings - a.stats.totalEarnings);
        break;
      case 'market-cap':
        result.sort((a, b) => b.token.marketCap - a.token.marketCap);
        break;
    }

    return result;
  }, [creators, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
          MARKETPLACE
        </h1>
        <p className="text-sm text-[#52525B] mt-1">
          Discover creators, buy tokens, and join communities
        </p>
        {error && (
          <p className="text-xs text-[#F97316] mt-2 border border-[#F97316]/30 px-3 py-1.5 inline-block">
            ⚠ {error}
          </p>
        )}
      </motion.div>

      {/* Search + Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, tokens..."
              className="w-full bg-[#111113] border-2 border-[#27272A] pl-11 pr-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 border-2 border-[#27272A] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all bg-[#111113]">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Sort Tabs */}
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                sortBy === option.value
                  ? 'border-[#6D28FF] text-[#6D28FF] bg-[#6D28FF]/5'
                  : 'border-[#27272A] text-[#52525B] hover:text-[#A1A1AA] hover:border-[#6D28FF]'
              }`}
            >
              <option.icon className="h-3.5 w-3.5" />
              {option.label}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                selectedCategory === cat.value
                  ? 'border-[#F5F5F5] text-[#F5F5F5] bg-[#18181B]'
                  : 'border-[#1E1E22] text-[#52525B] hover:text-[#A1A1AA] hover:border-[#27272A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-[#52525B] uppercase tracking-wider">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading creators…
            </span>
          ) : (
            `${filteredCreators.length} creator${filteredCreators.length !== 1 ? 's' : ''}`
          )}
        </span>
      </div>

      {/* Creator Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#111113] border-2 border-[#27272A] h-64 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCreators.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111113] border-2 border-[#27272A] p-16 text-center">
          <p className="text-sm text-[#52525B] font-bold uppercase tracking-wider">
            No creators found
          </p>
          <p className="text-xs text-[#3F3F46] mt-2">
            {error ? 'Backend unavailable — no data to display.' : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}
    </div>
  );
}
