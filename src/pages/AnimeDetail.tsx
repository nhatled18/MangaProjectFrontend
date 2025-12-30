import { useLocation, useNavigate } from 'react-router-dom';
import { Anime } from '@/types';
import { Play, Heart, Share2, Star, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { animeService } from '@/services/animeService'; // ✅ THÊM

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string;
  pageCount?: number;
}

export function AnimeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const anime = location.state?.anime as Anime;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (anime && anime.id) {
      fetchChapters();
    }
  }, [anime]);

  // ✅ SỬA: Dùng animeService thay vì axios trực tiếp
  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const animeIdentifier = anime.slug || anime.id;
      console.log('Fetching chapters for:', animeIdentifier);
      
      // ✅ SỬA: Dùng animeService.getEpisodes
      const chaptersData = await animeService.getEpisodes(animeIdentifier);
      
      console.log('Chapters response:', chaptersData);
      
      if (!chaptersData || chaptersData.length === 0) {
        setError('Anime này chưa có chapters');
      } else {
        // ✅ Map chapters to Chapter interface
        // Handle both Database and OTruyen formats
        const mappedChapters: Chapter[] = chaptersData.map((ch: any) => ({
          id: ch.id || ch.chapter_id || ch.chapter_api_data || '',
          chapterNumber: parseFloat(ch.chapterNumber || ch.chapter_number || ch.chapter_name || 0),
          title: ch.title || ch.chapter_title || ch.filename || `Chapter ${ch.chapterNumber || ch.chapter_number}`,
          description: ch.description || '',
          pageCount: ch.pageCount || ch.pages?.length || 0,
        }));
        setChapters(mappedChapters);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError('Failed to load chapters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    navigate(`/chapter/${anime.id}/${encodeURIComponent(chapter.id)}`, {
      state: {
        anime,
        chapter,
        chapters,
      },
    });
  };

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 text-lg">Anime không tìm thấy</p>
          <button
            onClick={() => navigate('/')}
            className="text-yellow-500 hover:text-yellow-400 mt-4"
          >
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
        <div className="relative h-96 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0">
            <img
              src={anime.image || 'https://via.placeholder.com/1200x400'}
              alt={anime.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          </div>

          <div className="relative h-full flex items-end p-8">
            <div className="flex gap-8 items-end">
              <img
                src={anime.image || 'https://via.placeholder.com/300x400'}
                alt={anime.title}
                className="w-48 h-72 object-cover rounded-lg shadow-2xl"
              />
              <div className="flex-1 pb-4">
                <p className="text-yellow-500 text-sm font-semibold mb-2">{anime.type}</p>
                <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>
                <p className="text-gray-300 mb-4">{anime.description}</p>
                <div className="flex gap-4 mb-6 text-sm">
                  <span className="text-gray-400">
                    Status: <span className="text-white">{anime.status}</span>
                  </span>
                  <span className="text-gray-400">
                    Episodes: <span className="text-white">{anime.episodeCount}</span>
                  </span>
                  <span className="text-gray-400">
                    Category: <span className="text-white">{anime.category}</span>
                  </span>
                </div>
                <div className="flex gap-4">
                  {chapters.length > 0 && (
                    <button 
                      onClick={() => handleChapterClick(chapters[0])}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                      <Play size={20} fill="currentColor" />
                      Đọc Chapter 1
                    </button>
                  )}
                  <button className="flex items-center gap-2 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 py-3 rounded-lg transition-colors">
                    <Heart size={20} />
                    Thêm vào danh sách
                  </button>
                  <button className="flex items-center gap-2 border-2 border-gray-500 text-gray-300 hover:border-yellow-500 hover:text-yellow-500 font-bold px-6 py-3 rounded-lg transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Lượt xem</div>
            <div className="text-yellow-500 font-bold text-2xl">
              {(anime.viewCount / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Xếp hạng</div>
            <div className="text-yellow-500 font-bold text-2xl flex items-center justify-center gap-2">
              <Star size={24} fill="currentColor" />
              {anime.rating.toFixed(1)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Trạng thái</div>
            <div className="text-white font-bold text-lg">{anime.status}</div>
          </div>
        </div>

        {/* Chapters */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Danh sách Chapter</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-yellow-500" size={32} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchChapters}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : chapters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className="p-4 rounded-lg font-semibold transition-colors bg-gray-800 text-white hover:bg-yellow-500 hover:text-black"
                  title={chapter.title || `Chapter ${chapter.chapterNumber}`}
                >
                  <div>Chap {chapter.chapterNumber}</div>
                  {(chapter.pageCount ?? 0) > 0 && (
                    <div className="text-xs text-gray-400">{chapter.pageCount} pages</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Không có chapter nào</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}