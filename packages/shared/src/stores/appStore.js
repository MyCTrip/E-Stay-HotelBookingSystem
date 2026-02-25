import { create } from 'zustand';
/**
 * 应用 Store
 */
export const useAppStore = create((set) => ({
    currentHotelMarket: 'domestic',
    setMarket: (market) => set(() => ({
        currentHotelMarket: market,
    })),
}));
//# sourceMappingURL=appStore.js.map