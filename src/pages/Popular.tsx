import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Footer } from '@/components/Footer';
import { useTrendingAnimes } from '@/hooks/useAnime';
import { Anime } from '@/types';

export function Popular() {
  const navigate = useNavigate();
  const { animes, loading } = useTrendingAnimes();
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'views'>('rating');

  useEffect(() => {
    let sorted = [...animes];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'views') {
      sorted.sort((a, b) => b.viewCount - a.viewCount);
    }
    setFilteredAnimes(sorted);
  }, [animes, sortBy]);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Phổ biến</h1>

          {/* Sort Options */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                sortBy === 'rating'
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Theo Xếp hạng
            </button>
            <button
              onClick={() => setSortBy('views')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                sortBy === 'views'
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Theo Lượt xem
            </button>
          </div>

          {filteredAnimes.length > 0 && (
            <p className="text-gray-400 mb-4">Hiển thị {filteredAnimes.length} anime</p>
          )}
        </div>

        <AnimeGrid
          animes={filteredAnimes}
          loading={loading}
          onAnimeClick={handleAnimeClick}
        />

        {!loading && filteredAnimes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Không tìm thấy anime nào</p>
            <button
              onClick={() => navigate('/')}
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}