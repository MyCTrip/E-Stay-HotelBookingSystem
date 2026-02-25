/**
 * 数据持久化层
 * 统一处理搜索历史、收藏夹、用户偏好等需要本地存储的数据
 */
import { useStorage } from '../adapters/storage';
import { getConfigValue } from '../config';
/**
 * 持久化存储管理器
 */
export class PersistenceManager {
    constructor() {
        const config = getConfigValue('storage');
        this.storagePrefix = config.prefix;
    }
    /**
     * 保存搜索历史
     */
    async saveSearchHistory(search) {
        try {
            const all = await this.getSearchHistories();
            // 避免重复
            const filtered = all.filter((h) => {
                const isDuplicate = h.query === search.query &&
                    h.city === search.city &&
                    h.checkIn === search.checkIn &&
                    h.checkOut === search.checkOut;
                return !isDuplicate;
            });
            // 保持最多 20 条记录
            const updated = [search, ...filtered].slice(0, 20);
            const storage = useStorage();
            await storage.setItem(this.getStorageKey('search_history'), JSON.stringify(updated));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to save search history:', err);
        }
    }
    /**
     * 获取搜索历史
     */
    async getSearchHistories() {
        try {
            const storage = useStorage();
            const data = await storage.getItem(this.getStorageKey('search_history'));
            return data ? JSON.parse(data) : [];
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to get search histories:', err);
            return [];
        }
    }
    /**
     * 清空搜索历史
     */
    async clearSearchHistories() {
        try {
            const storage = useStorage();
            await storage.removeItem(this.getStorageKey('search_history'));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to clear search histories:', err);
        }
    }
    /**
     * 添加到收藏
     */
    async addFavorite(hotelId) {
        try {
            const all = await this.getFavorites();
            if (all.some((f) => f.hotelId === hotelId)) {
                return; // 已存在
            }
            const updated = [...all, { hotelId, timestamp: Date.now() }];
            const storage = useStorage();
            await storage.setItem(this.getStorageKey('favorites'), JSON.stringify(updated));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to add favorite:', err);
        }
    }
    /**
     * 从收藏移除
     */
    async removeFavorite(hotelId) {
        try {
            const all = await this.getFavorites();
            const updated = all.filter((f) => f.hotelId !== hotelId);
            const storage = useStorage();
            await storage.setItem(this.getStorageKey('favorites'), JSON.stringify(updated));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to remove favorite:', err);
        }
    }
    /**
     * 获取收藏列表
     */
    async getFavorites() {
        try {
            const storage = useStorage();
            const data = await storage.getItem(this.getStorageKey('favorites'));
            return data ? JSON.parse(data) : [];
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to get favorites:', err);
            return [];
        }
    }
    /**
     * 检查是否已收藏
     */
    async isFavorited(hotelId) {
        const favorites = await this.getFavorites();
        return favorites.some((f) => f.hotelId === hotelId);
    }
    /**
     * 保存用户偏好
     */
    async savePreferences(preferences) {
        try {
            const current = await this.getPreferences();
            const updated = { ...current, ...preferences };
            const storage = useStorage();
            await storage.setItem(this.getStorageKey('preferences'), JSON.stringify(updated));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to save preferences:', err);
        }
    }
    /**
     * 获取用户偏好
     */
    async getPreferences() {
        try {
            const storage = useStorage();
            const data = await storage.getItem(this.getStorageKey('preferences'));
            return data
                ? JSON.parse(data)
                : {
                    theme: 'light',
                    language: 'zh-CN',
                    defaultCity: 'Beijing',
                    notifications: true,
                };
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to get preferences:', err);
            return {
                theme: 'light',
                language: 'zh-CN',
                defaultCity: 'Beijing',
                notifications: true,
            };
        }
    }
    /**
     * 生成存储键
     */
    getStorageKey(name) {
        return `${this.storagePrefix}${name}`;
    }
    /**
     * 清空所有数据
     */
    async clearAll() {
        try {
            await this.clearSearchHistories();
            const storage = useStorage();
            await storage.removeItem(this.getStorageKey('favorites'));
            await storage.removeItem(this.getStorageKey('preferences'));
        }
        catch (err) {
            console.error('[PersistenceManager] Failed to clear all data:', err);
        }
    }
}
/**
 * 全局持久化管理器实例
 */
let globalPersistenceManager = null;
/**
 * 获取全局持久化管理器
 */
export function getPersistenceManager() {
    if (!globalPersistenceManager) {
        globalPersistenceManager = new PersistenceManager();
    }
    return globalPersistenceManager;
}
export default {
    PersistenceManager,
    getPersistenceManager,
};
//# sourceMappingURL=index.js.map