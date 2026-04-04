import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeService } from '@/services/animeService';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { Anime } from '@/types';
import { Footer } from '@/components/Footer';

interface ContinueReadingItem {
  id: string | number;
  animeId: number;
  animeName: string;
  ch: string;
  title: string;
  image: string;
  lastRead: string;
  anime?: Anime;
}

export function Home() {
  const navigate = useNavigate();
  const { getReadingHistory } = useReadingProgress();
  const [trending, setTrending] = useState<Anime[]>([]);
  const [continueReading, setContinueReading] = useState<ContinueReadingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending animes
        const trendingResponse = await animeService.getTrendingAnimes(1);
        const trendingAnimes = trendingResponse.items || [];
        setTrending(trendingAnimes);
        
        // Use trending animes for continue reading (first 4)
        const continueData: ContinueReadingItem[] = trendingAnimes.slice(0, 4).map((anime: Anime, idx: number) => ({
          id: anime.id || idx,
          animeId: typeof anime.id === 'string' ? parseInt(anime.id) : anime.id,
          animeName: anime.title,
          ch: anime.currentEpisode || 'Ch. 1',
          title: anime.title,
          image: anime.image,
          lastRead: 'Updated recently',
          anime: anime, // Store full anime object
        }));
        
        setContinueReading(continueData.length > 0 ? continueData : getMockContinueReading());
      } catch (error) {
        console.error('Error fetching data:', error);
        setContinueReading(getMockContinueReading());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMockContinueReading = (): ContinueReadingItem[] => [
    { id: 1, animeId: 1, animeName: 'Fire Dragon', ch: '158', title: 'Fire Dragon', image: '/fairytail_volume_12.jpg', lastRead: 'Read 2 days ago' },
    { id: 2, animeId: 2, animeName: 'Team Lucy', ch: '159', title: 'Team Lucy', image: '/fairytail_volume_12.jpg', lastRead: 'Read 2 days ago' },
    { id: 3, animeId: 3, animeName: 'Herms Adventure', ch: '155', title: 'Herms Wagi...', image: '/fairytail_volume_12.jpg', lastRead: 'Read 2 days ago' },
    { id: 4, animeId: 4, animeName: 'Fire Dragon', ch: '161', title: 'Fire Dragon', image: '/fairytail_volume_12.jpg', lastRead: 'Read 2 days ago' },
  ];

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  const handleContinueReadingClick = async (item: ContinueReadingItem) => {
    if (!item.anime) return;

    // Get last reading progress
    const readingHistory = getReadingHistory(item.anime.id);
    
    // If has reading history, jump to chapter viewer
    if (readingHistory) {
      navigate(`/chapter/${item.anime.id}/${readingHistory.chapterId}`, {
        state: {
          anime: item.anime,
          chapterId: readingHistory.chapterId,
          chapterNumber: readingHistory.chapterNumber,
          chapterTitle: readingHistory.chapterTitle,
        }
      });
    } else {
      // Fetch chapters and jump to newest one
      try {
        const animeIdentifier = item.anime.slug || item.anime.id;
        const chapters = await animeService.getEpisodes(animeIdentifier);
        
        if (chapters && chapters.length > 0) {
          // Get newest chapter (highest number)
          const sortedChapters = [...chapters].sort((a: any, b: any) => {
            const aNum = parseFloat(a.episodeNumber || a.chapterNumber || a.chapter_number || 0);
            const bNum = parseFloat(b.episodeNumber || b.chapterNumber || b.chapter_number || 0);
            return bNum - aNum;
          });
          
          const newestChapter = sortedChapters[0];
          const chapterId = newestChapter.id || '';
          
          navigate(`/chapter/${item.anime.id}/${encodeURIComponent(chapterId)}`, {
            state: {
              anime: item.anime,
              chapters,
            }
          });
        } else {
          // Fallback to anime detail if no chapters
          navigate(`/anime/${item.anime.id}`, { state: { anime: item.anime } });
        }
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
        // Fallback to anime detail on error
        navigate(`/anime/${item.anime.id}`, { state: { anime: item.anime } });
      }
    }
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
        {/* --- Continue Reading Section --- */}
        <section>
          <h2>Continue Reading</h2>
          <div className="continue-list">
            {continueReading.map((item, idx) => (
              <div 
                key={item.id} 
                className={`continue-card ${idx === 0 ? 'active' : ''}`}
                onClick={() => handleContinueReadingClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <img src={item.image} alt="Cover" className="c-img" />
                <div className="c-info">
                  <div className="c-title">Ch. {item.ch}: {item.title}</div>
                  <div className="c-time">{item.lastRead}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Two Columns (Bản vẽ của bạn) --- */}
        <div className="two-columns-ft">
          {/* Popular Chapters (Grid) */}
          <section>
            <h2>Popular Chapters</h2>
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