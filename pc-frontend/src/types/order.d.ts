// src/types/order.d.ts

export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  _id: string;
  orderNo: string;      // 订单号
  userInfo: {
    name: string;
    phone: string;
  };
  hotelInfo: {
    hotelId: string;
    hotelName: string;
  };
  roomInfo: {
    roomId: string;
    roomType: string;   // 房型名称
    roomNumber?: string; // 实际入住的房号 (调度时分配)
    count: number;
  };
  dateInfo: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  amount: number;
  status: OrderStatus;
  createdAt: string;
  remark?: string;
}