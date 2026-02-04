// 对应后端 User Model
export type UserRole = 'merchant' | 'admin';
export type UserStatus = 'active' | 'disabled';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// 对应后端 MerchantProfile Model
export type VerifyStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface MerchantProfile {
  _id: string;
  userId: string; // 关联 User
  merchantName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessLicenseNo?: string;
  idCardNo?: string;
  verifyStatus: VerifyStatus;
  rejectReason?: string;
}
