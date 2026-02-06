import api from './api'

export interface HotelQuery {
  city?: string
  search?: string
  limit?: number
  page?: number
}

export interface Hotel {
  _id: string
  baseInfo: {
    nameCn: string
    address: string
    city: string
    star: number
    images: string[]
    phone?: string
    description?: string
    facilities?: any[]
    policies?: any[]
  }
  checkinInfo?: {
    checkinTime: string
    checkoutTime: string
  }
  auditInfo?: {
    status: string
  }
}

export interface HotelListResponse {
  data: Hotel[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

/**
 * 获取酒店列表（带筛选和分页）
 */
export async function fetchHotels(query: HotelQuery): Promise<HotelListResponse> {
  return api.get('/hotels', { params: query })
}

/**
 * 获取热门酒店列表
 */
export async function fetchHotHotels(limit = 10): Promise<Hotel[]> {
  return api.get('/hotels/hot', { params: { limit } })
}

/**
 * 获取所有有酒店的城市列表
 */
export async function fetchCities(): Promise<string[]> {
  return api.get('/hotels/cities')
}

/**
 * 获取单个酒店详情（包含房型列表）
 */
export async function fetchHotelDetail(hotelId: string): Promise<Hotel> {
  return api.get(`/hotels/${hotelId}`)
}

/**
 * 获取酒店下的房型列表
 */
export async function fetchRoomsByHotel(
  hotelId: string,
  params?: { status?: string; limit?: number; page?: number }
): Promise<any> {
  return api.get(`/hotels/${hotelId}/rooms`, { params })
}
