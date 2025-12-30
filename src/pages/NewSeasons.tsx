import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Footer } from '@/components/Footer';
import { useNewReleases } from '@/hooks/useAnime';
import { Anime } from '@/types';

export function NewSeasons() {
  const navigate = useNavigate();
  const { animes, loading } = useNewReleases();
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      setFilteredAnimes(animes.filter(a => a.category === selectedCategory));
    } else {
      setFilteredAnimes(animes);
    }
  }, [animes, selectedCategory]);

  const categories = Array.from(new Set(animes.map(a => a.category))) as string[];

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Mùa mới</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === ''
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
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