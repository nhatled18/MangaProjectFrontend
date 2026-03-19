import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { tokenService } from '@/services/tokenService';

interface PaymentModalProps {
  isOpen: boolean;
  transactionId: number;
  amount: number;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  transactionId,
  amount,
  price,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        setError('Vui lòng điền đầy đủ thông tin thẻ');
        setLoading(false);
        return;
      }

      // Mock external transaction ID từ payment gateway
      const externalTransactionId = `mock_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Gọi API confirm purchase
      await tokenService.confirmPurchase(
        transactionId,
        externalTransactionId
      );

      // Reset form
      setCardNumber('');
      setCardHolder('');
      setExpiry('');
      setCvv('');

      // Notify success
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Thanh Toán</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Số lượng Token:</span>
            <span className="font-semibold text-blue-600">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tổng tiền:</span>
            <span className="font-bold text-lg text-gray-800">
              {price.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số Thẻ
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 16) setCardNumber(val);
              }}
              placeholder="1234 5678 9012 3456"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Chủ Thẻ
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hết hạn (MM/YY)
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length >= 2) {
                    val = val.substr(0, 2) + '/' + val.substr(2, 2);
                  }
                  if (val.length <= 5) setExpiry(val);
                }}
                placeholder="12/25"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 3) setCvv(val);
                }}
                placeholder="123"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Đây là một demo. Không sử dụng thẻ thực.
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? 'Đang xử lý...' : 'Thanh Toán'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
