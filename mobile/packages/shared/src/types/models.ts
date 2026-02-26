/**
 * 后端数据模型类型定义
 * 与PC后端 Mongoose 数据库模型保持完全一致
 * 包含三种房型：hotel, hourlyHotel, homeStay
 * 
 * 数据流：PC后端MongoDB → API返回(this) → 前端detailDataMiddleware转换
 */

import type {
  // 通用类型
  DetailBaseInfo,
  DetailHostInfo,
  DetailRoomInfo,
  HotelInfoData,
  HostInfoData,
  RoomCardData,
  RoomDrawerBasicInfoData,
  RoomDrawerBannerData,
  RoomDrawerFeeNoticeData,
  RoomDrawerPriceData,
  RoomPackageDetailData,
  RoomBedInfo,
  FacilityCategory,
  CancellationPolicy,
  FeeInfo,
  FeeNoticeInfo,
  SurroundingInfo,
  PriceItem,
  Distance,
} from './detailDataMiddleware'

/**
 * ============================================
 * 后端原本定义的基础类型
 * ============================================
 */

/**
 * 属性类型识别符（三种房型）
 */
export type PropertyType = 'hotel' | 'hourlyHotel' | 'homeStay'

/**
 * 审核状态枚举
 */
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'

/**
 * 设施项（后端原本的细粒度设施）
 */
export interface FacilityItem {
  name: string // 设施名称，如"免费WiFi"
  description?: string // 设施说明，支持HTML
  icon?: string // 设施图标
  available?: boolean // 设施是否可用，默认true
}

/**
 * 设施分类（后端原本的）
 */
export interface Facility {
  category: string // 分类名，如"公共设施"、"房间设施"
  content: string // HTML 富文本，分类整体描述（注：backend已做XSS防护）
  summary?: string // 简短摘要，用于列表显示
  icon?: string // 分类图标
  order?: number // 排序，默认0
  visible?: boolean // 是否显示，默认true
  items?: FacilityItem[] // 该分类下的细分设施列表
}

/**
 * 政策信息（后端原本的）
 */
export interface Policy {
  policyType: string // 政策类型，如"cancellation"、"petAllowed"等
  content: string // HTML 富文本，政策详情（注：backend已做XSS防护）
  summary?: string // 简短描述，用于列表显示
  flags?: Record<string, any> // JSON对象，用于快速筛选/标签，如{type:'pet',allowed:true}
  effectiveFrom?: Date // 生效日期
}

/**
 * 周边地点信息
 */
export interface Surrounding {
  surType: 'metro' | 'attraction' | 'business' // 地铁/景点/商圈
  surName: string // 地点名称
  distance: number // 距离，单位米
}

/**
 * 优惠信息
 */
export interface Discount {
  title: string // 促销标题
  type: 'discount' | 'instant' // 折扣/立减
  content: string // 促销描述
}

/**
 * 审核信息（用于Hotel和Room）
 */
export interface AuditInfo {
  status: AuditStatus // 审核状态
  auditedBy?: string // 审批者用户ID（ObjectId字符串）
  auditedAt?: Date // 审批时间
  rejectReason?: string // 驳回原因
}

/**
 * 地理位置（GeoJSON Point）
 */
export interface GeoLocation {
  type: 'Point'
  coordinates: [number, number] // [lng, lat]
}

/**
 * 入住信息
 */
export interface CheckinInfo {
  checkinTime: string // 入住时间，格式 HH:MM
  checkoutTime: string // 退房时间，格式 HH:MM
  breakfastType?: string // 早餐类型
  breakfastPrice?: number // 早餐价格
}

/**
 * 房间头部信息（房间属性）
 */
export interface RoomHeadInfo {
  size: string // 房间面积，如"25 sqm"
  floor: string // 楼层
  wifi: boolean // 是否有WiFi
  windowAvailable: boolean // 是否有窗户
  smokingAllowed: boolean // 是否允许吸烟
}

/**
 * 房间早餐信息
 */
export interface BreakfastInfo {
  breakfastType?: string // 早餐类型，如"自助"、"套餐"
  cuisine?: string // 餐食风格，如"中式"、"西式"
  bussinessTime?: string // 营业时间，如"06:00-10:00"
  addBreakfast?: string // 额外早餐说明
}

/**
 * 床铺信息
 */
export interface BedInfo {
  bedType: string // 床类型，如"大床"、"双床"
  bedNumber: number // 该床型的数量
  bedSize: string // 床尺寸，如"1.5m x 2m"
}

/**
 * 钟点房特定时段配置
 */
export interface HourlySlot {
  startTime: string // HH:MM
  endTime: string // HH:MM
  price: number // 该时段价格
}

/**
 * ============================================
 * Hotel 表相关接口
 * ============================================
 */

/**
 * 基础Hotel类型（通用字段，所有房型都有）
 */
interface BaseHotel {
  // 主键和外键
  _id: string // MongoDB ObjectId
  merchantId: string // 商户ID（ObjectId字符串）

  // 基础信息（使用detailDataMiddleware的DetailBaseInfo）
  baseInfo: DetailBaseInfo

  // 入住信息
  checkinInfo?: CheckinInfo

