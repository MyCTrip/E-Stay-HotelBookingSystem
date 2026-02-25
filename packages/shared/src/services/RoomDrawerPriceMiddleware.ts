/**
 * RoomDrawerPrice 组件数据中间件
 * 职责：从中央数据提取并格式化房间价格信息
 */

import type { DetailCenterData, RoomDrawerPriceData } from '../types/detailDataMiddleware'
import type { HomeStaySearchParams } from '../types/homestay'

export const roomDrawerPriceMiddleware = {
  /**
   * 获取 RoomDrawerPrice 组件所需的数据
   */
  getData: (centerData: DetailCenterData, searchParams?: HomeStaySearchParams): RoomDrawerPriceData => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom) {
      return {
        originPrice: 0,
        currentPrice: 0,
      }
    }

    const { price } = selectedRoom
    
    return {
      originPrice: price.originPrice,
      currentPrice: price.currentPrice,
      discounts: price.discounts,
    }
  },
}
