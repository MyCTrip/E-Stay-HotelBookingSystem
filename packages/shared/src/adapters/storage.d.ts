/**
 * 存储接口 - 抽象平台特定的存储实现
 */
export interface IStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}
/**
 * 注册存储实现（应用启动时调用）
 * - Web: 使用 localStorage
 * - Taro/WeChat: 使用 Taro.storage
 */
export declare function registerStorage(impl: IStorage): void;
/**
 * 获取存储实例
 */
export declare function useStorage(): IStorage;
/**
 * Web 存储实现
 */
export declare const webStorageImpl: IStorage;
/**
 * Taro 存储实现（小程序）
 */
export declare const createTaroStorageImpl: (Taro: any) => IStorage;
//# sourceMappingURL=storage.d.ts.map