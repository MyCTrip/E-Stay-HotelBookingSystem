/**
 * 推荐民宿 Mock 数据
 * 直接引用 homestayDetail.ts 中的标准数据
 */
import { HOMESTAY_DETAIL_MOCK } from './homestayDetail'

export const RECOMMENDED_HOMESTAYS = [HOMESTAY_DETAIL_MOCK]

export function getRecommendedHomestays(city?: string, priceMin?: number, priceMax?: number) {
  return RECOMMENDED_HOMESTAYS
}

