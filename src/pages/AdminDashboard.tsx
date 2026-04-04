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
    <div className="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-header">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Shield className="text-yellow-500" size={28} />
            <h1>Admin Dashboard</h1>
          </div>
          <p>Quản lý người dùng và upload truyện & chương</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('upload-anime')}
            className={`admin-tab ${activeTab === 'upload-anime' ? 'active' : ''} flex items-center gap-2`}
          >
            <Plus size={18} />
            Upload Truyện & Chương
          </button>
          <button
            onClick={() => setActiveTab('my-stories')}
            className={`admin-tab ${activeTab === 'my-stories' ? 'active' : ''} flex items-center gap-2`}
          >
            <CheckCircle size={18} />
            Quản lý truyện
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'users' && <UserManagement token={token} />}
          {activeTab === 'upload-anime' && <AnimeUpload token={token} />}
          {activeTab === 'my-stories' && (
            <AnimeManagement token={token} onNavigateToUpload={() => { setActiveTab('upload-anime'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          )}
        </div>
      </div>
    </div>
  );
}