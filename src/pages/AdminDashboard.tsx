import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, CheckCircle } from 'lucide-react';
import { UserManagement } from '../components/admin/UserManagement';
import { AnimeUpload } from '../components/admin/AnimeUpload';
import { AnimeManagement } from '../components/admin/AnimeManagement';

export function AdminDashboard() {
  const { isAdmin, isAuthenticated, token, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'upload-anime' | 'my-stories'>('users');


  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isInitialized, isAuthenticated, isAdmin, navigate]);
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-yellow-500" size={32} />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Quản lý người dùng và upload truyện & chương</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
              }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('upload-anime')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'upload-anime'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <Plus size={18} />
            Upload Truyện & Chương
          </button>
          <button
            onClick={() => setActiveTab('my-stories')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'my-stories'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
              }`}
          >
            <CheckCircle size={18} />
            Quản lý truyện
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && <UserManagement token={token} />}

        {/* Upload Anime & Chapters Tab */}
        {activeTab === 'upload-anime' && (
          <AnimeUpload token={token} />
        )}

        {/* My Stories Tab */}
        {activeTab === 'my-stories' && (
          <AnimeManagement token={token} onNavigateToUpload={() => { setActiveTab('upload-anime'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
      </div>
    </div>
  );
}