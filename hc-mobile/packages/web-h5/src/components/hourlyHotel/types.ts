export interface HourlyFacilityItem {
  name?: string
  content?: string
}

export interface HourlyPolicyItem {
  content?: string
}

export interface HourlyRoomBaseInfo {
  nameCn?: string
  city?: string
  address?: string
  star?: number
  type?: string
  price?: number
  images?: string[]
  maxOccupancy?: number
  facilities?: Array<HourlyFacilityItem | string>
  policies?: HourlyPolicyItem[]
  windowAvailable?: boolean
}

export interface HourlyRoom {
  _id: string
  baseInfo: HourlyRoomBaseInfo
  images?: string[]
  durationOptions?: number[]
}

export interface HourlyRoomDetail {
  _id: string
  hotelId: string
  baseInfo: HourlyRoomBaseInfo
  durationOptions?: number[]
  createdAt?: Date
  updatedAt?: Date
}
