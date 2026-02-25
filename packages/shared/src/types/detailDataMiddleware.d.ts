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
    early: string;
    later: string;
}
/**
 * 价格项
 */
export interface PriceItem {
    originPrice: number;
    currentPrice: number;
}
/**
 * 距离信息
 */
export interface Distance {
    value: number;
    unit: string;
}
/**
 * 房间床铺信息
 */
export interface RoomBedInfo {
    name: string;
    type: string;
    size: string;
    number: number;
}
/**
 * 便利设施项
 */
export interface FacilityItemInfo {
    id: string;
    name: string;
    available: boolean;
}
/**
 * 设施分类
 */
export interface FacilityCategory {
    id: string;
    name: string;
    facilities: FacilityItemInfo[];
}
/**
 * 政策信息
 */
export interface PolicyInfo {
    id?: string;
    title?: string;
    content?: string;
    description?: string;
}
/**
 * 取消政策（包含时间段和规则）
 */
export interface CancellationPolicy extends PolicyInfo {
    checkInSpan?: TimeSpan[];
    checkoutTime?: string;
    cancelMinute?: number;
    deadlineTime?: number;
}
/**
 * 便利设施限制
 */
export interface AmenitiesRestriction {
    baby?: boolean;
    children?: boolean;
    elderly?: boolean;
    overseas?: boolean;
    hongKongMacaoTaiwan?: boolean;
    pets?: boolean;
}
/**
 * 周边信息 - 地点
 */
export interface SurroundingPlace {
    name: string;
    distance: Distance;
}
/**
 * 周边信息 - 社区/建筑信息
 */
export interface CommunityInfo {
    name: string;
    belongTo?: string;
    buildAge?: number;
    buildType?: string;
}
/**
 * 周边信息 - 完整结构
 */
export interface SurroundingInfo {
    fullAddress?: string;
    community?: CommunityInfo;
    surroundings?: Array<{
        type: 'transportations' | 'attractions' | 'restaurants' | 'shopping';
        content?: SurroundingPlace | SurroundingPlace[];
    }>;
}
/**
 * 收费信息
 */
export interface FeeInfo {
    originPrice: number;
    currentPrice: number;
    discounts?: DiscountInfo[];
}
/**
 * 费用通知信息（FeeNoticeSection专用）
 */
export interface FeeNoticeInfo {
    deposit: number;
    standardGuests: number;
    joinNumber: number;
    joinPrice: number;
    otherDescription?: string;
    showOther?: boolean;
}
/**
 * 套餐详情
 */
export interface PackageDetail {
    title: string;
    checkInService?: string;
    enjoyService?: string;
    details?: Array<{
        lable: string;
        value: string;
    }>;
}
/**
 * 折扣信息
 */
export interface DiscountInfo {
    name: string;
    description: string;
    amount: number;
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
    name: string;
    brand?: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
    star?: number;
    address: string;
    area?: string;
    room?: string;
    bed?: number;
    guests?: number;
}
/**
 * 2. BookingBar 所需数据
 */
export interface BookingBarData {
    host?: {
        avatar?: string;
        name?: string;
    };
    priceList?: PriceItem[];
    totalPrice?: number;
    deadlineTime?: number;
}
/**
 * 3. FacilitiesSection 所需数据
 */
export interface FacilitiesSectionData {
    facilities: FacilityCategory[];
}
/**
 * 4. FeeNoticeSection 所需数据
 */
export interface FeeNoticeSectionData extends FeeNoticeInfo {
}
/**
 * 5. HostInfo 所需数据
 */
export interface HostInfoData {
    name: string;
    avatar?: string;
    badge?: string;
    responseRate?: number;
    orderConfirmationRate?: number;
    responseTime?: string;
    totalReviews?: number;
    overallRating?: number;
    tags?: string[];
}
/**
 * 6. ImageCarousel 所需数据
 */
export interface ImageCarouselData {
    images: Array<{
        category?: string;
        url: string;
    }>;
}
/**
 * 7. NearbyRecommendations 所需数据
 */
export interface NearbyRecommendationsData extends SurroundingInfo {
}
/**
 * 8. PolicySection 所需数据
 */
export interface PolicySectionData {
    checkInSpan?: TimeSpan[];
    checkoutTime?: string;
    cancelMinute?: number;
    cancellationHour?: string;
    deadlineTime?: number;
    amenities?: AmenitiesRestriction;
}
/**
 * 9. RoomCard 所需数据
 */
