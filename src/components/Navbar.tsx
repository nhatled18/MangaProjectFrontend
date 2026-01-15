import { useState} from 'react';
import { Search, Bell, User, Menu, LogOut, Settings, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = useState({ username: '', password: '', email: '' });
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, login, register, isLoading } = useAuth();

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      if (loginMode === 'login') {
        if (!loginData.username || !loginData.password) {
          setLoginError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        await login(loginData.username, loginData.password);
      } else {
        if (!loginData.username || !loginData.email || !loginData.password) {
          setLoginError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        await register(loginData.username, loginData.email, loginData.password);
        setLoginMode('login');
        setLoginData({ username: '', password: '', email: '' });
        setLoginError('Đăng ký thành công! Vui lòng đăng nhập.');
      }
      // Reset form after successful login
      if (loginMode === 'login') {
        setLoginData({ username: '', password: '', email: '' });
        setIsLoginFormOpen(false);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
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
              // Login button when not authenticated - positioned to the right
              <button
                onClick={() => setIsLoginFormOpen(!isLoginFormOpen)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-sm"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Login Form Modal - Centered */}
        {isLoginFormOpen && !isAuthenticated && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl">
                  {loginMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                </h3>
                <button
                  onClick={() => {
                    setIsLoginFormOpen(false);
                    setLoginError('');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-500/20 border border-red-500 text-red-400 rounded text-sm">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Nhập username"
                    disabled={isLoading}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  />
                </div>

                {loginMode === 'register' && (
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Nhập email"
                      disabled={isLoading}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    disabled={isLoading}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Đang xử lý...' : loginMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-400">
                {loginMode === 'login' ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <button
                      onClick={() => {
                        setLoginMode('register');
                        setLoginError('');
                      }}
                      disabled={isLoading}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold disabled:opacity-50"
                    >
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <button
                      onClick={() => {
                        setLoginMode('login');
                        setLoginError('');
                      }}
                      disabled={isLoading}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold disabled:opacity-50"
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
              Danh sách Truyện
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

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block text-red-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                🛡️ Admin Dashboard
              </Link>
            )}

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