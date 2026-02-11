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
  HOME: {
    path: 'pages/Home/index',
    name: 'Home',
    isTabPage: true,
    description: '首页',
  },
  SEARCH_RESULT: {
    path: 'pages/SearchResult/index',
    name: 'SearchResult',
    isTabPage: false,
    description: '搜索结果页',
  },
  HOTEL_DETAIL: {
    path: 'pages/HotelDetail/index',
    name: 'HotelDetail',
    isTabPage: false,
    description: '酒店详情页',
  },
  ROOM_DETAIL: {
    path: 'pages/RoomDetail/index',
    name: 'RoomDetail',
    isTabPage: false,
    description: '房间详情页',
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
  HOME: `/${ROUTE_CONFIG.HOME.path}`,
  SEARCH_RESULT: `/${ROUTE_CONFIG.SEARCH_RESULT.path}`,
  HOTEL_DETAIL: `/${ROUTE_CONFIG.HOTEL_DETAIL.path}`,
  ROOM_DETAIL: `/${ROUTE_CONFIG.ROOM_DETAIL.path}`,
  NOT_FOUND: `/${ROUTE_CONFIG.NOT_FOUND.path}`,
} as const

/**
 * 页面路由数组 - app.config.ts 中的 pages 配置
 * 注意：这里保存的是不带前导 / 的路径
 */
export const PAGE_ROUTES = Object.values(ROUTE_CONFIG).map((route) => route.path) as const

/**
 * Tab 页面路由数组
 */
export const TAB_ROUTES = Object.values(ROUTE_CONFIG)
  .filter((route) => route.isTabPage)
  .map((route) => route.path) as const

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
 * 这些函数在运行时导入Taro，避免在编译器加载app.config.ts时执行Taro代码
 */
export const navigate = {
  /**
   * 导航到首页（Tab 页面）
   */
  toHome: () => {
    const Taro = require('@tarojs/taro').default
    Taro.switchTab({ url: ROUTES.HOME })
  },

  /**
   * 导航到搜索结果页面
   */
  toSearchResult: () => {
    const Taro = require('@tarojs/taro').default
    Taro.navigateTo({ url: ROUTES.SEARCH_RESULT })
  },

  /**
   * 导航到酒店详情页
   */
  toHotelDetail: (id: string) => {
    const Taro = require('@tarojs/taro').default
    Taro.navigateTo({ url: `${ROUTES.HOTEL_DETAIL}?id=${id}` })
  },

  /**
   * 导航到房间详情页
   */
  toRoomDetail: (id: string) => {
    const Taro = require('@tarojs/taro').default
    Taro.navigateTo({ url: `${ROUTES.ROOM_DETAIL}?id=${id}` })
  },

  /**
   * 导航到 404 页面
   */
  toNotFound: () => {
    const Taro = require('@tarojs/taro').default
    Taro.navigateTo({ url: ROUTES.NOT_FOUND })
  },

  /**
   * 通用导航方法 - 自动判断是否为 Tab 页面
   */
  go: (key: keyof typeof ROUTES, params?: Record<string, any>) => {
    const Taro = require('@tarojs/taro').default
    const pageRoute = ROUTE_CONFIG[key as keyof typeof ROUTE_CONFIG]
    const path = ROUTES[key]

    if (pageRoute.isTabPage) {
      Taro.switchTab({ url: path })
    } else {
      const queryString = params ? new URLSearchParams(params).toString() : ''
      const finalUrl = queryString ? `${path}?${queryString}` : path
      Taro.navigateTo({ url: finalUrl })
    }
  },

  /**
   * 返回上一页
   */
  back: (delta: number = 1) => {
    const Taro = require('@tarojs/taro').default
    Taro.navigateBack({ delta })
  },

  /**
   * 重定向到首页
   */
  redirect: () => {
    const Taro = require('@tarojs/taro').default
    Taro.switchTab({ url: ROUTES.HOME })
  },
} as const

/**
 * 导出默认配置对象
 */
export default ROUTE_CONFIG
