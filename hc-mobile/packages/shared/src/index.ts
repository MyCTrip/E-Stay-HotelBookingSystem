// API services
export { createApiService, createMockApiService } from './api'
export type { IApiService, ApiConfig, ApiResponse, PaginatedResponse } from './api'

// Storage adapters
export {
  registerStorage,
  useStorage,
  webStorageImpl,
  createTaroStorageImpl,
} from './adapters/storage'
export type { IStorage } from './adapters/storage'

// Stores
export {
  createHotelStore,
  initHotelStore,
  useHotelStore,
  resetHotelStore,
} from './stores/hotelStore'
export type { SearchParams } from './stores/hotelStore'
export { useAppStore } from './stores/appStore'
export {
  createHomeStayStore,
  initHomeStayStore,
  useHomeStayStore,
  resetHomeStayStore,
} from './stores/homestayStore'
export type { HomeStayState } from './stores/homestayStore'

// Hotel domain and adapter
export * from './domain/hotel'
export * from './services/hotel'

// Middleware
export {
  MiddlewareManager,
  getMiddlewareManager,
  initializeDefaultMiddlewares,
  createLoggingMiddleware,
  createPerformanceMiddleware,
} from './middleware'
export type { IMiddleware } from './middleware'

// Errors
export {
  ErrorCode,
  BusinessError,
  ErrorFactory,
  ErrorHandlerChain,
  getErrorHandlerChain,
  handleError,
} from './errors'
export type { IErrorHandler } from './errors'

// Config
export { ConfigManager, initializeConfig, getConfig, getConfigValue } from './config'
export type {
  Environment,
  ApiConfig as ConfigApiConfig,
  AuthConfig,
  StorageConfig,
  LoggingConfig,
  AppConfig,
} from './config'

// Persistence
export { PersistenceManager, getPersistenceManager } from './persistence'
export type { SearchHistory, FavoriteHotel, UserPreferences } from './persistence'

// Shared types
export * from './types/models'
export type {
  HomeStay,
  PaginationMeta,
  HomeStaySearchParams,
  HomestayRoomTypeConfig as HomeStayConfig,
  QuickFilterTag,
} from './types/homestay'

// Constants
export { QUICK_FILTER_TAGS } from './constants/homestay'

// Utils
export * from './utils'

