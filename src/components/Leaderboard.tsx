import { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';
import { LeaderboardEntry } from '@/types';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface LeaderboardProps {
  limit?: number;
  showTop?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ limit = 50, showTop = false }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, [currentPage, showTop]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (showTop) {
        const topEntries = await tokenService.getTopLeaderboard();
        setEntries(topEntries);
        setTotalEntries(topEntries.length);
      } else {
        const offset = (currentPage - 1) * limit;
        const { entries, total } = await tokenService.getLeaderboard(limit, offset);
        setEntries(entries);
        setTotalEntries(total);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (!rank) return <span className="text-gray-400 text-sm">N/A</span>;
    if (rank === 1) return <div className="text-2xl filter drop-shadow-sm">🥇</div>;
    if (rank === 2) return <div className="text-2xl filter drop-shadow-sm">🥈</div>;
    if (rank === 3) return <div className="text-2xl filter drop-shadow-sm">🥉</div>;
    return (
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black text-gray-500 border border-gray-100 shadow-inner">
        {rank}
      </div>
    );
  };

  const getRowHighlight = (rank: number) => {
    if (rank === 1) return 'bg-amber-50/40';
    if (rank === 2) return 'bg-slate-50/40';
    if (rank === 3) return 'bg-orange-50/40';
    return '';
  };

  const totalPages = Math.ceil(totalEntries / limit);

  return (
    <div className="w-full">
      {/* Table Header Wrapper */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="text-amber-500" size={24} />
            {showTop ? 'Top 10 Độc Giả' : 'Bảng Xếp Hạng'}
          </h2>
          <p className="text-sm text-gray-500">Thứ hạng dựa trên tổng số token đã nạp</p>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400 font-medium">Đang tải bảng xếp hạng...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50/50">
            <div className="text-4xl mb-4">🏜️</div>
            <p className="font-medium">Chưa có dữ liệu bảng xếp hạng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center w-24">Hạng</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Độc Giả</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Token Nạp</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Chapter Mở</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`group transition-all duration-200 hover:bg-blue-50/30 ${getRowHighlight(entry.rank)}`}
                  >
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        {getRankBadge(entry.rank)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          {entry.rank <= 3 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <div className={`w-2 h-2 rounded-full ${entry.rank === 1 ? 'bg-amber-400' : entry.rank === 2 ? 'bg-slate-400' : 'bg-orange-400'}`}></div>
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">
                          {entry.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-black text-sm border border-blue-100">
                        {(entry.tokensPurchased || 0).toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-500">
                      {entry.chaptersUnlocked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination & Footer */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 font-medium">
          Hiển thị <span className="text-gray-900 font-bold">{entries.length}</span> / <span className="text-gray-900 font-bold">{totalEntries}</span> độc giả
        </p>

        {!showTop && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
              title="Trang trước"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 px-3">
              <span className="text-sm font-bold text-blue-600">{currentPage}</span>
              <span className="text-sm font-medium text-gray-400">/</span>
              <span className="text-sm font-bold text-gray-600">{totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
              title="Trang sau"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
