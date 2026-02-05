import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Popconfirm } from 'antd';
import { LoginOutlined, LogoutOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '@/types/order';
import dayjs from 'dayjs';

interface Props {
  loading: boolean;
  dataSource: Order[];
  onCheckIn: (record: Order) => void;
  onCheckOut: (record: Order) => void;
  onAdjust: (record: Order) => void;
}

export const OrderTable: React.FC<Props> = ({ loading, dataSource, onCheckIn, onCheckOut, onAdjust }) => {
  
  // 状态颜色映射
  const statusMap: Record<OrderStatus, { color: string; text: string }> = {
    pending: { color: 'default', text: '待支付' },
    paid: { color: 'processing', text: '待入住' }, // 已支付，但还没来
    confirmed: { color: 'processing', text: '已确认' },
    checked_in: { color: 'success', text: '入住中' },
    completed: { color: 'default', text: '已完成' },
    cancelled: { color: 'error', text: '已取消' },
    refunded: { color: 'error', text: '已退款' },
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '预订人',
      key: 'guest',
      render: (_: any, r: Order) => (
        <div>
          <div>{r.userInfo.name}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{r.userInfo.phone}</div>
        </div>
      )
    },
    {
      title: '房型信息',
      key: 'room',
      render: (_: any, r: Order) => (
        <div>
          <b>{r.roomInfo.roomType}</b>
          <div style={{ fontSize: 12 }}>
             {r.roomInfo.roomNumber ? <Tag color="blue">{r.roomInfo.roomNumber}</Tag> : <Tag>未排房</Tag>}
          </div>
        </div>
      )
    },
    {
      title: '入离时间',
      key: 'date',
      render: (_: any, r: Order) => (
        <div style={{ fontSize: 13 }}>
          <div>{dayjs(r.dateInfo.checkIn).format('MM-DD')} 入住</div>
          <div style={{ color: '#999' }}>{dayjs(r.dateInfo.checkOut).format('MM-DD')} 离店 ({r.dateInfo.nights}晚)</div>
        </div>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `¥${val}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, r: Order) => (
        <Space>
          {/* 只有“待入住”状态可以办理入住 */}
          {(r.status === 'paid' || r.status === 'confirmed') && (
            <Tooltip title="分配房间并办理入住">
              <Button type="primary" size="small" icon={<LoginOutlined />} onClick={() => onCheckIn(r)}>
                入住
              </Button>
            </Tooltip>
          )}

          {/* 只有“入住中”状态可以办理退房 */}
          {r.status === 'checked_in' && (
            <Popconfirm title="确定办理退房吗？" onConfirm={() => onCheckOut(r)}>
               <Button type="dashed" danger size="small" icon={<LogoutOutlined />}>退房</Button>
            </Popconfirm>
          )}

          {/* 允许修改订单的情况 */}
          {['paid', 'confirmed', 'checked_in'].includes(r.status) && (
             <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onAdjust(r)}>调整</Button>
          )}
          
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
        </Space>
      )
    },
  ];

  return (
    <Table 
      rowKey="_id"
      loading={loading}
      dataSource={dataSource} 
      columns={columns as any}
      scroll={{ x: 1000 }}
    />
  );
};