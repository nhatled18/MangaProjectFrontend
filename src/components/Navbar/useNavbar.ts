import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const useNavbar = (onSearch?: (query: string) => void) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const toggleUserMenu = useCallback(() => setIsUserMenuOpen(prev => !prev), []);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

  const toggleLoginForm = useCallback(() => setIsLoginFormOpen(prev => !prev), []);
  const closeLoginForm = useCallback(() => setIsLoginFormOpen(false), []);

  const handleSearch = useCallback((query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}&page=1`);
    onSearch?.(query);
    closeMenu();
  }, [onSearch, closeMenu, navigate]);

  return {
    isMenuOpen,
    isUserMenuOpen,
    isLoginFormOpen,
    isAuthenticated,
    user,
    logout,
    toggleMenu,
    closeMenu,
    toggleUserMenu,
    closeUserMenu,
    toggleLoginForm,
    closeLoginForm,
    handleSearch
  };
};
