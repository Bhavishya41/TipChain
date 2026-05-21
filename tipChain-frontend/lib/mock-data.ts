// ============================================
// TIPCHAIN — Mock Data
// Realistic data for frontend development
// TODO: Replace with API calls to backend
// ============================================

import type {
  Creator,
  Transaction,
  Supporter,
  DashboardStats,
  ActivityItem,
  ChartDataPoint,
} from './types';

// ---- Chart Data Generator ----
function generateChartData(days: number, basePrice: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const volatility = (Math.random() - 0.45) * basePrice * 0.08;
    price = Math.max(0.001, price + volatility);
    data.push({
      timestamp: now - i * 86400000,
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 50000 + 5000),
    });
  }
  return data;
}

// ---- Creators ----
export const mockCreators: Creator[] = [
  {
    id: 'c1',
    username: 'synthwave_sarah',
    displayName: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    bio: 'Electronic music producer. Creating dark ambient soundscapes and retro-futuristic beats since 2019.',
    category: 'music',
    verified: true,
    socials: {
      twitter: '@synthwavesarah',
      youtube: 'SynthwaveSarah',
      website: 'https://sarahchen.music',
    },
    stats: {
      supporters: 2847,
      totalTips: 12450,
      totalEarnings: 89340,
      weeklyGrowth: 12.4,
    },
    token: {
      id: 't1',
      name: 'SarahCoin',
      symbol: '$SARAH',
      price: 0.0847,
      priceChange24h: 15.3,
      marketCap: 847000,
      totalSupply: 10000000,
      circulatingSupply: 6500000,
      holders: 1243,
      volume24h: 34500,
      chartData: generateChartData(30, 0.065),
      createdAt: '2024-08-15T00:00:00Z',
    },
    joinedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'c2',
    username: 'pixel_mike',
    displayName: 'Mike Torres',
    avatar: '/avatars/mike.jpg',
    bio: 'Digital artist & pixel art enthusiast. Building worlds one pixel at a time. Featured in Art Basel Digital 2024.',
    category: 'art',
    verified: true,
    socials: {
      twitter: '@pixelmike',
      instagram: 'pixel_mike_art',
      website: 'https://pixelmike.art',
    },
    stats: {
      supporters: 4210,
      totalTips: 23100,
      totalEarnings: 156200,
      weeklyGrowth: 8.7,
    },
    token: {
      id: 't2',
      name: 'PixelCoin',
      symbol: '$PIXEL',
      price: 0.1234,
      priceChange24h: -3.2,
      marketCap: 1234000,
      totalSupply: 10000000,
      circulatingSupply: 7800000,
      holders: 2156,
      volume24h: 67800,
      chartData: generateChartData(30, 0.11),
      createdAt: '2024-05-20T00:00:00Z',
    },
    joinedAt: '2024-04-10T00:00:00Z',
  },
  {
    id: 'c3',
    username: 'code_queen',
    displayName: 'Priya Sharma',
    avatar: '/avatars/priya.jpg',
    bio: 'Teaching millions to code. Solidity, Rust, TypeScript. Building the open web, one tutorial at a time.',
    category: 'tech',
    verified: true,
    socials: {
      twitter: '@codequeen',
      youtube: 'CodeQueenPriya',
      website: 'https://codequeen.dev',
    },
    stats: {
      supporters: 8930,
      totalTips: 45600,
      totalEarnings: 312000,
      weeklyGrowth: 22.1,
    },
    token: {
      id: 't3',
      name: 'CodeCoin',
      symbol: '$CODE',
      price: 0.2156,
      priceChange24h: 28.9,
      marketCap: 2156000,
      totalSupply: 10000000,
      circulatingSupply: 5200000,
      holders: 4520,
      volume24h: 123400,
      chartData: generateChartData(30, 0.15),
      createdAt: '2024-03-01T00:00:00Z',
    },
    joinedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'c4',
    username: 'laugh_factory',
    displayName: 'Jordan Blake',
    avatar: '/avatars/jordan.jpg',
    bio: 'Stand-up comedy meets the internet. 2M followers laughing along. New special dropping Q1 2025.',
    category: 'comedy',
    verified: false,
    socials: {
      twitter: '@jordanblakecomedy',
      youtube: 'JordanBlakeLive',
    },
    stats: {
      supporters: 1567,
      totalTips: 8900,
      totalEarnings: 67800,
      weeklyGrowth: -2.3,
    },
    token: {
      id: 't4',
      name: 'LaughCoin',
      symbol: '$LAUGH',
      price: 0.0423,
      priceChange24h: -5.8,
      marketCap: 423000,
      totalSupply: 10000000,
      circulatingSupply: 8900000,
      holders: 876,
      volume24h: 12300,
      chartData: generateChartData(30, 0.05),
      createdAt: '2024-09-10T00:00:00Z',
    },
    joinedAt: '2024-08-20T00:00:00Z',
  },
  {
    id: 'c5',
    username: 'gamer_nova',
    displayName: 'Nova Kim',
    avatar: '/avatars/nova.jpg',
    bio: 'Pro gamer turned content creator. Valorant, CS2, and indie gems. Let\'s play.',
    category: 'gaming',
    verified: true,
    socials: {
      twitter: '@gamernova',
      youtube: 'NovaGaming',
    },
    stats: {
      supporters: 6230,
      totalTips: 34200,
      totalEarnings: 234500,
      weeklyGrowth: 5.6,
    },
    token: {
      id: 't5',
      name: 'NovaCoin',
      symbol: '$NOVA',
      price: 0.1678,
      priceChange24h: 7.4,
      marketCap: 1678000,
      totalSupply: 10000000,
      circulatingSupply: 6100000,
      holders: 3456,
      volume24h: 89100,
      chartData: generateChartData(30, 0.14),
      createdAt: '2024-04-15T00:00:00Z',
    },
    joinedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'c6',
    username: 'fit_marcus',
    displayName: 'Marcus Johnson',
    avatar: '/avatars/marcus.jpg',
    bio: 'Certified personal trainer. Calisthenics, nutrition, mindset. Transform your body and mind.',
    category: 'fitness',
    verified: false,
    socials: {
      twitter: '@fitmarcus',
      instagram: 'fit_marcus',
      youtube: 'FitMarcus',
    },
    stats: {
      supporters: 3120,
      totalTips: 15600,
      totalEarnings: 98700,
      weeklyGrowth: 11.2,
    },
    token: {
      id: 't6',
      name: 'FitCoin',
      symbol: '$FIT',
      price: 0.0567,
      priceChange24h: 4.1,
      marketCap: 567000,
      totalSupply: 10000000,
      circulatingSupply: 7200000,
      holders: 1678,
      volume24h: 23400,
      chartData: generateChartData(30, 0.045),
      createdAt: '2024-07-01T00:00:00Z',
    },
    joinedAt: '2024-06-15T00:00:00Z',
  },
];

