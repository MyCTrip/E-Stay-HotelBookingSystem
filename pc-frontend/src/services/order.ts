// src/services/order.ts
import request from './request';
import type { Order, OrderStatus } from '@/types/order';

interface OrderListParams {
  page: number;
  pageSize: number;
  status?: string;
  keyword?: string;
}

export const orderApi = {
  // 获取订单列表
  getList: (params: OrderListParams) => request.get('/orders/merchants/list', { params }),
  
  // 办理入住 (分配房号)
  checkIn: (orderId: string, roomNumber: string) => request.post(`/orders/${orderId}/check-in`, { roomNumber }),
  
  // 办理退房
  checkOut: (orderId: string) => request.post(`/orders/${orderId}/check-out`),
  
  // 调整订单 (修改房型/日期)
  updateOrder: (orderId: string, data: Partial<Order>) => request.put(`/orders/${orderId}/adjust`, data),
  
  // 取消/退款
  cancelOrder: (orderId: string) => request.post(`/orders/${orderId}/cancel`),
};