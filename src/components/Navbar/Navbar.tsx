import { Bell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavbar } from './useNavbar';
import { NavLinks } from './NavLinks';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const {
    isMenuOpen,
    isUserMenuOpen,
    isLoginFormOpen,
    isAuthenticated,
    toggleMenu,
    closeMenu,
    toggleUserMenu,
    closeUserMenu,
    toggleLoginForm,
    closeLoginForm,
    handleSearch
  } = useNavbar(onSearch);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-yellow-500 text-2xl font-bold">FAIRYTAILVIETNAM</div>
          </Link>

          {/* Search Bar - Desktop */}
          <SearchBar onSearch={handleSearch} className="hidden md:flex flex-1 mx-8" />

          {/* Navigation Links - Desktop */}
          <NavLinks className="hidden lg:flex items-center gap-8 text-sm" />

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="text-gray-400 hover:text-yellow-500 relative p-2">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <UserMenu
                  isOpen={isUserMenuOpen}
                  onToggle={toggleUserMenu}
                  onClose={closeUserMenu}
                />

                {/* Toggle Mobile Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="lg:hidden text-gray-400 hover:text-yellow-500 p-2"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              // Login button when not authenticated
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMenu}
                  className="lg:hidden text-gray-400 hover:text-yellow-500 p-2"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <button
                  onClick={toggleLoginForm}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-sm"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isLoginFormOpen && !isAuthenticated}
          onClose={closeLoginForm}
        />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
}
