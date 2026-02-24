/**
 * RoomDrawerBanner 组件数据中间件
 * 职责：从中央数据提取并格式化房间图片轮播信息
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'

export interface RoomBannerImageData {
  category?: string
  url: string
}

export const roomDrawerBannerMiddleware = {
  /**
   * 获取 RoomDrawerBanner 组件所需的数据
   */
  getData: (centerData: DetailCenterData): RoomBannerImageData[] => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom || !selectedRoom.banner || !selectedRoom.banner.images) {
      return []
    }

    return selectedRoom.banner.images.map(img => ({
      category: img.category,
      url: img.url,
    }))
  },
}
