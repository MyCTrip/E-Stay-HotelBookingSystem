import { AxiosInstance } from 'axios'

export interface Room {
  _id: string
  hotelId: string
  baseInfo: {
    type: string
    price: number
    images: string[]
    maxOccupancy: number
    facilities?: any[]
    policies?: any[]
    bedRemark?: string[]
  }
  headInfo: {
    size: string
    floor: string
    wifi: boolean
    windowAvailable: boolean
    smokingAllowed: boolean
  }
  bedInfo: Array<{
    bedType: string
    bedNumber: number
    bedSize: string
  }>
  breakfastInfo?: {
    breakfastType?: string
    cuisine?: string
  }
  auditInfo?: {
    status: string
  }
}

/**
 * 创建房型服务 - 工厂函数
 */
export function createRoomService(api: AxiosInstance) {
  return {
    /**
     * 获取单个房型详情
     */
    fetchRoomDetail: (roomId: string): Promise<Room> => {
      return api.get(`/rooms/${roomId}`)
    },
  }
}

// 为了向后兼容，导出这个函数（在 web 中）
export const fetchRoomDetail = (api: AxiosInstance) => (roomId: string) =>
  api.get(`/rooms/${roomId}`)
