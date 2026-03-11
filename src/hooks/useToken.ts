import { useState, useCallback, useEffect } from 'react';
import { tokenService } from '@/services/tokenService';
import { LeaderboardEntry, TokenTransaction } from '@/types';

export const useTokenBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const newBalance = await tokenService.getTokenBalance();
      setBalance(newBalance);
      return newBalance;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải số dư');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, []);

  return { balance, loading, error, refreshBalance };
};

export const useChapterUnlock = (chapterId: number) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const checkUnlock = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const unlocked = await tokenService.checkChapterUnlock(chapterId);
      setIsUnlocked(unlocked);
      return unlocked;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kiểm tra khóa');
      return false;
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  const unlock = useCallback(async (cost?: number) => {
    setLoading(true);
    setError('');
    try {
      const result = await tokenService.unlockChapter(chapterId, cost);
      setIsUnlocked(true);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi mở khóa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    checkUnlock();
  }, [chapterId]);

  return { isUnlocked, loading, error, checkUnlock, unlock };
};

export const useLeaderboard = (limit: number = 50) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadLeaderboard = useCallback(async (offset: number = 0) => {
    setLoading(true);
    setError('');
    try {
      const { entries, total } = await tokenService.getLeaderboard(limit, offset);
      setEntries(entries);
      setTotal(total);
      return { entries, total };
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải bảng xếp hạng');
      return { entries: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadLeaderboard();
  }, [limit]);

  return { entries, total, loading, error, loadLeaderboard };
};

export const useUserRank = () => {
  const [rank, setRank] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadRank = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userRank = await tokenService.getMyRank();
      setRank(userRank);
      return userRank;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải xếp hạng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRank();
  }, []);

  return { rank, loading, error, loadRank };
};

export const useTransactionHistory = (limit: number = 50) => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const txs = await tokenService.getTransactionHistory(limit);
      setTransactions(txs);
      return txs;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải lịch sử');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadTransactions();
  }, [limit]);

  return { transactions, loading, error, loadTransactions };
};
