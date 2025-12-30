export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  error?: string;
  access_token?: string;
  user?: User;
}

export interface DebugState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasUser: boolean;
  hasToken: boolean;
  username?: string;
  tokenInStorage: boolean;
  userInStorage: boolean;
}

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  debugState: () => DebugState;
}

export interface AuthContextType extends UseAuthReturn {}