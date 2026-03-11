import { create } from 'zustand';

interface TokenState {
  balance: number;
  lastUpdated: number;
  setBalance: (balance: number) => void;
  updateBalance: () => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  balance: 0,
  lastUpdated: Date.now(),
  setBalance: (balance: number) => set({ balance, lastUpdated: Date.now() }),
  updateBalance: () => set({ lastUpdated: Date.now() }),
}));
