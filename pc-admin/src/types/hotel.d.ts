/**
 * 通用审核状态
 * 对应数据库 enum: ['draft','pending','approved','rejected','offline']
 */
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';

// ==========================================
// 1. 房间 (HotelRoom) - 对应后端 Room Schema
// ==========================================

export interface RoomBaseInfo {
  type: string;           // 房型名称
  price: number;          // 价格
  stock: number;          // ✅ 补全：库存 (前端需要，建议后端也加上)
  images: string[];       // 图片
  status: AuditStatus;    // 状态
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
  hasBreakfast?: boolean; // ✅ 前端辅助字段，后端可能没有直接对应，转换时处理
  breakfastType?: string;
  cuisine?: string;
  bussinessTime?: string;
  addBreakfast?: string;
}

export interface RoomAuditInfo {
  auditedBy?: string;     
  auditedAt?: string;     
  rejectReason?: string;
}

// 💥 重命名 Room -> HotelRoom 以匹配组件引用
export interface HotelRoom {
  _id: string;
  hotelId: string;
  
  // 子文档嵌套
  baseInfo: RoomBaseInfo;
  headInfo: RoomHeadInfo;
  bedInfo: RoomBedInfo[];        
  breakfastInfo?: RoomBreakfastInfo;
  auditInfo?: RoomAuditInfo;

  createdAt: string;
  updatedAt: string;
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
  status: AuditStatus;   
  auditedBy?: string;    
  auditedAt?: string;    
  rejectReason?: string;
}

export interface Hotel {
  _id: string;
  merchantId: string;    

  baseInfo: HotelBaseInfo;
  checkinInfo?: HotelCheckinInfo;
  auditInfo?: HotelAuditInfo;

  // 虚拟字段：如果后端 populate 了 rooms，这里会有值
  rooms?: HotelRoom[]; // ✅ 这里也要改引用

  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. 前端表单类型 (UI Layer)
// ==========================================
export interface HotelFormValues {
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: any; 
  description: string;
  images: any[]; 

  checkinInfo?: {
    checkinTime?: string;
    checkoutTime?: string;
    breakfastType?: string;
    breakfastPrice?: number;
  };

  nearbyList?: { type?: string; name?: string; distance?: string }[];
  discountRules?: { title?: string; type?: string; value?: string }[];
  
  rooms?: Array<{
    name: string;
    price: number;
    stock: number;
    size?: number;
    facilities?: string[];
    hasBreakfast?: boolean;
  }>;
}