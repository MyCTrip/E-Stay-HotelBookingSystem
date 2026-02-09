import { createPersistentSearchStore, type SearchState } from '@estay/shared/stores'

/**
 * Web 平台的存储实现（使用 localStorage）
 */
const webStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
}

// 创建带持久化的搜索 Store，使用平台特定的存储
export const useSearchStore = createPersistentSearchStore(webStorage)

export type { SearchState }
