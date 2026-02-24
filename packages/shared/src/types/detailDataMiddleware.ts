/**
 * Detail页统一数据中间件
 * 
 * 职责：定义所有Detail页组件需要的详情型数据结构（数据库格式）
 * 仅包含从后端数据库获取的详情型数据，不包含搜索型数据
 * 这是中央数据定义，其他组件中间件都基于这个接口来进行数据转换
 */

/**
 * ============================================
 * 通用数据结构（被多个组件共用）
 * ============================================
 */

/**
 * 时间段信息（checkIn span）
 */
export interface TimeSpan {
  early: string  // 最早时间 格式: dd:mm
  later: string  // 最晚时间 格式: dd:mm
}

/**
 * 价格项
 */
export interface PriceItem {
  originPrice: number   // 原价
  currentPrice: number  // 现价
}

/**
 * 距离信息
 */
export interface Distance {
  value: number   // 距离数值
  unit: string    // 距离单位（km/m）
}

/**
 * 房间床铺信息
 */
export interface RoomBedInfo {
  name: string      // 房间名
  type: string      // 床型
  size: string      // 尺寸（单位m）
  number: number    // 数量
}

/**
 * 便利设施项
 */
export interface FacilityItemInfo {
  id: string        // 设施ID
  name: string      // 设施名
  available: boolean  // 是否可用
}

/**
 * 设施分类
 */
export interface FacilityCategory {
  id: string                    // 分类ID
  name: string                  // 分类名
  facilities: FacilityItemInfo[]  // 该分类下的设施项
}

/**
 * 政策信息
 */
export interface PolicyInfo {
  id?: string
  title?: string
  content?: string
  description?: string
}

/**
 * 取消政策（包含时间段和规则）
 */
export interface CancellationPolicy extends PolicyInfo {
  checkInSpan?: TimeSpan[]  // 入住时间段
  checkoutTime?: string      // 退房时间
  cancelMinute?: number      // 取消时限（分钟）
  deadlineTime?: number      // 截止时间（小时）
}

/**
 * 便利设施限制
 */
export interface AmenitiesRestriction {
  baby?: boolean              // 允许婴儿
  children?: boolean          // 允许儿童
  elderly?: boolean           // 允许老人
  overseas?: boolean          // 允许海外客人
  hongKongMacaoTaiwan?: boolean  // 允许港澳台
  pets?: boolean              // 允许宠物
}

/**
 * 周边信息 - 地点
 */
export interface SurroundingPlace {
  name: string        // 地点名
  distance: Distance  // 距离信息
}

/**
 * 周边信息 - 社区/建筑信息
 */
export interface CommunityInfo {
  name: string        // 社区名
  belongTo?: string   // 所属行政区
  buildAge?: number   // 建筑年龄
  buildType?: string  // 建筑类型
}

/**
 * 周边信息 - 完整结构
 */
export interface SurroundingInfo {
  fullAddress?: string        // 完整地址
  community?: CommunityInfo   // 社区信息
  surroundings?: Array<{      // 周边设施
    type: 'transportations' | 'attractions' | 'restaurants' | 'shopping' // 类型枚举
    content?: SurroundingPlace | SurroundingPlace[]  // 地点内容
  }>
}

/**
 * 收费信息
 */
export interface FeeInfo {
  originPrice: number // 原价
  currentPrice: number // 当前价格
  discounts?: DiscountInfo[] // 折扣信息
}

/**
 * 费用通知信息（FeeNoticeSection专用）
 */
export interface FeeNoticeInfo {
  deposit: number         // 定金
  standardGuests: number  // 标准客人数
  joinNumber: number      // 追加人数
  joinPrice: number       // 追加价格
  otherDescription?: string  // 其他说明
  showOther?: boolean     // 是否显示其他
}

/**
 * 套餐详情
 */
export interface PackageDetail {
  title: string           // 套餐标题
  checkInService?: string // 入住服务说明
  enjoyService?: string   // 享受的服务说明
  details?: Array<{       // 具体详情
    lable: string         // 标签
    value: string         // 说明
  }>
}

/**
 * 折扣信息
 */
export interface DiscountInfo {
  name: string            // 折扣类型名称
  description: string     // 折扣说明
  amount: number          // 折扣金额
}

