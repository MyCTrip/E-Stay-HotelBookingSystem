import React, { useEffect, useState } from 'react';
import { Form, Button, Space, message, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { hotelApi } from '@/services/hotel';
import type { Hotel, AuditStatus } from '@/types/hotel';
import type { UploadFile } from 'antd/es/upload/interface';

// 引入的公共组件
import { BaseInfoCard } from '@/components/PageLoader/BaseInfoCard';
import { PolicyCard } from '@/components/PageLoader/PolicyCard';
import { MarketingCard } from '@/components/PageLoader/MarketingCard';
import { RoomListCard } from '@/components/rooms/RoomListCard';
import { HotelDetailsView } from '@/components/hotel/HotelDetailsView'; // 酒店详情查看组件

// 表单值类型定义（UI层）
interface HotelFormValues {
  nameCn: string;
  nameEn?: string;
  address: string;
  city?: string;
  star?: number;
  openTime?: any;
  description?: string;
  images?: UploadFile[];
  checkinInfo?: {
    checkinTime?: string;
    checkoutTime?: string;
    breakfastType?: string;
    breakfastPrice?: number;
  };
  nearbyList?: any[];
  discountRules?: any[];
  rooms?: any[];
}

const HotelManage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<HotelFormValues>();

  // === 状态管理核心 ===
  const [loading, setLoading] = useState(true);        // 全局加载状态
  const [submitting, setSubmitting] = useState(false); // 提交按钮加载状态
  const [hotelData, setHotelData] = useState<Hotel | null>(null); // 当前酒店数据
  const [isEditing, setIsEditing] = useState(false);   // 页面模式：true=编辑/新增表单，false=详情查看

  // === 1. 初始化：获取当前商家的酒店信息 ===
  const fetchMyHotel = async () => {
    setLoading(true);
    try {
      // --- 👇 临时代码开始：假装后端返回了数据 👇 ---
      // 模拟延迟 0.5 秒
      // await new Promise(resolve => setTimeout(resolve, 500));

      // const mockData: any = {
      //   _id: 'mock-hotel-001',
      //   baseInfo: {
      //     nameCn: '易宿精选度假酒店 (测试)',
      //     nameEn: 'E-Stay Luxury Resort',
      //     city: '三亚',
      //     address: '海棠湾路 88 号',
      //     star: 5,
      //     openTime: '2023-10-01',
      //     description: '这是一家非常棒的度假酒店，拥有私人海滩和无边泳池...',
      //     phone: '0898-88888888',
      //     images: [
      //       'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3', 
      //       'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3'
      //     ]
      //   },
      //   checkinInfo: {
      //     checkinTime: '15:00',
      //     checkoutTime: '12:00',
      //     breakfastType: '自助',
      //     breakfastPrice: 128
      //   },
      //   rooms: [
      //     {
      //       _id: 'room-01',
      //       baseInfo: { type: '海景大床房', price: 1299, stock: 5 },
      //       headInfo: { size: '45', wifi: true, windowAvailable: true },
      //       breakfastInfo: { hasBreakfast: true }
      //     },
      //     {
      //       _id: 'room-02',
      //       baseInfo: { type: '园景双床房', price: 899, stock: 10 },
      //       headInfo: { size: '35', wifi: true, windowAvailable: true },
      //       breakfastInfo: { hasBreakfast: false }
      //     }
      //   ]
      // };

      // setHotelData(mockData); // 强制写入数据
      // setIsEditing(false);    // 强制进入“查看模式”
      // --- 👆 临时代码结束 👆 ---

      // 原来的真实代码先注释掉，等接后端时再解开
      // 调用新接口，获取当前商家的酒店列表
      const res: any = await hotelApi.getMyHotels();
      
      // 数据格式适配（兼容接口返回数组/对象两种格式）
      const list = Array.isArray(res) ? res : (res.data || []);

      if (list.length > 0) {
        // 场景A：商家已有酒店 -> 进入查看模式
        setHotelData(list[0]);
        setIsEditing(false); 
      } else {
        // 场景B：商家暂无酒店 -> 进入新增模式
        setHotelData(null);
        setIsEditing(true);
      }
    } catch (err: any) {
      // 特殊处理404异常（如果后端在「未找到酒店」时返回404状态码）
      if (err?.response?.status === 404) {
        setHotelData(null);
        setIsEditing(true);
      } else {
        console.error(err);
        message.error('酒店信息加载失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHotel();
  }, []);

  // === 2. 表单数据回填逻辑（进入编辑模式时触发） ===
  useEffect(() => {
    if (isEditing && hotelData) {
      // --- 编辑模式：回填已有酒店数据 ---
      const images = hotelData.baseInfo.images?.map((url, i) => ({
         uid: String(i), name: `图片-${i}`, status: 'done', url 
      })) || [];

      form.setFieldsValue({
        nameCn: hotelData.baseInfo.nameCn,
        nameEn: hotelData.baseInfo.nameEn,
        city: hotelData.baseInfo.city,
        address: hotelData.baseInfo.address,
        star: hotelData.baseInfo.star,
        openTime: hotelData.baseInfo.openTime ? dayjs(hotelData.baseInfo.openTime) : undefined,
        description: hotelData.baseInfo.description,
        images: images as any,
        checkinInfo: hotelData.checkinInfo,
        // 回填房间数据
        rooms: hotelData.rooms?.map((r: any) => ({
            name: r.baseInfo?.type || r.type,
            price: r.baseInfo?.price || r.price,
            stock: r.baseInfo?.stock || r.stock,
            size: r.headInfo?.size ? parseFloat(r.headInfo.size) : 0,
            facilities: [
                r.headInfo?.wifi ? '无线网络' : '',
                r.headInfo?.windowAvailable ? '有窗' : ''
            ].filter(Boolean),
            hasBreakfast: !!r.breakfastInfo?.hasBreakfast
        }))
      });
    } else if (isEditing && !hotelData) {
      // --- 新增模式：设置表单默认值 ---
      form.resetFields();
      form.setFieldsValue({
          star: 3,
          checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
          rooms: [{ name: '标准间', price: 299, stock: 10, size: 25 }]
      });
    }
  }, [isEditing, hotelData, form]);

  // === 3. 表单提交逻辑 ===
  const onFinish = async (values: HotelFormValues) => {
    setSubmitting(true);
    try {
      let finalDesc = values.description || '';
      if (values.nearbyList?.length) finalDesc += '\n\n【周边信息】...'; // 简化的周边信息拼接逻辑

      // 提取图片URL（过滤无效值）
      const imageList = values.images?.map(
        (f: any) => f.url || (f.response && f.response.url)
      ).filter(Boolean) || [];

      // 构造接口提交参数
      const payload: Partial<Hotel> = {
        baseInfo: {
          nameCn: values.nameCn,
          nameEn: values.nameEn,
          address: values.address,
          city: values.city || '未填写',
          star: values.star ?? 3,
          openTime: values.openTime ? dayjs(values.openTime).format('YYYY-MM-DD') : '',
          description: finalDesc,
          roomTotal: values.rooms?.length ?? 0,
          phone: '待完善',
          images: imageList as string[],
        },
        // 入住政策参数（带默认值兜底）
        checkinInfo: values.checkinInfo?.checkinTime ? {
            checkinTime: values.checkinInfo.checkinTime,
            checkoutTime: values.checkinInfo.checkoutTime || '12:00',
            breakfastType: values.checkinInfo.breakfastType,
            breakfastPrice: values.checkinInfo.breakfastPrice
        } : undefined,
        
        auditInfo: { status: 'draft' as AuditStatus }, // 审核状态默认设为草稿
        
        // 房间数据构造
        rooms: values.rooms?.map(room => ({
          baseInfo: { type: room.name, price: room.price, stock: room.stock, images: [], status: 'draft', maxOccupancy: 2 },
          headInfo: { size: String(room.size || 0), floor: '1-10', wifi: room.facilities?.includes('无线网络') || false, windowAvailable: true, smokingAllowed: false },
          breakfastInfo: room.hasBreakfast ? { hasBreakfast: true } : {},
          bedInfo: [] 
        })) as any
      };

      if (hotelData?._id) {
        // 有酒店ID：执行编辑更新操作
        await hotelApi.update(hotelData._id, payload);
        message.success('酒店信息修改成功');
      } else {
        // 无酒店ID：执行新增创建操作
        await hotelApi.create(payload);
        message.success('酒店发布成功');
      }
      
      // 提交成功后：刷新最新数据并切回查看模式
      await fetchMyHotel(); 
      setIsEditing(false);

    } catch (err: any) {
      message.error(err?.response?.data?.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // === 页面渲染逻辑 ===
  // 全局加载中：展示大加载动画
  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="正在加载酒店信息..." /></div>;

  // 查看模式：渲染只读的酒店详情组件
  if (!isEditing && hotelData) {
    return <HotelDetailsView data={hotelData} onEdit={() => setIsEditing(true)} />;
  }

  // 编辑/新增模式：渲染表单页面
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 80 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>
            {hotelData ? '编辑酒店信息' : '发布新酒店'}
          </h2>
          <p style={{ color: '#888' }}>
            {hotelData ? '修改以下信息并保存，修改后可能需要重新审核' : '请完善酒店信息，完成后即可开启营业'}
          </p>
        </div>
        {/* 仅编辑已有酒店时，显示取消按钮 */}
        {hotelData && (
          <Button icon={<ArrowLeftOutlined />} onClick={() => setIsEditing(false)}>
            取消编辑
          </Button>
        )}
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
        {/* 按模块拆分的表单组件 */}
        <BaseInfoCard />
        <PolicyCard />
        <MarketingCard />
        <RoomListCard />

        {/* 悬浮底部操作栏 */}
        <div style={{ 
          position: 'fixed', bottom: 0, right: 0, width: '100%', 
          padding: '12px 24px', background: '#fff', borderTop: '1px solid #e8e8e8', 
          textAlign: 'right', zIndex: 99 
        }}>
          <Space>
             {hotelData && <Button size="large" onClick={() => setIsEditing(false)}>取消</Button>}
             <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={submitting}>
                {hotelData ? '保存修改' : '立即发布'}
             </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default HotelManage;