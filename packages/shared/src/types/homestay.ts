/**
 * 民宿模块类型定义
 */

/**
 * 搜索参数
 */
export interface HomeStaySearchParams {
  city: string
  checkIn: Date
  checkOut: Date
  guests: number
  rooms?: number
  beds?: number
  keyword?: string
  selectedTags?: string[]
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}

/**
 * 设施项
 */
export interface FacilityItem {
  name: string
  description?: string
  icon?: string
  available?: boolean
}

/**
 * 设施分类
 */
export interface Facility {
  category: string
  content: string
  summary?: string
  icon?: string
  items?: FacilityItem[]
  order?: number
  visible?: boolean
  
}

/**
 * 政策
 */
export interface Policy {
  policyType: string
  content: string
  summary?: string
  flags?: Record<string, any>
  effectiveFrom?: Date
}

/**
 * 周边信息
 */
export interface Surrounding {
  surType: 'metro' | 'attraction' | 'business'
  surName: string
  distance: number
}

/**
 * 折扣信息
 */
export interface Discount {
  title: string
  type: 'discount' | 'instant'
  content: string
}

/**
 * 民宿基础信息
 */
export interface HomeStayBaseInfo {
  nameCn: string
  nameEn?: string
  address: string
  city: string
  star: number
  phone: string
  description: string
  roomTotal?: number
  openTime?: string
  facilities: Facility[]
  policies: Policy[]
  surroundings?: Surrounding[]
  discounts?: Discount[]
}

/**
 * 民宿特定类型配置
 */
export interface HomeStayTypeConfig {
  hostName: string
  hostPhone: string
  hostAvatar?: string
  responseTimeHours: number
  instantBooking: boolean
  minStay: number
  maxStay?: number
  securityDeposit?: number
  amenityTags?: string[]
}

/**
 * 入住信息
 */
export interface CheckinInfo {
  checkinTime: string
  checkoutTime: string
  breakfastType?: string
  breakfastPrice?: number
}

/**
 * 审核信息
 */
export interface AuditInfo {
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'
  auditedBy?: string
  auditedAt?: Date
  rejectReason?: string
}

/**
 * 民宿主体
 */
export interface HomeStay {
  _id: string
  merchantId: string
  baseInfo: HomeStayBaseInfo
  typeConfig?: HomeStayTypeConfig
  checkinInfo?: CheckinInfo
  auditInfo?: AuditInfo
  images: string[]
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  rooms: Room[]
  createdAt: Date
  updatedAt: Date
}

/**
 * 房间属性
 */
export interface RoomHeadInfo {
  size: string
  floor?: string
  wifi: boolean
  windowAvailable: boolean
  smokingAllowed: boolean
}

/**
 * 床铺信息
 */
export interface BedInfo {
  bedType: string
  bedNumber: number
  bedSize: string
}

/**
 * 房间早餐
 */
export interface BreakfastInfo {
  breakfastType?: string
  cuisine?: string
  bussinessTime?: string
  addBreakfast?: string
}

/**
 * 民宿房型特定配置
 */
export interface HomestayRoomTypeConfig {
  pricePerNight: number
  weeklyDiscount?: number
  monthlyDiscount?: number
  cleaningFee?: number
  minimumStay: number
  maxGuests: number
  instantBook: boolean
}

/**
 * 房间基础信息
 */
export interface RoomBaseInfo {
  type: string
  price: number
  images: string[]
  maxOccupancy: number
  facilities: Facility[]
  policies: Policy[]
  bedRemark: string[]
}

/**
 * 房型
 */
export interface Room {
  _id: string
  hotelId: string
  baseInfo: RoomBaseInfo
  category: 'homestay' | 'standard' | 'hourly'
  typeConfig?: HomestayRoomTypeConfig
  headInfo?: RoomHeadInfo
  bedInfo: BedInfo[]
  breakfastInfo?: BreakfastInfo
  auditInfo?: AuditInfo
  createdAt: Date
  updatedAt: Date
}

/**
 * 价格信息
 */
export interface PriceInfo {
  basePrice: number
  cleaningFee?: number
  discountType?: 'weekly' | 'monthly' | 'none'
  discountValue?: number
  finalPrice: number
  totalNights: number
}

/**
 * 搜索结果分页
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

/**
 * API搜索响应
 */
export interface HomeStaySearchResponse {
  data: HomeStay[]
  pagination: PaginationMeta
}

/**
 * 快捷筛选标签
 */
export interface QuickFilterTag {
  id: string
  label: string
  icon?: string
  badge?: string
}
