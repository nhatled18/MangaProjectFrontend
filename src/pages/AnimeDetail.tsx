import { useLocation, useNavigate } from 'react-router-dom';
import { Anime } from '@/types';
import { Play, Star, Loader, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { animeService } from '@/services/animeService';

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string;
  pageCount?: number;
  isUnlocked?: boolean;
  releaseDate?: string;
  isFree?: boolean;
}

export function AnimeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const anime = location.state?.anime as Anime;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('oldest');

  useEffect(() => {
    if (anime && anime.id) {
      fetchChapters();
    }
  }, [anime]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const animeIdentifier = anime.slug || anime.id;
      const chaptersData = await animeService.getEpisodes(animeIdentifier);

      if (!chaptersData || chaptersData.length === 0) {
        setError('Anime này chưa có chapters');
      } else {
        const mappedChapters: Chapter[] = chaptersData.map((ch: any) => ({
          id: ch.id || ch.chapter_id || ch.chapter_api_data || '',
          chapterNumber: parseFloat(ch.chapterNumber || ch.chapter_number || ch.chapter_name || 0),
          title: ch.title || ch.chapter_title || ch.filename || `Chapter ${ch.chapterNumber || ch.chapter_number}`,
          description: ch.description || '',
          pageCount: ch.pageCount || ch.pages?.length || 0,
          isUnlocked: ch.isUnlocked !== undefined ? ch.isUnlocked : true,
          releaseDate: ch.releaseDate || ch.created_at || ch.updated_at,
          isFree: ch.isFree ?? true,
        }));
        setChapters(mappedChapters);
      }
    } catch (err) {
      setError('Failed to load chapters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logic: 
  // 1. VIP Section: All premium/locked chapters (always sorted DESC)
  const premiumChapters = chapters.filter(ch => !ch.isFree).sort((a, b) => b.chapterNumber - a.chapterNumber);
  
  // 2. Free Section: All free chapters sortable by number
  const freeChapters = chapters.filter(ch => ch.isFree).sort((a, b) => {
    if (sortOrder === 'newest') return b.chapterNumber - a.chapterNumber;
    return a.chapterNumber - b.chapterNumber;
  });

  const newestChapter = chapters.length > 0 
    ? [...chapters].sort((a, b) => b.chapterNumber - a.chapterNumber)[0] 
    : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    navigate(`/chapter/${anime.id}/${encodeURIComponent(chapter.id)}`, {
      state: { anime, chapter, chapters },
    });
  };

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 text-lg">Anime không tìm thấy</p>
          <button onClick={() => navigate('/')} className="text-yellow-500 hover:text-yellow-400 mt-4">
            ← Quay lại trang chủ
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative min-h-[400px] md:h-96 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0">
            <img src={anime.image || 'https://via.placeholder.com/1200x600'} alt={anime.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>

          <div className="relative h-full flex items-center md:items-end p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end w-full">
              <img src={anime.image || 'https://via.placeholder.com/400x600'} alt={anime.title} className="w-40 md:w-48 h-60 md:h-72 object-cover rounded-lg shadow-2xl flex-shrink-0" />
              <div className="flex-1 text-center md:text-left">
                <p className="text-yellow-500 text-sm font-semibold mb-2">{anime.type}</p>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">{anime.title}</h1>
                <p className="text-gray-300 mb-4 line-clamp-3 text-sm md:text-md">{anime.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {chapters.length > 0 && (
                    <button
                      onClick={() => {
                        const first = chapters.reduce((p, c) => p.chapterNumber < c.chapterNumber ? p : c);
                        handleChapterClick(first);
                      }}
                      className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      <Play size={20} fill="currentColor" /> Đọc từ đầu
                    </button>
                  )}
                  {newestChapter && (
                    <button
                      onClick={() => handleChapterClick(newestChapter)}
                      className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors w-full sm:w-auto"
                    >
                      Mới nhất
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Lượt xem</div>
            <div className="text-yellow-500 font-bold text-2xl">{(anime.viewCount / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Xếp hạng</div>
            <div className="text-yellow-500 font-bold text-2xl flex items-center justify-center gap-2">
              <Star size={24} fill="currentColor" /> {anime.rating.toFixed(1)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Trạng thái</div>
            <div className="text-white font-bold text-lg">{anime.status}</div>
          </div>
        </div>

        {/* Chapters List */}
        <section className="space-y-10">
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-8 bg-yellow-500 rounded-full"></span> Danh sách Chapter
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-yellow-500" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={fetchChapters} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg">Thử lại</button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* VIP Section (All Locked Chapters) */}
                {premiumChapters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-red-500 font-bold text-xs uppercase tracking-widest px-1">
                      <Lock size={14} fill="currentColor" /> Chương VIP (Đang khóa)
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {premiumChapters.map(ch => (
                        <ChapterItem key={ch.id} chapter={ch} onClick={handleChapterClick} formatDate={formatDate} isVIP />
                      ))}
                    </div>
                  </div>
                )}

                {/* Free List */}
                <div>
                  <div className="flex items-center justify-between mb-4 border-l-4 border-green-500 pl-3">
                    <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Chương Miễn phí
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex items-center gap-1 bg-gray-800 p-0.5 rounded-lg border border-gray-700">
                      <button
                        onClick={() => setSortOrder('newest')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          sortOrder === 'newest' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        MỚI NHẤT
                      </button>
                      <button
                        onClick={() => setSortOrder('oldest')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          sortOrder === 'oldest' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        CŨ NHẤT
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {freeChapters.map(ch => (
                      <ChapterItem key={ch.id} chapter={ch} onClick={handleChapterClick} formatDate={formatDate} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ChapterItem({ chapter, onClick, formatDate, isVIP }: { chapter: Chapter, onClick: (c: Chapter) => void, formatDate: (s?: string) => string, isVIP?: boolean }) {
  return (
    <button
      onClick={() => onClick(chapter)}
      className={`group flex items-center justify-between p-3 md:p-4 rounded-xl transition-all duration-300 border w-full ${
        isVIP ? 'bg-gray-800/40 border-red-500/30 hover:border-red-500' : 'bg-gray-800 border-gray-700 hover:border-yellow-500'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-bold border ${
          isVIP ? 'bg-gray-900 text-red-500 border-red-500/30 group-hover:bg-red-500 group-hover:text-white' : 'bg-gray-900 text-yellow-500 border-gray-700 group-hover:bg-yellow-500 group-hover:text-black'
        }`}>
          {chapter.chapterNumber}
          {!chapter.isUnlocked && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 border-2 border-gray-800">
              <Lock size={10} fill="currentColor" />
            </div>
          )}
        </div>
        <div className="text-left min-w-0">
          <div className="flex items-center gap-2">
            <div className={`font-bold text-md md:text-lg truncate ${isVIP ? 'text-gray-200 group-hover:text-red-400' : 'text-white group-hover:text-yellow-500'}`}>
              {chapter.title}
            </div>
            {!chapter.isUnlocked && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded border border-red-500/20 uppercase">Premium</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            {chapter.pageCount} trang • <span className="md:inline hidden">{formatDate(chapter.releaseDate)}</span>
            <span className="md:hidden inline">{formatDate(chapter.releaseDate).split('/').slice(0,2).join('/')}</span>
          </div>
        </div>
      </div>
      <div className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-2 ${
        isVIP ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-gray-900 text-gray-400 group-hover:bg-yellow-500 group-hover:text-black'
      }`}>
        {!chapter.isUnlocked && <Lock size={14} />}
        <span className="md:inline hidden">{chapter.isUnlocked ? (isVIP ? 'Đọc ngay (VIP)' : formatDate(chapter.releaseDate)) : 'Mở khóa'}</span>
        <span className="md:hidden inline">{chapter.isUnlocked ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}</span>
      </div>
    </button>
  );
}