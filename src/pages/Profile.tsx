import { useAuth } from '../hooks/useAuth';
import { Mail, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <p className="text-gray-400">Thành viên từ {joinDate}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Thông tin tài khoản</h2>

          <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
            <User size={20} className="text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Username</p>
              <p className="text-white font-semibold">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
            <Mail size={20} className="text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Ngày tham gia</p>
              <p className="text-white font-semibold">{joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}