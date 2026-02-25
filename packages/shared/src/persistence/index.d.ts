/**
 * 数据持久化层
 * 统一处理搜索历史、收藏夹、用户偏好等需要本地存储的数据
 */
/**
 * 搜索历史记录
 */
export interface SearchHistory {
    id: string;
    query: string;
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    timestamp: number;
}
/**
 * 收藏酒店记录
 */
export interface FavoriteHotel {
    hotelId: string;
    timestamp: number;
}
/**
 * 用户偏好
 */
export interface UserPreferences {
    theme: 'light' | 'dark';
    language: 'zh-CN' | 'en-US';
    defaultCity: string;
    notifications: boolean;
}
/**
 * 持久化存储管理器
 */
export declare class PersistenceManager {
    private readonly storagePrefix;
    constructor();
    /**
     * 保存搜索历史
     */
    saveSearchHistory(search: SearchHistory): Promise<void>;
    /**
     * 获取搜索历史
     */
    getSearchHistories(): Promise<SearchHistory[]>;
    /**
     * 清空搜索历史
     */
    clearSearchHistories(): Promise<void>;
    /**
     * 添加到收藏
     */
    addFavorite(hotelId: string): Promise<void>;
    /**
     * 从收藏移除
     */
    removeFavorite(hotelId: string): Promise<void>;
    /**
     * 获取收藏列表
     */
    getFavorites(): Promise<FavoriteHotel[]>;
    /**
     * 检查是否已收藏
     */
    isFavorited(hotelId: string): Promise<boolean>;
    /**
     * 保存用户偏好
     */
    savePreferences(preferences: Partial<UserPreferences>): Promise<void>;
    /**
     * 获取用户偏好
     */
    getPreferences(): Promise<UserPreferences>;
    /**
     * 生成存储键
     */
    private getStorageKey;
    /**
     * 清空所有数据
     */
    clearAll(): Promise<void>;
}
/**
 * 获取全局持久化管理器
 */
export declare function getPersistenceManager(): PersistenceManager;
declare const _default: {
    PersistenceManager: typeof PersistenceManager;
    getPersistenceManager: typeof getPersistenceManager;
};
export default _default;
//# sourceMappingURL=index.d.ts.map