import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from './Navbar.constants';
import { useAuth } from '../../hooks/useAuth';

interface NavLinksProps {
  className?: string;
  onItemClick?: () => void;
  mobile?: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = React.memo(({ className = '', onItemClick, mobile = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  const linkStyles = (href: string) => {
    if (mobile) {
      return `block px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2 transition-colors ${
        isActive(href) ? 'text-yellow-500' : 'text-gray-300'
      }`;
    }
    return `transition-colors ${
      isActive(href) ? 'text-yellow-500' : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <div className={className}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={linkStyles(link.href)}
          onClick={onItemClick}
        >
          {link.label}
        </Link>
      ))}
      
      {/* Admin Link */}
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          className={mobile 
            ? "block text-red-400 px-4 py-2 hover:bg-gray-800 rounded font-semibold flex items-center gap-2"
            : "text-red-400 hover:text-red-300 transition-colors font-semibold"
          }
          onClick={onItemClick}
        >
          🛡️ Admin
        </Link>
      )}
    </div>
  );
});

NavLinks.displayName = 'NavLinks';
