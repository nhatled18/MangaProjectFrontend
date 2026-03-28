import { TokenPackage, TokenTransaction, LeaderboardEntry, UserStatistics } from '@/types';
import apiClient from './api';

export const tokenService = {
  // ============ SHOP ENDPOINTS ============
  
  getTokenPackages: async (): Promise<TokenPackage[]> => {
    try {
      const response = await apiClient.get('/shop/packages');
      return response.data.data.packages || [];
    } catch {
      return [];
    }
  },

  getTokenBalance: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/shop/balance');
      return response.data.data.tokenBalance || 0;
    } catch {
      return 0;
    }
  },

  purchaseToken: async (amount: number, paymentMethod: string = 'credit_card') => {
    try {
      const response = await apiClient.post('/shop/purchase-token', { amount, paymentMethod });
      
      if (response.data?.status === 'success' && response.data?.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      if (error.response?.status === 401) throw new Error('Unauthorized - Please login first');
      if (error.response?.status === 422) throw new Error('Validation Error');
      if (!error.response) throw new Error('Cannot connect to backend');
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  confirmPurchase: async (transactionId: number, externalTransactionId: string) => {
    const response = await apiClient.post(`/shop/confirm-purchase/${transactionId}`, {
      externalTransactionId,
    });
    return response.data.data;
  },

  getTransactionHistory: async (limit: number = 50): Promise<TokenTransaction[]> => {
    try {
      const response = await apiClient.get('/shop/transaction-history', {
        params: { limit },
      });
      return response.data.data.transactions || [];
    } catch {
      return [];
    }
  },

  manualConfirm: async (amount: number, price: number) => {
    try {
      const response = await apiClient.post('/shop/manual-confirm', { amount, price });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi thông báo. Vui lòng thử lại.');
    }
  },

  // ============ UNLOCK ENDPOINTS ============

  checkChapterUnlock: async (chapterId: number): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/unlock/chapter/${chapterId}/check`);
      return response.data.data.isUnlocked || false;
    } catch {
      return false;
    }
  },

  unlockChapter: async (chapterId: number, cost?: number) => {
    const response = await apiClient.post(`/unlock/chapter/${chapterId}`, cost ? { cost } : {});
    return response.data.data;
  },

  getMyUnlocks: async (limit: number = 100, offset: number = 0): Promise<any[]> => {
    try {
      const response = await apiClient.get('/unlock/my-unlocks', {
        params: { limit, offset },
      });
      return response.data.data.unlocks || [];
    } catch {
      return [];
    }
  },

  getUnlockedChaptersForAnime: async (animeId: number): Promise<number[]> => {
    try {
      const response = await apiClient.get(`/unlock/anime/${animeId}/unlocked-chapters`);
      return response.data.data.unlockedChapterIds || [];
    } catch {
      return [];
    }
  },

  // ============ LEADERBOARD ENDPOINTS ============

  getLeaderboard: async (limit: number = 50, offset: number = 0): Promise<{ entries: LeaderboardEntry[], total: number }> => {
    try {
      const response = await apiClient.get('/leaderboard', {
        params: { limit, offset },
      });
      return {
        entries: response.data.data.leaderboard || [],
        total: response.data.data.pagination?.total || 0,
      };
    } catch {
      return { entries: [], total: 0 };
    }
  },

  getTopLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await apiClient.get('/leaderboard/top');
      return response.data.data.top || [];
    } catch {
      return [];
    }
  },

  getMonthlyTopPurchases: async (limit: number = 10): Promise<any[]> => {
    try {
      const response = await apiClient.get('/leaderboard/top-purchases-month', {
        params: { limit }
      });
      return response.data.data.top || [];
    } catch {
      return [];
    }
  },

  getMyRank: async (): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get('/leaderboard/me');
      return response.data.data || null;
    } catch {
      return null;
    }
  },

  getUserRank: async (userId: number): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get(`/leaderboard/user/${userId}`);
      return response.data.data || null;
    } catch {
      return null;
    }
  },

  getUserStats: async (userId: number): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get(`/leaderboard/stats/${userId}`);
      return response.data.data || null;
    } catch {
      return null;
    }
  },
};

export default tokenService;
