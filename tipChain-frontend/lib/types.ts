// ============================================
// TIPCHAIN — TypeScript Interfaces
// ============================================

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  category: CreatorCategory;
  verified: boolean;
  socials: {
    twitter?: string;
    youtube?: string;
    instagram?: string;
    website?: string;
  };
  stats: CreatorStats;
  token: Token;
  joinedAt: string;
}

export interface CreatorStats {
  supporters: number;
  totalTips: number;
  totalEarnings: number;
  weeklyGrowth: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  totalSupply: number;
  circulatingSupply: number;
  holders: number;
  volume24h: number;
  chartData: ChartDataPoint[];
  createdAt: string;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Transaction {
  id: string;
  type: 'tip' | 'buy' | 'sell' | 'launch';
  from: {
    username: string;
    avatar: string;
  };
  to: {
    username: string;
    avatar: string;
  };
  amount: number;
  tokenSymbol?: string;
  tokenAmount?: number;
  timestamp: string;
  txHash: string;
}

export interface Supporter {
  id: string;
  username: string;
  avatar: string;
  totalTipped: number;
  tokensHeld: number;
  rank: number;
  since: string;
}

export interface DashboardStats {
  totalEarnings: number;
  earningsChange: number;
  totalSupporters: number;
  supportersChange: number;
  tokenPrice: number;
  tokenPriceChange: number;
  totalTransactions: number;
  transactionsChange: number;
}

export interface LaunchTokenForm {
  creatorName: string;
  tokenName: string;
  tokenSymbol: string;
  description: string;
  totalSupply: number;
  initialPrice: number;
  category: CreatorCategory;
  avatar: File | null;
  banner: File | null;
  twitter: string;
  youtube: string;
  website: string;
}

export type CreatorCategory =
  | 'music'
  | 'art'
  | 'gaming'
  | 'tech'
  | 'comedy'
  | 'education'
  | 'fitness'
  | 'cooking'
  | 'fashion'
  | 'other';

export interface MarketplaceFilters {
  search: string;
  category: CreatorCategory | 'all';
  sortBy: 'trending' | 'recent' | 'top-tipped' | 'market-cap';
  priceRange: [number, number];
}

export interface ActivityItem {
  id: string;
  type: 'tip' | 'buy' | 'sell' | 'comment' | 'milestone';
  user: {
    username: string;
    avatar: string;
  };
  message: string;
  amount?: number;
  tokenSymbol?: string;
  timestamp: string;
}