/**
 * ============================================
 * 详情型数据结构（16个）
 * ============================================
 */

/**
 * 1. HotelInfo 所需数据
 */
export interface HotelInfoData {
  name: string               // 民宿名称
  brand?: string             // 品牌
  tags?: string[]            // 标签
  rating?: number            // 评分
  reviewCount?: number       // 评价数
  star?: number              // 星级
  address: string            // 地址
  area?: string              // 面积
  room?: string              // 房间数
  bed?: number               // 床位数
  guests?: number            // 客人数
}

/**
 * 2. BookingBar 所需数据
 */
export interface BookingBarData {
  host?: {
    avatar?: string
    name?: string
  }
  priceList?: PriceItem[]  // 价格数组
  totalPrice?: number
  deadlineTime?: number
}

/**
 * 3. FacilitiesSection 所需数据
 */
export interface FacilitiesSectionData {
  facilities: FacilityCategory[]
}

/**
 * 4. FeeNoticeSection 所需数据
 */
export interface FeeNoticeSectionData extends FeeNoticeInfo {}

/**
 * 5. HostInfo 所需数据
 */
export interface HostInfoData {
  name: string               // 房东名称
  avatar?: string            // 房东头像
  badge?: string             // 房东徽章
  responseRate?: number      // 回复率
  orderConfirmationRate?: number // 订单确认率
  responseTime?: string      // 平均回复时间
  totalReviews?: number      // 总评价数
  overallRating?: number     // 总评分
  tags?: string[]            // 房东标签
}

/**
 * 6. ImageCarousel 所需数据
 */
export interface ImageCarouselData {
  images: Array<{
    category?: string
    url: string
  }>
}

/**
 * 7. NearbyRecommendations 所需数据
 */
export interface NearbyRecommendationsData extends SurroundingInfo {}

/**
 * 8. PolicySection 所需数据
 */
export interface PolicySectionData {
  checkInSpan?: TimeSpan[]
  checkoutTime?: string
  cancelMinute?: number
  cancellationHour?:string;
  deadlineTime?: number
  amenities?: AmenitiesRestriction
}

/**
 * 9. RoomCard 所需数据
 */
export interface RoomCardData {
  _id: string
  roomId: string  // 房间ID - 用于定位packageDetail
  name: string
  area: string
  beds: string
  guests: string
  image: string
  priceList: Array<{packageId:number,originPrice:number,currentPrice:number}>
  priceNote?: string
  benefits?: string[]
  confirmTime?: string
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  cancelMunite?: number
  packageCount?: number
  packages?: Array<{
    packageId: number
    name: string
    showPackageDetail?: boolean
    showBreakfastTag?: boolean
    breakfastCount?: number
    showCancelTag?: boolean
    cancelMunite?: number
    showComfirmTag?: boolean
    confirmTime?: number
  }>
}

/**
 * 10. RoomDrawerBanner 所需数据
 */
export interface RoomDrawerBannerData {
    images: Array<{
    category?: string
    url: string
  }>
}

/**
 * 11. RoomDrawerBasicInfo 所需数据
 */
export interface RoomDrawerBasicInfoData {
  id?: string
  name: string
  type: string
  area: number
  guests: number | string
  bedRemark?: string | string[] // 床铺说明
  breakfastCount?: number
  room?: RoomBedInfo[]
  bedInfo?: RoomBedInfo[]
}

/**
 * 12. RoomDrawerFacilities 所需数据
 */
export interface RoomDrawerFacilitiesData {
  facilities: FacilityCategory[]
}

/**
 * 13. RoomDrawerFeeNotice 所需数据
 */
export interface RoomDrawerFeeNoticeData {
  deposit: number         // 定金
  standardGuests: number  // 标准客人数
  joinNumber: number      // 追加人数
  joinPrice: number       // 追加价格
  otherDescription?: string  // 其他说明
  showOther?: boolean     // 是否显示其他
}

/**
 * 14. RoomDrawerPolicy 所需数据
 */
export interface RoomDrawerPolicyData {
  checkInSpan?: TimeSpan[]
  checkoutTime?: string
  cancelMinute?: number
  deadlineTime?: number
  amenities?: AmenitiesRestriction
}

