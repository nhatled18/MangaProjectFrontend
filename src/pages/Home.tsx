import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeService } from '@/services/animeService';
import { Anime } from '@/types';
import { Footer } from '@/components/Footer';

interface ReadingHistoryItem {
  animeId: number;
  animeName: string;
  chapterNumber: number;
  chapterTitle: string;
  image: string;
  lastRead: string;
  chapterId: string;
}

export function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Anime[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ Fetch trending animes from API
        const trendingResponse = await animeService.getTrendingAnimes(1);
        const trendingAnimes = trendingResponse.items || [];
        setTrending(trendingAnimes);
        
        // ✅ Load reading history from localStorage
        const history = loadReadingHistoryFromStorage();
        setReadingHistory(history);
      } catch (error) {
        console.error('Error fetching data:', error);
        setReadingHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ✅ Load all reading history from localStorage
  const loadReadingHistoryFromStorage = (): ReadingHistoryItem[] => {
    const STORAGE_KEY = 'reading_progress';
    const history: ReadingHistoryItem[] = [];
    
    // Duyệt tất cả localStorage keys để tìm reading progress
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(STORAGE_KEY + '_')) {
        try {
          const animeId = parseInt(key.replace(STORAGE_KEY + '_', ''));
          const progressData = localStorage.getItem(key);
          
          if (progressData) {
            const progressMap = JSON.parse(progressData);
            // Lấy chapter được đọc cuối cùng
            const chapters = Object.values(progressMap as any).sort((a: any, b: any) => {
              return new Date(b.lastReadTime).getTime() - new Date(a.lastReadTime).getTime();
            });
            
            if (chapters.length > 0) {
              const lastChapter = chapters[0] as any;
              history.push({
                animeId,
                animeName: `Anime ${animeId}`, // Sẽ được cập nhật từ API
                chapterNumber: lastChapter.chapterNumber,
                chapterTitle: lastChapter.chapterTitle,
                image: '/fairytail_volume_12.jpg', // Sẽ được cập nhật từ API
                lastRead: new Date(lastChapter.lastReadTime).toLocaleDateString('vi-VN'),
                chapterId: lastChapter.chapterId,
              });
            }
          }
        } catch (e) {
          console.error('Error parsing reading history:', e);
        }
      }
    }
    
    // Fetch anime data từ API để cập nhật tên và hình ảnh
    if (history.length > 0) {
      history.forEach(async (item) => {
        try {
          const anime = await animeService.getAnimeById(String(item.animeId));
          if (anime) {
            item.animeName = anime.title;
            item.image = anime.image;
          }
        } catch (e) {
          console.error('Failed to fetch anime:', e);
        }
      });
    }
    
    return history;
  };

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  // ✅ Click từ Reading History
  const handleReadingHistoryClick = (item: ReadingHistoryItem) => {
    navigate(`/chapter/${item.animeId}/${encodeURIComponent(item.chapterId)}`, {
      state: {
        anime: { id: item.animeId, title: item.animeName, image: item.image },
        chapterId: item.chapterId,
        chapterNumber: item.chapterNumber,
        chapterTitle: item.chapterTitle,
      }
    });
  };

  if (loading && trending.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--primary-red)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="home-content">
      {/* --- Cấu trúc Hero Banner từ Source của bạn --- */}
      <header className="hero">
        <div className="hero-content">
          <h1>Fairy Tail:<br />100 Years Quest</h1>
          <p>The magic adventure continues. Join Natsu, Lucy, and the guild as they take on the legendary quest.</p>
          <button className="btn-primary-ft" onClick={() => trending[0] && handleAnimeClick(trending[0])}>🔥 Read Now</button>
          <button className="btn-secondary-ft">Chapter List</button>
        </div>
      </header>

      <div className="container-ft">
        {/* --- Reading History Section (Thực tế từ localStorage) --- */}
        {readingHistory.length > 0 && (
          <section>
            <h2>📖 Your Reading History</h2>
            <div className="continue-list">
              {readingHistory.slice(0, 4).map((item) => (
                <div 
                  key={`${item.animeId}-${item.chapterId}`}
                  className="continue-card"
                  onClick={() => handleReadingHistoryClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={item.image} alt="Cover" className="c-img" />
                  <div className="c-info">
                    <div className="c-title">Ch. {item.chapterNumber}: {item.animeName}</div>
                    <div className="c-time">{item.lastRead}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Two Columns (Bản vẽ của bạn) --- */}
        <div className="two-columns-ft">
          {/* Popular Chapters (Grid) */}
          <section>
            <h2>🔥 Popular Chapters</h2>
            <div className="popular-grid">
              {(trending.length > 0 ? trending : Array(4).fill(null)).slice(0, 8).map((anime, idx) => (
                <div key={anime?.id || idx} className="pop-card" onClick={() => anime && handleAnimeClick(anime)}>
                  <div className="pop-cover-wrap">
                    <div className={`badge-top ${idx === 1 ? 'badge-new' : 'badge-hot'}`}>
                      {idx === 1 ? 'NEW' : 'HOT'}
                    </div>
                    <div className="badge-vol">{12 - idx}</div>
                    <img src={anime?.image || '/fairytail_volume_12.jpg'} alt="Cover" />
                    <div className="pop-overlay">
                      <span className="pop-status">🔥 {idx === 1 ? 'NEW' : 'HOT'}</span>
                      <span className="pop-views">👁 {(13.3 + idx).toFixed(1)}K</span>
                    </div>
                  </div>
                  <div className="pop-title">{anime?.title || `Volume ${12 - idx}`}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Updates (List) */}
          <section>
            <h2>Latest Updates</h2>
            <div className="latest-list">
              {(trending.length > 0 ? trending : Array(3).fill(null)).slice(0, 5).map((anime, idx) => (
                <div key={anime?.id || idx} className="latest-item" onClick={() => anime && handleAnimeClick(anime)}>
                  <img src={anime?.image || '/fairytail_volume_12.jpg'} alt="Cover" className="l-img" />
                  <div className="l-info">
                    <div className="l-title">{anime?.title.slice(0, 20) || 'Ch. 163 - Titania'}</div>
                    <div className="l-time">Updated {idx + 1}h ago</div>
                  </div>
                  <button className="btn-read-ft">Read</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}