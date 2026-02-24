/**
 * PolicySection 组件数据中间件
 * 职责：从中央数据提取并格式化政策信息
 */

import type { DetailCenterData, TimeSpan, AmenitiesRestriction } from '../types/detailDataMiddleware'
import type { HomeStaySearchParams } from '../types/homestay'

export interface PolicySectionData {
  checkInSpan?: TimeSpan[]
  checkoutTime?: string
  cancelMinute?: number
  deadlineTime?: number
  amenities?: AmenitiesRestriction
}

export const policySectionMiddleware = {
  /**
   * 获取 PolicySection 组件所需的数据
   */
  getData: (centerData: DetailCenterData, searchParams?: HomeStaySearchParams): PolicySectionData => {
    const { policies } = centerData
    
    return {
      checkInSpan: policies.checkInSpan,
      checkoutTime: policies.checkoutTime,
      cancelMinute: policies.cancelMinute,
      deadlineTime: policies.deadlineTime,
      amenities: policies.amenities,
    }
  },
}