export interface RoomCardData {
    _id: string;
    roomId: string;
    name: string;
    area: string;
    beds: string;
    guests: string;
    image: string;
    priceList: Array<{
        packageId: number;
        originPrice: number;
        currentPrice: number;
    }>;
    priceNote?: string;
    benefits?: string[];
    confirmTime?: string;
    showBreakfastTag?: boolean;
    breakfastCount?: number;
    showCancelTag?: boolean;
    cancelMunite?: number;
    packageCount?: number;
    packages?: Array<{
        packageId: number;
        name: string;
        showPackageDetail?: boolean;
        showBreakfastTag?: boolean;
        breakfastCount?: number;
        showCancelTag?: boolean;
        cancelMunite?: number;
        showComfirmTag?: boolean;
        confirmTime?: number;
    }>;
}
/**
 * 10. RoomDrawerBanner 所需数据
 */
export interface RoomDrawerBannerData {
    images: Array<{
        category?: string;
        url: string;
    }>;
}
/**
 * 11. RoomDrawerBasicInfo 所需数据
 */
export interface RoomDrawerBasicInfoData {
    id?: string;
    name: string;
    type: string;
    area: number;
    guests: number | string;
    bedRemark?: string | string[];
    breakfastCount?: number;
    room?: RoomBedInfo[];
    bedInfo?: RoomBedInfo[];
}
/**
 * 12. RoomDrawerFacilities 所需数据
 */
export interface RoomDrawerFacilitiesData {
    facilities: FacilityCategory[];
}
/**
 * 13. RoomDrawerFeeNotice 所需数据
 */
export interface RoomDrawerFeeNoticeData {
    deposit: number;
    standardGuests: number;
    joinNumber: number;
    joinPrice: number;
    otherDescription?: string;
    showOther?: boolean;
}
/**
 * 14. RoomDrawerPolicy 所需数据
 */
export interface RoomDrawerPolicyData {
    checkInSpan?: TimeSpan[];
    checkoutTime?: string;
    cancelMinute?: number;
    deadlineTime?: number;
    amenities?: AmenitiesRestriction;
}
/**
 * 15. RoomPackageDetail 所需数据
 */
export interface RoomPackageDetailData {
    title: string;
    checkInService?: string;
    enjoyService?: string;
    details?: Array<{
        lable: string;
        value: string;
    }>;
}
/**
 * 16. RoomDrawerPrice 所需数据
 */
export interface RoomDrawerPriceData {
    originPrice: number;
    currentPrice: number;
    discounts?: DiscountInfo[];
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
    city?: string;
    phone?: string;
    description?: string;
}
export interface BookingBarInfo extends BookingBarData {
}
export interface FacilitiesSectionInfo extends FacilitiesSectionData {
}
export interface FeeNoticeSectionInfo extends FeeNoticeSectionData {
}
export interface ImageCarouselInfo extends ImageCarouselData {
}
export interface NearbyRecommendationsInfo extends NearbyRecommendationsData {
}
export interface PolicySectionInfo extends PolicySectionData {
}
export interface RoomCardInfo extends RoomCardData {
}
export interface DetailHostInfo extends HostInfoData {
}
/**
 * 房间详细信息 - 包含RoomDrawer所需的所有数据
 */
export interface DetailRoomInfo {
    _id: string;
    hotelId: string;
    basicInfo: RoomDrawerBasicInfoData;
    banner: RoomDrawerBannerData;
    facilities: RoomDrawerFacilitiesData;
    policy: RoomDrawerPolicyData;
    feeNotice: RoomDrawerFeeNoticeData;
    price: RoomDrawerPriceData;
    packageDetails?: Record<number, RoomPackageDetailData>;
    auditInfo?: AuditInfo;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * 审核信息
 */
export interface AuditInfo {
    status: 'pending' | 'approved' | 'rejected';
    auditedAt?: Date;
    auditedBy?: string;
    reason?: string;
}
/**
 * 统一数据中间件 - Detail页中央数据结构
 * 所有Detail组件需要的详情型数据都来自这个结构
 * 包含完整的16个子组件所需的全部数据
 */
export interface DetailCenterData {
    _id: string;
    merchantId: string;
    baseInfo: DetailBaseInfo;
    bookingBar: BookingBarInfo;
    facilites: FacilitiesSectionInfo;
    feeNotice: FeeNoticeInfo;
    hostInfo?: DetailHostInfo;
    images: ImageCarouselInfo;
    surroundings?: NearbyRecommendationsInfo;
    policies: PolicySectionInfo;
    rooms: RoomCardInfo[];
    selectedRoom?: DetailRoomInfo;
    auditInfo?: AuditInfo;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Detail页上下文状态 - 仅UI交互状态
 */
export interface DetailContextState {
    selectedRoomName?: string;
    expandNearbyProperties?: boolean;
    currentTab?: string;
    activeDrawer?: 'room' | 'facilities' | null;
    scrollPosition?: number;
}
//# sourceMappingURL=detailDataMiddleware.d.ts.map