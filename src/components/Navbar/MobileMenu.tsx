import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavLinks } from './NavLinks';
import { SearchBar } from './SearchBar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = React.memo(({ isOpen, onClose, onSearch }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };

  return (
    <div className="lg:hidden border-t border-gray-700 py-4 space-y-2 animate-slide-down">
      <SearchBar mobile onSearch={(q) => { onSearch(q); onClose(); }} className="px-4 py-2 mb-2" />
      
      <NavLinks mobile onItemClick={onClose} />

      {isAuthenticated && (
        <>
          <Link
            to="/token-shop"
            className="block text-blue-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold flex items-center gap-2"
            onClick={onClose}
          >
            ⭐ Mua Token
          </Link>
          <Link
            to="/leaderboard"
            className="block text-yellow-500 px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
            onClick={onClose}
          >
            🏆 Bảng Xếp Hạng
          </Link>

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
                onClose();
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
  );
});

MobileMenu.displayName = 'MobileMenu';
