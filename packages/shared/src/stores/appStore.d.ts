import type { HotelMarket } from '../domain';
/**
 * 应用全局状态
 */
export interface AppStoreState {
    currentHotelMarket: HotelMarket;
    setMarket: (market: HotelMarket) => void;
}
/**
 * 应用 Store
 */
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppStoreState>>;
//# sourceMappingURL=appStore.d.ts.map