/**
 * Hotel 模块专用类型定义
 * 注意：所有日期参数使用 string 类型（YYYY-MM-DD 格式）
 */

import type { HotelDomainModel, HotelRoomSPUModel, GeoPoint, HotelMarket } from '../domain'
import type { Room } from '../types'
// 进口 hotel room SKU 类型（钉在原始名称中避免冲突）
import type { HotelRoomSKUModel } from '../domain/hotel/hotel.view.types'

/**
 * 酒店搜索参数（日期使用 string 格式）
 */
export interface HotelSearchParams {
  city: string
  keyword?: string
  checkInDate: string // YYYY-MM-DD 格式
  checkOutDate: string // YYYY-MM-DD 格式
  market: HotelMarket
  page: number
  limit: number
  stars?: number[]
  minPrice?: number
  maxPrice?: number
}

/**
 * 酒店 Store 完整状态接口
 */
export interface HotelStoreState {
  // ===== 搜索参数 =====
  searchParams: HotelSearchParams

  // ===== 酒店列表 =====
  hotelList: HotelDomainModel[]
  hotels: HotelDomainModel[]
  total: number
  hasMore: boolean

  // ===== 酒店详情 =====
  currentHotelDetail: HotelDomainModel | null

  // ===== 房间信息 =====
  roomSPUList: Record<string, HotelRoomSPUModel[]>
  currentSelectedRoomId: string | null
  currentRoom: Room | HotelRoomSKUModel | null

  // ===== UI 状态 =====
  isRoomModalVisible: boolean
  loading: boolean
  error: string | null
  inFlightKey: string | null

  // ===== Actions: 搜索和过滤 =====
  setSearchParams: (params: Partial<HotelSearchParams>) => void

  // ===== Actions: 获取数据 =====
  fetchHotels: (ctx?: { append?: boolean; userLocation?: GeoPoint; city?: string; checkInDate?: string; checkOutDate?: string }) => Promise<void>
  fetchHotelDetail: (hotelId: string, ctx?: { userLocation?: GeoPoint }) => Promise<void>
  fetchHotelRooms: (hotelId: string) => Promise<HotelRoomSPUModel[]>
  fetchMoreHotels: (ctx?: { userLocation?: GeoPoint }) => Promise<void>
  fetchRoomSPUListByHotel: (hotelId: string) => Promise<HotelRoomSPUModel[]>
  fetchRoomDetail: (roomId: string) => Promise<void>

  // ===== Actions: 房间模态框 =====
  setRoomModalVisible: (visible: boolean) => void
  openRoomModal: (roomId: string) => void
  closeRoomModal: () => void
  setCurrentSelectedRoomId: (roomId: string | null) => void

  // ===== Actions: 其他 =====
  clearError: () => void
  resetHotels: () => void
}
