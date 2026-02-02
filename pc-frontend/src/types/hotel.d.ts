// src/types/hotel.d.ts

// 1. 审核状态枚举
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';

// 2. 房间 (Room) - 对应数据库 Schema
export interface Room {
  _id: string;
  hotelId: string;
  // 数据库里是 baseInfo
  baseInfo: {
    type: string;
    price: number;
    images: string[];
    status: AuditStatus;
    maxOccupancy: number;
  };
  headInfo: {
    size: string;
    floor: string;
    wifi: boolean;
    windowAvailable: boolean;
    smokingAllowed: boolean;
  };
  // ... 其他子文档按需添加
}

// 3. 酒店 (Hotel) - 对应数据库 Schema
export interface Hotel {
  _id: string;
  merchantId: string;

  // ✅ 核心：对应数据库的 baseInfo 子文档
  baseInfo: {
    nameCn: string;
    nameEn?: string;
    address: string;
    city: string;
    star: number;
    openTime: string;
    roomTotal: number;
    phone: string;
    description: string; // 之前报错缺少的字段在这里！
    images: string[];
  };

  // ✅ 对应数据库的 auditInfo 子文档
  auditInfo?: {
    status: AuditStatus;
    rejectReason?: string;
    auditedBy?: string;
    auditedAt?: string;
  };

  // ✅ 对应数据库的 checkinInfo 子文档
  checkinInfo?: {
    checkinTime: string;
    checkoutTime: string;
  };

  rooms?: Room[]; // 如果后端 Populate 了房间
  createdAt: string;
  updatedAt: string;
}

// 4. 前端表单用的扁平类型 (仅用于 Form 组件的 values)
export interface HotelFormValues {
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: any;
  description: string;
  images: any[];
}
