import type { HomeStayHotel } from '@estay/shared';
/**
 * 民宿详情 Mock 数据
 * 严格遵循 HomeStayHotel 类型结构
 */
export declare const HOMESTAY_DETAIL_MOCK: HomeStayHotel;
/**
 * 搜索结果 Mock 数据
 */
export declare const SEARCH_RESULT_HOMESTAYS: HomeStayHotel[];
/**
 * 热门民宿 Mock 数据
 */
export declare const POPULAR_HOMESTAYS: HomeStayHotel[];
/**
 * 推荐民宿函数
 */
export declare function getRecommendedHomestays(city?: string, priceMin?: number, priceMax?: number): HomeStayHotel[];
//# sourceMappingURL=homestayDetail.d.ts.map