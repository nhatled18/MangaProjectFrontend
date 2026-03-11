import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, Copy, CheckCheck, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { tokenService } from '@/services/tokenService';

interface BankTransferModalProps {
  isOpen: boolean;
  amount: number;   // số token
  price: number;    // giá tiền VND
  onClose: () => void;
  onSuccess: () => void;
}

const BankTransferModal: React.FC<BankTransferModalProps> = ({ isOpen, amount, price, onClose, onSuccess }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const pollingInterval = useRef<any>(null);

  // Lấy username hiện tại từ localStorage
  const rawUser = localStorage.getItem('user');
  const userObj = rawUser ? JSON.parse(rawUser) : null;
  const username: string = userObj?.username ?? '';

  // Nội dung chuyển khoản đúng định dạng
  const transferContent = `NAPTK ${username}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Khởi tạo balance ban đầu để so sánh
  useEffect(() => {
    if (isOpen) {
      tokenService.getTokenBalance().then(balance => {
        setInitialBalance(balance);
      });

      // Bắt đầu polling mỗi 5 giây
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [isOpen]);

  const startPolling = () => {
    stopPolling();
    pollingInterval.current = setInterval(checkBalance, 5000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const checkBalance = async () => {
    if (!isOpen) return;
    
    setChecking(true);
    try {
      const currentBalance = await tokenService.getTokenBalance();
      if (initialBalance !== null && currentBalance > initialBalance) {
        // Tokens added!
        window.dispatchEvent(new CustomEvent('tokenBalanceUpdated', { detail: { balance: currentBalance } }));
        stopPolling();
        onSuccess();
      }
    } catch (err) {
      console.error('Error polling balance:', err);
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden my-auto"
        style={{ animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <QrCode size={22} />
            <h2 className="text-lg font-bold">Thanh Toán Chuyển Khoản</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">Gói Token</p>
              <p className="font-extrabold text-blue-600 text-xl">{amount.toLocaleString()} Token</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">Số tiền CK</p>
              <p className="font-extrabold text-gray-800 text-xl">{price.toLocaleString()}đ</p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative group">
            <div className="bg-white border-2 border-blue-50 rounded-2xl p-3 shadow-md flex flex-col items-center gap-2 transition-transform hover:scale-[1.02]">
              <img
                src={`https://qr.sepay.vn/img?acc=09172194820&bank=TPBank&amount=${price}&des=NAPTK%20${username}`}
                alt="QR Code ngân hàng"
                className="w-full h-auto max-h-[420px] object-contain rounded-xl shadow-sm border border-gray-100"
              />
              <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                <ShieldCheck size={12} className="text-green-500" />
                <span>Thanh toán tự động qua VietQR</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
              <AlertCircle size={14} />
              <span>GHI ĐÚNG NỘI DUNG CHUYỂN KHOẢN</span>
            </div>

            {/* Content Field */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-amber-700/60 uppercase mb-0.5">Nội dung chuyển khoản</p>
                <p className="font-mono font-bold text-gray-800 text-base">{transferContent}</p>
              </div>
              <button
                onClick={() => copyToClipboard(transferContent, 'content')}
                className={`p-2 rounded-lg transition-all ${
                  copied === 'content' ? 'bg-green-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-100 border border-amber-200 shadow-sm'
                }`}
              >
                {copied === 'content' ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {/* Price Field */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-700/60 uppercase mb-0.5">Số tiền chính xác</p>
                <p className="font-bold text-gray-800 text-base">{price.toLocaleString()} đ</p>
              </div>
              <button
                onClick={() => copyToClipboard(String(price), 'price')}
                className={`p-2 rounded-lg transition-all ${
                  copied === 'price' ? 'bg-green-500 text-white' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-100 shadow-sm'
                }`}
              >
                {copied === 'price' ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <div className="flex-shrink-0">
              {checking ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Clock size={16} className="text-blue-500" />
              )}
            </div>
            <p className="leading-relaxed">
              Hệ thống đang chờ giao dịch... 
              <br />
              <span className="font-semibold text-gray-700">Tự động cộng token</span> sau 1-2 phút.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-sm shadow-sm"
          >
            Hủy Giao Dịch
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BankTransferModal;
