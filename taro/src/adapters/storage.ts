import Taro from '@tarojs/taro'
import type { IStorage } from '../../../shared/dist'

/**
 * Taro 小程序存储适配器
 * 实现 IStorage 接口，使用 Taro.storage API
 */
export const taroStorage: IStorage = {
  /**
   * 获取存储项
   */
  getItem: (key: string): string | null => {
    try {
      const data = Taro.getStorageSync(key)
      return data ? String(data) : null
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error)
      return null
    }
  },

  /**
   * 设置存储项
   */
  setItem: (key: string, value: string): void => {
    try {
      Taro.setStorageSync(key, value)
    } catch (error) {
      console.warn(`Failed to set item ${key}:`, error)
    }
  },

  /**
   * 移除存储项
   */
  removeItem: (key: string): void => {
    try {
      Taro.removeStorageSync(key)
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error)
    }
  },

  /**
   * 清空存储
   */
  clear: (): void => {
    try {
      Taro.clearStorageSync()
    } catch (error) {
      console.warn('Failed to clear storage:', error)
    }
  },
}

export default taroStorage
