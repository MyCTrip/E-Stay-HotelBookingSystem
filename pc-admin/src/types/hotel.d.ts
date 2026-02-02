// src/types/hotel.d.ts

/**
 * 通用审核状态
 * 对应数据库 enum: ['draft','pending','approved','rejected','offline']
 */
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';

// ==========================================
// 1. 房间 (Room) - 严格对应 Schema
// ==========================================

export interface RoomBaseInfo {
  type: string;           // 房型名称
  price: number;          // 价格
  images: string[];       // 图片
  status: AuditStatus;    // 注意：Room 的 status 在 baseInfo 里
  maxOccupancy: number;   // 最大入住人数
}

export interface RoomHeadInfo {
  size: string;           // 面积 (如 25 sqm)
  floor: string;          // 楼层
  wifi: boolean;
  windowAvailable: boolean;
  smokingAllowed: boolean;
}

export interface RoomBedInfo {
  bedType: string;        // 床型
  bedNumber: number;      // 数量
  bedSize: string;        // 尺寸
}

export interface RoomBreakfastInfo {
  breakfastType?: string;
  cuisine?: string;
  bussinessTime?: string;
  addBreakfast?: string;
}

export interface RoomAuditInfo {
  auditedBy?: string;     // AdminProfile ID
  auditedAt?: string;     // Date string
  rejectReason?: string;
}

export interface Room {
  _id: string;
  hotelId: string;
  
  // ✅ 子文档嵌套
  baseInfo: RoomBaseInfo;
  headInfo: RoomHeadInfo;
  bedInfo: RoomBedInfo[];        // 必须是数组
  breakfastInfo?: RoomBreakfastInfo;
  auditInfo?: RoomAuditInfo;

  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. 酒店 (Hotel) - 严格对应 Schema
// ==========================================

export interface HotelBaseInfo {
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;           // 带索引
  star: number;
  openTime: string;       // 文本格式
  roomTotal: number;
  phone: string;
  description: string;
  images: string[];
}

export interface HotelCheckinInfo {
  checkinTime: string;
  checkoutTime: string;
  breakfastType?: string;
  breakfastPrice?: number;
}

export interface HotelAuditInfo {
  status: AuditStatus;    // 注意：Hotel 的 status 在 auditInfo 里
  auditedBy?: string;     // AdminProfile ID
  auditedAt?: string;     // Date string
  rejectReason?: string;
}

export interface Hotel {
  _id: string;
  merchantId: string;     // MerchantProfile ID

  // ✅ 子文档嵌套
  baseInfo: HotelBaseInfo;
  checkinInfo?: HotelCheckinInfo;
  auditInfo?: HotelAuditInfo;

  // 虚拟字段：如果后端 populate 了 rooms，这里会有值
  rooms?: Room[]; 

  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. 前端表单类型 (UI Layer)
// ==========================================
// 注意：Antd Form 还是偏向扁平化，提交时需要我们在 onFinish 里
// 将这些扁平数据组装成上面的 Hotel 嵌套结构。
export interface HotelFormValues {
  // --- BaseInfo ---
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: any; // dayjs object
  description: string;
  images: any[]; // UploadFile[]

  // --- CheckinInfo ---
  checkinInfo?: {
    checkinTime?: string;
    checkoutTime?: string;
    breakfastType?: string;
    breakfastPrice?: number;
  };

  // --- 辅助字段 (用于生成 description 的周边/优惠信息) ---
  nearbyList?: { type?: string; name?: string; distance?: string }[];
  discountRules?: { title?: string; type?: string; value?: string }[];
  
  // --- Rooms (Form List) ---
  rooms?: Array<{
    name: string;
    price: number;
    stock: number;
    size?: number;
    facilities?: string[];
    hasBreakfast?: boolean;
  }>;
}