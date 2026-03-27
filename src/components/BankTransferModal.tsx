import React from 'react';
import { QrCode, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBankTransfer } from '@/hooks/UseBankTransfer';
import { LoadingView, ErrorView, QRSection, SuccessView } from './BankTransferModalviews';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BankTransferModalProps {
  isOpen: boolean;
  amount: number;  // số token
  price: number;   // giá tiền VND
  onClose: () => void;
  onSuccess: (newBalance?: number) => void;
}

// ─── Modal Shell ─────────────────────────────────────────────────────────────

interface ModalShellProps {
  onClose: () => void;
  /** Prevent backdrop click while QR is showing (user might accidentally close) */
  disableBackdropClose?: boolean;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ onClose, disableBackdropClose, children }) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4 overflow-y-auto"
    onClick={disableBackdropClose ? undefined : onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden my-auto relative"
      style={{ animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>

    <style>{`
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  </div>
);

// ─── Modal Header ─────────────────────────────────────────────────────────────

interface ModalHeaderProps {
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2 text-white">
      <QrCode size={22} />
      <h2 className="text-lg font-bold">Nạp Token qua VietQR</h2>
    </div>
    <button
      onClick={onClose}
      className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full"
    >
      <X size={20} />
    </button>
  </div>
);

// ─── BankTransferModal ────────────────────────────────────────────────────────

const BankTransferModal: React.FC<BankTransferModalProps> = ({
  isOpen,
  amount,
  price,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();

  const { modalState, errorMessage, paymentData, tokensAdded, retryPayment } = useBankTransfer({
    isOpen,
    amount,
    price,
    userId: user?.id,
    onSuccess,
  });

  if (!isOpen) return null;

  return (
    <ModalShell onClose={onClose} disableBackdropClose={modalState === 'qr'}>
      <ModalHeader onClose={onClose} />

      {modalState === 'loading' && <LoadingView />}

      {modalState === 'error' && (
        <ErrorView message={errorMessage} onRetry={retryPayment} />
      )}

      {modalState === 'qr' && paymentData && (
        <QRSection
          amount={amount}
          price={price}
          paymentData={paymentData}
          onClose={onClose}
        />
      )}

      {modalState === 'success' && (
        <SuccessView tokensAdded={tokensAdded} onClose={onClose} />
      )}
    </ModalShell>
  );
};

export default BankTransferModal;