import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

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

import './App.css';

function App() {
  const auth = useAuth();

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
            
            {/* ✅ Profile & Settings - chỉ hiển thị khi đã login */}
            {auth.isAuthenticated && (
              <>
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