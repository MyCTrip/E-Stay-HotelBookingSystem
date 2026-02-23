export type HotelMarket = 'domestic' | 'international'

export interface GeoPoint {
  lng: number
  lat: number
}

export interface HotelBaseInfoModel {
  name: string
  star: number
  address: string
  description: string
  images: string[]
}

export interface HotelFacilityModel {
  category: string
  content: string
  summary?: string
}

export interface HotelPolicyModel {
  checkInTime: string
  cancellationPolicy: string
  checkOutTime?: string
}

export interface HotelSurroundingModel {
  surName: string
  surType: string
  distanceMeters?: number
  distanceText?: string
}

export interface HotelRatingModel {
  score: number
  count: number
  label?: string
}

export interface HotelDomainModel {
  id: string
  market: HotelMarket
  baseInfo: HotelBaseInfoModel
  facilities: HotelFacilityModel[]
  policies: HotelPolicyModel
  surroundings: HotelSurroundingModel[]
  rating: HotelRatingModel
  distanceText?: string
}

export interface HotelRoomHeadInfoModel {
  size?: string
  floor?: string
  wifi?: boolean
  windowAvailable?: boolean
  smokingAllowed?: boolean
}

export interface HotelRoomBedInfoModel {
  bedType: string
  bedNumber: number
  bedSize: string
}

export interface HotelRoomSKUModel {
  roomId: string
  priceInfo: {
    nightlyPrice: number
  }
  status: 'available' | 'sold_out'
  cancellationRule: string
}

export interface HotelRoomSPUModel {
  spuName: string
  images: string[]
  headInfo: HotelRoomHeadInfoModel
  bedInfo: HotelRoomBedInfoModel[]
  startingPrice: number
  skus: HotelRoomSKUModel[]
}

export interface HotelSearchParams {
  city: string
  keyword?: string
  checkInDate: string
  checkOutDate: string
  market: HotelMarket
  page: number
  limit: number
  stars?: number[]
  minPrice?: number
  maxPrice?: number
}

export interface HotelAdapterContext {
  userLocation?: GeoPoint
}

