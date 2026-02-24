/**
 * RoomPackageDetail 组件数据中间件
 * 职责：从中央数据提取并格式化房间套餐详情信息
 */

import type { DetailCenterData, RoomPackageDetailData } from '../types/detailDataMiddleware'

export const roomPackageDetailMiddleware = {
  /**
   * 获取 RoomPackageDetail 组件所需的数据
   */
  getData: (centerData: DetailCenterData): RoomPackageDetailData | undefined => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom || !selectedRoom.packageDetail) {
      return undefined
    }

    return {
      title: selectedRoom.packageDetail.title,
      checkInService: selectedRoom.packageDetail.checkInService,
      enjoyService: selectedRoom.packageDetail.enjoyService,
      details: selectedRoom.packageDetail.details,
    }
  },
}
