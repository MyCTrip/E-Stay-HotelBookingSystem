// src/types/user.d.ts

// 对应 MerchantProfile
export interface MerchantProfile {
  _id: string;
  userId: string;
  // 必须嵌套
  baseInfo: {
    merchantName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
  qualificationInfo?: {
    businessLicenseNo?: string;
    realNameStatus: 'unverified' | 'verified' | 'rejected';
  };
  auditInfo?: {
    verifyStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  };
  createdAt: string;
}

// 对应 AdminProfile
export interface AdminProfile {
  _id: string;
  userId: string;
  // 嵌套
  baseInfo: {
    name: string;
    employeeNo?: string;
  };
  createdAt: string;
}