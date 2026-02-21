// API 服务
export { createApiService, createMockApiService } from './api'
export type { IApiService, ApiConfig, ApiResponse, PaginatedResponse } from './api'

// 存储适配器
export { registerStorage, useStorage, webStorageImpl, createTaroStorageImpl } from './adapters/storage'
export type { IStorage } from './adapters/storage'

// Store 管理
export { createHotelStore, initHotelStore, useHotelStore, resetHotelStore } from './stores/hotelStore'
// 核心模型类型从 models.ts 导出去，供 web 和 taro 使用
export * from './types/models' 

// 导出 store 及其相关方法
export * from './stores/hotelStore'

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
export {
  ConfigManager,
  initializeConfig,
  getConfig,
  getConfigValue,
} from './config'
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

// 工具函数
export * from './utils'
