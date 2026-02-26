import React, { useEffect, useState } from 'react';
import { Form, Button, Space, message, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { hotelApi } from '@/services/hotel';
import { facilitiesToFormValues, formValuesToFacilities } from '@/config/facilities';
import type { Hotel, AuditStatus } from '@/types/hotel';
import type { UploadFile } from 'antd/es/upload/interface';

// 引入的公共组件
import { BaseInfoCard } from '@/components/hotel/BaseInfoCard';
import { PolicyCard } from '@/components/hotel/PolicyCard';
import { MarketingCard } from '@/components/hotel/MarketingCard';
import { HotelDetailsView } from '@/components/hotel/HotelDetailsView';
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
      // ✅ 403 处理：商户资料缺失 -> 跳转去完善资料
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
      
      // 🔑 合并数据：优先用 pendingChanges，回退到 baseInfo
      const mergedBaseInfo = {
        ...hotelData.baseInfo,
        ...(hotelData.pendingChanges?.baseInfo || {})
      };
      
      // 1. Facilities 转换：将后端的 facilities 结构转换为表单的 checkbox 选中值
      const facilitiesFormValues = facilitiesToFormValues(mergedBaseInfo.facilities || []);

      // 2. Policies 转换
      const policiesUI: any = {};
      mergedBaseInfo.policies?.forEach((item: any) => {
         if (item.policyType === 'petAllowed') policiesUI.pet = item.content;
         if (item.policyType === 'cancellation') policiesUI.cancellation = item.content;
         if (item.policyType === 'other') policiesUI.other = item.content;
      });

      // 3. 图片转换
      const images = mergedBaseInfo.images?.map((url, i) => ({
         uid: String(i), name: `img-${i}`, status: 'done', url 
      })) || [];

      form.setFieldsValue({
        nameCn: mergedBaseInfo.nameCn,
        nameEn: mergedBaseInfo.nameEn,
        city: mergedBaseInfo.city,
        address: mergedBaseInfo.address,
        star: mergedBaseInfo.star,
        openTime: mergedBaseInfo.openTime ? dayjs(mergedBaseInfo.openTime) : undefined,
        description: mergedBaseInfo.description,
        images: images as any,
// 4. CheckinInfo (字符串 -> Dayjs)
        checkinInfo: {
            ...(hotelData.pendingChanges?.checkinInfo || hotelData.checkinInfo),
            checkinTime: (hotelData.pendingChanges?.checkinInfo?.checkinTime || hotelData.checkinInfo?.checkinTime) ? dayjs(hotelData.pendingChanges?.checkinInfo?.checkinTime || hotelData.checkinInfo?.checkinTime, 'HH:mm') : undefined,
            checkoutTime: (hotelData.pendingChanges?.checkinInfo?.checkoutTime || hotelData.checkinInfo?.checkoutTime) ? dayjs(hotelData.pendingChanges?.checkinInfo?.checkoutTime || hotelData.checkinInfo?.checkoutTime, 'HH:mm') : undefined,
        },

        // 5. 注入转换后的动态字段
        facilities: facilitiesFormValues,
        policies: policiesUI,
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
          // 默认勾选一些基础设施
          facilities: {
            basic: ['wifi', 'elevator'],
            service: ['front_desk']
          },
          nearbyList: [],
          discountRules: [],
      });
    }
  }, [isEditing, hotelData, form]);

  // === 3. 表单提交逻辑 ===
  const onFinish = async (values: HotelFormValues) => {
    setSubmitting(true);
    try {
      // 1. 图片处理：需要上传新文件 + 获取已存储文件的 URL
      let imageList: string[] = [];
      
      if (values.images && values.images.length > 0) {
        // 并行处理所有文件：已上传的直接用 URL，新上传的要先上传到服务器
        const uploadPromises = values.images.map(async (file: any) => {
          // 如果已经有 URL（之前上传过或编辑时回显的），直接返回
          if (file.url) {
            return file.url;
          }
          // 如果有原始文件对象，需要上传到服务器
          if (file.originFileObj) {
            const formData = new FormData();
            formData.append('file', file.originFileObj);
            try {
              const uploadResponse = await hotelApi.uploadImage(formData);
              return (uploadResponse as any).url || (uploadResponse as any).data?.url;
            } catch (uploadError: any) {
              console.error('图片上传失败:', uploadError);
              throw new Error('图片上传失败，请重试');
            }
          }
          return null;
        });
        
        const uploadedUrls = await Promise.all(uploadPromises);
        imageList = uploadedUrls.filter(Boolean);
      }

      // 防御：确保至少有一张图片
      if (imageList.length === 0) {
          message.error('请上传至少一张酒店图片');
          setSubmitting(false);
          return;
      }

      // 2. Facilities 转换 (UI -> DB)
      // 使用 helper 函数将表单的 checkbox 选中值转换为完整的 facilities 结构
      const facilitiesDB = formValuesToFacilities(values.facilities || {});

      // 3. Policies 转换 (UI -> DB)
      // 文档要求：Array, required, non-empty, content 为 HTML
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
          surType: surTypeMap[item.type] || 'business', // 转换字段名 type -> surType，并转枚举
          surName: item.name || '未知地点',            // 转换字段名 name -> surName
          distance: Number(item.distance) || 100       // 确保是数字
      }));

      const discountTypeMap: Record<string, string> = {
          '立减': 'instant',
          '折扣': 'discount',
          'instant': 'instant',
          'discount': 'discount'
      };
      const discountsDB = (values.discountRules || []).map((item: any) => ({
          title: item.title || '优惠',
          type: discountTypeMap[item.type] || 'instant', // 转枚举
          content: item.value || ''                      // 转换字段名 value -> content
      }));

      // 4. 构造严格符合文档的 Payload
      // 文档结构：{ baseInfo: {...}, checkinInfo: {...} }
      const payload: any = {
        baseInfo: {
          nameCn: values.nameCn,
          nameEn: values.nameEn, // optional
          address: values.address,
          city: values.city || '未填写',
          star: values.star ?? 3,
          roomTotal: 1,
          openTime: values.openTime ? dayjs(values.openTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          // 文档要求 phone 是 string
          phone: '000-00000000', 
          description: values.description || '暂无描述',
          images: imageList,
          
          // 严格符合文档结构
          facilities: facilitiesDB,
          policies: policiesDB,
          
          // 文档提到的可选数组，显式传空数组
          surroundings: surroundingsDB,
          discounts: discountsDB
        },
        
        // checkinInfo 是 optional，但如果有内容则必须包含 checkinTime/checkoutTime
        checkinInfo: {
            checkinTime: values.checkinInfo?.checkinTime ? (values.checkinInfo.checkinTime as any).format('HH:mm') : '14:00',
            checkoutTime: values.checkinInfo?.checkoutTime ? (values.checkinInfo.checkoutTime as any).format('HH:mm') : '12:00',
            // 文档没明确提 breakfastType/Price，但在示例中可能有，建议保留或根据 checkinInfo 定义调整
            
        }
      };

      console.log('提交的 Payload:', JSON.stringify(payload, null, 2)); // 方便你自己调试看

      if (hotelData?._id) {
        // PUT /api/hotels/:id
        await hotelApi.update(hotelData._id, payload);
        message.success('更新申请已提交');
      } else {
        // POST /api/hotels
        await hotelApi.create(payload);
        message.success('酒店创建成功');
      }
      
      await fetchMyHotel(); 
      setIsEditing(false);

    } catch (err: any) {
      console.error(err);
      // 显示后端返回的详细校验错误
      const errorMsg = err?.response?.data?.message;
      const fieldErrors = err?.response?.data?.errors ? JSON.stringify(err?.response?.data?.errors) : '';
      message.error(`${errorMsg || '提交失败'} ${fieldErrors}`);
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