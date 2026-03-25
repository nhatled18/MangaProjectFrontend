import { useState} from 'react';
import { Search, Bell, User, Menu, LogOut, Settings, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthForm } from './AuthForm';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=1`);
    onSearch?.(searchQuery);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserMenuOpen(false);
  };



  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-yellow-500 text-2xl font-bold">FAIRYTAILVIETNAM</div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm truyện..."
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
            <Link to="/" className="text-yellow-500 hover:text-yellow-400 transition-colors">
              Trang chủ
            </Link>
            <Link to="/anime-list" className="text-gray-300 hover:text-white transition-colors">
              Danh sách Truyện
            </Link>
            <Link to="/new-seasons" className="text-gray-300 hover:text-white transition-colors">
              Mùa mới
            </Link>
            <Link to="/popular" className="text-gray-300 hover:text-white transition-colors">
              Phổ biến
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              Về chúng tôi
            </Link>
            {/* Admin Dashboard Link */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-red-400 hover:text-red-300 transition-colors font-semibold">
                🛡️ Admin
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="text-gray-400 hover:text-yellow-500 relative p-2">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-gray-400 hover:text-yellow-500 p-2 flex items-center gap-2"
                  >
                    <User size={20} />
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                      <span className="text-gray-300 text-sm max-w-[100px] truncate">
                        {user?.username}
                      </span>
                      <span className="text-yellow-500 text-[10px] font-bold">
                        {user?.token_balance?.toLocaleString() ?? 0} TOKEN
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-gray-300 text-sm font-semibold">{user?.username}</p>
                        <p className="text-gray-500 text-xs">{user?.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('/token-shop');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors font-semibold text-sm border-b border-gray-700"
                      >
                        ⭐ Mua Token
                      </button>

                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 transition-colors flex items-center gap-2"
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
                      </button>

                      <button
                        onClick={() => {
                          navigate('/leaderboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 transition-colors"
                      >
                        🏆 Bảng Xếp Hạng
                      </button>

                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 transition-colors flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Cài đặt
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2 border-t border-gray-700"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-gray-400 hover:text-yellow-500 p-2"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              // Login button when not authenticated - positioned to the right
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-gray-400 hover:text-yellow-500 p-2"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <button
                  onClick={() => setIsLoginFormOpen(!isLoginFormOpen)}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-sm"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login Form Modal - Centered */}
        {isLoginFormOpen && !isAuthenticated && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsLoginFormOpen(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                title="Đóng"
              >
                <X size={24} />
              </button>
              
              <AuthForm onSuccess={() => setIsLoginFormOpen(false)} isModal={true} />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4 space-y-2 animate-slide-down">
            {/* Search Bar Mobile */}
            <div className="px-4 py-2 mb-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm truyện..."
                    className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>

            <Link
              to="/"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/anime-list"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Danh sách Truyện
            </Link>
            <Link
              to="/new-seasons"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mùa mới
            </Link>
            <Link
              to="/popular"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Phổ biến
            </Link>
            <Link
              to="/about"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Về chúng tôi
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/token-shop"
                  className="block text-blue-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⭐ Mua Token
                </Link>
                <Link
                  to="/leaderboard"
                  className="block text-yellow-500 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏆 Bảng Xếp Hạng
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block text-red-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🛡️ Admin
                  </Link>
                )}

                <div className="border-t border-gray-700 mt-2 pt-2 space-y-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-800 rounded flex items-center gap-2"
                  >
                    <User size={16} />
                    Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-800 rounded flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Cài đặt
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}