// ---- Dashboard Stats ----
export const mockDashboardStats: DashboardStats = {
  totalEarnings: 89340,
  earningsChange: 12.4,
  totalSupporters: 2847,
  supportersChange: 8.2,
  tokenPrice: 0.0847,
  tokenPriceChange: 15.3,
  totalTransactions: 12450,
  transactionsChange: 5.7,
};

// ---- Recent Transactions ----
export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'tip',
    from: { username: 'alex_web3', avatar: '/avatars/alex.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 25.5,
    timestamp: '2024-11-15T14:30:00Z',
    txHash: '0x1a2b3c4d5e6f...',
  },
  {
    id: 'tx2',
    type: 'buy',
    from: { username: 'defi_dave', avatar: '/avatars/dave.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 150,
    tokenSymbol: '$SARAH',
    tokenAmount: 1770,
    timestamp: '2024-11-15T13:15:00Z',
    txHash: '0x7a8b9c0d1e2f...',
  },
  {
    id: 'tx3',
    type: 'tip',
    from: { username: 'music_lover99', avatar: '/avatars/generic.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 10,
    timestamp: '2024-11-15T12:00:00Z',
    txHash: '0x3c4d5e6f7a8b...',
  },
  {
    id: 'tx4',
    type: 'sell',
    from: { username: 'whale_watcher', avatar: '/avatars/generic.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 500,
    tokenSymbol: '$SARAH',
    tokenAmount: 5900,
    timestamp: '2024-11-15T10:45:00Z',
    txHash: '0x9c0d1e2f3a4b...',
  },
  {
    id: 'tx5',
    type: 'tip',
    from: { username: 'night_owl', avatar: '/avatars/generic.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 5,
    timestamp: '2024-11-14T23:30:00Z',
    txHash: '0x5e6f7a8b9c0d...',
  },
  {
    id: 'tx6',
    type: 'buy',
    from: { username: 'crypto_cat', avatar: '/avatars/generic.jpg' },
    to: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' },
    amount: 75,
    tokenSymbol: '$SARAH',
    tokenAmount: 885,
    timestamp: '2024-11-14T20:00:00Z',
    txHash: '0x1e2f3a4b5c6d...',
  },
];

// ---- Supporters ----
export const mockSupporters: Supporter[] = [
  { id: 's1', username: 'defi_dave', avatar: '/avatars/dave.jpg', totalTipped: 2340, tokensHeld: 45000, rank: 1, since: '2024-06-15T00:00:00Z' },
  { id: 's2', username: 'alex_web3', avatar: '/avatars/alex.jpg', totalTipped: 1890, tokensHeld: 32000, rank: 2, since: '2024-07-01T00:00:00Z' },
  { id: 's3', username: 'crypto_cat', avatar: '/avatars/generic.jpg', totalTipped: 1450, tokensHeld: 28000, rank: 3, since: '2024-06-20T00:00:00Z' },
  { id: 's4', username: 'whale_watcher', avatar: '/avatars/generic.jpg', totalTipped: 1200, tokensHeld: 21000, rank: 4, since: '2024-08-01T00:00:00Z' },
  { id: 's5', username: 'music_lover99', avatar: '/avatars/generic.jpg', totalTipped: 890, tokensHeld: 15000, rank: 5, since: '2024-09-10T00:00:00Z' },
  { id: 's6', username: 'night_owl', avatar: '/avatars/generic.jpg', totalTipped: 670, tokensHeld: 12000, rank: 6, since: '2024-08-15T00:00:00Z' },
  { id: 's7', username: 'pixel_collector', avatar: '/avatars/generic.jpg', totalTipped: 450, tokensHeld: 8500, rank: 7, since: '2024-10-01T00:00:00Z' },
  { id: 's8', username: 'anon_tipper', avatar: '/avatars/generic.jpg', totalTipped: 320, tokensHeld: 6000, rank: 8, since: '2024-10-15T00:00:00Z' },
];

// ---- Activity Feed ----
export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'tip', user: { username: 'alex_web3', avatar: '/avatars/alex.jpg' }, message: 'tipped 25.5 USDC', amount: 25.5, timestamp: '2024-11-15T14:30:00Z' },
  { id: 'a2', type: 'buy', user: { username: 'defi_dave', avatar: '/avatars/dave.jpg' }, message: 'bought 1,770 $SARAH', amount: 150, tokenSymbol: '$SARAH', timestamp: '2024-11-15T13:15:00Z' },
  { id: 'a3', type: 'milestone', user: { username: 'synthwave_sarah', avatar: '/avatars/sarah.jpg' }, message: 'reached 2,500 supporters 🎉', timestamp: '2024-11-15T12:00:00Z' },
  { id: 'a4', type: 'tip', user: { username: 'music_lover99', avatar: '/avatars/generic.jpg' }, message: 'tipped 10 USDC', amount: 10, timestamp: '2024-11-15T11:30:00Z' },
  { id: 'a5', type: 'sell', user: { username: 'whale_watcher', avatar: '/avatars/generic.jpg' }, message: 'sold 5,900 $SARAH', amount: 500, tokenSymbol: '$SARAH', timestamp: '2024-11-15T10:45:00Z' },
  { id: 'a6', type: 'comment', user: { username: 'night_owl', avatar: '/avatars/generic.jpg' }, message: 'Love the new album drop! 🔥', timestamp: '2024-11-14T23:30:00Z' },
  { id: 'a7', type: 'buy', user: { username: 'crypto_cat', avatar: '/avatars/generic.jpg' }, message: 'bought 885 $SARAH', amount: 75, tokenSymbol: '$SARAH', timestamp: '2024-11-14T20:00:00Z' },
  { id: 'a8', type: 'tip', user: { username: 'pixel_collector', avatar: '/avatars/generic.jpg' }, message: 'tipped 15 USDC', amount: 15, timestamp: '2024-11-14T18:00:00Z' },
];

// ---- Helpers ----
export function getCreatorByUsername(username: string): Creator | undefined {
  return mockCreators.find((c) => c.username === username);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toFixed(2)}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
