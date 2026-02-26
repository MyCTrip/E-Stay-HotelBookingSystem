/**
 * 搜索结果卡片中间件
 * 将 Hotel/Room 适配为 SearchResultCard 组件所需的数据格式
 */

import type { Hotel, HomeStayHotel, Room, HomeStayRoom } from './models'
import type { DetailBaseInfo } from './detailDataMiddleware'

/**
 * 搜索卡片数据结构
 * 用于 SearchResultCard 组件
 */
export interface SearchCardData {
  _id: string
  baseInfo: {
    name: string
    nameEn?: string
    star: number
    reviewCount: number
    city: string
    address: string
  }
  images: string[]
  rooms: Array<{
    price: number
    type?: string
  }>
}

/**
 * 从 HomeStayHotel 转换为 SearchCardData
 */
export function transformHotelToSearchCard(hotel: HomeStayHotel): SearchCardData {
  return {
    _id: hotel._id,
    baseInfo: {
      name: hotel.baseInfo.name,
      nameEn: hotel.baseInfo.name, // 使用 name 而不是 nameEn
      star: hotel.baseInfo.star || 5,
      reviewCount: hotel.baseInfo.reviewCount || 0,
      city: hotel.baseInfo.city || '',
      address: hotel.baseInfo.address || '',
    },
    images: hotel.images || [],
    rooms: ((hotel.rooms || []) as HomeStayRoom[]).map((room) => ({
      price: room.price?.currentPrice || room.price?.originPrice || 0,
      type: room.basicInfo?.type,
    })),
  }
}

/**
 * 批量转换
 */
export function transformHotelsToSearchCards(hotels: HomeStayHotel[]): SearchCardData[] {
  return hotels.map(transformHotelToSearchCard)
}
