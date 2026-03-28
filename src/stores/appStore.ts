import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  theme: 'light' | 'dark';
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  theme: 'light',
  setLoading: (isLoading) => set({ isLoading }),
  setTheme: (theme) => set({ theme }),
}));
