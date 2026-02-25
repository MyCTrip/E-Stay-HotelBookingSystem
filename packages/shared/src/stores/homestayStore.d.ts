/**
 * 民宿 Zustand Store
 * 管理搜索、详情、推荐等所有民宿相关状态
 */
import type { Room, HomeStaySearchParams, PaginationMeta } from '../types';
import type { HomeStay } from '../types/homestay';
/** 本地副本类型 - 用于暂存修改不直接更新Store */
export interface DetailLocalCopy {
    homeStay: HomeStay;
    selectedRoomId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    otherModifications?: Record<string, any>;
}
/** 详情页上下文状态 - 仅UI交互状态 */
export interface DetailContextState {
    selectedRoomName: string;
    selectedRoomId?: string;
    expandNearbyProperties: boolean;
    currentTab: string;
    activeDrawer?: 'room' | 'facilities' | null;
    scrollPosition?: number;
    checkInDate?: string;
    checkOutDate?: string;
    deadlineTime?: number;
    isEditing?: boolean;
    localCopy?: DetailLocalCopy;
    modifiedFields?: Set<string>;
}
/** 搜索 UI 状态 */
export interface SearchUIState {
    activeModal?: 'location' | 'date' | 'guests' | 'filter' | null;
    isFilterPanelOpen: boolean;
    currentSort: 'price' | 'rating' | 'popularity' | 'newest';
    viewMode: 'list' | 'map';
}
/** Store 状态接口 */
export interface HomestayStoreState {
    searchParams: HomeStaySearchParams | null;
    homestays: HomeStay[];
    pagination: PaginationMeta;
    searchLoading: boolean;
    searchError: string | null;
    currentHomestay: HomeStay | null;
    detailContext: DetailContextState;
    detailLoading: boolean;
    detailError: string | null;
    hotHomestays: HomeStay[];
    recommendedHomestays: HomeStay[];
    nearbyRooms: Room[];
    searchUIState: SearchUIState;
    setSearchParams(params: HomeStaySearchParams): void;
    fetchSearchResults(params: HomeStaySearchParams): Promise<void>;
    loadMoreSearchResults(): Promise<void>;
    setSearchUIState(state: Partial<SearchUIState>): void;
    fetchHomestayDetail(id: string): Promise<void>;
    setCurrentHomestay(homestay: HomeStay | null): void;
    updateDetailContext(context: Partial<DetailContextState>): void;
    startEditingDetail(): void;
    setDetailLocalCopy(data: Partial<DetailLocalCopy>): void;
    commitDetailLocalCopy(): void;
    revertDetailLocalCopy(): void;
    resetDetailLocalCopy(): void;
    loadHotHomestays(): Promise<void>;
    loadRecommendedHomestays(city?: string, priceMin?: number, priceMax?: number): Promise<void>;
    loadNearbyRooms(homestayId: string): Promise<void>;
    clearCurrentHomestay(): void;
    clearErrors(): void;
    reset(): void;
}
export declare const useHomestayStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<HomestayStoreState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<HomestayStoreState, {
            searchParams: HomeStaySearchParams | null;
            detailContext: DetailContextState;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: HomestayStoreState) => void) => () => void;
        onFinishHydration: (fn: (state: HomestayStoreState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<HomestayStoreState, {
            searchParams: HomeStaySearchParams | null;
            detailContext: DetailContextState;
        }>>;
    };
}>;
//# sourceMappingURL=homestayStore.d.ts.map