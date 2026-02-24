/**
 * HostInfo 组件数据中间件
 * 职责：从中央数据提取并格式化房东信息
 */

import type { DetailCenterData, DetailHostInfo } from '../types/detailDataMiddleware'

export const hostInfoMiddleware = {
  /**
   * 获取 HostInfo 组件所需的数据
   */
  getData: (centerData: DetailCenterData): DetailHostInfo => {
    const { hostInfo } = centerData
    
    if (!hostInfo) {
      return {
        name: '',
        avatar: '',
        badge: '',
        responseRate: 0,
        orderConfirmationRate: 0,
        responseTime: '',
        totalReviews: 0,
        overallRating: 0,
        tags: [],
      }
    }

    return {
      name: hostInfo.name,
      avatar: hostInfo.avatar,
      badge: hostInfo.badge,
      responseRate: hostInfo.responseRate,
      orderConfirmationRate: hostInfo.orderConfirmationRate,
      responseTime: hostInfo.responseTime,
      totalReviews: hostInfo.totalReviews,
      overallRating: hostInfo.overallRating,
      tags: hostInfo.tags,
    }
  },
}
