import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TokenBalanceProps {
  onOpenShop?: () => void;
  className?: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ onOpenShop, className = '' }) => {
  const { user } = useAuth();

  return (
    <button
      onClick={onOpenShop}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors ${className}`}
    >
      <span className="text-xl">⭐</span>
      <span>{user?.token_balance ?? 0}</span>
    </button>
  );
};

export default TokenBalance;