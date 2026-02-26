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

  // 上传图片
  uploadImage: (formData: FormData) => request.post<{ url: string; filename: string; size: number }>('/upload', formData),

  // === 🆕 房间管理接口 ===
// 获取当前酒店的所有房间
  getRooms: (hotelId: string) => request.get<PageResult<HotelRoom>>(`/hotels/${hotelId}/rooms`),
  
// 添加房间 (这个没问题，因为新建房间时它还没有 ID，必须挂在酒店下面)
  addRoom: (hotelId: string, data: Partial<HotelRoom>) => request.post(`/hotels/${hotelId}/rooms`, data),
  
  //更新房间 (扁平化路径)
  updateRoom: (hotelId: string, roomId: string, data: Partial<HotelRoom>) => request.put(`/rooms/${roomId}`, data),
  
  //删除房间 (扁平化路径)
  deleteRoom: (hotelId: string, roomId: string) => request.delete(`/rooms/${roomId}`),

  // 提交房间审核
 submitRoom: (roomId: string) => request.post(`/rooms/${roomId}/submit`),
};