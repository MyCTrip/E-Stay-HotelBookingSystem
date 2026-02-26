import { create } from 'zustand'
import type { HotelMarket } from '../domain'

/**
 * 应用全局状态
 */
export interface AppStoreState {
  // ===== 市场选择 =====
  currentHotelMarket: HotelMarket

  // ===== Actions =====
  setMarket: (market: HotelMarket) => void
}

/**
 * 应用 Store
 */
export const useAppStore = create<AppStoreState>((set) => ({
  currentHotelMarket: 'domestic',

  setMarket: (market: HotelMarket) =>
    set(() => ({
      currentHotelMarket: market,
    })),
}))
