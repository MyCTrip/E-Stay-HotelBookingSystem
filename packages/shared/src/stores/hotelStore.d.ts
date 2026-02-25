import { IApiService } from '../api';
import { Hotel, Room, HotelQuery, PropertyType } from '../types';
/**
 * 搜索参数
 */
export interface SearchParams {
    city: string;
    keyword: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    filters: {
        star?: number;
        priceRange?: [number, number];
        tags?: string[];
    };
}
export interface ExtendedSearchParams extends SearchParams {
    propertyType?: PropertyType;
}
/**
 * 酒店 Store 状态
 */
interface HotelStoreState {
    searchParams: ExtendedSearchParams;
    hotels: Hotel[];
    hotelsPagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
    currentHotel: Hotel | null;
    currentHotelRooms: Room[];
    currentRoom: Room | null;
    hotHotels: Hotel[];
    loading: boolean;
    error: string | null;
    setSearchParams: (params: Partial<ExtendedSearchParams>) => void;
    fetchHotels: (query: HotelQuery) => Promise<void>;
    fetchMoreHotels: () => Promise<void>;
    fetchHotelDetail: (id: string) => Promise<void>;
    fetchRoomDetail: (id: string) => Promise<void>;
    fetchHotHotels: () => Promise<void>;
    clearError: () => void;
    resetHotels: () => void;
}
/**
 * 创建酒店 Store（工厂函数）
 */
export declare function createHotelStore(api: IApiService): import("zustand").UseBoundStore<import("zustand").StoreApi<HotelStoreState>>;
/**
 * 获取 Hotel Store Hook（作为 React Hook 使用）
 * @throws 如果 Store 未初始化，抛出错误
 */
export declare function useHotelStore(): HotelStoreState;
/**
 * 初始化 Hotel Store（幂等性）
 * @param api API 服务实例
 */
export declare function initHotelStore(api: IApiService): void;
/**
 * 重置 Store 状态（用于测试或用户登出）
 */
export declare function resetHotelStore(): void;
export {};
//# sourceMappingURL=hotelStore.d.ts.map