  // 地理位置
  location?: GeoLocation

  // 通用费用信息（所有房型都有）
  feeInfo?: FeeInfo // 基础费用信息
  feeNotice?: FeeNoticeInfo // 费用通知信息

  // 周边信息
  surroundings?: SurroundingInfo

  // 预订相关
  bookingDeadline?: {
    deadlineTime: number
    description?: string
  }
  priceList?: PriceItem[]

  // 房间和图片
  rooms?: Room[] // 所属房间列表
  images?: string[] // 酒店图片

  // 审核、删除等系统字段
  auditInfo?: AuditInfo
  pendingChanges?: any
  pendingDeletion?: boolean
  deletedAt?: Date

  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * homeStay类型Hotel（使用detailDataMiddleware的结构）
 */
export interface HomeStayHotel extends BaseHotel {
  baseInfo: DetailBaseInfo & { propertyType: 'homeStay' }
  
  // homeStay特有：房东信息
  hostInfo?: DetailHostInfo

  // homeStay特有：评论
  reviews?: Array<{
    _id?: string
    userId?: string
    userName: string
    rating: number
    content: string
    createdAt?: Date
    images?: string[]
  }>
  reviews_count?: number

  // homeStay特有：使用detailDataMiddleware的结构
  facilities: FacilityCategory[] // 设施
  policies: CancellationPolicy[] // 政策
}

/**
 * 标准酒店类型Hotel（使用后端原本的Policy和Facility）
 */
export interface StandardHotel extends BaseHotel {
  baseInfo: DetailBaseInfo & { propertyType: 'hotel' }

  // 标准酒店：使用后端原本的结构
  facilities: Facility[] // 设施
  policies: Policy[] // 政策
}

/**
 * 钟点房类型Hotel（基于BaseHotel + 钟点房特定字段，与StandardHotel类似但propertyType不同）
 */
export interface HourlyHotel extends BaseHotel {
  baseInfo: DetailBaseInfo & { propertyType: 'hourlyHotel' }

  // 钟点房与标准酒店相同的字段
  facilities: Facility[] // 设施
  policies: Policy[] // 政策

  // 钟点房特有
  typeConfig?: {
    hourlySlots?: HourlySlot[]
    minimumHours?: number
    maximumHours?: number
  }
}

/**
 * Hotel的union类型
 */
export type Hotel = HomeStayHotel | StandardHotel | HourlyHotel

/**
 * ============================================
 * Room 表相关接口
 * ============================================
 */

/**
 * 基础Room类型（通用字段）
 */
interface BaseRoom {
  // 主键和外键
  _id: string // MongoDB ObjectId
  hotelId: string // 所属酒店ID（ObjectId字符串）

  // 房间基本信息
  headInfo?: RoomHeadInfo // 房间属性（可选，用于兼容）
  bedInfo: BedInfo[] // 床铺信息数组（必填）
  breakfastInfo?: BreakfastInfo // 早餐信息

  // 套餐详情
  packageDetail?: RoomPackageDetailData

  // 审核、删除等系统字段
  auditInfo?: AuditInfo
  pendingChanges?: any
  pendingDeletion?: boolean
  deletedAt?: Date

  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * homeStay类型Room（包含完整的RoomDrawer数据）
 */
export interface HomeStayRoom extends BaseRoom {
  // homeStay房间：完整的drawer数据
  basicInfo: RoomDrawerBasicInfoData // 基本信息
  banner: RoomDrawerBannerData // 图片
  facilities: FacilityCategory[] // 设施（使用detailDataMiddleware的）
  policies: CancellationPolicy[] // 政策（使用detailDataMiddleware的）
  feeNotice: RoomDrawerFeeNoticeData // 费用通知
  price: RoomDrawerPriceData // 价格

  // 房型分类
  category: 'homestay'
}

/**
 * 标准酒店类型Room（简化版，包含基本RoomDrawer数据）
 */
export interface StandardRoom extends BaseRoom {
  // 标准房间：基本信息和drawer数据
  basicInfo: RoomDrawerBasicInfoData // 基本信息
  banner: RoomDrawerBannerData // 图片
  facilities: Facility[] // 设施（使用后端原本的）
  policies: Policy[] // 政策（使用后端原本的）
  feeNotice: RoomDrawerFeeNoticeData // 费用通知
  price: RoomDrawerPriceData // 价格

  // 房型分类
  category: 'standard' | 'hourly'
}

/**
 * Room的union类型
 */
export type Room = HomeStayRoom | StandardRoom

/**
 * ============================================
 * API 响应格式
 * ============================================
 */

/**
 * 单项API响应格式
 */
export interface ApiResponse<T> {
  data: T
  meta?: Record<string, any>
}

/**
 * 列表API响应格式
 */
export interface ListResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

/**
 * 酒店查询参数
 */
export interface HotelQuery {
  city?: string // 城市名称
  search?: string // 搜索关键词
  propertyType?: PropertyType // 房型类型
  page?: number // 分页页码
  limit?: number // 分页大小
  checkIn?: string // 入住日期，ISO格式
  checkOut?: string // 退房日期，ISO格式
}
