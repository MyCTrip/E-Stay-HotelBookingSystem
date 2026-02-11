/**
 * 数据持久化层
 * 统一处理搜索历史、收藏夹、用户偏好等需要本地存储的数据
 */

import { useStorage } from '../adapters/storage'
import { getConfigValue } from '../config'

/**
 * 搜索历史记录
 */
export interface SearchHistory {
  id: string
  query: string
  city: string
  checkIn: string
  checkOut: string
  guests: number
  timestamp: number
}

/**
 * 收藏酒店记录
 */
export interface FavoriteHotel {
  hotelId: string
  timestamp: number
}

/**
 * 用户偏好
 */
export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  defaultCity: string
  notifications: boolean
}

/**
 * 持久化存储管理器
 */
export class PersistenceManager {
  private readonly storagePrefix: string

  constructor() {
    const config = getConfigValue('storage')
    this.storagePrefix = config.prefix
  }

  /**
   * 保存搜索历史
   */
  async saveSearchHistory(search: SearchHistory): Promise<void> {
    try {
      const all = await this.getSearchHistories()
      // 避免重复
      const filtered = all.filter((h) => {
        const isDuplicate =
          h.query === search.query &&
          h.city === search.city &&
          h.checkIn === search.checkIn &&
          h.checkOut === search.checkOut
        return !isDuplicate
      })
      // 保持最多 20 条记录
      const updated = [search, ...filtered].slice(0, 20)
      const storage = useStorage()
      await storage.setItem(
        this.getStorageKey('search_history'),
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error('[PersistenceManager] Failed to save search history:', err)
    }
  }

  /**
   * 获取搜索历史
   */
  async getSearchHistories(): Promise<SearchHistory[]> {
    try {
      const storage = useStorage()
      const data = await storage.getItem(this.getStorageKey('search_history'))
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('[PersistenceManager] Failed to get search histories:', err)
      return []
    }
  }

  /**
   * 清空搜索历史
   */
  async clearSearchHistories(): Promise<void> {
    try {
      const storage = useStorage()
      await storage.removeItem(this.getStorageKey('search_history'))
    } catch (err) {
      console.error('[PersistenceManager] Failed to clear search histories:', err)
    }
  }

  /**
   * 添加到收藏
   */
  async addFavorite(hotelId: string): Promise<void> {
    try {
      const all = await this.getFavorites()
      if (all.some((f) => f.hotelId === hotelId)) {
        return // 已存在
      }
      const updated = [...all, { hotelId, timestamp: Date.now() }]
      const storage = useStorage()
      await storage.setItem(
        this.getStorageKey('favorites'),
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error('[PersistenceManager] Failed to add favorite:', err)
    }
  }

  /**
   * 从收藏移除
   */
  async removeFavorite(hotelId: string): Promise<void> {
    try {
      const all = await this.getFavorites()
      const updated = all.filter((f) => f.hotelId !== hotelId)
      const storage = useStorage()
      await storage.setItem(
        this.getStorageKey('favorites'),
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error('[PersistenceManager] Failed to remove favorite:', err)
    }
  }

  /**
   * 获取收藏列表
   */
  async getFavorites(): Promise<FavoriteHotel[]> {
    try {
      const storage = useStorage()
      const data = await storage.getItem(this.getStorageKey('favorites'))
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('[PersistenceManager] Failed to get favorites:', err)
      return []
    }
  }

  /**
   * 检查是否已收藏
   */
  async isFavorited(hotelId: string): Promise<boolean> {
    const favorites = await this.getFavorites()
    return favorites.some((f) => f.hotelId === hotelId)
  }

  /**
   * 保存用户偏好
   */
  async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences()
      const updated = { ...current, ...preferences }
      const storage = useStorage()
      await storage.setItem(
        this.getStorageKey('preferences'),
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error('[PersistenceManager] Failed to save preferences:', err)
    }
  }

  /**
   * 获取用户偏好
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const storage = useStorage()
      const data = await storage.getItem(this.getStorageKey('preferences'))
      return data
        ? JSON.parse(data)
        : {
            theme: 'light',
            language: 'zh-CN',
            defaultCity: 'Beijing',
            notifications: true,
          }
    } catch (err) {
      console.error('[PersistenceManager] Failed to get preferences:', err)
      return {
        theme: 'light',
        language: 'zh-CN',
        defaultCity: 'Beijing',
        notifications: true,
      }
    }
  }

  /**
   * 生成存储键
   */
  private getStorageKey(name: string): string {
    return `${this.storagePrefix}${name}`
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    try {
      await this.clearSearchHistories()
      const storage = useStorage()
      await storage.removeItem(this.getStorageKey('favorites'))
      await storage.removeItem(this.getStorageKey('preferences'))
    } catch (err) {
      console.error('[PersistenceManager] Failed to clear all data:', err)
    }
  }
}

/**
 * 全局持久化管理器实例
 */
let globalPersistenceManager: PersistenceManager | null = null

/**
 * 获取全局持久化管理器
 */
export function getPersistenceManager(): PersistenceManager {
  if (!globalPersistenceManager) {
    globalPersistenceManager = new PersistenceManager()
  }
  return globalPersistenceManager
}

export default {
  PersistenceManager,
  getPersistenceManager,
}