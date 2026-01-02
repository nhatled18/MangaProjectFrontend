import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundImages } from '@/components/BackgroundImages';
import { MangaBanner } from '@/components/MangaBanner';
import { AnimeGrid } from '@/components/AnimeGrid';
import { TrendingItem } from '@/components/TrendingItem';
import { useTrendingAnimes, useNewReleases } from '@/hooks/useAnime';
import { Anime } from '@/types';
import { Loader } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { animes: initialTrending = [], loading: trendingLoading } = useTrendingAnimes();
  const { animes: newReleases = [], loading: newLoading } = useNewReleases();
  const [continueWatching, setContinueWatching] = useState<Anime[]>([]);
  const [allTrending, setAllTrending] = useState<Anime[]>([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initialize trending
  useEffect(() => {
    setAllTrending(initialTrending);
  }, [initialTrending]);

  // Mock continue watching data
  useEffect(() => {
    if (Array.isArray(newReleases)) {
      setContinueWatching(newReleases.slice(0, 5));
    }
  }, [newReleases]);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  const loadMoreTrending = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = trendingPage + 1;
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:5000/api/anime/trending?limit=40&page=${nextPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setAllTrending([...allTrending, ...data.data]);
        setTrendingPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more trending:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [trendingPage, loadingMore, hasMore, allTrending]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreTrending();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreTrending, hasMore, loadingMore]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Background Images */}
      <BackgroundImages />

      {/* Manga Banner */}
      <MangaBanner
        onReadClick={() => navigate('/manga')}
        onWebsiteClick={() => window.open('https://example.com', '_blank')}
      />

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>▶</span>
              <span>Tiếp tục Xem</span>
            </h2>
          </div>
          <AnimeGrid
            animes={continueWatching}
            loading={newLoading}
            onAnimeClick={handleAnimeClick}
          />
        </section>
      )}

      {/* New Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span></span>
            <span>Phát Hành Mới</span>
          </h2>
          <a href="/new-seasons" className="text-yellow-500 hover:text-yellow-400 transition-colors">
            Xem tất cả →
          </a>
        </div>
        <AnimeGrid
          animes={newReleases}
          loading={newLoading}
          onAnimeClick={handleAnimeClick}
        />
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span></span>
            <span>Đang Xu Hướng ({allTrending.length}+)</span>
          </h2>
          <a href="/popular" className="text-yellow-500 hover:text-yellow-400 transition-colors">
            Xem tất cả →
          </a>
        </div>
        <div className="space-y-4">
          {trendingLoading ? (
            <div className="text-center py-8 text-gray-400">Đang tải...</div>
          ) : !Array.isArray(allTrending) || allTrending.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Không có dữ liệu</div>
          ) : (
            <>
              {allTrending.map((anime, index) => (
                <TrendingItem
                  key={`${anime.id}-${index}`}
                  anime={anime}
                  rank={index + 1}
                  onClick={handleAnimeClick}
                />
              ))}
              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="py-8 text-center">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Đang tải thêm...</span>
                  </div>
                )}
                {!loadingMore && !hasMore && allTrending.length > 0 && (
                  <p className="text-gray-500">Đã tải hết tất cả {allTrending.length} truyện</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}