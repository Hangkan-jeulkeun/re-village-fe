import { create } from 'zustand';

interface TopToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

export const useTopToastStore = create<TopToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
