import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, QrCode, Copy, CheckCheck, ShieldCheck, Loader2, Wifi } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BankTransferModalProps {
  isOpen: boolean;
  amount: number;   // số token
  price: number;    // giá tiền VND
  onClose: () => void;
  onSuccess: (newBalance?: number) => void;
}

type ModalState = 'loading' | 'qr' | 'success' | 'error';

const BankTransferModal: React.FC<BankTransferModalProps> = ({ isOpen, amount, price, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [modalState, setModalState] = useState<ModalState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Payment data từ server
  const [shortCode, setShortCode] = useState('');
  const [transferContent, setTransferContent] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [tokensAdded, setTokensAdded] = useState(0);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  // ─── Tạo Payment Request ────────────────────────────────────────────────
  const createPayment = useCallback(async () => {
    if (!user) return;
    setModalState('loading');
    setErrorMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/shop/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ amount, price }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== 'success') {
        throw new Error(json.message || 'Không tạo được payment request');
      }
      const { shortCode: sc, transferContent: tc } = json.data;
      setShortCode(sc);
      setTransferContent(tc);
      //const qr = `https://qr.sepay.vn/img?acc=09172194820&bank=TPBank&amount=${price}&des=${encodeURIComponent(tc)}&t=${Date.now()}`;
      const qr = `https://qr.sepay.vn/img?acc=21483301&bank=ACB&amount=${price}&des=${encodeURIComponent(tc)}&t=${Date.now()}`;
      setQrUrl(qr);
      setModalState('qr');
    } catch (e: any) {
      setErrorMessage(e.message || 'Lỗi không xác định');
      setModalState('error');
    }
  }, [user, amount, price]);

  // ─── Polling kiểm tra thanh toán ────────────────────────────────────────
  const startPolling = useCallback((sc: string) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/shop/check-payment/${sc}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await res.json();
        if (json.status === 'success' && json.data.paymentStatus === 'completed') {
          stopPolling();
          setTokensAdded(json.data.tokensAdded);
          setModalState('success');
          onSuccess(json.data.tokenBalance);
        }
      } catch {
        // Bỏ qua lỗi mạng tạm thời, tiếp tục poll
      }
    }, 3000); // poll mỗi 3 giây

    // Timeout sau 10 phút
    timeoutRef.current = setTimeout(() => {
      stopPolling();
    }, 10 * 60 * 1000);
  }, [stopPolling, onSuccess]);

  // ─── Lifecycle ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setModalState('loading');
      setShortCode('');
      setTransferContent('');
      setQrUrl('');
      setTokensAdded(0);
      createPayment();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [isOpen]); // eslint-disable-line

  useEffect(() => {
    if (modalState === 'qr' && shortCode) {
      startPolling(shortCode);
    }
    if (modalState !== 'qr') {
      stopPolling();
    }
  }, [modalState, shortCode]); // eslint-disable-line

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4 overflow-y-auto"
      onClick={modalState === 'qr' ? undefined : onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden my-auto relative"
        style={{ animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
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

        {/* ── Loading State ── */}
        {modalState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-gray-500 text-sm">Đang tạo mã thanh toán...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {modalState === 'error' && (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-4 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <X size={28} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800">Có lỗi xảy ra</h3>
            <p className="text-gray-500 text-sm">{errorMessage}</p>
            <button
              onClick={createPayment}
              className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* ── QR State ── */}
        {modalState === 'qr' && (
          <>
            <div className="px-5 py-5 space-y-4">
              {/* Summary */}
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

              {/* QR */}
              <div className="bg-white border-2 border-blue-50 rounded-2xl p-2 shadow-md flex flex-col items-center gap-2">
                <img
                  src={qrUrl}
                  alt="QR Code VietQR"
                  className="w-full h-auto max-h-[380px] object-contain rounded-xl"
                />
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 pb-1">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span>THANH TOÁN AN TOÀN QUA VIETQR</span>
                </div>
              </div>

              {/* Nội dung CK */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-amber-700 uppercase mb-0.5">Nội dung chuyển khoản</p>
                  <p className="font-mono font-bold text-gray-800 truncate text-sm">{transferContent}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  className={`p-2 rounded-lg ml-2 transition-all flex-shrink-0 ${
                    copied === 'content' ? 'bg-green-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {copied === 'content' ? <CheckCheck size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {/* Polling indicator */}
              <div className="flex items-center gap-3 text-[11px] text-gray-500 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                <Wifi size={16} className="text-blue-500 flex-shrink-0 animate-pulse" />
                <p className="leading-tight">
                  Hệ thống đang <strong className="text-blue-600">tự động theo dõi</strong> giao dịch. Token sẽ được cộng ngay khi tiền vào.
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
        )}

        {/* ── Success State ── */}
        {modalState === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCheck size={38} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Nạp thành công! 🎉</h3>
              <p className="text-green-600 font-extrabold text-2xl mb-1">+{tokensAdded.toLocaleString()} Token</p>
              <p className="text-gray-500 text-sm">Token đã được cộng vào tài khoản của bạn.</p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Tuyệt vời!
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BankTransferModal;
