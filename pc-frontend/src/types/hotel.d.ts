// src/types/hotel.d.ts

export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';

// ==========================================
// 0. 辅助类型 (对应后端 Schema)
// ==========================================

export interface HotelFacilityItem {
  item: string;
  content: string; // HTML
}

export interface HotelFacility {
  category: string; // 必填
  summary?: string;
  icon?: string;
  order?: number;
  visible?: boolean;
  content?: string; // 你的代码逻辑目前是用这个字段存逗号分隔的字符串
  items?: HotelFacilityItem[]; // 后端也支持这种细分结构
}

export interface HotelPolicy {
  policyType: string; // 必填
  summary?: string;
  content: string;    // 必填 HTML
  flags?: string[];
  effectiveFrom?: string;
}

// ==========================================
// 1. 房间 (HotelRoom)
// ==========================================

export interface RoomBaseInfo {
  type: string;
  price: number;
  stock: number; // 对应 Schema 里的 inventory 或 stock (虽然Schema没细写，但业务必须有)
  images: string[];
  maxOccupancy: number;
  
  // ⚠️ Room Schema 里这些也是必填且非空的！
  facilities: HotelFacility[]; 
  policies: HotelPolicy[];
  bedRemark: string[]; // 必填：例如 ["成人加床：免费"]
}

export interface RoomHeadInfo {
  size: string;
  floor: string;
  wifi: boolean;
  windowAvailable: boolean;
  smokingAllowed: boolean;
}

export interface RoomBedInfo {
  bedType: string;
  bedNumber: number;
  bedSize: string;
}

export interface HotelRoom {
  _id: string;
  hotelId: string;
  baseInfo: RoomBaseInfo;
  headInfo: RoomHeadInfo;
  bedInfo: RoomBedInfo[]; // 必填数组
  breakfastInfo?: {
    breakfastType?: string;
    cuisine?: string;
    bussinessTime?: string;
    addBreakfast?: string;
  };
  auditInfo?: {
    status: AuditStatus;
    rejectReason?: string;
  };
}

// ==========================================
// 2. 酒店 (Hotel)
// ==========================================

export interface HotelBaseInfo {
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: string;
  description: string;
  images: string[];
  phone: string;
  roomTotal: number;

  // 🔥 必填且非空
  facilities: HotelFacility[];
  policies: HotelPolicy[];
  
  // 可选
  surroundings?: Array<{
    surType: string;
    surName: string;
    distance: number;
  }>;
}

export interface HotelCheckinInfo {
  checkinTime: string;
  checkoutTime: string;
  breakfastType?: string;
  breakfastPrice?: number;
}

export interface Hotel {
  _id: string;
  merchantId: string;
  baseInfo: HotelBaseInfo;
  checkinInfo?: HotelCheckinInfo;
  auditInfo?: {
    status: AuditStatus;
    rejectReason?: string;
  };
  rooms?: HotelRoom[];
  createdAt: string;
  updatedAt: string;
}