import { useState, useCallback, useEffect } from 'react';
import { User, AuthResponse, UseAuthReturn } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Simple observable store to notify all subscribers when auth changes
class AuthStore {
  private token: string | null = null;
  private user: User | null = null;
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  subscribe(callback: () => void): (() => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(cb => cb());
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  setAuth(token: string | null, user: User | null) {
    this.token = token;
    this.user = user;

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    this.notify();
  }

  clear() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.notify();
  }
}

const authStore = new AuthStore();

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [token, setToken] = useState<string | null>(authStore.getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized] = useState(true);

  // ✅ Subscribe to store changes
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setToken(authStore.getToken());
      setUser(authStore.getUser());
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      const { access_token, user: userData } = data;
      if (!access_token || !userData) {
        throw new Error('Invalid response from server');
      }

      authStore.setAuth(access_token, userData);
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data: AuthResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || 'Registration failed');
        }

        setError(null);
        
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    authStore.clear();
  }, []);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isInitialized,
    isAdmin: user?.role === 'admin',
  };
};