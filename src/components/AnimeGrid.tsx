import { Anime } from '@/types';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
  loading?: boolean;
  onAnimeClick?: (anime: Anime) => void;
}

export function AnimeGrid({ animes, loading, onAnimeClick }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg pb-[140%] animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (animes.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-400 text-lg">Không tìm thấy truyện </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animes.map((anime, index) => (
        <AnimeCard
          key={anime.id || `anime-${index}`}
          anime={anime}
          onClick={onAnimeClick}
        />
      ))}
    </div>
  );
}
