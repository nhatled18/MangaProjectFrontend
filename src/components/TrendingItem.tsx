import { Anime } from '@/types';
import { Eye, Star } from 'lucide-react';

interface TrendingItemProps {
  anime: Anime;
  rank: number;
  onClick?: (anime: Anime) => void;
}

export function TrendingItem({ anime, rank, onClick }: TrendingItemProps) {
  return (
    <div
      onClick={() => onClick?.(anime)}
      className="bg-gray-800 rounded-lg p-4 flex gap-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        <div className="text-gold-500 font-bold text-2xl w-12 text-center">
          #{rank}
        </div>
      </div>

      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={anime.image || 'https://via.placeholder.com/80x100'}
          alt={anime.title}
          className="w-20 h-28 object-cover rounded"
        />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <h3 className="text-white font-bold text-lg truncate">{anime.title}</h3>

        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Eye size={16} />
            {(anime.viewCount / 1000).toFixed(0)}K
          </span>
          <span className="text-gold-500 font-semibold flex items-center gap-1">
            <Star size={16} fill="currentColor" />
            {anime.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-400 text-xs mt-2 line-clamp-2">
          {anime.description}
        </p>
      </div>

      {/* Action button */}
      <div className="flex-shrink-0 flex items-center">
        <button className="bg-gold-500 text-black font-bold px-4 py-2 rounded hover:bg-gold-600 transition-colors">
          →
        </button>
      </div>
    </div>
  );
}
