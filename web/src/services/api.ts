import { createApiInstance, IStorage } from '@estay/shared/services'

/**
 * Web 平台的存储实现（使用 localStorage）
 */
const webStorage: IStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
}

// 创建 API 实例，使用平台特定的存储
const api = createApiInstance(
  import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  webStorage
)

export default api
