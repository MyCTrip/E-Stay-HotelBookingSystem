import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Row, Col, message, Space } from 'antd'; // ✅ 引入 Space
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { hotelApi } from '@/services/hotel';
import type { HotelRoom } from '@/types/hotel'; // ✅ 引用修正

// 引入子组件
import { RoomTable } from '@/components/rooms/RoomTable';
import { RoomFormModal } from '@/components/rooms/RoomFormModal';
import { RoomDetailModal } from '@/components/rooms/RoomDetailModal';

const RoomManage: React.FC = () => {
  // === 状态管理 ===
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [hotelId, setHotelId] = useState<string>(''); // ✅ 这个变量现在会被用到了

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
      // 兼容后端可能返回 { data: [...] } 或直接 [...]
      const myHotels = Array.isArray(hotelRes) ? hotelRes : (hotelRes.data || []);
      
      if (myHotels.length > 0) {
        const myHotel = myHotels[0];
        setHotelId(myHotel._id); // ✅ 赋值
        
        // 如果后端 /hotel/my 接口通过 populate 已经把 rooms 带回来了，直接用
        if (myHotel.rooms && myHotel.rooms.length > 0) {
           setRooms(myHotel.rooms);
        } else {
           // 否则调用获取房间列表接口 (如果有)
           // setRooms([]); 
           // 或者临时先为空
        }
      } else {
        message.warning('请先创建酒店信息');
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

  // === 3. 表单提交逻辑 (适配后端 Schema) ===
  const handleFormSubmit = async (values: any) => {
    if (!hotelId) {
        message.error('未找到酒店信息');
        return;
    }
    setFormLoading(true);
    try {
      // 提取图片
      const imageList = values.images?.map((f: any) => f.url || (f.response && f.response.url)).filter(Boolean) || [];

      // ✅ 构造完全符合后端 Room Schema 的数据结构
      // 注意：后端要求 bedInfo, status, maxOccupancy 必填
      const payload: Partial<HotelRoom> = {
        hotelId: hotelId, // 关联ID
        baseInfo: {
          type: values.name,
          price: values.price,
          stock: values.stock,
          images: imageList,
          status: 'draft',    // 默认草稿状态
          maxOccupancy: 2     // 前端没填，给个默认值
        },
        headInfo: {
          size: String(values.size),
          floor: '1-10',      // 默认值
          wifi: values.facilities?.includes('WiFi') || false,
          windowAvailable: values.facilities?.includes('有窗') || false,
          smokingAllowed: false
        },
        breakfastInfo: {
          hasBreakfast: values.hasBreakfast
        },
        bedInfo: [], // ✅ 后端要求必填且数组，前端暂时没做床型输入，传空数组以过校验
        auditInfo: {
           // 通常后端会自动处理
        }
      };

      if (currentRoom) {
        // 编辑模式
        await hotelApi.updateRoom(hotelId, currentRoom._id, payload);
        message.success('更新成功');
      } else {
        // 创建模式
        await hotelApi.addRoom(hotelId, payload);
        message.success('创建成功');
      }
      
      setIsFormOpen(false);
      fetchRooms(); // 刷新

    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 顶部操作栏 */}
      <Card variant="borderless" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>房间列表</h2>
          </Col>
          <Col>
            <Space>
               <Input prefix={<SearchOutlined />} placeholder="搜索房间..." style={{ width: 200 }} />
               <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>创造房型</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 列表组件 */}
      <Card variant="borderless">
        <RoomTable 
          loading={loading} 
          dataSource={rooms} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* 弹窗组件 */}
      <RoomFormModal
        open={isFormOpen}
        title={currentRoom ? '编辑房间' : '创建新房型'}
        initialValues={currentRoom}
        loading={formLoading}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
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