/**
 * RoomDetailDrawer/RoomDrawerBanner 组件数据中间件
 * 数据来源：DetailCenterData.selectedRoom.roomImages
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */

import type { DetailCenterData, RoomDrawerBannerData } from '../detailDataMiddleware'

export interface RoomDrawerBannerParams {
  images: Array<{
    category?: string
    url: string
  }>
}

export const transformCenterDataToRoomDrawerBanner = (
  data: DetailCenterData
): RoomDrawerBannerParams => {
  return {
    images: data.selectedRoom?.roomImages || [],
  }
}

export const transformRoomDrawerBannerToCenterData = (
  params: Partial<RoomDrawerBannerParams>
): Partial<DetailCenterData> => {
  return {}
}
