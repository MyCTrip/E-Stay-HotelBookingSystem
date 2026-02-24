/**
 * RoomDetailDrawer/RoomDrawerPrice 组件数据中间件
 * 数据来源：DetailCenterData.selectedRoom 和 feePrice
 * 组件接收：id、price、discounts[]
 */

import type { DetailCenterData, RoomDrawerPriceData, DiscountInfo } from '../detailDataMiddleware'

export interface RoomDrawerPriceParams {
  id: string
  price: number
  discounts?: DiscountInfo[]
}

export const transformCenterDataToRoomDrawerPrice = (
  data: DetailCenterData
): RoomDrawerPriceParams => {
  return {
    id: data.selectedRoom?._id || '',
    price: data.selectedRoom?.price || 0,
    discounts: data.feePrice?.discounts,
  }
}

export const transformRoomDrawerPriceToCenterData = (
  params: Partial<RoomDrawerPriceParams>
): Partial<DetailCenterData> => {
  return {
    feePrice: {
      discounts: params.discounts,
    },
  }
}
