/**
 * 钟点房模块常量定义
 */

/**
 * 钟点房快速筛选标签
 */
export const HOURLY_QUICK_FILTER_TAGS = [
    { id: 'near_subway', label: '近地铁', icon: 'subway' },
    { id: 'airport_train', label: '机场/高铁', badge: '优选' },
    { id: 'has_window', label: '有窗户', icon: 'window' },
    { id: 'shower', label: '独立卫浴', icon: 'shower' },
    { id: 'free_cancel', label: '免费取消', icon: 'cancel' },
]

/**
 * 城市列表 (保持与主站一致，也可按需精简为主要中转城市)
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
 * 钟点房特有：快捷入住时长选项
 */
export const QUICK_DURATION_OPTIONS = [
    { label: '3小时', value: 3 },
    { label: '4小时', value: 4 },
    { label: '6小时', value: 6 },
]

/**
 * 布局常量 (保持统一)
 */
export const LAYOUT_CONSTANTS = {
    SAFE_AREA_TOP: 44, // iOS导航栏+状态栏
    SAFE_AREA_BOTTOM: 34, // iOS Home Indicator
    TAB_BAR_HEIGHT: 56, // 底部导航栏
    SEARCH_BAR_HEIGHT: 48, // 搜索栏高度
    MOBILE_HORIZONTAL_PADDING: 16, // 移动端横向padding
}

/**
 * 颜色常量 (保持统一)
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
 * 字体大小常量 (保持统一)
 */
export const FONT_SIZES = {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 18,
}

/**
 * 间距常量 (保持统一)
 */
export const SPACING = {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 24,
}

/**
 * 圆角常量 (保持统一)
 */
export const BORDER_RADIUS = {
    SMALL: 6,
    MEDIUM: 8,
    LARGE: 12,
}

/**
 * API路径常量 (替换为钟点房专属接口)
 */
export const API_PATHS = {
    SEARCH_HOURLY: '/hourly-rooms/search',
    HOT_HOURLY: '/hourly-rooms/hot',
    HOURLY_DETAIL: (id: string) => `/hourly-rooms/${id}`,
    ROOM_DETAIL: (id: string) => `/rooms/${id}`, // 具体的物理房间详情可能与全日房复用
    CITIES: '/hourly-rooms/cities',
    AUTOCOMPLETE: '/hourly-rooms/autocomplete',
}

/**
 * 路由常量 (替换为钟点房专属路由)
 */
export const ROUTES = {
    HOME_HOURLY: '/home/hourly',
    SEARCH_RESULT_HOURLY: '/search-result/hourly',
    HOTEL_DETAIL_HOURLY: (id: string) => `/hotel-detail/hourly/${id}`,
    ROOM_DETAIL_HOURLY: (hotelId: string, roomId: string) =>
        `/room-detail/hourly/${hotelId}/${roomId}`,
}