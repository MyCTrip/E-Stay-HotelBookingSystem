/**
 * BookingBar 组件数据中间件
 * 职责：从中央数据提取并格式化预订栏信息
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'

export interface BookingBarData {
  host?: {
    name?: string
    avatar?: string
  }
  priceList?: Array<{
    originPrice: number
    currentPrice: number
  }>
  totalPrice?: number
  deadlineTime?: number
}

export const bookingBarMiddleware = {
  /**
   * 获取 BookingBar 组件所需的数据
   */
  getData: (centerData: DetailCenterData): BookingBarData => {
    const { bookingBar } = centerData
    
    return {
      host: bookingBar.host ? {
        name: bookingBar.host.name,
        avatar: bookingBar.host.avatar,
      } : undefined,
      priceList: bookingBar.priceList,
      totalPrice: bookingBar.totalPrice,
      deadlineTime: bookingBar.deadlineTime,
    }
  },
}