/**
 * 15. RoomPackageDetail 所需数据
 */
export interface RoomPackageDetailData {
  title: string           // 套餐标题
  checkInService?: string // 入住服务说明
  enjoyService?: string   // 享受的服务说明
  details?: Array<{       // 具体详情
    lable: string         // 标签
    value: string         // 说明
  }>
}

/**
 * 16. RoomDrawerPrice 所需数据
 */
export interface RoomDrawerPriceData {
  originPrice: number // 原价
  currentPrice: number // 当前价格
  discounts?: DiscountInfo[] // 折扣信息
}

/**
 * ============================================
 * 统一中央数据结构 - Detail页的核心数据
 * ============================================
 */

/**
 * 基础/酒店信息
 */
export interface DetailBaseInfo extends HotelInfoData {
  city?: string
  phone?: string
  description?: string
}

export interface BookingBarInfo extends BookingBarData {}

export interface FacilitiesSectionInfo extends FacilitiesSectionData {}

export interface FeeNoticeSectionInfo extends FeeNoticeSectionData {}

export interface ImageCarouselInfo extends ImageCarouselData {}

export interface NearbyRecommendationsInfo extends NearbyRecommendationsData {}

export interface PolicySectionInfo extends PolicySectionData {}

export interface RoomCardInfo extends RoomCardData {}

export interface DetailHostInfo extends HostInfoData {}
/**
 * 房间详细信息 - 包含RoomDrawer所需的所有数据
 */
export interface DetailRoomInfo {
  // 基础信息
  _id: string
  hotelId: string
  
  // 基本信息（RoomDrawerBasicInfo）
  basicInfo: RoomDrawerBasicInfoData
  
  // 房间图片（RoomDrawerBanner）
  banner: RoomDrawerBannerData
  
  // 设施（RoomDrawerFacilities）
  facilities: RoomDrawerFacilitiesData
  
  // 政策（RoomDrawerPolicy）
  policy: RoomDrawerPolicyData
  
  // 费用须知（RoomDrawerFeeNotice）
  feeNotice: RoomDrawerFeeNoticeData
  
  // 价格（RoomDrawerPrice）
  price: RoomDrawerPriceData
  
  // 套餐详情（RoomPackageDetail） - 以packageId为key的映射
  packageDetails?: Record<number, RoomPackageDetailData>
  
  // 系统字段
  auditInfo?: AuditInfo
  createdAt: Date
  updatedAt: Date
}

/**
 * 审核信息
 */
export interface AuditInfo {
  status: 'pending' | 'approved' | 'rejected'
  auditedAt?: Date
  auditedBy?: string
  reason?: string
}

/**
 * 统一数据中间件 - Detail页中央数据结构
 * 所有Detail组件需要的详情型数据都来自这个结构
 * 包含完整的16个子组件所需的全部数据
 */
export interface DetailCenterData {

  _id:string
  merchantId:string
  // ========== 1. HotelInfo ==========
  baseInfo: DetailBaseInfo

  // ========== 2. BookingBar ==========
  bookingBar: BookingBarInfo

  // ========== 3. FacilitiesSection ==========
  facilites:FacilitiesSectionInfo

  // ========== 4. FeeNoticeSection ==========
  feeNotice: FeeNoticeInfo

  // ========== 5. HostInfo ==========
  hostInfo?: DetailHostInfo

  // ========== 6. ImageCarousel ==========
  images: ImageCarouselInfo

  // ========== 7. NearbyRecommendations ==========
  surroundings?: NearbyRecommendationsInfo

  // ========== 8. PolicySection ==========
  policies: PolicySectionInfo
  // ========== 9. RoomCard (列表) ==========
  rooms: RoomCardInfo[]

  // ========== 10-16. RoomDrawer系列 (选中房间) ==========
  selectedRoom?: DetailRoomInfo

  // ========== 系统字段 ==========
  auditInfo?: AuditInfo
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Detail页上下文状态 - 仅UI交互状态
 */
export interface DetailContextState {
  selectedRoomName?: string
  expandNearbyProperties?: boolean
  currentTab?: string
  activeDrawer?: 'room' | 'facilities' | null
  scrollPosition?: number
}
