import axios from 'axios';
import { TokenPackage, TokenTransaction, LeaderboardEntry, UserStatistics } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add JWT token interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Ensure Content-Type is always set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export const tokenService = {
  // ============ SHOP ENDPOINTS ============
  
  /**
   * Lấy danh sách token packages
   */
  getTokenPackages: async (): Promise<TokenPackage[]> => {
    try {
      const response = await apiClient.get('/shop/packages');
      return response.data.data.packages || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Lấy token balance của user hiện tại
   */
  getTokenBalance: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/shop/balance');
      return response.data.data.tokenBalance || 0;
    } catch (error: any) {
      return 0;
    }
  },

  /**
   * Tạo pending transaction để chuẩn bị mua token
   */
  purchaseToken: async (amount: number, paymentMethod: string = 'credit_card') => {
    try {
      const requestBody = {
        amount,
        paymentMethod,
      };
      
      const response = await apiClient.post('/shop/purchase-token', requestBody);
      
      if (response.data?.status === 'success' && response.data?.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login first');
      } else if (error.response?.status === 422) {
        throw new Error('Validation Error');
      } else if (!error.response) {
        throw new Error(`Cannot connect to backend at ${API_BASE_URL}`);
      } else {
        throw new Error(error.response?.data?.message || error.message);
      }
    }
  },

  /**
   * Xác nhận mua token sau khi thanh toán thành công
   */
  confirmPurchase: async (transactionId: number, externalTransactionId: string) => {
    try {
      const response = await apiClient.post(`/shop/confirm-purchase/${transactionId}`, {
        externalTransactionId,
      });
      
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Lịch sử giao dịch
   */
  getTransactionHistory: async (limit: number = 50): Promise<TokenTransaction[]> => {
    try {
      const response = await apiClient.get('/shop/transaction-history', {
        params: { limit },
      });
      return response.data.data.transactions || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Xác nhận đã chuyển khoản thủ công (VietQR không API)
   */
  manualConfirm: async (amount: number, price: number) => {
    try {
      const response = await apiClient.post('/shop/manual-confirm', {
        amount,
        price,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi thông báo. Vui lòng thử lại.');
    }
  },

  // ============ UNLOCK ENDPOINTS ============

  /**
   * Kiểm tra xem chapter đã unlock chưa
   */
  checkChapterUnlock: async (chapterId: number): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/unlock/chapter/${chapterId}/check`);
      return response.data.data.isUnlocked || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Mở khóa chapter
   */
  unlockChapter: async (chapterId: number, cost?: number) => {
    try {
      const body = cost ? { cost } : {};
      const response = await apiClient.post(`/unlock/chapter/${chapterId}`, body);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách chapters đã unlock của user
   */
  getMyUnlocks: async (limit: number = 100, offset: number = 0): Promise<any[]> => {
    try {
      const response = await apiClient.get('/unlock/my-unlocks', {
        params: { limit, offset },
      });
      return response.data.data.unlocks || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Lấy danh sách chapters đã unlock cho 1 anime
   */
  getUnlockedChaptersForAnime: async (animeId: number): Promise<number[]> => {
    try {
      const response = await apiClient.get(`/unlock/anime/${animeId}/unlocked-chapters`);
      return response.data.data.unlockedChapterIds || [];
    } catch (error) {
      return [];
    }
  },

  // ============ LEADERBOARD ENDPOINTS ============

  /**
   * Lấy leaderboard
   */
  getLeaderboard: async (limit: number = 50, offset: number = 0): Promise<{ entries: LeaderboardEntry[], total: number }> => {
    try {
      const response = await apiClient.get('/leaderboard', {
        params: { limit, offset },
      });
      return {
        entries: response.data.data.leaderboard || [],
        total: response.data.data.pagination?.total || 0,
      };
    } catch (error) {
      return { entries: [], total: 0 };
    }
  },

  /**
   * Lấy top 10 leaderboard
   */
  getTopLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await apiClient.get('/leaderboard/top');
      return response.data.data.top || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Lấy top 10 user mua token nhiều nhất tháng này
   */
  getMonthlyTopPurchases: async (limit: number = 10): Promise<any[]> => {
    try {
      const response = await apiClient.get('/leaderboard/top-purchases-month', {
        params: { limit }
      });
      return response.data.data.top || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Lấy rank của user hiện tại
   */
  getMyRank: async (): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get('/leaderboard/me');
      return response.data.data || null;
    } catch (error: any) {
      return null;
    }
  },

  /**
   * Lấy rank của 1 user
   */
  getUserRank: async (userId: number): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get(`/leaderboard/user/${userId}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Lấy thống kê chi tiết của user
   */
  getUserStats: async (userId: number): Promise<UserStatistics | null> => {
    try {
      const response = await apiClient.get(`/leaderboard/stats/${userId}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },
};
