import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Row, Col, message, Space, Modal } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { hotelApi } from '@/services/hotel';
import type { HotelRoom } from '@/types/hotel';

// 引入组件
import { RoomTable } from '@/components/rooms/RoomTable'; 
import { RoomFormModal } from '@/components/rooms/RoomFormModal'; 
import { RoomDetailModal } from '@/components/rooms/RoomDetailModal'; 

const RoomManage: React.FC = () => {
  // === 状态管理 ===
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [hotelId, setHotelId] = useState<string>('');

  // 弹窗控制
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<HotelRoom | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // === 1. 初始化加载 ===
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const hotelRes: any = await hotelApi.getMyHotels();
      const myHotels = Array.isArray(hotelRes) ? hotelRes : (hotelRes.data || []);
      
      if (myHotels.length > 0) {
        const myHotel = myHotels[0];
        setHotelId(myHotel._id);
        
        const roomsRes: any = await hotelApi.getRooms(myHotel._id);
        const roomList = Array.isArray(roomsRes) ? roomsRes : (roomsRes.data || []);
        setRooms(roomList);
      } else {
        message.warning('请先在“酒店信息”中创建酒店');
      }
    } catch (error) {
      console.error(error);
      message.error('加载房间列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // === 2. 交互处理 ===
  const handleCreate = () => {
    if (!hotelId) {
        message.error('未找到酒店信息，无法创建房型');
        return;
    }
    setCurrentRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: HotelRoom) => {
    setCurrentRoom(room);
    setIsFormOpen(true);
  };

  const handleView = (room: HotelRoom) => {
    setCurrentRoom(room);
    setIsDetailOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!hotelId) return;
    try {
        await hotelApi.deleteRoom(hotelId, roomId); 
        message.success('删除成功');
        fetchRooms(); 
    } catch (error) {
        message.error('删除失败');
    }
  };

  // 🔥 🆕 这是你新增的：改变状态（去审核）
  const handleSubmitAudit = async (roomId: string) => {
    if (!hotelId) return;
    try {
      await hotelApi.submitRoom(roomId); 
      message.success('已提交审核，请耐心等待管理员处理');
      fetchRooms(); // 刷新列表，状态就会变成“审核中”
    } catch (error: any) {
      message.error(error?.response?.data?.message || '提交审核失败');
    }
  };

  // === 3. 表单提交 (保持原样，用来保存草稿/修改) ===
  const handleFormSubmit = async (payload: any) => {
    if (!hotelId) {
        message.error('系统异常：未获取到酒店ID');
        return;
    }

    setFormLoading(true);
    try {
      if (currentRoom) {
        await hotelApi.updateRoom(hotelId, currentRoom._id, payload);
        message.success('房型更新成功');
      } else {
        await hotelApi.addRoom(hotelId, payload);
        message.success('新房型创建成功（已存为草稿）');
      }
      
      setIsFormOpen(false);
      fetchRooms(); 

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || '操作失败';
      message.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card variant="borderless" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>房型管理</h2>
          </Col>
          <Col>
            <Space>
               <Input prefix={<SearchOutlined />} placeholder="搜索房型..." style={{ width: 200 }} />
               <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>添加新房型</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card variant="borderless">
        <RoomTable 
          loading={loading} 
          dataSource={rooms} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitAudit={handleSubmitAudit} // 🔥 🆕 把提交审核的函数传给表格组件
        />
      </Card>

      <RoomFormModal
        open={isFormOpen}
        title={currentRoom ? '编辑房型' : '创建新房型'}
        initialValues={currentRoom}
        loading={formLoading}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit} // 这是原本的写数据函数
      />

      <RoomDetailModal
        open={isDetailOpen}
        data={currentRoom}
        onCancel={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default RoomManage;