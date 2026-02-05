import request from './request';
import type { MerchantProfile } from '@/types/user';

export const merchantApi = {
  // 获取当前商户资料
  getProfile: () => request.get<MerchantProfile>('/merchant/profile'),

  // 更新商户资料 (包含触发审核的逻辑)
  // 后端通常逻辑：如果只改电话，状态不变；如果改了营业执照/名称，状态自动变为 pending
  updateProfile: (data: Partial<MerchantProfile>) => request.put('/merchant/profile', data),
};