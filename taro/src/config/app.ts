import { createApiInstance } from '../../../shared/dist'
import { taroStorage } from '../adapters'

/**
 * 应用配置
 */
export const API_BASE_URL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api'
  }
  return 'https://api.estay.com/api'
}

/**
 * 创建应用级 API 实例
 */
export const api = createApiInstance(API_BASE_URL(), taroStorage)

export default {
  api,
  storage: taroStorage,
}
