import { create } from 'zustand'
import type { HotelMarket } from '../domain/hotel'

interface AppStoreState {
  currentHotelMarket: HotelMarket
  setMarket: (market: HotelMarket) => void
}

export const useAppStore = create<AppStoreState>((set) => ({
  currentHotelMarket: 'domestic',
  setMarket: (market) => set({ currentHotelMarket: market }),
}))

