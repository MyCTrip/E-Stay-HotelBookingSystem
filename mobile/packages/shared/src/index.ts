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

// ======== 🌟 核心修改 1：对齐你最新的 Hotel Store ========
export {
  createHotelStore,
  initHotelStore,
  useHotelStore,
  resetHotelStore,
} from './stores/hotelStore'
// 清理掉了队友旧的 ExtendedSearchParams，保留最新的
export type { SearchParams, HotelStoreState } from './stores/hotelStore'

export { useAppStore } from './stores/appStore'
export type { AppStoreState } from './stores/appStore'

// Homestay Store (保留队友的民宿逻辑)
export { useHomestayStore, initHomestayStoreApi } from './stores/homestayStore'
export type {
  HomestayStoreState,
  DetailContextState,
  SearchUIState,
} from './stores/homestayStore'

// Mock 数据 (保留队友的代码)
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

// 组件数据中间件
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

// 类型定义
export * from './types'

// ======== 🌟 核心修改 2：对齐你最新的领域模型和服务层 ========
export * from './domain/hotel'     // 明确指向最新的酒店领域模型
export type { HotelDomainModel } from './domain/hotel/hotel.types'
export * from './services/hotel'   // 补充缺失的服务层！这样 UI 才能调用接口

// 常量定义
export { QUICK_FILTER_TAGS } from './constants/homestay'

// 工具函数
export * from './utils'