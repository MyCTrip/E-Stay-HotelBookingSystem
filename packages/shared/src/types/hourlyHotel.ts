/**
 * 钟点房模块类型定义
 */

/**
 * 钟点房搜索参数 (与民宿的最大区别在于日期和时长)
 */
import type { Facility, Policy } from './homestay'

export interface HourlyRoomSearchParams {
    city: string
    date: Date          // 入住日期（通常为今天或明天）
    startTime: string   // 预计到店时间，例如 '14:00'
    duration: number    // 连住小时数，例如 3, 4, 6
    guests: number
    rooms?: number
    keyword?: string
    selectedTags?: string[]
    priceMin?: number
    priceMax?: number
    page?: number
    limit?: number
}


/**
 * 钟点房/酒店基础信息
 */
export interface HourlyRoomBaseInfo {
    nameCn: string
    nameEn?: string
    address: string
    city: string
    star: number
    phone: string
    description: string
    roomTotal?: number
    facilities: Facility[]
    policies: Policy[]
}

/**
 * 钟点房房型基础信息
 */
export interface HourlyRoomTypeBaseInfo {
    type: string
    price: number       // 对应此时长的基准价格
    images: string[]
    maxOccupancy: number
    facilities: Facility[]
    windowAvailable: boolean // 钟点房用户通常很在意是否有窗
}

/**
 * 具体的钟点房房型 (子房间)
 */
export interface HourlyRoomDetail {
    _id: string
    hotelId: string
    baseInfo: HourlyRoomTypeBaseInfo
    durationOptions: number[] // 该房型支持的小时数，例如 [3, 4]
    createdAt: Date
    updatedAt: Date
}

/**
 * 钟点房主体 (外层卡片展示的酒店实体)
 * 对应你 index.tsx 中引入的 HourlyRoom 类型
 */
export interface HourlyRoom {
    _id: string
    merchantId: string
    baseInfo: HourlyRoomBaseInfo
    images: string[]
    durationOptions: number[] // 该酒店整体支持的钟点房时长选项，如 [3, 4, 6]
    rooms?: HourlyRoomDetail[] // 酒店包含的具体房型
    createdAt: Date
    updatedAt: Date
}

/**
 * API搜索响应
 */
export interface HourlyRoomSearchResponse {
    data: HourlyRoom[]
    pagination: {
        page: number
        limit: number
        total: number
    }
}
