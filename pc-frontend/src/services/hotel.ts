import request from './request';
import type { Hotel, HotelRoom } from '@/types/hotel';

// 定义一个通用的分页响应结构 
interface PageResult<T> {
  rows: T[];
  total: number;
  current_page: number;
  total_page: number;
  result: number;
}

export const hotelApi = {
    // 对应后端: router.get('/my', ...)
  getMyHotels: () => request.get<PageResult<Hotel>>('/hotels/my'),

  // Merchant: Create Hotel
  create: (data: Partial<Hotel>) => request.post('/hotels', data),
  
  // Merchant: Update Hotel
  update: (id: string, data: Partial<Hotel>) => request.put(`/hotels/${id}`, data),
  
  // Merchant: Submit for Audit (触发状态流转 draft -> pending)
  submitAudit: (id: string) => request.post(`/hotels/${id}/submit`),
  
  // Get Detail
  getDetail: (id: string) => request.get<Hotel>(`/hotels/${id}`),
  
  // Get List (支持分页查询)
  getList: (params: any) => request.get<PageResult<Hotel>>('/hotels', { params }),



  // === 🆕 房间管理接口 ===
// 获取当前酒店的所有房间
  getRooms: (hotelId: string) => request.get<PageResult<HotelRoom>>(`/hotels/${hotelId}/rooms`),
  
  // 添加房间
  addRoom: (hotelId: string, data: Partial<HotelRoom>) => request.post(`/hotels/${hotelId}/rooms`, data),
  
  // 更新房间
  updateRoom: (hotelId: string, roomId: string, data: Partial<HotelRoom>) => request.put(`/hotels/${hotelId}/rooms/${roomId}`, data),
  
  // 删除房间
  deleteRoom: (hotelId: string, roomId: string) => request.delete(`/hotels/${hotelId}/rooms/${roomId}`),

  // 提交房间审核
 submitRoom: (roomId: string) => request.post(`/rooms/${roomId}/submit`),
};