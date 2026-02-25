/**
 * RoomDrawerFacilities 组件数据中间件
 * 职责：从中央数据提取并格式化房间设施信息
 */

import type { DetailCenterData, FacilityCategory } from '../types/detailDataMiddleware'

export const roomDrawerFacilitiesMiddleware = {
  /**
   * 获取 RoomDrawerFacilities 组件所需的数据
   */
  getData: (centerData: DetailCenterData): FacilityCategory[] => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom || !selectedRoom.facilities) {
      return []
    }

    return selectedRoom.facilities.facilities
  },
}
