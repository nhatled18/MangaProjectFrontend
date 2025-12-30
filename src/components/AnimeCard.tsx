import { Anime } from '@/types';

interface AnimeCardProps {
  anime: Anime;
  onClick?: (anime: Anime) => void;
}

export function AnimeCard({ anime, onClick }: AnimeCardProps) {
  return (
    <div
      onClick={() => onClick?.(anime)}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative pb-[140%] bg-gray-700">
        <img
          src={anime.image || 'https://via.placeholder.com/200x280'}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {anime.status === 'Ongoing' && (
          <div className="absolute top-2 right-2 bg-gold-500 text-black text-xs font-bold px-2 py-1 rounded">
            Ongoing
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-white font-bold text-sm line-clamp-2">{anime.title}</h3>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span>👁</span>
            {(anime.viewCount / 1000).toFixed(0)}K
          </span>
          <span className="flex items-center gap-1 text-gold-500 font-semibold">
            <span>⭐</span>
            {anime.rating.toFixed(1)}
          </span>
        </div>

        {/* Episode info */}
        <div className="text-xs text-gray-500">
          {anime.currentEpisode}
        </div>
      </div>
    </div>
  );
}
