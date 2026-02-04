import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Card, Space, Popconfirm, Avatar, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { hotelApi } from '@/services/hotel';
import { roomStatusAsResponse } from '@/utils/responseAsStatus';
import type { Hotel } from '@/types/hotel';

function HotelList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取列表数据
  const fetch = async () => {
    setLoading(true);
    try {
      // 这里的参数根据你实际后端分页需求调整，这里先取 100 条
      const res: any = await hotelApi.getList({ page: 1, limit: 100 });
      const list = res?.data?.rows || res?.rows || res?.data || [];
      setData(list);
    } catch (err) {
      console.error(err);
      message.error('获取酒店列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // 下架/删除逻辑
  const handleDelete = async (id: string) => {
    try {
      // 发送 update 请求将状态改为 offline
      await hotelApi.update(id, { auditInfo: { status: 'offline' } });
      message.success('酒店已下架');
      fetch(); // 刷新列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '封面',
      key: 'img',
      width: 100,
      render: (_: any, r: Hotel) => {
        // ✅ 关键修复：从 baseInfo 读取 images，并做空值保护
        const imgUrl = r.baseInfo?.images?.[0];
        return imgUrl ? (
          <Avatar shape="square" size={64} src={imgUrl} />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            无图
          </div>
        );
      },
    },
    {
      title: '酒店名称',
      key: 'name',
      // ✅ 关键修复：从 baseInfo 读取
      render: (_: any, r: Hotel) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.baseInfo?.nameCn}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.baseInfo?.nameEn}</div>
        </div>
      ),
    },
    {
      title: '城市',
      key: 'city',
      render: (_: any, r: Hotel) => r.baseInfo?.city || '-',
    },
    {
      title: '星级',
      key: 'star',
      render: (_: any, r: Hotel) => (
        <span style={{ color: '#faad14' }}>{'★'.repeat(r.baseInfo?.star || 0)}</span>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, r: Hotel) => {
        // ✅ 关键修复：从 auditInfo 读取
        const s = r.auditInfo?.status || 'draft';
        return <Tag color={roomStatusAsResponse(s).color}>{roomStatusAsResponse(s).level}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, r: Hotel) => (
        <Space>
          <Tooltip title="查看详情">
            <Button icon={<EyeOutlined />} onClick={() => navigate(`/merchant/hotels/${r._id}`)} />
          </Tooltip>

          <Tooltip title="编辑信息">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/merchant/hotels/${r._id}/edit`)}
            />
          </Tooltip>

          <Popconfirm title="确定要下架吗？" onConfirm={() => handleDelete(r._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      {/* 搜索栏预留 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        {/* 这里的按钮其实和 Tab 的 Create 是一样的功能，可以保留也可以去掉 */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/merchant/hotels/new')}
        >
          发布新酒店
        </Button>
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default HotelList;
