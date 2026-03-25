import { useNavigate } from 'react-router-dom';
import { Loader, Lock, CreditCard, Coins, LogIn } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ChapterNavBar } from '@/components/ChapterNavBar';
import { ChapterImageGallery } from '@/components/ChapterImageGallery';
import { useChapterViewer } from '@/hooks/useChapterViewer';

export function ChapterViewer() {
  const navigate = useNavigate();
  const {
    animeId,
    chapterId,
    chapterData,
    chapters,
    loading,
    error,
    isLocked,
    unlocking,
    tokenBalance,
    isLoggedIn,
    prevChapter,
    nextChapter,
    handleUnlock,
  } = useChapterViewer();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <Loader className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Đang tải chương...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="text-gold-500 hover:text-gold-400">
            ← Quay lại
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gold-500 hover:text-gold-400 flex items-center gap-2 mb-4"
          >
            ← Quay lại
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {chapterData?.title || `Chapter ${chapterData?.chapterNumber}`}
          </h1>
          <p className="text-gray-400 text-sm">
            từ {chapterData?.source === 'database' ? 'Database' : 'OTruyen'}
          </p>
        </div>

        {/* Top Navigation */}
        <div className="mb-6 md:mb-8">
          <ChapterNavBar animeId={animeId} chapters={chapters} prevChapter={prevChapter} nextChapter={nextChapter} />
        </div>

        {/* Content: locked or image gallery */}
        {isLocked ? (
          <ChapterLockPanel
            chapterNumber={chapterData?.chapterNumber}
            tokenBalance={tokenBalance}
            isLoggedIn={isLoggedIn}
            unlocking={unlocking}
            onUnlock={handleUnlock}
            onGoShop={() => navigate('/token-shop')}
            onGoLogin={() => navigate('/login')}
          />
        ) : (
          <ChapterImageGallery images={chapterData?.images ?? []} chapterId={chapterId} />
        )}

        {/* Bottom Navigation */}
        <div className="mt-6 md:mt-8">
          <ChapterNavBar animeId={animeId} chapters={chapters} prevChapter={prevChapter} nextChapter={nextChapter} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Lock Panel ─────────────────────────────────────────────────────────────
// Inline vì nhỏ và chỉ dùng ở đây — nếu sau này cần dùng ở chỗ khác thì tách file riêng

interface ChapterLockPanelProps {
  chapterNumber?: number;
  tokenBalance: number;
  isLoggedIn: boolean;
  unlocking: boolean;
  onUnlock: () => void;
  onGoShop: () => void;
  onGoLogin: () => void;
}

function ChapterLockPanel({
  chapterNumber,
  tokenBalance,
  isLoggedIn,
  unlocking,
  onUnlock,
  onGoShop,
  onGoLogin,
}: ChapterLockPanelProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 md:p-12 flex flex-col items-center text-center border border-gray-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0" />

      <div className="w-16 md:w-24 h-16 md:h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
        <Lock size={32} className="text-yellow-500 md:hidden" />
        <Lock size={48} className="text-yellow-500 hidden md:block" />
      </div>

      <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Chương này đang bị khóa</h2>
      <p className="text-gray-400 mb-6 md:mb-8 max-w-md text-sm md:text-base">
        Chương {chapterNumber} hiện đang bị khóa. Bạn có thể mở khóa ngay bằng 20 Token hoặc đợi 7 ngày để đọc miễn phí.
      </p>

      {isLoggedIn ? (
        <div className="w-full max-w-sm bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-700 mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
              <Coins size={18} className="text-yellow-500" />
              <span>Số dư hiện tại:</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-white">{tokenBalance} Token</span>
          </div>

          <button
            onClick={onUnlock}
            disabled={unlocking}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold py-3 md:py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-md md:text-lg shadow-lg shadow-yellow-500/20"
          >
            {unlocking ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <Lock size={20} />
                Mở khóa (20 Token)
              </>
            )}
          </button>

          {tokenBalance < 20 && (
            <button
              onClick={onGoShop}
              className="w-full mt-4 flex items-center justify-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold text-sm"
            >
              <CreditCard size={18} />
              Nạp thêm Token
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={onGoLogin}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
          >
            <LogIn size={20} />
            Đăng nhập ngay
          </button>
          <p className="text-gray-500 text-sm">Bạn cần 20 token để mở khóa chương này</p>
        </div>
      )}

      <p className="text-gray-500 text-xs md:text-sm">
        * Sau khi mở khóa, bạn có thể đọc chương này vĩnh viễn
      </p>
    </div>
  );
}