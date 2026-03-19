import React, { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';
import { useAuth } from '@/hooks/useAuth';
import { TokenPackage } from '@/types';
import BankTransferModal from './BankTransferModal';
import TransactionHistory from './TransactionHistory';
import { ShoppingBag, History as HistoryIcon } from 'lucide-react';

interface TokenShopProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const TokenShop: React.FC<TokenShopProps> = ({ onClose, onSuccess }) => {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const tokenBalance = user?.token_balance ?? 0;
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgs, currentBalance] = await Promise.all([
        tokenService.getTokenPackages(),
        tokenService.getTokenBalance(),
      ]);
      setPackages(pkgs);
      // Sync balance to auth store if it's different
      if (currentBalance !== user?.token_balance) {
        updateUser({ token_balance: currentBalance });
      }
    } catch (err) {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setPaymentModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handlePaymentSuccess = (newBalance?: number) => {
    setPaymentModalOpen(false);
    setSuccess('Thanh toán thành công! Token đã được cộng vào tài khoản.');
    if (newBalance !== undefined) {
      updateUser({ token_balance: newBalance });
    }
    loadData();
    onSuccess?.();
  };

  return (
    <div className="token-shop bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-gray-800">
      {/* QR Payment Modal */}
      {selectedPackage && (
        <BankTransferModal
          isOpen={paymentModalOpen}
          amount={selectedPackage.tokens}
          price={selectedPackage.price}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6 border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Cửa Hàng Token
          </h2>
          <p className="text-gray-500 mt-1 font-medium italic">
            Sự đóng góp của bạn giúp chúng mình có thêm kinh phí duy trì và cập nhật truyện nhanh hơn
          </p>
        </div>
        <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1">Số dư hiện tại</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-700">{tokenBalance.toLocaleString()}</span>
            <span className="text-xs font-bold text-blue-400">TOKEN</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'shop'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag size={18} />
          Gói Token
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <HistoryIcon size={18} />
          Lịch Sử
        </button>
      </div>

      {activeTab === 'shop' ? (
        <>
          {/* Packages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg"></div>
                <p className="mt-4 text-gray-400 font-medium">Đang tải gói token...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                Không có gói token nào khả dụng
              </div>
            ) : (
              packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`group relative border-2 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                    selectedPackage?.tokens === pkg.tokens
                    ? 'border-blue-600 bg-blue-50/50 shadow-xl'
                    : 'border-gray-100 hover:border-blue-300 bg-gray-50 hover:bg-white'
                    }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {selectedPackage?.tokens === pkg.tokens && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-tighter">
                      Đang chọn
                    </div>
                  )}
                  
                  <div className="text-center relative z-10">
                    <div className="text-5xl font-black text-blue-600 mb-1 group-hover:scale-110 transition-transform">
                      {pkg.tokens}
                    </div>
                    <p className="text-[10px] tracking-[0.2em] font-black text-gray-400 uppercase mb-4">Tokens</p>
                    
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <p className="text-2xl font-black text-gray-800">
                        {pkg.price.toLocaleString('vi-VN')}
                      </p>
                      <span className="text-xs font-bold text-gray-500">đ</span>
                    </div>
                    
                    {/* Price per token badge removed */}
    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(pkg);
                      }}
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                        selectedPackage?.tokens === pkg.tokens
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600'
                      } disabled:opacity-50`}
                    >
                      {loading ? 'Đang xử lý...' : 'Mua Ngay'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
    
          {/* Info Section */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="font-extrabold text-white text-lg mb-4 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm">💡</span>
              Đặc quyền của Token:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 relative z-10">
              <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Mở khóa tức thì các chapter mới nhất (trước 7 ngày khi trở thành miễn phí).</span>
              </li>
              <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Sau khi mở khóa, bạn có quyền truy cập vĩnh viễn vào chapter đó.</span>
              </li>
              <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Tích lũy token để thăng hạng trên Bảng Xếp Hạng Fan Cứng.</span>
              </li>
              <li className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Mức giá chỉ 20 token cho một chapter sớm chất lượng cao.</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <TransactionHistory />
      )}

      {/* Close Button */}
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
