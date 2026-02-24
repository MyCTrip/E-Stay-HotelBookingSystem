/**
 * 民宿模块常量定义
 */
import type { QuickFilterTag } from '../types/homestay';
/**
 * 快速筛选标签
 */
export declare const QUICK_FILTER_TAGS: QuickFilterTag[];
/**
 * 城市列表
 */
export declare const CITIES: string[];
/**
 * 快速日期选项
 */
export declare const QUICK_DATE_OPTIONS: {
    label: string;
    value: number;
}[];
/**
 * 布局常量
 */
export declare const LAYOUT_CONSTANTS: {
    SAFE_AREA_TOP: number;
    SAFE_AREA_BOTTOM: number;
    TAB_BAR_HEIGHT: number;
    SEARCH_BAR_HEIGHT: number;
    MOBILE_HORIZONTAL_PADDING: number;
};
/**
 * 颜色常量
 */
export declare const COLORS: {
    PRIMARY: string;
    SECONDARY: string;
    TEXT_PRIMARY: string;
    TEXT_SECONDARY: string;
    TEXT_LIGHT: string;
    BACKGROUND: string;
    BORDER: string;
    WHITE: string;
    SUCCESS: string;
    WARNING: string;
    ERROR: string;
};
/**
 * 字体大小常量
 */
export declare const FONT_SIZES: {
    XS: number;
    SM: number;
    MD: number;
    LG: number;
    XL: number;
};
/**
 * 间距常量
 */
export declare const SPACING: {
    XS: number;
    SM: number;
    MD: number;
    LG: number;
    XL: number;
};
/**
 * 圆角常量
 */
export declare const BORDER_RADIUS: {
    SMALL: number;
    MEDIUM: number;
    LARGE: number;
};
/**
 * API路径常量
 */
export declare const API_PATHS: {
    SEARCH_HOMESTAYS: string;
    HOT_HOMESTAYS: string;
    HOMESTAY_DETAIL: (id: string) => string;
    ROOM_DETAIL: (id: string) => string;
    CITIES: string;
    AUTOCOMPLETE: string;
};
/**
 * 路由常量
 */
export declare const ROUTES: {
    HOME_HOMESTAY: string;
    SEARCH_RESULT_HOMESTAY: string;
    HOTEL_DETAIL_HOMESTAY: (id: string) => string;
    ROOM_DETAIL_HOMESTAY: (hotelId: string, roomId: string) => string;
};
//# sourceMappingURL=homestay.d.ts.map