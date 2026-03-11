import { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';
import { Trophy, Star, Medal } from 'lucide-react';

export function MarqueeLeaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const top = await tokenService.getMonthlyTopPurchases();
        setEntries(top);
      } catch (err) {
        console.error('Failed to fetch marquee leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading || entries.length === 0) return null;

  // Double the entries for seamless loop
  const displayEntries = [...entries, ...entries];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={16} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={16} className="text-gray-300" />;
    if (rank === 3) return <Medal size={16} className="text-orange-400" />;
    return <Star size={14} className="text-blue-300" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 font-bold';
    if (rank === 2) return 'text-gray-200 font-semibold';
    if (rank === 3) return 'text-orange-300 font-semibold';
    return 'text-white/90';
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#1d8a99] via-[#43c6ac] to-[#1d8a99] border-b border-white/10 py-1.5 shadow-lg group">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#1d8a99] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#1d8a99] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {displayEntries.map((entry, idx) => (
          <div 
            key={`${entry.userId}-${idx}`} 
            className="inline-flex items-center mx-8 text-sm"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 hover:bg-black/20 transition-colors border border-white/5">
              <span className="flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </span>
              <span className="text-white/60 text-xs font-medium">#{entry.rank}</span>
              <span className={`${getRankColor(entry.rank)} font-semibold`}>
                {entry.username}
              </span>
              <span className="text-white/90 ml-1">đã mua</span>
              <span className="text-yellow-400 font-mono font-bold text-sm mx-1">
                {(entry.tokensPurchased || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-white/90">token</span>
            </div>
            
            {/* Visual separator between items if not last */}
            <span className="ml-8 text-white/30">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
