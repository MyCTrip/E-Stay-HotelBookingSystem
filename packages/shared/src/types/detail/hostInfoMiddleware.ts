/**
 * HostInfo 组件数据中间件
 * 数据来源：DetailCenterData.hostInfo
 * 组件接收：name、avatar、badge、responseRate、responseTime、totalReviews、overallRating、tags
 */

import type { DetailCenterData, HostInfoData } from '../detailDataMiddleware'

export interface HostInfoParams extends HostInfoData {}

export const transformCenterDataToHostInfo = (
  data: DetailCenterData
): HostInfoParams => {
  return {
    name: data.hostInfo?.name,
    avatar: data.hostInfo?.avatar,
    badge: data.hostInfo?.badge,
    responseRate: data.hostInfo?.responseRate,
    orderConfirmationRate: data.hostInfo?.orderConfirmationRate,
    responseTime: data.hostInfo?.responseTime,
    totalReviews: data.hostInfo?.totalReviews,
    overallRating: data.hostInfo?.overallRating,
    tags: data.hostInfo?.tags,
  }
}

export const transformHostInfoToCenterData = (
  params: Partial<HostInfoParams>
): Partial<DetailCenterData> => {
  return {
    hostInfo: params as any,
  }
}
