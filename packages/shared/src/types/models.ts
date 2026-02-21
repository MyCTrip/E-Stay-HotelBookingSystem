/**
 * 数据模型类型定义
 * 结合后端原始数据结构与移动端展示场景所需字段
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
  propertyType?: PropertyType
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
 * 移动端聚合展示信息 (前端独有或 BFF 层计算下发)
 * 专为列表页和详情页的快速渲染设计
 */
export interface HotelDisplayInfo {
  lowestPrice: number;    // 当前时间段内的最低起步价
  rating: number;         // 综合评分 (如 4.8)
  reviewCount: number;    // 评价总数
  distanceText?: string;  // 距离描述 (如 "距您 1.5km")
  tags?: string[];        // 快捷标签 (如 "免费停车", "近地铁")
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
  typeConfig?: TypeConfig
  // 新增：专供移动端聚合展示的独立数据块
  displayInfo?: HotelDisplayInfo
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
  price: number // 基础价格（挂牌价）
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
  category?: string
  typeConfig?: TypeConfig
  
  // 新增：移动端预订必须的状态（与查询日期强关联）
  inventory?: number;       // 当前查询时间段内的剩余库存量
  currentPrice?: number;    // 当前查询时间段内的实际结算价格
}

/**
 * 属性类型识别符
 */
export type PropertyType = 'hotel' | 'hourlyHotel' | 'homeStay'

/**
 * 按 propertyType 存放的可选配置项
 */
export interface TypeConfig {
  [key: string]: any
}

/**
 * 搜索查询参数 (完美匹配你的排序、筛选和国内外需求)
 */
export interface HotelQuery {
  city?: string
  search?: string
  limit?: number
  page?: number
  propertyType?: PropertyType
  
  // 核心业务参数
  isInternational?: boolean; // 区分国内/海外酒店业务
  checkInDate?: string;      // 入住日期 YYYY-MM-DD
  checkOutDate?: string;     // 离店日期 YYYY-MM-DD
  
  // 筛选参数
  minPrice?: number;         // 最低价
  maxPrice?: number;         // 最高价
  stars?: number[];          // 星级筛选，如 [3, 4, 5]
  facilities?: string[];     // 设施筛选，如 ['wifi', 'parking']
  
  // 排序参数
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc'; 
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