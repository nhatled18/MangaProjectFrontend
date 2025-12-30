import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';

import './App.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if already logged in)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return !auth.isAuthenticated ? children : <Navigate to="/" replace />;
};

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
        {/* ✅ CRITICAL FIX: Always render Navbar 
            Let Navbar handle showing/hiding based on isAuthenticated 
            This prevents unmount/remount when auth state changes */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/anime-list" element={<ProtectedRoute><AnimeList /></ProtectedRoute>} />
            <Route path="/anime/:id" element={<ProtectedRoute><AnimeDetail /></ProtectedRoute>} />
            <Route path="/chapter/:animeId/:chapterId" element={<ProtectedRoute><ChapterViewer /></ProtectedRoute>} />
            <Route path="/new-seasons" element={<ProtectedRoute><NewSeasons /></ProtectedRoute>} />
            <Route path="/popular" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* 404 - Redirect to home or login */}
            <Route 
              path="*" 
              element={<Navigate to={auth.isAuthenticated ? "/" : "/login"} replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;