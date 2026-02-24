/**
 * HotelInfo 组件数据中间件
 * 职责：从中央数据提取并格式化酒店基本信息
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'
import type { DetailBaseInfo } from '../types/detailDataMiddleware'

export const hotelInfoMiddleware = {
  /**
   * 获取 HotelInfo 组件所需的数据
   */
  getData: (centerData: DetailCenterData): DetailBaseInfo => {
    const { baseInfo } = centerData
    
    return {
      _id: baseInfo._id,
      name: baseInfo.name,
      brand: baseInfo.brand,
      tags: baseInfo.tags,
      rating: baseInfo.rating,
      reviewCount: baseInfo.reviewCount,
      star: baseInfo.star,
      address: baseInfo.address,
      area: baseInfo.area,
      room: baseInfo.room,
      bed: baseInfo.bed,
      guests: baseInfo.guests,
      city: baseInfo.city,
      phone: baseInfo.phone,
      description: baseInfo.description,
    }
  },
}
