import React, { useState } from 'react';
import { X, QrCode, Copy, CheckCheck, Clock } from 'lucide-react';

interface VNPayCheckoutProps {
  isOpen: boolean;
  amount: number;   // số token
  price: number;    // giá tiền VND
  onClose: () => void;
  onSuccess: () => void;
}

const VNPayCheckout: React.FC<VNPayCheckoutProps> = ({ isOpen, amount, price, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  // Lấy username hiện tại từ localStorage
  const rawUser = localStorage.getItem('user');
  const username: string = rawUser ? (JSON.parse(rawUser)?.username ?? '') : '';

  // Nội dung chuyển khoản đúng định dạng
  const transferContent = `NAPTK ${username}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: 'fadeInScale 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-800">Thanh Toán Chuyển Khoản</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Gói đã chọn */}
          <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Gói token</p>
              <p className="font-bold text-gray-800 text-lg">{amount.toLocaleString()} Token</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Số tiền CK</p>
              <p className="font-bold text-blue-600 text-lg">{price.toLocaleString()}đ</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="border-2 border-blue-100 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/QR_Code.jpg"
                alt="QR Code ngân hàng"
                className="w-56 h-56 object-cover"
              />
            </div>
            <p className="text-xs text-gray-400">Quét mã để chuyển khoản nhanh</p>
          </div>

          {/* Hướng dẫn nội dung CK */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1">
              ⚠️ Ghi đúng nội dung chuyển khoản
            </p>

            {/* Số tiền */}
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
              <div>
                <p className="text-[10px] text-gray-400">Số tiền</p>
                <p className="font-bold text-gray-800">{price.toLocaleString()}đ</p>
              </div>
              <button
                onClick={() => copyToClipboard(String(price), 'price')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Sao chép"
              >
                {copied === 'price' ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Nội dung CK */}
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
              <div>
                <p className="text-[10px] text-gray-400">Nội dung CK</p>
                <p className="font-bold text-gray-800 font-mono">{transferContent}</p>
              </div>
              <button
                onClick={() => copyToClipboard(transferContent, 'content')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Sao chép"
              >
                {copied === 'content' ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Tự động */}
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-green-50 rounded-xl px-3 py-2 border border-green-100">
            <Clock size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>
              Token sẽ được cộng <strong className="text-green-700">tự động</strong> ngay sau khi hệ thống nhận được giao dịch.
              Thường trong vòng <strong>1–2 phút</strong>.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors text-sm"
          >
            Đóng
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VNPayCheckout;
