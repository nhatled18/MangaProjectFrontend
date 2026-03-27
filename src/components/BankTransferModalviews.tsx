import React, { useState } from 'react';
import { X, Copy, CheckCheck, ShieldCheck, Loader2, Wifi } from 'lucide-react';
import type { PaymentData } from '@/hooks/UseBankTransfer';



export const LoadingView: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <Loader2 size={40} className="text-blue-500 animate-spin" />
    <p className="text-gray-500 text-sm">Đang tạo mã thanh toán...</p>
  </div>
);


interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 gap-4 text-center">
    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
      <X size={28} className="text-red-500" />
    </div>
    <h3 className="font-bold text-gray-800">Có lỗi xảy ra</h3>
    <p className="text-gray-500 text-sm">{message}</p>
    <button
      onClick={onRetry}
      className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
    >
      Thử lại
    </button>
  </div>
);


interface SuccessViewProps {
  tokensAdded: number;
  onClose: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ tokensAdded, onClose }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
      <CheckCheck size={38} />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">Nạp thành công! 🎉</h3>
      <p className="text-green-600 font-extrabold text-2xl mb-1">
        +{tokensAdded.toLocaleString()} Token
      </p>
      <p className="text-gray-500 text-sm">Token đã được cộng vào tài khoản của bạn.</p>
    </div>
    <button
      onClick={onClose}
      className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
    >
      Tuyệt vời!
    </button>
  </div>
);

// ─── CopyButton ──────────────────────────────────────────────────────────────

interface CopyButtonProps {
  text: string;
  id: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, id }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isCopied = copiedId === id;

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg ml-2 transition-all flex-shrink-0 ${
        isCopied
          ? 'bg-green-500 text-white'
          : 'bg-white text-amber-600 hover:bg-amber-100 border border-amber-200'
      }`}
    >
      {isCopied ? <CheckCheck size={18} /> : <Copy size={18} />}
    </button>
  );
};

// ─── QRSection ───────────────────────────────────────────────────────────────

interface QRSectionProps {
  amount: number;
  price: number;
  paymentData: PaymentData;
  onClose: () => void;
}

export const QRSection: React.FC<QRSectionProps> = ({ amount, price, paymentData, onClose }) => (
  <>
    <div className="px-5 py-5 space-y-4">
      {/* Order summary */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">Số lượng</p>
          <p className="font-extrabold text-blue-600 text-xl">{amount.toLocaleString()} Token</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">Thanh toán</p>
          <p className="font-extrabold text-gray-800 text-xl">{price.toLocaleString()}đ</p>
        </div>
      </div>

      {/* QR image */}
      <div className="bg-white border-2 border-blue-50 rounded-2xl p-2 shadow-md flex flex-col items-center gap-2">
        <img
          src={paymentData.qrUrl}
          alt="QR Code VietQR"
          className="w-full h-auto max-h-[380px] object-contain rounded-xl"
        />
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 pb-1">
          <ShieldCheck size={12} className="text-green-500" />
          <span>THANH TOÁN AN TOÀN QUA VIETQR</span>
        </div>
      </div>

      {/* Transfer content */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between">
        <div className="overflow-hidden">
          <p className="text-[10px] font-bold text-amber-700 uppercase mb-0.5">Nội dung chuyển khoản</p>
          <p className="font-mono font-bold text-gray-800 truncate text-sm">
            {paymentData.transferContent}
          </p>
        </div>
        <CopyButton text={paymentData.transferContent} id="transfer-content" />
      </div>

      {/* Auto-detect notice */}
      <div className="flex items-center gap-3 text-[11px] text-gray-500 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
        <Wifi size={16} className="text-blue-500 flex-shrink-0 animate-pulse" />
        <p className="leading-tight">
          Hệ thống đang{' '}
          <strong className="text-blue-600">tự động theo dõi</strong> giao dịch. Token sẽ được cộng
          ngay khi tiền vào.
        </p>
      </div>
    </div>

    <div className="px-5 pb-5">
      <button
        onClick={onClose}
        className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold transition-all text-xs uppercase tracking-widest"
      >
        Đóng (token vẫn cộng tự động)
      </button>
    </div>
  </>
);