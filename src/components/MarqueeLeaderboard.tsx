import { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';
import { Trophy, Star, Medal } from 'lucide-react';

export function MarqueeLeaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for testing
  const mockData = [
    { userId: 1, username: 'NatsuFire', rank: 1, tokensPurchased: 5000 },
    { userId: 2, username: 'LucyHeartfilia', rank: 2, tokensPurchased: 3500 },
    { userId: 3, username: 'GrayFullbuster', rank: 3, tokensPurchased: 2800 },
    { userId: 4, username: 'ElsaScarlette', rank: 4, tokensPurchased: 1200 },
    { userId: 5, username: 'HappyDragon', rank: 5, tokensPurchased: 950 },
  ];

  useEffect(() => {
    const fetchTop = async () => {
      try {
        // Try monthly top first, then fallback to regular top leaderboard
        let top = await tokenService.getMonthlyTopPurchases();
        
        if (!top || top.length === 0) {
          // Fallback to regular leaderboard top 10
          const leaderboardData = await tokenService.getTopLeaderboard();
          top = leaderboardData.slice(0, 10);
        }
        
        setEntries(top && top.length > 0 ? top : mockData);
      } catch (err) {
        console.error('Failed to fetch marquee leaderboard', err);
        setEntries(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) return null;

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
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#0B101E] via-[#151B2B] to-[#0B101E] border-b border-[#FF3B3B]/20 py-2 shadow-lg shadow-[#FF3B3B]/10 group">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B101E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B101E] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {displayEntries.map((entry, idx) => (
          <div 
            key={`${entry.userId}-${idx}`} 
            className="inline-flex items-center mx-8 text-sm"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#151B2B] hover:bg-[#1E2847] transition-colors border border-[#FF3B3B]/30">
              <span className="flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </span>
              <span className="text-white/50 text-xs font-medium">#{entry.rank}</span>
              <span className={`${getRankColor(entry.rank)} font-semibold`}>
                {entry.username}
              </span>
              <span className="text-white/80 ml-1">đã mua</span>
              <span className="text-[#FF3B3B] font-mono font-bold text-sm mx-1">
                {(entry.tokensPurchased || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-white/80">token</span>
            </div>
            
            {/* Visual separator between items if not last */}
            <span className="ml-8 text-white/20">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
