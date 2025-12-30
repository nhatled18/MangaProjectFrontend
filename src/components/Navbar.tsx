import { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // ✅ Auto-redirect to login when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Navigate to search page
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=1`);

    // Call callback if provided
    onSearch?.(searchQuery);

    // Close mobile menu after search
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout(); // ✅ Just call logout - useEffect above will handle navigation
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-yellow-500 text-2xl font-bold">TRUYENVUI</div>
          </Link>

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm Anime..."
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
          )}

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <Link
                to="/"
                className="text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/anime-list"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Danh sách Anime
              </Link>
              <Link
                to="/new-seasons"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Mùa mới
              </Link>
              <Link
                to="/popular"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Phổ biến
              </Link>
              {/* Admin Dashboard Link */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-red-400 hover:text-red-300 transition-colors font-semibold"
                >
                  🛡️ Admin
                </Link>
              )}
            </div>
          )}

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
                    <span className="hidden sm:inline text-gray-300 text-sm max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-gray-300 text-sm font-semibold">{user?.username}</p>
                        <p className="text-gray-500 text-xs">{user?.email}</p>
                      </div>

                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 transition-colors flex items-center gap-2"
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
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
                  <Menu size={20} />
                </button>
              </>
            ) : (
              // Login/Register buttons when not authenticated
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-gray-700 py-4 space-y-2">
            <Link
              to="/"
              className="block text-yellow-500 px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/anime-list"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Danh sách Anime
            </Link>
            <Link
              to="/new-seasons"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Mùa mới
            </Link>
            <Link
              to="/popular"
              className="block text-gray-300 px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Phổ biến
            </Link>

            {/* Admin Link for Mobile */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block text-red-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                🛡️ Admin Dashboard
              </Link>
            )}

            {/* Mobile Search */}
            <div className="px-4 py-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full bg-gray-800 text-white px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
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

            {/* Mobile User Menu */}
            <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded flex items-center gap-2"
              >
                <User size={16} />
                Hồ sơ cá nhân
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded flex items-center gap-2"
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
          </div>
        )}
      </div>
    </nav>
  );
}