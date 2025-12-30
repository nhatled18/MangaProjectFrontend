import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Pagination } from '@/components/Pagination';
import { Footer } from '@/components/Footer';
import { useSearchAnimes } from '@/hooks/useAnime';
import { Anime } from '@/types';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // ✅ SỬA: Truyền currentPage vào hook để lấy đúng page từ backend
  const { animes, loading, error, totalPages, totalItems } = useSearchAnimes(query, currentPage);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`, { state: { anime } });
  };

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setSearchParams({ q: query, page: validPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Kết quả tìm kiếm cho: <span className="text-yellow-500">"{query}"</span>
          </h1>
          {!loading && (
            <p className="text-gray-400">
              {totalItems > 0 ? (
                <>
                  Tìm thấy <span className="text-yellow-500 font-semibold">{totalItems}</span> kết quả
                  {totalPages > 1 && ` - Trang ${currentPage} / ${totalPages}`}
                </>
              ) : (
                'Không tìm thấy kết quả nào'
              )}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : animes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              {query ? 'Không tìm thấy kết quả nào' : 'Vui lòng nhập từ khóa tìm kiếm'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-yellow-500 hover:text-yellow-400 transition-colors font-semibold"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        ) : (
          <>
            {/* ✅ Display animes từ backend */}
            <AnimeGrid
              animes={animes}
              loading={false}
              onAnimeClick={handleAnimeClick}
            />

            {/* ✅ Pagination controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Page info */}
            <div className="text-center text-gray-400 mt-8 text-sm">
              <p>
                Hiển thị {animes.length} kết quả trên trang này
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}