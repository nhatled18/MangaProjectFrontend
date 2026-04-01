import { useState, useEffect, useCallback, useRef } from 'react';
import { tokenService } from '@/services/tokenService';
import { useAuth } from '@/hooks/useAuth';
import { TokenPackage } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShopTab = 'shop' | 'history';

export interface UseTokenShopReturn {
  packages: TokenPackage[];
  tokenBalance: number;
  selectedPackage: TokenPackage | null;
  activeTab: ShopTab;
  loading: boolean;
  error: string;
  success: string;
  paymentModalOpen: boolean;
  setActiveTab: (tab: ShopTab) => void;
  handlePurchase: (pkg: TokenPackage) => void;
  handleSelectPackage: (pkg: TokenPackage) => void;
  handlePaymentSuccess: (newBalance?: number) => void;
  handleClosePayment: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTokenShop(onSuccess?: () => void): UseTokenShopReturn {
  const { user, updateUser } = useAuth();

  const [packages, setPackages]                 = useState<TokenPackage[]>([]);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const [success, setSuccess]                   = useState('');
  const [selectedPackage, setSelectedPackage]   = useState<TokenPackage | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab]               = useState<ShopTab>('shop');

  const tokenBalance = user?.token_balance ?? 0;

  const updateUserRef = useRef(updateUser);
  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const pkgs = await tokenService.getTokenPackages();
      setPackages(pkgs);
    } catch {
      setError('Không thể tải danh sách gói token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const handleSelectPackage = useCallback((pkg: TokenPackage) => {
    setSelectedPackage(pkg);
  }, []);

  const handlePurchase = useCallback((pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setPaymentModalOpen(true);
    setError('');
    setSuccess('');
  }, []);

  const handleClosePayment = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  const handlePaymentSuccess = useCallback((newBalance?: number) => {
    setPaymentModalOpen(false);
    setSuccess('Thanh toán thành công! Token đã được cộng vào tài khoản.');
    if (newBalance !== undefined) {
      updateUserRef.current({ token_balance: newBalance });
    }
    onSuccess?.();
  }, [onSuccess]);

  return {
    packages,
    tokenBalance,
    selectedPackage,
    activeTab,
    loading,
    error,
    success,
    paymentModalOpen,
    setActiveTab,
    handlePurchase,
    handleSelectPackage,
    handlePaymentSuccess,
    handleClosePayment,
  };
}
