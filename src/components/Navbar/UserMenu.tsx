import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface UserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = React.memo(({ isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const menuItems = [
    { label: 'Hồ sơ cá nhân', icon: User, onClick: () => { navigate('/profile'); onClose(); } },
    { label: '🏆 Bảng Xếp Hạng', onClick: () => { navigate('/leaderboard'); onClose(); } },
    { label: 'Cài đặt', icon: Settings, onClick: () => { navigate('/settings'); onClose(); } },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-yellow-500 p-2 flex items-center gap-2"
        aria-expanded={isOpen}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-gray-300 text-sm font-semibold">{user?.username}</p>
            <p className="text-gray-500 text-xs">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              navigate('/token-shop');
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors font-semibold text-sm border-b border-gray-700"
          >
            ⭐ Mua Token
          </button>

          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 transition-colors flex items-center gap-2"
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ))}

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
  );
});

UserMenu.displayName = 'UserMenu';
