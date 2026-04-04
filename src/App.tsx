import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { MarqueeLeaderboard } from '@/components/MarqueeLeaderboard';

// Pages
import { Home } from '@/pages/Home';
import { AnimeList } from '@/pages/AnimeList';
import { AnimeDetail } from '@/pages/AnimeDetail';
import { ChapterViewer } from '@/pages/ChapterViewer';
import { NewSeasons } from '@/pages/NewSeasons';
import { Popular } from '@/pages/Popular';
import { SearchResults } from '@/pages/SearchResults';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';
import { TokenShopPage } from '@/pages/TokenShopPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
// import { AboutUs } from '@/pages/AboutUs';

import { useEffect } from 'react';
import { tokenService } from '@/services/tokenService';

function App() {
  const auth = useAuth();

  // 🕵️ Cảm biến số dư chạy ngầm (Background Polling)
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) return;

    const fetchBalance = async () => {
      try {
        const balance = await tokenService.getTokenBalance();
        if (balance !== auth.user?.token_balance) {
          auth.updateUser({ token_balance: balance });
          console.log('--- [Auth] Token balance updated automatically ---');
        }
      } catch (err) {
        // Silently fail to not disturb user
      }
    };

    // Chạy ngay lần đầu
    fetchBalance();

    // Và lặp lại sau mỗi 5 giây (Rất nhanh)
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.user?.id]);

  if (!auth.isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <MarqueeLeaderboard />
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* ✅ Tất cả routes công khai - không cần login */}
            <Route path="/" element={<Home />} />
            <Route path="/anime-list" element={<AnimeList />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/chapter/:animeId/:chapterId" element={<ChapterViewer />} />
            <Route path="/new-seasons" element={<NewSeasons />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            {/* <Route path="/about" element={<AboutUs />} /> */}
            {/* ✅ Token Shop & Profile - chỉ hiển thị khi đã login */}
            {auth.isAuthenticated && (
              <>
                <Route path="/token-shop" element={<TokenShopPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </>
            )}

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;