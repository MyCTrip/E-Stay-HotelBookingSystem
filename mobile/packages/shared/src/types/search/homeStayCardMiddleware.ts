/**
 * 民宿卡片中间件 (HomeStayCard)
 * 将 Hotel/Room 适配为 HomeStayCard 瀑布流组件所需的数据格式
 */

import type { HomeStayHotel, HomeStayRoom } from '../models'

/**
 * 民宿卡片数据格式
 * 用于 HomeStayCard 瀑布流组件
 */
export interface HomeStayCardData {
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
  facilities: Array<{
    id: string
    name: string
  }>
}

/**
 * 从 HomeStayHotel 转换为 HomeStayCardData
 */
export function transformHotelToHomeStayCard(hotel: HomeStayHotel): HomeStayCardData {
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
    facilities: (hotel.facilities || []).map((fac) => ({
      id: fac.id,
      name: fac.name,
    })),
  }
}

/**
 * 批量转换
 */
export function transformHotelsToHomeStayCards(hotels: HomeStayHotel[]): HomeStayCardData[] {
  return hotels.map(transformHotelToHomeStayCard)
}
