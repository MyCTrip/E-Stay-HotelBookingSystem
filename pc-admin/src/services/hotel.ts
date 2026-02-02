import request from './request';
import type { Hotel } from '@/types/hotel';

// 定义一个通用的分页响应结构 
interface PageResult<T> {
  rows: T[];
  total: number;
  current_page: number;
  total_page: number;
}

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
  getList: (params: any) => request.get<PageResult<Hotel>>('/hotel', { params }),
};