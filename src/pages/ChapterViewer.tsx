import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  }, [chapterId]);

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let decodedChapterId = decodeURIComponent(chapterId || '');
      console.log('Chapter ID/URL:', decodedChapterId);
      
      const apiUrl = getApiUrl();
      const response = await axios.get(
        `${apiUrl}/chapter?id=${encodeURIComponent(decodedChapterId)}`
      );
      
      console.log('Chapter response:', response.data);
      
      if (response.data.status === 'success') {
        const item = response.data.data.item;
        const source = response.data.data.source || 'otruyen';
        
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
      } else {
        setError('Failed to load chapter');
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
      setError('Không thể tải chapter. Vui lòng thử lại.');
    } finally {
      setLoading(false);
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
        <div className="flex gap-4 mb-8">
          {prevChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(prevChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              <ChevronLeft size={20} />
              Chap {prevChapter.chapterNumber}
            </button>
          )}
          {nextChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(nextChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded font-bold ml-auto"
            >
              Chap {nextChapter.chapterNumber}
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          {images.length > 0 ? (
            <div>
              <p className="text-gray-400 text-sm mb-4">Tổng {images.length} trang</p>
              {images.map((image, i) => (
                <div key={`${chapterId}-${i}`} className="flex justify-center mb-4">
                  <img
                    src={image}
                    alt={`Page ${i + 1}`}
                    className="max-w-full h-auto rounded"
                    loading="lazy"
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

        {/* Bottom Navigation */}
        <div className="flex gap-4 mt-8">
          {prevChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(prevChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              <ChevronLeft size={20} />
              Chap {prevChapter.chapterNumber}
            </button>
          )}
          {nextChapter && (
            <button
              onClick={() =>
                navigate(`/chapter/${animeId}/${encodeURIComponent(nextChapter.id)}`, {
                  state: { chapters },
                })
              }
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded font-bold ml-auto"
            >
              Chap {nextChapter.chapterNumber}
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}