import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeService } from '@/services/animeService';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useAuth } from '@/hooks/useAuth';
import { Anime } from '@/types';
import { Footer } from '@/components/Footer';

interface GlobalTimelineItem {
  animeId: string | number;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  animeName: string;
  image: string;
  lastReadTime: number;
}

export function Home() {
  const navigate = useNavigate();
  const { getGlobalReadingTimeline } = useReadingProgress();
  const { isAuthenticated, user } = useAuth();
  const [trending, setTrending] = useState<Anime[]>([]);
  const [continueReading, setContinueReading] = useState<GlobalTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Update currentUserId in localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      localStorage.setItem('currentUserId', String(user.id));
    } else {
      localStorage.removeItem('currentUserId');
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ Fetch trending animes from API
        const trendingResponse = await animeService.getTrendingAnimes(1);
        const trendingAnimes = trendingResponse.items || [];
        setTrending(trendingAnimes);
        
        // ✅ Load global reading timeline (top 10 chapters user read)
        const timeline = getGlobalReadingTimeline();
        setContinueReading(timeline);
      } catch (error) {
        console.error('Error fetching data:', error);
        setContinueReading([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getGlobalReadingTimeline, isAuthenticated, user?.id]);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  // ✅ Click từ Continue Reading
  const handleContinueReadingClick = (item: GlobalTimelineItem) => {
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
        {/* --- Continue Reading Section (Global Timeline) --- */}
        {continueReading.length > 0 && (
          <section>
            <h2>📖 Continue Reading</h2>
            <div className="continue-list">
              {continueReading.map((item) => (
                <div 
                  key={`${item.animeId}-${item.chapterId}`}
                  className="continue-card"
                  onClick={() => handleContinueReadingClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={item.image || '/fairytail_volume_12.jpg'} alt="Cover" className="c-img" onError={(e) => { e.currentTarget.src = '/fairytail_volume_12.jpg'; }} />
                  <div className="c-info">
                    <div className="c-title">Ch. {item.chapterNumber}: {item.animeName}</div>
                    <div className="c-time">{new Date(item.lastReadTime).toLocaleDateString('vi-VN')}</div>
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