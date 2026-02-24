/**
 * RoomCard 组件数据中间件
 * 职责：从中央数据提取并格式化房间卡片信息
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'

export interface RoomCardItemData {
  _id: string
  roomId: string  // 房间ID - 用于定位packageDetail
  name: string
  area: string
  beds: string
  guests: string
  image: string
  priceList: Array<{
    packageId: number
    originPrice: number
    currentPrice: number
  }>
  priceNote?: string
  benefits?: string[]
  confirmTime?: string
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  cancelMunite?: number
  packageCount?: number
  hasPackageDetail?: boolean
  packages?: Array<{
    packageId: number
    name: string
    showPackageDetail?: boolean
    showBreakfastTag?: boolean
    breakfastCount?: number
    showCancelTag?: boolean
    cancelMunite?: number
    showComfirmTag?: boolean
    confirmTime?: number
  }>
}

export const roomCardMiddleware = {
  /**
   * 获取 RoomCard 组件所需的数据（房间列表）
   */
  getData: (centerData: DetailCenterData): RoomCardItemData[] => {
    const { rooms } = centerData
    
    if (!rooms || rooms.length === 0) {
      return []
    }

    return rooms.map(room => {
      // 检查是否有任何 package 的 showPackageDetail 为 true
      const roomPackages = (room as any).packages || []
      const hasPackageDetail = Array.isArray(roomPackages) && 
        roomPackages.some((pkg: any) => pkg.showPackageDetail === true)

      return {
        _id: room._id,
        roomId: (room as any).roomId || room._id,  // 优先使用 roomId，否则用 _id
        name: room.name,
        area: room.area,
        beds: room.beds,
        guests: room.guests,
        image: room.image,
        priceList: (room as any).priceList || [],
        priceNote: room.priceNote,
        benefits: room.benefits,
        confirmTime: (room as any).confirmTime,
        showBreakfastTag: (room as any).showBreakfastTag || false,
        breakfastCount: (room as any).breakfastCount,
        showCancelTag: (room as any).showCancelTag || false,
        cancelMunite: (room as any).cancelMunite,
        packageCount: (room as any).packageCount,
        hasPackageDetail,
        packages: roomPackages,
      }
    })
  },
}
