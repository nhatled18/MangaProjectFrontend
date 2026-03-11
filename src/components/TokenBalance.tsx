import React, { useState, useEffect } from 'react';
import { tokenService } from '@/services/tokenService';

interface TokenBalanceProps {
  onOpenShop?: () => void;
  className?: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ onOpenShop, className = '' }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
    
    // Listen for global balance updates
    const handleUpdate = (e: any) => {
      if (e.detail?.balance !== undefined) {
        setBalance(e.detail.balance);
      } else {
        loadBalance();
      }
    };

    window.addEventListener('tokenBalanceUpdated', handleUpdate);

    // Refresh balance mỗi 30 giây
    const interval = setInterval(loadBalance, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('tokenBalanceUpdated', handleUpdate);
    };
  }, []);

  const loadBalance = async () => {
    try {
      const tokenBalance = await tokenService.getTokenBalance();
      setBalance(tokenBalance);
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onOpenShop}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors ${className}`}
    >
      <span className="text-xl">⭐</span>
      <span>{loading ? '...' : balance}</span>
    </button>
  );
};

export default TokenBalance;
