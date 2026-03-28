import React from 'react';
import { ShoppingBag, History as HistoryIcon } from 'lucide-react';
import { TokenPackage } from '@/types';
import { ShopTab } from '@/hooks/useTokenShop';

// ─── TokenHeader ──────────────────────────────────────────────────────────────

interface TokenHeaderProps {
  tokenBalance: number;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenBalance }) => (
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
);

// ─── TokenTabs ────────────────────────────────────────────────────────────────

interface TokenTabsProps {
  activeTab: ShopTab;
  onTabChange: (tab: ShopTab) => void;
}

const TABS: { key: ShopTab; label: string; icon: React.ReactNode }[] = [
  { key: 'shop',    label: 'Gói Token', icon: <ShoppingBag size={18} /> },
  { key: 'history', label: 'Lịch Sử',  icon: <HistoryIcon size={18} /> },
];

export const TokenTabs: React.FC<TokenTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
    {TABS.map(({ key, label, icon }) => (
      <button
        key={key}
        onClick={() => onTabChange(key)}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
          activeTab === key
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {icon}
        {label}
      </button>
    ))}
  </div>
);

// ─── TokenPackageCard ─────────────────────────────────────────────────────────

interface TokenPackageCardProps {
  pkg: TokenPackage;
  isSelected: boolean;
  loading: boolean;
  onSelect: (pkg: TokenPackage) => void;
  onPurchase: (pkg: TokenPackage) => void;
}

export const TokenPackageCard: React.FC<TokenPackageCardProps> = ({
  pkg,
  isSelected,
  loading,
  onSelect,
  onPurchase,
}) => (
  <div
    className={`group relative border-2 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
      isSelected
        ? 'border-blue-600 bg-blue-50/50 shadow-xl'
        : 'border-gray-100 hover:border-blue-300 bg-gray-50 hover:bg-white'
    }`}
    onClick={() => onSelect(pkg)}
  >
    {isSelected && (
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

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPurchase(pkg);
        }}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
          isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600'
        } disabled:opacity-50`}
      >
        {loading ? 'Đang xử lý...' : 'Mua Ngay'}
      </button>
    </div>
  </div>
);

// ─── TokenPackagesGrid ────────────────────────────────────────────────────────

interface TokenPackagesGridProps {
  packages: TokenPackage[];
  selectedPackage: TokenPackage | null;
  loading: boolean;
  onSelect: (pkg: TokenPackage) => void;
  onPurchase: (pkg: TokenPackage) => void;
}

export const TokenPackagesGrid: React.FC<TokenPackagesGridProps> = ({
  packages,
  selectedPackage,
  loading,
  onSelect,
  onPurchase,
}) => {
  if (loading) {
    return (
      <div className="col-span-full text-center py-20">
        <div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg" />
        <p className="mt-4 text-gray-400 font-medium">Đang tải gói token...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        Không có gói token nào khả dụng
      </div>
    );
  }

  return (
    <>
      {packages.map((pkg) => (
        <TokenPackageCard
          key={pkg.tokens}
          pkg={pkg}
          isSelected={selectedPackage?.tokens === pkg.tokens}
          loading={loading}
          onSelect={onSelect}
          onPurchase={onPurchase}
        />
      ))}
    </>
  );
};

// ─── TokenInfo ────────────────────────────────────────────────────────────────

const INFO_ITEMS = [
  'Mở khóa tức thì các chapter mới nhất (trước 7 ngày khi trở thành miễn phí).',
  'Sau khi mở khóa, bạn có quyền truy cập vĩnh viễn vào chapter đó.',
  'Tích lũy token để thăng hạng trên Bảng Xếp Hạng Fan Cứng.',
  'Mức giá chỉ 20 token cho một chapter sớm chất lượng cao.',
];

export const TokenInfo: React.FC = () => (
  <div className="mt-12 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700" />

    <h3 className="font-extrabold text-white text-lg mb-4 flex items-center gap-2 relative z-10">
      <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm">💡</span>
      Đặc quyền của Token:
    </h3>

    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 relative z-10">
      {INFO_ITEMS.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <span className="text-blue-400 font-bold">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── StatusMessage ────────────────────────────────────────────────────────────

interface StatusMessageProps {
  error: string;
  success: string;
}

export const StatusMessages: React.FC<StatusMessageProps> = ({ error, success }) => (
  <>
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
  </>
);