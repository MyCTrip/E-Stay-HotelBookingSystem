import request from './request';
import type { Hotel } from '@/types/hotel';

export const hotelApi = {
  // Merchant: Create Hotel
  create: (data: Partial<Hotel>) => request.post('/hotel', data),
  
  // Merchant: Update Hotel
  update: (id: string, data: Partial<Hotel>) => request.put(`/hotel/${id}`, data),
  
  // Merchant: Submit for Audit (触发状态流转 draft -> pending)
  submitAudit: (id: string) => request.post(`/hotel/${id}/submit`),
  
  // Get Detail
  getDetail: (id: string) => request.get<Hotel>(`/hotel/${id}`),
  
  // Get List (支持分页查询)
  getList: (params: any) => request.get('/hotel', { params }),
};