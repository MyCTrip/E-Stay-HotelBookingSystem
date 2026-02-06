import { create } from 'zustand';

interface SearchState {
  city: string;
  checkIn: string;
  checkOut: string;
  setCity: (c: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  city: '上海',
  checkIn: '',
  checkOut: '',
  setCity: (c) => set({ city: c }),
}));
