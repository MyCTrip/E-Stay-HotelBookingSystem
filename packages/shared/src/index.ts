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
export type { SearchParams, ExtendedSearchParams, HotelSearchParams, HotelStoreState } from './stores/hotelStore'

export { useAppStore } from './stores/appStore'
export type { AppStoreState } from './stores/appStore'

// Homestay Store (与 Mock 数据集成)
export { useHomestayStore } from './stores/homestayStore'
export type {
  HomestayStoreState,
  DetailContextState,
  SearchUIState,
} from './stores/homestayStore'

// Mock 数据（选择性导出以避免冲突）
export { SEARCH_RESULT_HOMESTAYS, getRecommendedHomestays, POPULAR_HOMESTAYS, HOMESTAY_DETAIL_MOCK } from './mocks'
export { NEARBY_ROOMS } from './mocks'

// Constants（常量）
export { FACILITY_CATEGORIES, getFacilitiesByCategory, getAvailableFacilitiesByCategory, getFacilitiesSectionData, getFacilitiesInCategory, getFacilitiesWithStatus } from './constants/facilities'
export type { Facility, FacilityCategory } from './constants/facilities'

// 中间件管理
export {
  MiddlewareManager,
  getMiddlewareManager,
  initializeDefaultMiddlewares,
  createLoggingMiddleware,
  createPerformanceMiddleware,
} from './middleware'
export type { IMiddleware } from './middleware'

// 组件数据中间件（服务层，与 types 有重复，types 优先）
export { DETAIL_CENTER_DATA_MOCK } from './mocks/detailCenterData'
export { initializeDetailData } from './services/DetailDataInitializer'
export type { InitializedDetailData } from './services/DetailDataInitializer'

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

// 类型定义（先导出，后面被覆盖）
export * from './types'

// 酒店领域模型和类型（视图模型类型，types 中无重复）
export * from './domain'

// 常量定义
export { QUICK_FILTER_TAGS } from './constants/homestay'

// 工具函数
export * from './utils'
