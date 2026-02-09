import { AxiosInstance } from 'axios'

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
 * 创建酒店服务 - 工厂函数
 */
export function createHotelService(api: AxiosInstance) {
  return {
    /**
     * 获取酒店列表（带筛选和分页）
     */
    fetchHotels: (query: HotelQuery): Promise<HotelListResponse> => {
      return api.get('/hotels', { params: query })
    },

    /**
     * 获取热门酒店列表
     */
    fetchHotHotels: (limit = 10): Promise<Hotel[]> => {
      return api.get('/hotels/hot', { params: { limit } })
    },

    /**
     * 获取所有有酒店的城市列表
     */
    fetchCities: (): Promise<string[]> => {
      return api.get('/hotels/cities')
    },

    /**
     * 获取单个酒店详情（包含房型列表）
     */
    fetchHotelDetail: (hotelId: string): Promise<Hotel> => {
      return api.get(`/hotels/${hotelId}`)
    },

    /**
     * 获取酒店下的房型列表
     */
    fetchRoomsByHotel: (
      hotelId: string,
      params?: { status?: string; limit?: number; page?: number }
    ): Promise<any> => {
      return api.get(`/hotels/${hotelId}/rooms`, { params })
    },
  }
}

// 为了向后兼容，导出这些函数（在 web 中）
export const fetchHotels = (api: AxiosInstance) => (query: HotelQuery) =>
  api.get('/hotels', { params: query })

export const fetchHotHotels = (api: AxiosInstance) => (limit = 10) =>
  api.get('/hotels/hot', { params: { limit } })

export const fetchCities = (api: AxiosInstance) => () =>
  api.get('/hotels/cities')

export const fetchHotelDetail = (api: AxiosInstance) => (hotelId: string) =>
  api.get(`/hotels/${hotelId}`)

export const fetchRoomsByHotel = (api: AxiosInstance) => (
  hotelId: string,
  params?: { status?: string; limit?: number; page?: number }
) => api.get(`/hotels/${hotelId}/rooms`, { params })
