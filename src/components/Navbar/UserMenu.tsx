import React from 'react';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface UserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = React.memo(({ isOpen, onToggle, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const menuItems = [
    { label: 'Hồ sơ cá nhân', icon: User, onClick: () => { navigate('/profile'); onClose(); } },
    { label: '🏆 Bảng Xếp Hạng', onClick: () => { navigate('/leaderboard'); onClose(); } },
    { label: 'Cài đặt', icon: Settings, onClick: () => { navigate('/settings'); onClose(); } },
  ];

  if (isAdmin) {
    menuItems.unshift({ 
      label: 'Dashboard Admin', 
      icon: Shield, 
      onClick: () => { navigate('/admin'); onClose(); } 
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease'
        }}
        aria-expanded={isOpen}
      >
        <img 
          src="/natsu-chibi.png" 
          alt="User Avatar" 
          className="user-avatar-ft" 
        />
        <div style={{ 
          display: 'none'
        }} className="user-info-text">
          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold', display: 'block' }}>
            {user?.username}
          </span>
          <span style={{ color: 'var(--primary-red)', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.05em', display: 'block' }}>
            {user?.token_balance?.toLocaleString() ?? 0} TOKEN
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <p>{user?.username}</p>
            <p className="email">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              navigate('/token-shop');
              onClose();
            }}
            className="user-menu-item buy-token"
          >
            ⭐ Mua Token
          </button>

          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="user-menu-item"
            >
              {item.icon && <item.icon size={16} style={{ flexShrink: 0 }} />}
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="user-menu-item logout"
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
});

UserMenu.displayName = 'UserMenu';
