import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import type { HotelRoom } from '@/types/hotel';

interface Props {
  loading: boolean;
  dataSource: HotelRoom[];
  onView: (record: HotelRoom) => void;
  onEdit: (record: HotelRoom) => void;
  onDelete: (id: string) => void;
}

export const RoomTable: React.FC<Props> = ({ loading, dataSource, onView, onEdit, onDelete }) => {
  const columns = [
    {
      title: '图片',
      key: 'image',
      render: (_: any, record: HotelRoom) => (
        <Avatar 
          shape="square" 
          size={64} 
          src={record.baseInfo.images?.[0]} 
          icon={<PictureOutlined />} 
        />
      ),
    },
    {
      title: '房间名称',
      dataIndex: ['baseInfo', 'type'],
      key: 'name',
      render: (text: string) => <b>{text}</b>
    },
    {
      title: '房价',
      dataIndex: ['baseInfo', 'price'],
      key: 'price',
      render: (price: number) => <span style={{ color: '#ff4d4f' }}>¥{price}</span>
    },
    {
      title: '库存',
      dataIndex: ['baseInfo', 'stock'],
      key: 'stock',
    },
    {
      title: '大小',
      dataIndex: ['headInfo', 'size'],
      key: 'size',
      render: (size: string) => `${size} m²`
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: HotelRoom) => (
         record.baseInfo.stock > 0 ? <Tag color="success">可预订</Tag> : <Tag color="error">满房</Tag>
      )
    },
    {
      title: '房间动作',
      key: 'action',
      render: (_: any, record: HotelRoom) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>预览</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除该房间吗？" onConfirm={() => onDelete(record._id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      rowKey="_id"
      loading={loading}
      dataSource={dataSource} 
      columns={columns as any}
      pagination={{ pageSize: 5 }}
    />
  );
};