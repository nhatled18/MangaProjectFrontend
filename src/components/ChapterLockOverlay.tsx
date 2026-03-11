import React, { useState, useEffect } from 'react';
import { tokenService } from '@/services/tokenService';

interface ChapterLockOverlayProps {
  chapterId: number;
  chapterNumber: number;
  onUnlock?: () => void;
  onOpenShop?: () => void;
  isOpen: boolean;
}

const ChapterLockOverlay: React.FC<ChapterLockOverlayProps> = ({
  chapterId,
  chapterNumber,
  onUnlock,
  onOpenShop,
  isOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTokenBalance();
    }
  }, [isOpen]);

  const loadTokenBalance = async () => {
    try {
      const balance = await tokenService.getTokenBalance();
      setTokenBalance(balance);
    } catch (err) {
      // Handle error silently
    }
  };

  const handleUnlock = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await tokenService.unlockChapter(chapterId);
      setSuccess(result.message);
      setTokenBalance(result.tokenBalance);

      // Call onUnlock callback sau 1 giây
      setTimeout(() => {
        if (onUnlock) onUnlock();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi mở khóa');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const unlockCost = 5;
  const canUnlock = tokenBalance >= unlockCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800">Chapter Bị Khóa</h2>
          <p className="text-gray-600 mt-2">Chapter {chapterNumber} chỉ dành cho thành viên VIP</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Token Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Token hiện tại</p>
              <p className="text-2xl font-bold text-blue-600">{tokenBalance}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cần để mở khóa</p>
              <p className="text-2xl font-bold text-blue-600">{unlockCost}</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((tokenBalance / unlockCost) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {canUnlock ? (
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang mở khóa...' : `Mở Khóa (${unlockCost} Token)`}
            </button>
          ) : (
            <button
              onClick={onOpenShop}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Mua Token Ngay
            </button>
          )}

          <button
            onClick={onOpenShop}
            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors"
          >
            Xem Gói Token
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>✨ Mở khóa chap để đọc nội dung mới nhất</p>
          <p className="mt-1">📈 Tham gia leaderboard để cạnh tranh vị trí cao</p>
        </div>
      </div>
    </div>
  );
};

export default ChapterLockOverlay;
