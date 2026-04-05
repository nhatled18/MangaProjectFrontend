import { useState, useCallback, useEffect } from 'react';
import { User, AuthResponse, UseAuthReturn } from '../types/auth';
import apiClient from '../services/api';

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
        // ✅ Restore currentUserId for reading progress separation
        if (this.user && this.user.id) {
          localStorage.setItem('currentUserId', String(this.user.id));
        }
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUserId');
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

  getToken() { return this.token; }
  getUser() { return this.user; }

  setAuth(token: string | null, user: User | null) {
    this.token = token;
    this.user = user;

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // ✅ Set currentUserId for reading progress separation
      localStorage.setItem('currentUserId', String(user.id));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // ✅ Clear currentUserId on logout
      localStorage.removeItem('currentUserId');
    }

    this.notify();
  }

  updateUser(updatedUser: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
        } catch (e) {
          console.error('Error updating stored user:', e);
        }
      }
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

  useEffect(() => {
    return authStore.subscribe(() => {
      setToken(authStore.getToken());
      setUser(authStore.getUser());
    });
  }, []);

  const handleAuthRequest = useCallback(async (
    url: string, 
    method: 'POST' | 'GET', 
    body?: any
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient({
        url,
        method,
        data: body,
      });

      const data: AuthResponse = res.data;
      if (data.access_token && data.user) {
        authStore.setAuth(data.access_token, data.user);
      }
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Authentication failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    token,
    isLoading,
    error,
    login: (username, password) => handleAuthRequest('/auth/login', 'POST', { username, password }),
    register: (username, email, password) => handleAuthRequest('/auth/register', 'POST', { username, email, password }),
    forgotPassword: (email) => handleAuthRequest('/auth/forgot-password', 'POST', { email }),
    verifyResetCode: (email, code) => handleAuthRequest('/auth/verify-reset-code', 'POST', { email, code }),
    resetPassword: (email, code, newPassword) => handleAuthRequest('/auth/reset-password', 'POST', { email, code, newPassword }),
    logout: () => authStore.clear(),
    updateUser: (data) => authStore.updateUser(data),
    isAuthenticated: !!token && !!user,
    isInitialized: true,
    isAdmin: user?.role === 'admin',
  };
};