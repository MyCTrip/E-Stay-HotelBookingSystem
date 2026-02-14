import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Divider, Alert, Row, Col } from 'antd';
import { ShopOutlined, IdcardOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/shared/ImageUpload';
import type { MerchantProfile } from '@/types/user';
import { merchantApi } from '@/services/merchant';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  visible: boolean;
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

  useEffect(() => {
    if (visible && data) {
      // 1. 防御性处理：确保 qualificationInfo 存在才 map
      const licenseImgs = data.qualificationInfo?.licenseImage?.map((url, index) => ({
        uid: String(index),
        name: `license-${index}`,
        status: 'done' as const,
        url: url
      })) || [];

      // 2. 防御性回显：所有 data.baseInfo 访问都加上 ?.
      form.setFieldsValue({
        merchantName: data.baseInfo?.merchantName || '',
        contactName: data.baseInfo?.contactName || '',
        contactPhone: data.baseInfo?.contactPhone || '',
        contactEmail: data.baseInfo?.contactEmail || '',
        businessLicenseNo: data.qualificationInfo?.businessLicenseNo || '',
        licenseImages: licenseImgs as any,
      });
    } else {
        form.resetFields();
    }
  }, [visible, data, form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const imageList = values.licenseImages?.map(
        (f: any) => f.url || (f.response && f.response.url)
      ).filter(Boolean) || [];

      // 构造符合后端要求的 Payload
      const payload: Partial<MerchantProfile> = {
        baseInfo: {
          merchantName: values.merchantName,
          contactName: values.contactName,
          contactPhone: values.contactPhone,
          contactEmail: values.contactEmail,
        },
        qualificationInfo: {
          businessLicenseNo: values.businessLicenseNo,
          licenseImage: imageList,
          realNameStatus: 'unverified' 
        },
        auditInfo: {
          verifyStatus: 'pending'
        }
      };

      await merchantApi.updateProfile(payload);
      
      message.success('提交成功，资料将进入审核流程');
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    // console.log('Upload event:', e); // 调试用
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      title="编辑商户资料"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Alert 
        message="审核提示" 
        description="修改“商户名称”或“资质信息”后，您的账户将重新进入审核状态。" 
        type="warning" 
        showIcon 
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        
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
              <Input placeholder="与营业执照一致" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="联系人姓名" 
              name="contactName" 
              rules={[{ required: true }]}
            >
              <Input placeholder="业务负责人" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item 
              label="联系电话" 
              name="contactPhone" 
              rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
            >
              <Input placeholder="用于接收审核通知" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="联系邮箱" 
              name="contactEmail" 
              rules={[{ type: 'email', required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" style={{ borderColor: '#e8e8e8' }}>
          <IdcardOutlined /> 资质认证
        </Divider>

        <Form.Item 
          label="统一社会信用代码" 
          name="businessLicenseNo" 
          rules={[{ required: true, message: '必填项' }]}
        >
          <Input placeholder="请输入18位信用代码" />
        </Form.Item>

        <Form.Item 
          label="营业执照电子版" 
          name="licenseImages"
          // 🔥 核心修复：上传组件应该用 fileList 而不是 value
          valuePropName="fileList" 
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '请上传营业执照' }]}
        >
          <ImageUpload 
            maxCount={1}
            maxSize={5}
            accept=".jpg,.jpeg,.png,.pdf" 
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default EditProfileModal;