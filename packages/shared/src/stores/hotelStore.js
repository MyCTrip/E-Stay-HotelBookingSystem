import { create } from 'zustand';
/**
 * 创建酒店 Store（工厂函数）
 */
export function createHotelStore(api) {
    const store = create((set, get) => ({
        // 初始状态
        searchParams: {
            city: 'Beijing',
            keyword: '',
            filters: {},
            propertyType: undefined,
        },
        hotels: [],
        hotelsPagination: {
            page: 1,
            limit: 10,
            total: 0,
            hasMore: true,
        },
        currentHotel: null,
        currentHotelRooms: [],
        currentRoom: null,
        hotHotels: [],
        loading: false,
        error: null,
        // ===== Actions =====
        setSearchParams: (params) => set((state) => ({
            searchParams: { ...state.searchParams, ...params },
        })),
        fetchHotels: async (query) => {
            set({ loading: true, error: null });
            try {
                // 如果调用方未传 propertyType，则优先从 store.searchParams 中注入
                const state = get();
                const mergedQuery = { ...(query || {}) };
                if (!mergedQuery.propertyType && state.searchParams?.propertyType) {
                    mergedQuery.propertyType = state.searchParams.propertyType;
                }
                const res = await api.getHotels(mergedQuery);
                set({
                    hotels: res.data,
                    hotelsPagination: {
                        page: res.meta.page,
                        limit: res.meta.limit,
                        total: res.meta.total,
                        hasMore: res.meta.page * res.meta.limit < res.meta.total,
                    },
                });
            }
            catch (err) {
                set({ error: err.message });
            }
            finally {
                set({ loading: false });
            }
        },
        fetchMoreHotels: async () => {
            const state = get();
            if (!state.hotelsPagination.hasMore)
                return;
            set({ loading: true });
            try {
                const nextPage = state.hotelsPagination.page + 1;
                const merged = {
                    ...state.searchParams,
                    page: nextPage,
                    limit: state.hotelsPagination.limit,
                };
                const res = await api.getHotels(merged);
                set({
                    hotels: [...state.hotels, ...res.data],
                    hotelsPagination: {
                        page: nextPage,
                        limit: res.meta.limit,
                        total: res.meta.total,
                        hasMore: nextPage * res.meta.limit < res.meta.total,
                    },
                });
            }
            catch (err) {
                set({ error: err.message });
            }
            finally {
                set({ loading: false });
            }
        },
        fetchHotelDetail: async (id) => {
            set({ loading: true, error: null });
            try {
                const hotel = await api.getHotelDetail(id);
                set({ currentHotel: hotel });
                // 同时获取房型列表
                const rooms = await api.getRoomsByHotel(id);
                set({ currentHotelRooms: rooms.data || [] });
            }
            catch (err) {
                set({ error: err.message });
            }
            finally {
                set({ loading: false });
            }
        },
        fetchRoomDetail: async (id) => {
            set({ loading: true, error: null });
            try {
                const room = await api.getRoomDetail(id);
                set({ currentRoom: room });
            }
            catch (err) {
                set({ error: err.message });
            }
            finally {
                set({ loading: false });
            }
        },
        fetchHotHotels: async () => {
            try {
                const hotels = await api.getHotHotels(10);
                set({ hotHotels: hotels });
            }
            catch (err) {
                console.error('Failed to fetch hot hotels:', err.message);
            }
        },
        clearError: () => set({ error: null }),
        resetHotels: () => set({
            hotels: [],
            hotelsPagination: {
                page: 1,
                limit: 10,
                total: 0,
                hasMore: true,
            },
        }),
    }));
    return store;
}
// 全局 store hook（惰性初始化，支持 reset）
let storeHook = null;
let apiInstance = null;
/**
 * 获取 Hotel Store Hook（作为 React Hook 使用）
 * @throws 如果 Store 未初始化，抛出错误
 */
export function useHotelStore() {
    if (!storeHook) {
        throw new Error('🔴 HotelStore not initialized! Call initHotelStore(api) in app startup.');
    }
    return storeHook(); // ✅ 调用 hook 获取 state
}
/**
 * 获取 store 实例（用于非-React 上下文）
 */
function getStoreInstance() {
    if (!storeHook) {
        throw new Error('HotelStore not initialized');
    }
    return storeHook;
}
/**
 * 初始化 Hotel Store（幂等性）
 * @param api API 服务实例
 */
export function initHotelStore(api) {
    if (storeHook) {
        console.warn('⚠️ HotelStore already initialized, skipping...');
        return;
    }
    apiInstance = api;
    storeHook = createHotelStore(api);
}
/**
 * 重置 Store 状态（用于测试或用户登出）
 */
export function resetHotelStore() {
    if (!storeHook)
        return;
    const state = storeHook.getState();
    state.resetHotels?.();
    state.clearError?.();
}
//# sourceMappingURL=hotelStore.js.map