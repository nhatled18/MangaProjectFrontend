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
      className="bg-gray-800 rounded-lg p-3 md:p-4 flex gap-3 md:gap-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200 group"
    >
      {/* Rank */}
      <div className="flex-shrink-0 flex items-center justify-center w-8 md:w-12">
        <div className="text-gold-500 font-bold text-xl md:text-2xl text-center">
          #{rank}
        </div>
      </div>

      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={anime.image || 'https://via.placeholder.com/80x100'}
          alt={anime.title}
          className="w-16 h-24 md:w-20 md:h-28 object-cover rounded shadow-md group-hover:shadow-gold-500/10"
        />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <h3 className="text-white font-bold text-md md:text-lg truncate group-hover:text-gold-500 transition-colors">
          {anime.title}
        </h3>

        <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Eye size={14} className="md:w-4 md:h-4 text-gray-500" />
            {(anime.viewCount / 1000).toFixed(0)}K
          </span>
          <span className="text-gold-500 font-bold flex items-center gap-1">
            <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
            {anime.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 line-clamp-1 md:line-clamp-2 italic">
          {anime.description}
        </p>
      </div>

      {/* Action button */}
      <div className="flex-shrink-0 flex items-center pl-1 md:pl-0">
        <button className="bg-gray-700 md:bg-gold-500 text-gold-500 md:text-black font-bold h-10 w-10 md:h-auto md:w-auto md:px-4 md:py-2 rounded-full md:rounded hover:bg-gold-500 hover:text-black transition-all">
          <span className="md:hidden">→</span>
          <span className="hidden md:inline">Xem ngay</span>
        </button>
      </div>
    </div>
  );
}
