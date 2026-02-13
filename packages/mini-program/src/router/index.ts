import Taro from '@tarojs/taro'

/**
 * 小程序应用路由配置
 *
 * 在 Taro 框架中，路由是通过 app.config.ts 的 pages 数组来配置的
 * 本文件集中管理所有路由配置、路径常量和导航方法
 *
 * 使用方式：
 * - 在 app.config.ts 中引用 PAGE_ROUTES 数组
 * - 在各页面中使用 navigate 对象进行页面跳转
 * - 在组件中使用 getPagePath() 获取页面路径
 */

/**
 * 页面路由配置对象
 * 集中定义所有页面的路由信息
 */
export interface PageRoute {
  /** 页面路径 */
  path: string
  /** 页面名称，用于识别 */
  name: string
  /** 是否为 Tab 页面 */
  isTabPage?: boolean
  /** 页面描述 */
  description?: string
}

/**
 * 详细的路由配置
 * 这是一个纯数据对象，不依赖于框架运行时
 */
export const ROUTE_CONFIG = {
  HOME_HOTEL: {
    path: 'pages/Home/hotel/index',
    name: 'HomeHotel',
    isTabPage: false,
    description: '首页 - 酒店',
  },
  HOME_HOURLY: {
    path: 'pages/Home/hourlyHotel/index',
    name: 'HomeHourly',
    isTabPage: false,
    description: '首页 - 钟点房',
  },
  HOME_HOMESTAY: {
    path: 'pages/Home/homeStay/index',
    name: 'HomeHomeStay',
    isTabPage: false,
    description: '首页 - 民宿',
  },
  SEARCH_RESULT: {
    path: 'pages/SearchResult/index',
    name: 'SearchResult',
    isTabPage: false,
    description: '搜索结果页',
  },
  SEARCH_HOTEL: {
    path: 'pages/SearchResult/hotel/index',
    name: 'SearchResultHotel',
    isTabPage: false,
    description: '搜索结果 - 酒店',
  },
  SEARCH_HOURLY: {
    path: 'pages/SearchResult/hourlyHotel/index',
    name: 'SearchResultHourly',
    isTabPage: false,
    description: '搜索结果 - 钟点房',
  },
  SEARCH_HOMESTAY: {
    path: 'pages/SearchResult/homeStay/index',
    name: 'SearchResultHomeStay',
    isTabPage: false,
    description: '搜索结果 - 民宿',
  },
  HOTEL_DETAIL: {
    path: 'pages/HotelDetail/index',
    name: 'HotelDetail',
    isTabPage: false,
    description: '酒店详情页',
  },
  HOTEL_DETAIL_HOTEL: {
    path: 'pages/HotelDetail/hotel/index',
    name: 'HotelDetailHotel',
    isTabPage: false,
    description: '酒店详情 - 酒店',
  },
  HOTEL_DETAIL_HOURLY: {
    path: 'pages/HotelDetail/hourlyHotel/index',
    name: 'HotelDetailHourly',
    isTabPage: false,
    description: '酒店详情 - 钟点房',
  },
  HOTEL_DETAIL_HOMESTAY: {
    path: 'pages/HotelDetail/homeStay/index',
    name: 'HotelDetailHomeStay',
    isTabPage: false,
    description: '酒店详情 - 民宿',
  },
  ROOM_DETAIL: {
    path: 'pages/RoomDetail/index',
    name: 'RoomDetail',
    isTabPage: false,
    description: '房间详情页',
  },
  ROOM_DETAIL_HOTEL: {
    path: 'pages/RoomDetail/hotel/index',
    name: 'RoomDetailHotel',
    isTabPage: false,
    description: '房间详情 - 酒店',
  },
  ROOM_DETAIL_HOURLY: {
    path: 'pages/RoomDetail/hourlyHotel/index',
    name: 'RoomDetailHourly',
    isTabPage: false,
    description: '房间详情 - 钟点房',
  },
  ROOM_DETAIL_HOMESTAY: {
    path: 'pages/RoomDetail/homeStay/index',
    name: 'RoomDetailHomeStay',
    isTabPage: false,
    description: '房间详情 - 民宿',
  },
  NOT_FOUND: {
    path: 'pages/NotFound/index',
    name: 'NotFound',
    isTabPage: false,
    description: '404 页面',
  },
} as const

/**
 * 路由路径常量
 * 用于 Taro.navigateTo() 和 Taro.switchTab()
 * 注意：导航时需要加上 / 前缀
 */
