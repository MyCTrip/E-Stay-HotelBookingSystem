/**
 * HotelInfo 组件数据中间件
 * 数据来源：DetailCenterData.baseInfo
 * 组件接收：name、brand、tags、rating、reviewCount、star、address、area、room、bed、guests
 */

import type { DetailCenterData, HotelInfoData } from '../detailDataMiddleware'

export interface HotelInfoParams extends HotelInfoData {}

/**
 * 从DetailCenterData转换为HotelInfo格式
 */
export const transformCenterDataToHotelInfo = (
  data: DetailCenterData
): HotelInfoParams => {
  return {
    name: data.baseInfo?.name || '民宿名称',
    brand: data.baseInfo?.brand,
    tags: data.baseInfo?.tags,
    rating: data.baseInfo?.rating,
    reviewCount: data.baseInfo?.reviewCount || 0,
    star: data.baseInfo?.star || 0,
    address: data.baseInfo?.address || '',
    area: data.baseInfo?.area,
    room: data.baseInfo?.room,
    bed: data.baseInfo?.bed,
    guests: data.baseInfo?.guests,
  }
}

/**
 * 从HotelInfo格式转换回CenterData格式（用于数据更新）
 */
export const transformHotelInfoToCenterData = (
  params: Partial<HotelInfoParams>
): Partial<DetailCenterData> => {
  return {
    baseInfo: params as any,
  }
}
