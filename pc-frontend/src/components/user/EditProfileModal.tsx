import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Divider, Alert, Row, Col } from 'antd';
import { ShopOutlined, IdcardOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/shared/ImageUpload';
import type { MerchantProfile } from '@/types/user';
import { merchantApi } from '@/services/merchant';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  visible: boolean; // 保持和你父组件调用一致
  onCancel: () => void;
  onSuccess: () => void;
  data: MerchantProfile | null;
}

interface ProfileFormValues {
  merchantName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessLicenseNo: string;
  licenseImages: UploadFile[];
}

const EditProfileModal: React.FC<Props> = ({ visible, onCancel, onSuccess, data }) => {
  const [form] = Form.useForm<ProfileFormValues>();
  const [loading, setLoading] = useState(false);

  // === 1. 数据回显逻辑 ===
  useEffect(() => {
    if (visible && data) {
      // 图片回显处理：将后端 URL 转换为 Upload 组件需要的 File 对象格式
      // 注意：这里假设后端 qualificationInfo.licenseImage 是一个字符串数组
      const licenseImgs = data.qualificationInfo?.licenseImage?.map((url, index) => ({
        uid: String(index),
        name: `license-${index}`,
        status: 'done' as const,
        url: url
      })) || [];

      form.setFieldsValue({
        merchantName: data.baseInfo.merchantName,
        contactName: data.baseInfo.contactName,
        contactPhone: data.baseInfo.contactPhone,
        contactEmail: data.baseInfo.contactEmail,
        businessLicenseNo: data.qualificationInfo?.businessLicenseNo || '',
        licenseImages: licenseImgs as any,
      });
    } else {
      form.resetFields(); // 关闭或无数据时重置表单
    }
  }, [visible, data, form]);

  // === 2. 提交逻辑 (对接真实 API) ===
  const handleSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      // 图片数据清洗：
      // ImageUpload 组件的值可能是：
      // 1. 旧图片：对象里直接有 url
      // 2. 新图片：对象里没有 url，但在 response.data.url 里 (取决于你的上传组件实现)
      const imageList = values.licenseImages?.map((f: any) => {
        if (f.url) return f.url; // 旧图片
        if (f.response && f.response.url) return f.response.url; // 新上传成功的图片
        return null;
      }).filter(Boolean) || [];

      // 构造符合后端 Mongoose Schema 的 Payload
      // 注意：这里只传需要更新的字段，不传整个 MerchantProfile 对象
      const payload: Partial<MerchantProfile> = {
        baseInfo: {
          merchantName: values.merchantName,
          contactName: values.contactName,
          contactPhone: values.contactPhone,
          contactEmail: values.contactEmail,
        },
        qualificationInfo: {
          businessLicenseNo: values.businessLicenseNo,
          licenseImage: imageList as string[],
          // ✅ 修复报错：显式赋值状态。
          // 逻辑：修改了资质信息，状态重置为 'unverified'，等待后续提交审核
          realNameStatus: 'unverified' 
        },
        // auditInfo 通常由后端控制，这里可以不传，或者根据后端要求传
      };

      // 调用 Service
      await merchantApi.updateProfile(payload);
      
      message.success('资料保存成功，请记得提交审核');
      onSuccess(); // 通知父组件刷新数据
      onCancel();  // 关闭弹窗
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      // 提取后端返回的错误信息
      const errorMsg = error.response?.data?.message || '更新资料失败，请稍后重试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理 Upload 组件 onChange 事件，确保 Form 能获取到文件列表
  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      title={data ? "编辑商户资料" : "完善商户资料"} // 动态标题
      open={visible} // Antd v5 推荐用 open，v4 用 visible，这里兼容你的代码
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={700}
      destroyOnClose
      maskClosable={false} // 防止误触关闭
    >
      <Alert 
        message="资料填写须知" 
        description="请确保“商户名称”与营业执照一致。修改保存后，需要点击“提交审核”按钮才会进入审核流程。" 
        type="info" 
        showIcon 
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        
        {/* === 模块 1：基础信息 === */}
        <Divider orientation="left" style={{ borderColor: '#e8e8e8' }}>
          <ShopOutlined /> 基础信息
        </Divider>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item 
              label="商户名称 (企业名)" 
              name="merchantName" 
              rules={[{ required: true, message: '请输入商户名称' }]}
            >
              <Input placeholder="与营业执照一致" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="联系人姓名" 
              name="contactName" 
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input placeholder="业务负责人姓名" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item 
              label="联系电话" 
              name="contactPhone" 
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号' }
              ]}
            >
              <Input placeholder="用于接收审核通知" maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="联系邮箱" 
              name="contactEmail" 
              rules={[
                { required: true, message: '请输入联系邮箱' },
                { type: 'email', message: '邮箱格式不正确' }
              ]}
            >
              <Input placeholder="example@company.com" />
            </Form.Item>
          </Col>
        </Row>

        {/* === 模块 2：资质信息 === */}
        <Divider orientation="left" style={{ borderColor: '#e8e8e8' }}>
          <IdcardOutlined /> 资质认证
        </Divider>

        <Form.Item 
          label="统一社会信用代码 (营业执照号)" 
          name="businessLicenseNo" 
          rules={[
            { required: true, message: '请输入统一社会信用代码' },
            { len: 18, message: '统一社会信用代码通常为18位' }
          ]}
        >
          <Input placeholder="请输入18位信用代码" maxLength={18} />
        </Form.Item>

        <Form.Item 
          label="营业执照电子版" 
          name="licenseImages"
          valuePropName="value"
          getValueFromEvent={normFile}
          extra="支持 .jpg .png 格式，文件大小不超过 5MB"
          rules={[{ required: true, message: '请上传营业执照图片' }]}
        >
          <ImageUpload 
            maxCount={1}
            maxSize={5} // 5MB
            accept=".jpg,.jpeg,.png" 
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default EditProfileModal;