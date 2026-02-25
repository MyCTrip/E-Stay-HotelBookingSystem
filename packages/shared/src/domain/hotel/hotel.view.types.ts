import type { FacilityModel, HotelBaseInfoModel as DBBaseInfo } from './hotel.types'

export type HotelMarket = 'domestic' | 'international'

export interface GeoPoint {
  lng: number
  lat: number
}

//  1. 专门用于列表页展示的轻量级视图卡片模型
export interface HotelListViewModel {
  id: string
  market: HotelMarket
  // 直接复用底层的 BaseInfo，或者用 Pick 挑出列表页需要的字段
  baseInfo: Pick<DBBaseInfo, 'nameCn' | 'nameEn' | 'star' | 'address' | 'description' | 'images'>
  rating: HotelRatingModel
  distanceText?: string
}

export type HotelFacilityViewModel = Pick<FacilityModel, 'category' | 'content' | 'summary'>

export interface HotelPolicyViewModel {
  checkInTime: string
  checkOutTime?: string
  cancellationPolicy: string
}

export interface HotelSurroundingViewModel {
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

// ✅ 2. 以下 SPU / SKU 相关的业务聚合模型保持不变，它们是前端选房特有的模型
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