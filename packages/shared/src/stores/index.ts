/**
 * Stores 统一导出
 */

export { useAppStore } from './appStore'
export type { AppStoreState } from './appStore'

export { useHomestayStore } from './homestayStore'
export type {
  HomestayStoreState,
  DetailContextState,
  SearchUIState,
} from './homestayStore'

export { useHotelStore, initHotelStore, resetHotelStore } from './hotelStore'
export type { SearchParams, HotelStoreState } from './hotelStore'
