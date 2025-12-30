import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Footer } from '@/components/Footer';
import { useAllStories } from '@/hooks/useAnime';
import { Anime } from '@/types';

export function AnimeList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  
  const { stories, loading, totalPages, totalItems } = useAllStories(page);
  const [filteredStories, setFilteredStories] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    let filtered = stories;

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(a => a.type === selectedType);
    }

    setFilteredStories(filtered);
  }, [stories, searchQuery, selectedType]);

  const types = Array.from(new Set(stories.map(a => a.type)));

  const handleStoryClick = (story: Anime) => {
    navigate(`/anime/${story.id}`, { state: { anime: story } });
  };

  // const handleSearch = (query: string) => {
  //   navigate(`/search?q=${encodeURIComponent(query)}`);
  // };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ page: String(page - 1) });
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setSearchParams({ page: String(page + 1) });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Danh sách Truyện</h1>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên truyện..."
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Loại
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Tất cả</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-400">
              Tìm thấy {filteredStories.length} truyện trên trang này (Tổng: {totalItems})
            </p>
          </div>
        </div>

        {/* Grid */}
        <AnimeGrid
          animes={filteredStories}
          loading={loading}
          onAnimeClick={handleStoryClick}
        />

        {!loading && filteredStories.length === 0 && stories.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Không tìm thấy truyện nào</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
              }}
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && stories.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Trang {page}</span>
              <span className="text-gray-400">/ {totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trang sau
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}