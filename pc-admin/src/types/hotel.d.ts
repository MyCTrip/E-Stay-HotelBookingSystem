// 对应后端 Hotel Model
export type HotelStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';

export interface Room {
  type: string;
  price: number;
  stock: number;
  facilities: string[];
  size: number; // m²
  images: string[];
}

export interface Hotel {
  _id: string;
  merchantId: string; // 关联 MerchantProfile
  nameCn: string;
  nameEn?: string;
  address: string;
  city: string;
  star: number;
  openTime: string;
  rooms: Room[];
  images: string[];
  status: HotelStatus;
  rejectReason?: string;
  auditedBy?: string; // Admin ID
  auditedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 对应后端 AuditLog Model
export interface AuditLog {
  _id: string;
  targetType: 'hotel' | 'merchant';
  targetId: string;
  action: 'approve' | 'reject' | 'offline';
  operatorId: string; // Admin info
  reason?: string;
  createdAt: string;
}