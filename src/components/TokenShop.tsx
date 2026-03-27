import React from 'react';
import BankTransferModal from './BankTransferModal';
import TransactionHistory from './TransactionHistory';
import { useTokenShop } from '@/hooks/Usetokenshop';
import {
  TokenHeader,
  TokenTabs,
  TokenPackagesGrid,
  TokenInfo,
  StatusMessages,
} from './tokensop.components';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TokenShopProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

// ─── TokenShop ────────────────────────────────────────────────────────────────

const TokenShop: React.FC<TokenShopProps> = ({ onClose, onSuccess }) => {
  const {
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
  } = useTokenShop(onSuccess);

  return (
    <div className="token-shop bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-gray-800">

      {/* Payment Modal */}
      {selectedPackage && (
        <BankTransferModal
          isOpen={paymentModalOpen}
          amount={selectedPackage.tokens}
          price={selectedPackage.price}
          onClose={handleClosePayment}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <TokenHeader tokenBalance={tokenBalance} />

      <StatusMessages error={error} success={success} />

      <TokenTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'shop' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TokenPackagesGrid
              packages={packages}
              selectedPackage={selectedPackage}
              loading={loading}
              onSelect={handleSelectPackage}
              onPurchase={handlePurchase}
            />
          </div>
          <TokenInfo />
        </>
      ) : (
        <TransactionHistory />
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-6 w-full text-gray-400 hover:text-gray-600 py-2 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 uppercase tracking-widest"
        >
          Quay lại trang chính
        </button>
      )}
    </div>
  );
};

export default TokenShop;
