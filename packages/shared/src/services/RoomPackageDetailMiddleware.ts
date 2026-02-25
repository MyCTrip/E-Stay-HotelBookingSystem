// @ts-nocheck
/**
 * RoomPackageDetail 组件数据中间�?
 * 职责：从中央数据提取并格式化房间套餐详情信息
 */

import type { DetailCenterData, RoomPackageDetailData } from '../types/detailDataMiddleware'

export const roomPackageDetailMiddleware = {
  /**
   * 获取 RoomPackageDetail 组件所需的数�?
   */
  getData: (centerData: DetailCenterData): RoomPackageDetailData | undefined => {
    const { selectedRoom } = centerData
    
    // @ts-ignore
    if (!selectedRoom || !selectedRoom.packageDetails) {
      return undefined
    }

    // @ts-ignore
    return {
      title: selectedRoom.packageDetails.title,
      checkInService: selectedRoom.packageDetails.checkInService,
      enjoyService: selectedRoom.packageDetails.enjoyService,
      details: selectedRoom.packageDetails.details,
    }
  },
}


