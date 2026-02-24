/**
 * RoomDrawerBasicInfo 组件数据中间件
 * 职责：从中央数据提取并格式化房间基本信息
 */

import type { DetailCenterData, RoomBedInfo } from '../types/detailDataMiddleware'

export interface RoomBasicInfoData {
  id?: string
  name: string
  area: string
  beds: string
  guests: string
  breakfastCount?: number
  room?: RoomBedInfo[]
}

export const roomDrawerBasicInfoMiddleware = {
  /**
   * 获取 RoomDrawerBasicInfo 组件所需的数据
   */
  getData: (centerData: DetailCenterData): RoomBasicInfoData => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom) {
      return {
        name: '',
        area: '',
        beds: '',
        guests: '',
      }
    }

    const basicInfo = selectedRoom.basicInfo
    
    return {
      id: basicInfo.id,
      name: basicInfo.name,
      area: String(basicInfo.area) + '㎡',
      beds: Array.isArray(basicInfo.bedRemark)
        ? basicInfo.bedRemark.join(',')
        : String(basicInfo.bedRemark || ''),
      guests: String(basicInfo.guests),
      breakfastCount: basicInfo.breakfastCount,
      room: basicInfo.room,
    }
  },
}
