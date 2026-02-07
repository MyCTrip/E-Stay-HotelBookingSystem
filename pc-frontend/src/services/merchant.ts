// src/services/merchant.ts
import request from './request';
import type { MerchantProfile } from '@/types/user';

export const merchantApi = {
  // 获取商户资料
  getProfile: () => request.get<MerchantProfile>('/merchants'),
  
  // 更新/创建商户资料 (Upsert)
  updateProfile: (data: Partial<MerchantProfile>) => request.post('/merchants', data),
  
  // 提交审核
  submitAudit: () => request.post('/merchants/submit'),
};