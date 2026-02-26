/**
 * RoomDrawerPolicy 组件数据中间件
 * 职责：从中央数据提取并格式化房间政策信息
 */

import type { DetailCenterData, TimeSpan, AmenitiesRestriction } from '../types/detailDataMiddleware'
import type { HomeStaySearchParams } from '../types/homestay'

export interface RoomPolicyData {
  checkInSpan?: TimeSpan[]
  checkoutTime?: string
  cancelMinute?: number
  deadlineTime?: number
  amenities?: AmenitiesRestriction
}

export const roomDrawerPolicyMiddleware = {
  /**
   * 获取 RoomDrawerPolicy 组件所需的数据
   */
  getData: (centerData: DetailCenterData, searchParams?: HomeStaySearchParams): RoomPolicyData => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom) {
      return {}
    }

    const { policy } = selectedRoom
    
    return {
      checkInSpan: policy.checkInSpan,
      checkoutTime: policy.checkoutTime,
      cancelMinute: policy.cancelMinute,
      deadlineTime: policy.deadlineTime,
      amenities: policy.amenities,
    }
  },
}
