import axios, { AxiosInstance } from 'axios'

/**
 * 存储接口 - 抽象平台特定的存储实现
 */
export interface IStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

/**
 * 创建 API 实例 - 工厂函数
 * @param config API 基础配置
 * @param storage 存储实现（可选，用于 token 管理）
 */
export function createApiInstance(
  baseURL: string,
  storage?: IStorage
): AxiosInstance {
  const api = axios.create({
    baseURL,
    timeout: 10000,
  })

  // 请求拦截：添加 token
  api.interceptors.request.use((config) => {
    if (storage) {
      const token = storage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  // 响应拦截：统一错误处理
  api.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const { response } = err

      if (response?.status === 401) {
        // 未授权：清除 token
        if (storage) {
          storage.removeItem('auth_token')
        }
        console.warn('Unauthorized, please login.')
      }

      if (response?.status === 403) {
        console.error('Forbidden:', response?.data?.message)
      }

      if (response?.status >= 500) {
        console.error('Server error:', response?.statusText)
      }

      return Promise.reject(err)
    }
  )

  return api
}

export default createApiInstance
