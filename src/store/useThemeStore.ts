import { create } from 'zustand';

interface ThemeState {
  dark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  dark: true,
  toggle: () => set((state) => ({ dark: !state.dark })),
  setDark: (dark) => set({ dark }),
}));
