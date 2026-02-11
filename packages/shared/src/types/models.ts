/**
 * 数据模型类型定义
 * 与后端 API 返回数据结构保持一致
 */

/**
 * 酒店设施
 */
export interface Facility {
  category: string // 分类：公共、房内等
  summary?: string // 简短描述
  icon?: string // 图标
  order?: number // 排序
  visible?: boolean // 是否显示
  content: string // HTML 富文本
  items?: Array<{
    item: string
    content: string
  }>
}

/**
 * 酒店政策
 */
export interface Policy {
  policyType: string // 政策类型
  summary?: string
  content: string // HTML 富文本
  flags?: string[]
  effectiveFrom?: string
}

/**
 * 周边信息
 */
export interface Surrounding {
  surType: 'metro' | 'attraction' | 'business'
  surName: string
  distance: number // 距离（米）
}

/**
 * 优惠信息
 */
export interface Discount {
  title: string
  type: 'discount' | 'instant'
  content: string
}

/**
 * 酒店基础信息
 */
export interface HotelBaseInfo {
  nameCn: string
  nameEn?: string
  address: string
  city: string
  star: number // 1-5 星
  openTime?: string
  roomTotal?: number
  phone: string
  description: string
  images: string[]
  facilities: Facility[]
  policies: Policy[]
  surroundings?: Surrounding[]
  discounts?: Discount[]
}

/**
 * 酒店入住信息
 */
export interface HotelCheckinInfo {
  checkinTime: string // HH:MM
  checkoutTime: string
  breakfastType?: string
  breakfastPrice?: number
}

/**
 * 酒店审核信息
 */
export interface AuditInfo {
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'
  rejectReason?: string
}

/**
 * 完整酒店数据
 */
export interface Hotel {
  _id: string
  baseInfo: HotelBaseInfo
  checkinInfo?: HotelCheckinInfo
  auditInfo?: AuditInfo
  rooms?: Room[]
  createdAt?: string
  updatedAt?: string
}

/**
 * 房间床型信息
 */
export interface BedInfo {
  bedType: string // 床类型
  bedNumber: number // 床数
  bedSize: string // 床大小
}

/**
 * 房间基本信息
 */
export interface RoomBaseInfo {
  type: string // 房型
  price: number // 价格
  images: string[]
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'
  maxOccupancy: number // 最多入住人数
  facilities?: Facility[]
  policies?: Policy[]
  bedRemark?: string[]
}

/**
 * 房间头部信息
 */
export interface RoomHeadInfo {
  size: string // 面积描述
  floor: string // 楼层
  wifi: boolean
  windowAvailable: boolean
  smokingAllowed: boolean
}

/**
 * 早餐信息
 */
export interface BreakfastInfo {
  breakfastType?: string
  cuisine?: string
  bussinessTime?: string
  addBreakfast?: string
}

/**
 * 完整房间数据
 */
export interface Room {
  _id: string
  hotelId: string
  baseInfo: RoomBaseInfo
  headInfo: RoomHeadInfo
  bedInfo: BedInfo[]
  breakfastInfo?: BreakfastInfo
  auditInfo?: {
    status: string
  }
  createdAt?: string
  updatedAt?: string
}

/**
 * 搜索查询参数
 */
export interface HotelQuery {
  city?: string
  search?: string
  limit?: number
  page?: number
  checkIn?: string
  checkOut?: string
}

/**
 * API 响应统一格式
 */
export interface ApiResponse<T> {
  data: T
  meta?: Record<string, any>
}

/**
 * 列表响应格式
 */
export interface ListResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
