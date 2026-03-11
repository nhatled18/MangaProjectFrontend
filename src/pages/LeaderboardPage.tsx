import Leaderboard from '@/components/Leaderboard';
import { useUserRank } from '@/hooks/useToken';
import { Trophy, Star, BookOpen, User } from 'lucide-react';

export function LeaderboardPage() {
  const { rank: myRank } = useUserRank();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bảng Xếp Hạng</h1>
          <p className="text-gray-500 text-lg">Vinh danh những độc giả nhiệt huyết nhất</p>
        </div>

        {/* My Rank Section */}
        {myRank && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={20} />
                Vị Trí Của Bạn
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-6 flex items-center gap-4 transition-colors hover:bg-gray-50">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Xếp Hạng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{myRank.rank || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="p-6 flex items-center gap-4 transition-colors hover:bg-gray-50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Token Đã Nạp</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(myRank.totalTokensPurchased || 0).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="p-6 flex items-center gap-4 transition-colors hover:bg-gray-50">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chapter Đã Mua</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myRank.chaptersUnlocked}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
