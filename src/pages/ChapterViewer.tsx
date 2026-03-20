import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { ChevronLeft, ChevronRight, Loader, Lock, CreditCard, Coins, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { tokenService } from '@/services/tokenService';
import { animeService } from '@/services/animeService';

interface ChapterData {
  id: string;
  chapterNumber: number;
  title: string;
  images: string[];
  source: 'database' | 'otruyen';
}

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string;
}

export function ChapterViewer() {
  const { animeId, chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));

  // Get API URL from environment or use default
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  };

  const getBaseUrl = () => {
    const apiUrl = getApiUrl();
    return apiUrl.replace('/api', '');
  };

  useEffect(() => {
    fetchChapterData();
    if (isLoggedIn) {
      fetchTokenBalance();
    }

    // Anti-copy protection
    const preventCopy = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', preventCopy);

    return () => {
      document.removeEventListener('contextmenu', preventCopy);
    };
  }, [chapterId]);

  const fetchTokenBalance = async () => {
    try {
      const balance = await tokenService.getTokenBalance();
      setTokenBalance(balance);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  };

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      setError(null);

      let decodedChapterId = decodeURIComponent(chapterId || '');
      const responseData = await animeService.getChapterContent(decodedChapterId);

      if (responseData.status === 'success') {
        const item = responseData.data.item;
        const source = responseData.data.source || 'otruyen';

        let images: string[] = [];

        if (source === 'database') {
          if (item.pages && Array.isArray(item.pages)) {
            const BASE_URL = getBaseUrl();

            images = item.pages
              .sort((a: any, b: any) => (a.pageNumber || 0) - (b.pageNumber || 0))
              .map((page: any) => {
                let url = page.imageUrl || page.image_url || page.url;

                // Add base URL if path is relative
                if (url && url.startsWith('/')) {
                  url = `${BASE_URL}${url}`;
                }

                return url;
              });
          }
        } else {
          // OTruyen format
          images = item.images || [];
        }

        setChapterData({
          id: item.id,
          chapterNumber: item.chapterNumber || item.chapter_number || 0,
          title: item.title,
          images: images,
          source: source,
        });
        setIsLocked(false);
      } else {
        setError('Failed to load chapter');
      }
    } catch (error: any) {
      if (error.response?.status === 402) {
        setIsLocked(true);
        const item = error.response.data.chapter;
        setChapterData({
          id: item.id,
          chapterNumber: item.chapterNumber || item.chapter_number || 0,
          title: item.title,
          images: [],
          source: 'database',
        });
      } else {
        setError('Không thể tải chapter. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!chapterData?.id) return;

    try {
      setUnlocking(true);
      await tokenService.unlockChapter(parseInt(chapterData.id));
      // Refresh data
      setIsLocked(false);
      fetchChapterData();
      fetchTokenBalance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không đủ token hoặc lỗi hệ thống.');
    } finally {
      setUnlocking(false);
    }
  };

  // Get chapter list from location state if available
  useEffect(() => {
    if (location.state?.chapters) {
      setChapters(location.state.chapters);
    }
  }, [location.state]);

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
          <button
            onClick={() => navigate(-1)}
            className="text-gold-500 hover:text-gold-400"
          >
            ← Quay lại
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = chapterData?.images || [];
  const currentChapterNum = chapters.findIndex(
    (ch) => ch.id === chapterId || decodeURIComponent(ch.id) === decodeURIComponent(chapterId || '')
  );
  const prevChapter = currentChapterNum > 0 ? chapters[currentChapterNum - 1] : null;
  const nextChapter =
    currentChapterNum >= 0 && currentChapterNum < chapters.length - 1
      ? chapters[currentChapterNum + 1]
      : null;

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

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
          {prevChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(prevChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-1 md:gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 md:px-4 py-2 rounded text-sm md:text-base transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="hidden xs:inline">Chương</span> {prevChapter.chapterNumber}
            </button>
          )}
          {nextChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(nextChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-1 md:gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 md:px-4 py-2 rounded font-bold ml-auto text-sm md:text-base transition-colors"
            >
              <span className="hidden xs:inline">Chương</span> {nextChapter.chapterNumber}
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        {isLocked ? (
          <div className="bg-gray-800 rounded-2xl p-6 md:p-12 flex flex-col items-center text-center border border-gray-700 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>
            
            <div className="w-16 md:w-24 h-16 md:h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
              <Lock size={32} className="text-yellow-500 md:hidden" />
              <Lock size={48} className="text-yellow-500 hidden md:block" />
            </div>
            
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Chương này đang bị khóa</h2>
            <p className="text-gray-400 mb-6 md:mb-8 max-w-md text-sm md:text-base">
              Chương {chapterData?.chapterNumber} hiện đang bị khóa. Bạn có thể mở khóa ngay bằng 20 Token hoặc đợi 7 ngày để đọc miễn phí.
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
                  onClick={handleUnlock}
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
                    onClick={() => navigate('/token-shop')}
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
                  onClick={() => navigate('/login')}
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
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            {images.length > 0 ? (
              <div>
                <p className="text-gray-400 text-sm mb-4">Tổng {images.length} trang</p>
                {images.map((image, i) => (
                  <div key={`${chapterId}-${i}`} className="flex justify-center mb-4 relative group">
                    {/* Transparent Overlay to block dragging/right-clicking individual images */}
                    <div className="absolute inset-0 z-10 select-none pointer-events-auto" onContextMenu={(e) => e.preventDefault()}></div>
                    
                    <img
                      src={image}
                      alt={`Page ${i + 1}`}
                      className="max-w-full h-auto rounded select-none shadow-lg"
                      loading="lazy"
                      draggable="false"
                      style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' } as any}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/600x900?text=Image+Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Không có hình ảnh</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-4 mt-6 md:mt-8">
          {prevChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(prevChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-1 md:gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 md:px-4 py-2 rounded text-sm md:text-base"
            >
              <ChevronLeft size={18} />
              <span className="hidden xs:inline">Chương</span> {prevChapter.chapterNumber}
            </button>
          )}
          {nextChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(nextChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-1 md:gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 md:px-4 py-2 rounded font-bold ml-auto text-sm md:text-base transition-colors"
            >
              <span className="hidden xs:inline">Chương</span> {nextChapter.chapterNumber}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}