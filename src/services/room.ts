import api from './api'

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
 * 获取单个房型详情
 */
export async function fetchRoomDetail(roomId: string): Promise<Room> {
  return api.get(`/rooms/${roomId}`)
}
