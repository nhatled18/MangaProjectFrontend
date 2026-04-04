export interface Anime {
  id: string;
  title: string;
  image: string;
  description: string;
  episodeCount: number;
  currentEpisode: string;
  rating: number;
  viewCount: number;
  type: string;
  status: string;
  category: string | string[];
  slug?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  token_balance?: number;
  role?: string;
}

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  description: string;
  duration: number;
  releaseDate: string;
}
// Token System Types
export interface TokenPackage {
  tokens: number;
  price: number;
  pricePerToken: number;
}

export interface TokenTransaction {
  id: number;
  userId: number;
  amount: number;
  type: 'purchase' | 'unlock' | 'refund' | 'admin';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChapterUnlock {
  id: number;
  userId: number;
  chapterId: number;
  tokensSpent: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  tokensSpent: number;
  tokensPurchased?: number;
  chaptersUnlocked: number;
}

export interface UserStatistics {
  userId: number;
  username: string;
  totalTokensSpent: string;
  chaptersUnlocked: number;
  rank?: number | string;
}