export const ROUTES = {
  HOME_HOTEL: `/${ROUTE_CONFIG.HOME_HOTEL?.path}`,
  HOME_HOURLY: `/${ROUTE_CONFIG.HOME_HOURLY?.path}`,
  HOME_HOMESTAY: `/${ROUTE_CONFIG.HOME_HOMESTAY?.path}`,
  SEARCH_RESULT: `/${ROUTE_CONFIG.SEARCH_RESULT.path}`,
  SEARCH_HOTEL: `/${ROUTE_CONFIG.SEARCH_HOTEL?.path}`,
  SEARCH_HOURLY: `/${ROUTE_CONFIG.SEARCH_HOURLY?.path}`,
  SEARCH_HOMESTAY: `/${ROUTE_CONFIG.SEARCH_HOMESTAY?.path}`,
  HOTEL_DETAIL: `/${ROUTE_CONFIG.HOTEL_DETAIL.path}`,
  HOTEL_DETAIL_HOTEL: `/${ROUTE_CONFIG.HOTEL_DETAIL_HOTEL?.path}`,
  HOTEL_DETAIL_HOURLY: `/${ROUTE_CONFIG.HOTEL_DETAIL_HOURLY?.path}`,
  HOTEL_DETAIL_HOMESTAY: `/${ROUTE_CONFIG.HOTEL_DETAIL_HOMESTAY?.path}`,
  ROOM_DETAIL: `/${ROUTE_CONFIG.ROOM_DETAIL.path}`,
  ROOM_DETAIL_HOTEL: `/${ROUTE_CONFIG.ROOM_DETAIL_HOTEL?.path}`,
  ROOM_DETAIL_HOURLY: `/${ROUTE_CONFIG.ROOM_DETAIL_HOURLY?.path}`,
  ROOM_DETAIL_HOMESTAY: `/${ROUTE_CONFIG.ROOM_DETAIL_HOMESTAY?.path}`,
  NOT_FOUND: `/${ROUTE_CONFIG.NOT_FOUND.path}`,
} as const

/**
 * 页面路由数组 - app.config.ts 中的 pages 配置
 * 注意：这里保存的是不带前导 / 的路径
 */
export const PAGE_ROUTES = Object.values(ROUTE_CONFIG).map((route) => route.path)

/**
 * Tab 页面路由数组
 */
export const TAB_ROUTES = Object.values(ROUTE_CONFIG)
  .filter((route) => route.isTabPage)
  .map((route) => route.path)

/**
 * 获取页面路径
 */
export const getPagePath = (key: keyof typeof ROUTES): string => {
  return ROUTES[key]
}

/**
 * 获取页面信息
 */
export const getPageInfo = (key: keyof typeof ROUTE_CONFIG): PageRoute => {
  return ROUTE_CONFIG[key]
}

/**
 * 导航辅助函数
 * 提供类型安全的页面跳转方法
 */
export const navigate = {
  /**
   * 导航到搜索结果页面
   */
  toSearchResult: () => {
    Taro.navigateTo({ url: ROUTES.SEARCH_RESULT })
  },

  /**
   * 导航到酒店详情页
   */
  toHotelDetail: (id: string) => {
    Taro.navigateTo({ url: `${ROUTES.HOTEL_DETAIL}?id=${id}` })
  },

  /**
   * 导航到房间详情页
   */
  toRoomDetail: (id: string) => {
    Taro.navigateTo({ url: `${ROUTES.ROOM_DETAIL}?id=${id}` })
  },

  /**
   * 导航到 404 页面
   */
  toNotFound: () => {
    Taro.navigateTo({ url: ROUTES.NOT_FOUND })
  },

  /**
   * 通用导航方法 - 自动判断是否为 Tab 页面
   */
  go: (key: keyof typeof ROUTES, params?: Record<string, any>) => {
    const pageRoute = ROUTE_CONFIG[key as keyof typeof ROUTE_CONFIG]
    const path = ROUTES[key]

    if (pageRoute.isTabPage) {
      Taro.switchTab({ url: path })
    } else {
      const queryString = params ? new URLSearchParams(params).toString() : ''
      const finalUrl = queryString ? `${path}?${queryString}` : path

      // 对于首页相关的路由，使用 redirectTo 避免页面栈溢出
      if (key === 'HOME_HOTEL' || key === 'HOME_HOURLY' || key === 'HOME_HOMESTAY') {
        Taro.redirectTo({ url: finalUrl })
      } else {
        Taro.navigateTo({ url: finalUrl })
      }
    }
  },

  /**
   * 返回上一页
   */
  back: (delta: number = 1) => {
    Taro.navigateBack({ delta })
  },
} as const

/**
 * 导出默认配置对象
 */
export default ROUTE_CONFIG
