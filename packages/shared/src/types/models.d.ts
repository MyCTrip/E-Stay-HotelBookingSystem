/**
 * 后端数据模型类型定义
 * 与PC后端 Mongoose 数据库模型保持完全一致
 * 包含三种房型：hotel, hourlyHotel, homeStay
 *
 * 数据流：PC后端MongoDB → API返回(this) → 前端detailDataMiddleware转换
 */
import type { DetailBaseInfo, DetailHostInfo, RoomDrawerBasicInfoData, RoomDrawerBannerData, RoomDrawerFeeNoticeData, RoomDrawerPriceData, RoomPackageDetailData, FacilityCategory, CancellationPolicy, FeeInfo, FeeNoticeInfo, SurroundingInfo, PriceItem } from './detailDataMiddleware';
/**
 * ============================================
 * 后端原本定义的基础类型
 * ============================================
 */
/**
 * 属性类型识别符（三种房型）
 */
export type PropertyType = 'hotel' | 'hourlyHotel' | 'homeStay';
/**
 * 审核状态枚举
 */
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
/**
 * 设施项（后端原本的细粒度设施）
 */
export interface FacilityItem {
    name: string;
    description?: string;
    icon?: string;
    available?: boolean;
}
/**
 * 设施分类（后端原本的）
 */
export interface Facility {
    category: string;
    content: string;
    summary?: string;
    icon?: string;
    order?: number;
    visible?: boolean;
    items?: FacilityItem[];
}
/**
 * 政策信息（后端原本的）
 */
export interface Policy {
    policyType: string;
    content: string;
    summary?: string;
    flags?: Record<string, any>;
    effectiveFrom?: Date;
}
/**
 * 周边地点信息
 */
export interface Surrounding {
    surType: 'metro' | 'attraction' | 'business';
    surName: string;
    distance: number;
}
/**
 * 优惠信息
 */
export interface Discount {
    title: string;
    type: 'discount' | 'instant';
    content: string;
}
/**
 * 审核信息（用于Hotel和Room）
 */
export interface AuditInfo {
    status: AuditStatus;
    auditedBy?: string;
    auditedAt?: Date;
    rejectReason?: string;
}
/**
 * 地理位置（GeoJSON Point）
 */
export interface GeoLocation {
    type: 'Point';
    coordinates: [number, number];
}
/**
 * 入住信息
 */
export interface CheckinInfo {
    checkinTime: string;
    checkoutTime: string;
    breakfastType?: string;
    breakfastPrice?: number;
}
/**
 * 房间头部信息（房间属性）
 */
export interface RoomHeadInfo {
    size: string;
    floor: string;
    wifi: boolean;
    windowAvailable: boolean;
    smokingAllowed: boolean;
}
/**
 * 房间早餐信息
 */
export interface BreakfastInfo {
    breakfastType?: string;
    cuisine?: string;
    bussinessTime?: string;
    addBreakfast?: string;
}
/**
 * 床铺信息
 */
export interface BedInfo {
    bedType: string;
    bedNumber: number;
    bedSize: string;
}
/**
 * 钟点房特定时段配置
 */
export interface HourlySlot {
    startTime: string;
    endTime: string;
    price: number;
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
    _id: string;
    merchantId: string;
    baseInfo: DetailBaseInfo;
    checkinInfo?: CheckinInfo;
    location?: GeoLocation;
    feeInfo?: FeeInfo;
    feeNotice?: FeeNoticeInfo;
    surroundings?: SurroundingInfo;
    bookingDeadline?: {
        deadlineTime: number;
        description?: string;
    };
    priceList?: PriceItem[];
    rooms?: Room[];
    images?: string[];
    auditInfo?: AuditInfo;
    pendingChanges?: any;
    pendingDeletion?: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * homeStay类型Hotel（使用detailDataMiddleware的结构）
 */
export interface HomeStayHotel extends BaseHotel {
    baseInfo: DetailBaseInfo & {
        propertyType: 'homeStay';
    };
    hostInfo?: DetailHostInfo;
    reviews?: Array<{
        _id?: string;
        userId?: string;
        userName: string;
        rating: number;
        content: string;
        createdAt?: Date;
        images?: string[];
    }>;
    reviews_count?: number;
    facilities: FacilityCategory[];
    policies: CancellationPolicy[];
}
/**
 * 标准酒店类型Hotel（使用后端原本的Policy和Facility）
 */
export interface StandardHotel extends BaseHotel {
    baseInfo: DetailBaseInfo & {
        propertyType: 'hotel';
    };
    facilities: Facility[];
    policies: Policy[];
}
/**
 * 钟点房类型Hotel（基于BaseHotel + 钟点房特定字段，与StandardHotel类似但propertyType不同）
 */
export interface HourlyHotel extends BaseHotel {
    baseInfo: DetailBaseInfo & {
        propertyType: 'hourlyHotel';
    };
    facilities: Facility[];
    policies: Policy[];
    typeConfig?: {
        hourlySlots?: HourlySlot[];
        minimumHours?: number;
        maximumHours?: number;
    };
}
/**
 * Hotel的union类型
 */
export type Hotel = HomeStayHotel | StandardHotel | HourlyHotel;
/**
 * ============================================
 * Room 表相关接口
 * ============================================
 */
/**
 * 基础Room类型（通用字段）
 */
interface BaseRoom {
    _id: string;
    hotelId: string;
    headInfo?: RoomHeadInfo;
    bedInfo: BedInfo[];
    breakfastInfo?: BreakfastInfo;
    packageDetail?: RoomPackageDetailData;
    auditInfo?: AuditInfo;
    pendingChanges?: any;
    pendingDeletion?: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * homeStay类型Room（包含完整的RoomDrawer数据）
 */
export interface HomeStayRoom extends BaseRoom {
    basicInfo: RoomDrawerBasicInfoData;
    banner: RoomDrawerBannerData;
    facilities: FacilityCategory[];
    policies: CancellationPolicy[];
    feeNotice: RoomDrawerFeeNoticeData;
    price: RoomDrawerPriceData;
    category: 'homestay';
}
/**
 * 标准酒店类型Room（简化版，包含基本RoomDrawer数据）
 */
export interface StandardRoom extends BaseRoom {
    basicInfo: RoomDrawerBasicInfoData;
    banner: RoomDrawerBannerData;
    facilities: Facility[];
    policies: Policy[];
    feeNotice: RoomDrawerFeeNoticeData;
    price: RoomDrawerPriceData;
    category: 'standard' | 'hourly';
}
/**
 * Room的union类型
 */
export type Room = HomeStayRoom | StandardRoom;
/**
 * ============================================
 * API 响应格式
 * ============================================
 */
/**
 * 单项API响应格式
 */
export interface ApiResponse<T> {
    data: T;
    meta?: Record<string, any>;
}
/**
 * 列表API响应格式
 */
export interface ListResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}
/**
 * 酒店查询参数
 */
export interface HotelQuery {
    city?: string;
    search?: string;
    propertyType?: PropertyType;
    page?: number;
    limit?: number;
    checkIn?: string;
    checkOut?: string;
}
export {};
//# sourceMappingURL=models.d.ts.map