/**
 * 存储接口 - 抽象平台特定的存储实现
 */
export interface IStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

let __storage: IStorage | null = null

/**
 * 注册存储实现（应用启动时调用）
 * - Web: 使用 localStorage
 * - Taro/WeChat: 使用 Taro.storage
 */
export function registerStorage(impl: IStorage) {
  __storage = impl
}

/**
 * 获取存储实例
 */
export function useStorage(): IStorage {
  if (!__storage) {
    throw new Error('Storage not registered! Call registerStorage() in app startup.')
  }
  return __storage
}

/**
 * Web 存储实现
 */
export const webStorageImpl: IStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(key)
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, value)
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}

/**
 * Taro 存储实现（小程序）
 */
export const createTaroStorageImpl = (Taro: any): IStorage => ({
  getItem: (key: string): string | null => {
    try {
      const value = Taro.getStorageSync(key)
      return value || null
    } catch (err: any) {
      console.error('Storage getItem error:', err)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      Taro.setStorageSync(key, value)
    } catch (err: any) {
      console.error('Storage setItem error:', err)
    }
  },
  removeItem: (key: string): void => {
    try {
      Taro.removeStorageSync(key)
    } catch (err: any) {
      console.error('Storage removeItem error:', err)
    }
  },
  clear: (): void => {
    try {
      const keys = Taro.getStorageInfoSync().keys
      keys?.forEach((k: string) => Taro.removeStorageSync(k))
    } catch (err: any) {
      console.error('Storage clear error:', err)
    }
  },
})
