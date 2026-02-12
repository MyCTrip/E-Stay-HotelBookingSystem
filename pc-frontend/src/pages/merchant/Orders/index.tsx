import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { orderApi } from '@/services/order';
import type { Order } from '@/types/order';

import { OrderFilter } from '@/components/order_c/OrderFilter';
import { OrderTable } from '@/components/order_c/OrderTable';
import { CheckInModal } from '@/components/order_c/CheckInModal';

const OrderManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('all');
  
  // 弹窗状态
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // === 1. 加载数据 (Mock) ===
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // await orderApi.getList({ page: 1, pageSize: 10, status });
      
      // 👇 Mock Data: 模拟一些移动端生成的订单
      await new Promise(r => setTimeout(r, 500));
      const mockOrders: Order[] = [
        {
          _id: '1', orderNo: 'ORD20260205001', 
          userInfo: { name: '张三', phone: '13800138000' },
          hotelInfo: { hotelId: 'h1', hotelName: '易宿酒店' },
          roomInfo: { roomId: 'r1', roomType: '豪华海景房', count: 1 },
          dateInfo: { checkIn: '2026-02-05', checkOut: '2026-02-06', nights: 1 },
          amount: 899, status: 'paid', createdAt: '2026-02-05T10:00:00Z'
        },
        {
          _id: '2', orderNo: 'ORD20260205002', 
          userInfo: { name: '李四', phone: '13900139000' },
          hotelInfo: { hotelId: 'h1', hotelName: '易宿酒店' },
          roomInfo: { roomId: 'r2', roomType: '标准双床房', roomNumber: '305', count: 1 },
          dateInfo: { checkIn: '2026-02-04', checkOut: '2026-02-06', nights: 2 },
          amount: 598, status: 'checked_in', createdAt: '2026-02-04T12:00:00Z'
        }
      ];
      
      // 简单前端过滤模拟
      if (status === 'all') setOrders(mockOrders);
      else setOrders(mockOrders.filter(o => o.status === status));

    } catch (error) {
      message.error('加载订单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  // === 2. 交互逻辑 ===
  
  // 打开入住弹窗
  const handleCheckInClick = (order: Order) => {
    setCurrentOrder(order);
    setCheckInModalOpen(true);
  };

  // 提交入住 (分配房号)
  const submitCheckIn = async (roomNumber: string) => {
    if (!currentOrder) return;
    setActionLoading(true);
    try {
      // await orderApi.checkIn(currentOrder._id, roomNumber);
      message.success(`办理入住成功，已分配房间：${roomNumber}`);
      setCheckInModalOpen(false);
      fetchOrders(); // 刷新
    } catch (error) {
      message.error('操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 办理退房
  const handleCheckOut = async (order: Order) => {
    try {
      // await orderApi.checkOut(order._id);
      message.success(`订单 ${order.orderNo} 已退房`);
      fetchOrders();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 调整订单 (待实现)
  const handleAdjust = (order: Order) => {
    message.info('这里将弹出修改房型/日期的弹窗');
    // 你可以在这里复用之前的 RoomFormModal 思想，做一个 AdjustOrderModal
  };

  return (
    <div style={{ padding: 24 }}>
      <OrderFilter 
        status={status} 
        onStatusChange={setStatus} 
        onSearch={(val) => message.info(`搜索: ${val}`)} 
      />
      
      <OrderTable 
        loading={loading}
        dataSource={orders}
        onCheckIn={handleCheckInClick}
        onCheckOut={handleCheckOut}
        onAdjust={handleAdjust}
      />

      <CheckInModal
        open={checkInModalOpen}
        order={currentOrder}
        loading={actionLoading}
        onCancel={() => setCheckInModalOpen(false)}
        onSubmit={submitCheckIn}
      />
    </div>
  );
};

export default OrderManage;