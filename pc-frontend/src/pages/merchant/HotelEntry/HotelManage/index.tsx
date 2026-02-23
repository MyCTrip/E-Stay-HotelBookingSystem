import React, { useEffect, useState } from 'react';
import { Form, Button, Space, message, Spin, Alert, Tag } from 'antd'; 
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { hotelApi } from '@/services/hotel';
import type { Hotel, AuditStatus } from '@/types/hotel';
import type { UploadFile } from 'antd/es/upload/interface';

// 引入的公共组件
import { BaseInfoCard } from '@/components/hotel/BaseInfoCard';
import { PolicyCard } from '@/components/hotel/PolicyCard';
import { MarketingCard } from '@/components/hotel/MarketingCard';
// import { RoomListCard } from '@/components/rooms/RoomListCard';
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
// 入住信息
  checkinInfo?: {
    checkinTime?: any; // UI层是 Dayjs 对象
    checkoutTime?: any;
    breakfastType?: string;
    breakfastPrice?: number;
  };
  // 动态字段 (UI层结构)
  facilities?: Record<string, string[]>; 
  policies?: {
    pet?: string;
    cancellation?: string;
    other?: string;
  };
  nearbyList?: any[];
  discountRules?: any[];
  // rooms?: any[];
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
      // 403 处理：商户资料缺失 -> 跳转去完善资料
      if (err?.response?.status === 403) {
        message.warning('请先完善商户资料');
        navigate('/merchant/profile'); // 确保你的路由里有这个路径
        return;
      }

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
    // --- A. 数据转换 (后端 -> UI) ---
      
      // 1. Facilities 转换: [{category: '基础', content: 'WiFi, 停车'}] -> {'基础': ['WiFi', '停车']}
      const facilitiesUI: any = {};
      hotelData.baseInfo.facilities?.forEach((item: any) => {
         if (item.content) {
            facilitiesUI[item.category] = item.content.split(',').map((s: string) => s.trim());
         }
      });

      // 2. Policies 转换
      const policiesUI: any = {};
      hotelData.baseInfo.policies?.forEach((item: any) => {
         if (item.policyType === 'petAllowed') policiesUI.pet = item.content;
         if (item.policyType === 'cancellation') policiesUI.cancellation = item.content;
         if (item.policyType === 'other') policiesUI.other = item.content;
      });

      // 3. 图片转换
      const images = hotelData.baseInfo.images?.map((url, i) => ({
         uid: String(i), name: `img-${i}`, status: 'done', url 
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
// 4. CheckinInfo (字符串 -> Dayjs)
        checkinInfo: {
            ...hotelData.checkinInfo,
            checkinTime: hotelData.checkinInfo?.checkinTime ? dayjs(hotelData.checkinInfo.checkinTime, 'HH:mm') : undefined,
            checkoutTime: hotelData.checkinInfo?.checkoutTime ? dayjs(hotelData.checkinInfo.checkoutTime, 'HH:mm') : undefined,
        },

        // 5. 注入转换后的动态字段
        facilities: facilitiesUI,
        policies: policiesUI,
        // 6. 回填房间数据
        // rooms: hotelData.rooms?.map((r: any) => ({ ... }))
      });
    } else if (isEditing && !hotelData) {
      // --- 新增模式：设置表单默认值 ---
      form.resetFields();
      form.setFieldsValue({
          star: 3,
          checkinInfo: { 
              checkinTime: dayjs('14:00', 'HH:mm'), 
              checkoutTime: dayjs('12:00', 'HH:mm'),
              breakfastType: '无'
          },
          facilities: { '基础设施': ['免费WiFi', '24小时前台'] },
          nearbyList: [],
          discountRules: [],
          // rooms: [{ name: '标准间', price: 299, stock: 10, size: 25 }]
      });
    }
  }, [isEditing, hotelData, form]);

  // === 3. 表单提交逻辑 ===
  const onFinish = async (values: HotelFormValues) => {
    setSubmitting(true);
    try {
      // 1. 图片处理：文档要求 images (string[])
      let imageList = values.images?.map(
        (f: any) => f.url || (f.response && f.response.url)
      ).filter(Boolean) || [];

      // 防御：文档隐含要求 images 可能非空，给一张默认图更安全
      if (imageList.length === 0) {
          imageList = ['https://via.placeholder.com/800x600?text=No+Image']; 
      }

      // 2. Facilities 转换 (UI -> DB)
      const facilitiesDB = Object.keys(values.facilities || {}).map(key => {
          const contentText = (values.facilities as any)[key]?.join(', ') || '';
          return {
              category: key,
              content: `<p>${contentText}</p>` // 包装成 HTML
          };
      }).filter(item => item.content !== '<p></p>'); 
      
      // 必填兜底
      if (facilitiesDB.length === 0) {
          facilitiesDB.push({ category: '基础服务', content: '<p>暂无详细信息</p>' });
      }

      // 3. Policies 转换 (UI -> DB)
      const policiesDB = [
          { 
            policyType: 'petAllowed', 
            content: values.policies?.pet ? `<p>${values.policies.pet}</p>` : '<p>不可携带宠物</p>' 
          },
          { 
            policyType: 'cancellation', 
            content: values.policies?.cancellation ? `<p>${values.policies.cancellation}</p>` : '<p>详询酒店前台</p>' 
          }
      ].filter(item => item.content);

      // 映射表：前端中文 -> 后端枚举
      const surTypeMap: Record<string, string> = {
          '地铁': 'metro',
          '景点': 'attraction',
          '商圈': 'business',
          '交通': 'metro', // 兜底
          'metro': 'metro',
          'attraction': 'attraction',
          'business': 'business'
      };

      const surroundingsDB = (values.nearbyList || []).map((item: any) => ({
          surType: surTypeMap[item.type] || 'business', 
          surName: item.name || '未知地点',            
          distance: Number(item.distance) || 100       
      }));

      const discountTypeMap: Record<string, string> = {
          '立减': 'instant',
          '折扣': 'discount',
          'instant': 'instant',
          'discount': 'discount'
      };
      const discountsDB = (values.discountRules || []).map((item: any) => ({
          title: item.title || '优惠',
          type: discountTypeMap[item.type] || 'instant', 
          content: item.value || ''                      
      }));

      // 4. 构造严格符合文档的 Payload
      const payload: any = {
        baseInfo: {
          nameCn: values.nameCn,
          nameEn: values.nameEn, // optional
          address: values.address,
          city: values.city || '未填写',
          star: values.star ?? 3,
          roomTotal: 1,
          openTime: values.openTime ? dayjs(values.openTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          phone: '000-00000000', 
          description: values.description || '暂无描述',
          images: imageList,
          facilities: facilitiesDB,
          policies: policiesDB,
          surroundings: surroundingsDB,
          discounts: discountsDB
        },
        checkinInfo: {
            checkinTime: values.checkinInfo?.checkinTime ? (values.checkinInfo.checkinTime as any).format('HH:mm') : '14:00',
            checkoutTime: values.checkinInfo?.checkoutTime ? (values.checkinInfo.checkoutTime as any).format('HH:mm') : '12:00',
        }
      };

      if (hotelData?._id) {
        await hotelApi.update(hotelData._id, payload);
        message.success('更新申请已提交');
      } else {
        await hotelApi.create(payload);
        message.success('酒店创建成功');
      }
      
      await fetchMyHotel(); 
      setIsEditing(false);

    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.response?.data?.message;
      const fieldErrors = err?.response?.data?.errors ? JSON.stringify(err?.response?.data?.errors) : '';
      message.error(`${errorMsg || '提交失败'} ${fieldErrors}`);
    } finally {
      setSubmitting(false);
    }
  };

  // === 状态提示渲染逻辑 ===
  const renderRejectAlert = () => {
    const status = hotelData?.auditInfo?.status;
    const rejectReason = (hotelData?.auditInfo as any)?.rejectReason; // 🔥 使用 as any 规避 TS 报错

    if (status !== 'rejected' && status !== 'offline') return null;

    const isOffline = status === 'offline';

    return (
      <Alert
        message={isOffline ? "酒店已强制下线" : "审核未通过"}
        description={
          <div>
            <p style={{ margin: 0 }}>
              {isOffline 
                ? '您的酒店已被管理员下线，暂不对外展示，请根据原因进行整改。' 
                : '您的酒店信息未通过管理员审核，请根据驳回原因修改后重新提交。'}
            </p>
            <p style={{ margin: '8px 0 0 0' }}>
              <strong>{isOffline ? '下线原因：' : '驳回原因：'}</strong>
              <span style={{ color: '#ff4d4f' }}>{rejectReason || '管理员未提供具体原因'}</span>
            </p>
          </div>
        }
        type={isOffline ? "warning" : "error"}
        showIcon
        style={{ marginBottom: 24 }}
      />
    );
  };

  // === 页面渲染逻辑 ===
  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="正在加载酒店信息..." /></div>;

  // 查看模式：渲染只读的酒店详情组件
  if (!isEditing && hotelData) {
    return (
      <>
        {/* 🔥 在查看模式顶部显示驳回警告 */}
        <div style={{ maxWidth: 1000, margin: '24px auto 0' }}>
          {renderRejectAlert()}
        </div>
        <HotelDetailsView data={hotelData} onEdit={() => setIsEditing(true)} />
      </>
    );
  }

  // 编辑/新增模式：渲染表单页面
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 80, paddingTop: 24 }}>
      
      {/* 🔥 在编辑模式顶部也显示驳回警告，提醒商户 */}
      {renderRejectAlert()}

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {/* 🔥 将标题改为 flex 布局，并在旁边展示当前状态 Tag */}
          <h2 style={{ fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', margin: 0 }}>
            {hotelData ? '编辑酒店信息' : '发布新酒店'}
            {hotelData && (
              <span style={{ marginLeft: 12 }}>
                {hotelData.auditInfo?.status === 'approved' && <Tag color="success">已上线</Tag>}
                {hotelData.auditInfo?.status === 'pending' && <Tag color="processing">审核中</Tag>}
                {hotelData.auditInfo?.status === 'draft' && <Tag color="default">草稿</Tag>}
                {hotelData.auditInfo?.status === 'rejected' && <Tag color="error">已驳回</Tag>}
                {hotelData.auditInfo?.status === 'offline' && <Tag color="warning">已下线</Tag>}
              </span>
            )}
          </h2>
          <p style={{ color: '#888', marginTop: 8 }}>
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
        {/* <RoomListCard /> */}

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