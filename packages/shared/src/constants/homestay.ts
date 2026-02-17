/**
 * 民宿模块常量定义
 */

import type { QuickFilterTag } from '../types/homestay'

/**
 * 快速筛选标签
 */
export const QUICK_FILTER_TAGS: QuickFilterTag[] = [
  { id: 'kitchen', label: '全套房厨房', icon: 'kitchen' },
  { id: 'spring-sale', label: '春节特惠', badge: '¥99' },
  { id: 'points', label: '积分当钱花', icon: 'points' },
  { id: 'instant', label: '立即预订', icon: 'instant' },
  { id: 'categories', label: '分类', icon: 'category' },
]

/**
 * 城市列表
 */
export const CITIES = [
  '上海',
  '北京',
  '广州',
  '深圳',
  '杭州',
  '南京',
  '武汉',
  '成都',
  '重庆',
  '西安',
  '长沙',
  '南昌',
]

/**
 * 快速日期选项
 */
export const QUICK_DATE_OPTIONS = [
  { label: '今晚', value: 0 },
  { label: '明晚', value: 1 },
  { label: '本周末', value: 5 },
]

/**
 * 布局常量
 */
export const LAYOUT_CONSTANTS = {
  SAFE_AREA_TOP: 44, // iOS导航栏+状态栏
  SAFE_AREA_BOTTOM: 34, // iOS Home Indicator
  TAB_BAR_HEIGHT: 56, // 底部导航栏
  SEARCH_BAR_HEIGHT: 48, // 搜索栏高度
  MOBILE_HORIZONTAL_PADDING: 16, // 移动端横向padding
}

/**
 * 颜色常量
 */
export const COLORS = {
  PRIMARY: '#FF6B00', // 主色-橙
  SECONDARY: '#0066FF', // 次色-蓝
  TEXT_PRIMARY: '#333333', // 主文字
  TEXT_SECONDARY: '#999999', // 辅助文字
  TEXT_LIGHT: '#CCCCCC', // 浅文字
  BACKGROUND: '#F5F5F5', // 背景
  BORDER: '#E0E0E0', // 分割线
  WHITE: '#FFFFFF', // 白色
  SUCCESS: '#4CAF50', // 成功
  WARNING: '#FFC107', // 警告
  ERROR: '#F44336', // 错误
}

/**
 * 字体大小常量
 */
export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
}

/**
 * 间距常量
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
}

/**
 * 圆角常量
 */
export const BORDER_RADIUS = {
  SMALL: 6,
  MEDIUM: 8,
  LARGE: 12,
}

/**
 * API路径常量
 */
export const API_PATHS = {
  SEARCH_HOMESTAYS: '/homestays/search',
  HOT_HOMESTAYS: '/homestays/hot',
  HOMESTAY_DETAIL: (id: string) => `/homestays/${id}`,
  ROOM_DETAIL: (id: string) => `/rooms/${id}`,
  CITIES: '/homestays/cities',
  AUTOCOMPLETE: '/homestays/autocomplete',
}

/**
 * 路由常量
 */
export const ROUTES = {
  HOME_HOMESTAY: '/home/homestay',
  SEARCH_RESULT_HOMESTAY: '/search-result/homestay',
  HOTEL_DETAIL_HOMESTAY: (id: string) => `/hotel-detail/homestay/${id}`,
  ROOM_DETAIL_HOMESTAY: (hotelId: string, roomId: string) =>
    `/room-detail/homestay/${hotelId}/${roomId}`,
}
