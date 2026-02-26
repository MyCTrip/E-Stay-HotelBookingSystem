import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, Avatar, Typography, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PictureOutlined, SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { HotelRoom } from '@/types/hotel';

interface Props {
  loading: boolean;
  dataSource: HotelRoom[];
  onView: (record: HotelRoom) => void;
  onEdit: (record: HotelRoom) => void;
  onDelete: (id: string) => void;
  onSubmitAudit: (id: string) => void; 
}

export const RoomTable: React.FC<Props> = ({ loading, dataSource, onView, onEdit, onDelete, onSubmitAudit }) => {
  const columns = [
    {
      title: '图片',
      key: 'image',
      width: 80,
      render: (_: any, record: HotelRoom) => (
        <Avatar 
          shape="square" 
          size={64} 
          src={record.baseInfo.images?.[0]} 
          icon={<PictureOutlined />} 
          style={{ backgroundColor: '#f5f5f5' }}
        />
      ),
    },
    {
      title: '房型名称',
      dataIndex: ['baseInfo', 'type'], 
      key: 'name',
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>
    },
    {
      title: '房价',
      dataIndex: ['baseInfo', 'price'],
      key: 'price',
      render: (price: number) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{price}</span>
    },
    {
      title: '库存/可住',
      key: 'stock',
      render: (_: any, record: HotelRoom) => (
         // 如果有库存展示库存，没有则展示最大入住人数
        <span>{record.baseInfo.maxOccupancy} 间</span>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: HotelRoom) => {
        const status = record.auditInfo?.status || 'draft'; 
        const rejectReason = record.auditInfo?.rejectReason;
        
        const statusMap: any = {
            draft: { color: 'default', text: '草稿' },
            pending: { color: 'processing', text: '审核中' },
            approved: { color: 'success', text: '已上线' },
            rejected: { color: 'error', text: '已驳回' },
            offline: { color: 'warning', text: '已下线' }
        };
        const current = statusMap[status] || statusMap.draft;
        return (
      <Space size="small">
        <Tag color={current.color}>{current.text}</Tag>
        
        {/* 🔥 新增：如果是驳回状态，显示一个带有驳回原因的悬浮气泡 */}
        {status === 'rejected' && (
          <Tooltip title={`驳回原因: ${rejectReason || '无'}`} color="red">
            <QuestionCircleOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Tooltip>
        )}
      </Space>
    );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: HotelRoom) => {
         const status = record.auditInfo?.status || 'draft'; 

         return (
          <Space>
            {/* 只有草稿和驳回状态，才可以提交审核 */}
            {(status === 'draft' || status === 'rejected') && (
               <Popconfirm 
                 title="确认提交审核？" 
                 description="提交后管理员将进行审批，期间不可修改。"
                 onConfirm={() => onSubmitAudit(record._id)}
               >
                 <Button type="link" size="small" icon={<SendOutlined />}>提交</Button>
               </Popconfirm>
            )}

            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>详情</Button>
            
            {/* 审核中不允许编辑 */}
            <Button type="link" size="small" icon={<EditOutlined />} disabled={status === 'pending'} onClick={() => onEdit(record)}>编辑</Button>
            
            <Popconfirm title="确定删除吗？" onConfirm={() => onDelete(record._id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        )
      },
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