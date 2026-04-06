import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { UserMenu } from './UserMenu';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar-ft">
        <div className="nav-left">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/logo-icon.png" alt="FairyTail Logo" className="logo-icon-img" />
            <span className="text-ft">FairyTail</span>
            <span className="text-reader" style={{ color: 'white' }}>Reader</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: '16px' }}>
            <Link to="/">Home</Link>
            <Link to="/anime-list" style={{ color: 'var(--text-muted)' }}>Chapters</Link>
            <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
          </div>
        </div>

        <div className="search-bar-ft">
          <input type="text" placeholder="Search Fairy Tail manga..." />
        </div>

        <div className="nav-right">
          <span style={{ cursor: 'pointer', fontSize: '1.2rem' }}>🔔</span>
          
          {isAuthenticated ? (
            <UserMenu 
              isOpen={isUserMenuOpen} 
              onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
              onClose={() => setIsUserMenuOpen(false)}
            />
          ) : (
            <img 
              src="/natsu-chibi.png" 
              alt="Natsu Profile" 
              className="user-avatar-ft cursor-pointer"
              onClick={() => setIsAuthModalOpen(true)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
