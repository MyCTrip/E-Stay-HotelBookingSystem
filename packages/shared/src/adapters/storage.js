let __storage = null;
/**
 * 注册存储实现（应用启动时调用）
 * - Web: 使用 localStorage
 * - Taro/WeChat: 使用 Taro.storage
 */
export function registerStorage(impl) {
    __storage = impl;
}
/**
 * 获取存储实例
 */
export function useStorage() {
    if (!__storage) {
        throw new Error('Storage not registered! Call registerStorage() in app startup.');
    }
    return __storage;
}
/**
 * Web 存储实现
 */
export const webStorageImpl = {
    getItem: (key) => {
        if (typeof window === 'undefined')
            return null;
        return localStorage.getItem(key);
    },
    setItem: (key, value) => {
        if (typeof window === 'undefined')
            return;
        localStorage.setItem(key, value);
    },
    removeItem: (key) => {
        if (typeof window === 'undefined')
            return;
        localStorage.removeItem(key);
    },
    clear: () => {
        if (typeof window === 'undefined')
            return;
        localStorage.clear();
    },
};
/**
 * Taro 存储实现（小程序）
 */
export const createTaroStorageImpl = (Taro) => ({
    getItem: (key) => {
        try {
            const value = Taro.getStorageSync(key);
            return value || null;
        }
        catch (err) {
            console.error('Storage getItem error:', err);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            Taro.setStorageSync(key, value);
        }
        catch (err) {
            console.error('Storage setItem error:', err);
        }
    },
    removeItem: (key) => {
        try {
            Taro.removeStorageSync(key);
        }
        catch (err) {
            console.error('Storage removeItem error:', err);
        }
    },
    clear: () => {
        try {
            const keys = Taro.getStorageInfoSync().keys;
            keys?.forEach((k) => Taro.removeStorageSync(k));
        }
        catch (err) {
            console.error('Storage clear error:', err);
        }
    },
});
//# sourceMappingURL=storage.js.map