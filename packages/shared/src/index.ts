// API 服务
export { createApiService, createMockApiService } from './api'
export type { IApiService, ApiConfig, ApiResponse, PaginatedResponse } from './api'

// 存储适配器
export {
  registerStorage,
  useStorage,
  webStorageImpl,
  createTaroStorageImpl,
} from './adapters/storage'
export type { IStorage } from './adapters/storage'

// Store 管理
export {
  createHotelStore,
  initHotelStore,
  useHotelStore,
  resetHotelStore,
} from './stores/hotelStore'
export type { SearchParams } from './stores/hotelStore'
export {
  createHomeStayStore,
  initHomeStayStore,
  useHomeStayStore,
  resetHomeStayStore,
} from './stores/homestayStore'
export type { HomeStayState } from './stores/homestayStore'

// 中间件管理
export {
  MiddlewareManager,
  getMiddlewareManager,
  initializeDefaultMiddlewares,
  createLoggingMiddleware,
  createPerformanceMiddleware,
} from './middleware'
export type { IMiddleware } from './middleware'

// 错误处理
export {
  ErrorCode,
  BusinessError,
  ErrorFactory,
  ErrorHandlerChain,
  getErrorHandlerChain,
  handleError,
} from './errors'
export type { IErrorHandler } from './errors'

// 配置管理
export { ConfigManager, initializeConfig, getConfig, getConfigValue } from './config'
export type {
  Environment,
  ApiConfig as ConfigApiConfig,
  AuthConfig,
  StorageConfig,
  LoggingConfig,
  AppConfig,
} from './config'

// 数据持久化
export { PersistenceManager, getPersistenceManager } from './persistence'
export type { SearchHistory, FavoriteHotel, UserPreferences } from './persistence'

// 类型定义
export * from './types'

// 常量定义
export { QUICK_FILTER_TAGS } from './constants/homestay'

// 工具函数
export * from './utils'
