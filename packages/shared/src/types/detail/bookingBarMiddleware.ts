/**
 * BookingBar 组件数据中间件
 * 数据来源：DetailCenterData
 * 组件接收：host、priceList、totalPrice、deadlineTime
 */

import type { DetailCenterData, BookingBarData } from '../detailDataMiddleware'

export interface BookingBarParams extends BookingBarData {}

export const transformCenterDataToBookingBar = (
  data: DetailCenterData
): BookingBarParams => {
  return {
    host: {
      avatar: data.hostInfo?.avatar,
      name: data.hostInfo?.name,
    },
    priceList: data.priceList,
    totalPrice: data.feeInfo?.totalPrice,
    deadlineTime: data.bookingDeadline?.deadlineTime,
  }
}

export const transformBookingBarToCenterData = (
  params: Partial<BookingBarParams>
): Partial<DetailCenterData> => {
  return {}
}
