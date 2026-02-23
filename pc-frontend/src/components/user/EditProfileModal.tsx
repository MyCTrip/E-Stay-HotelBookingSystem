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
  businessLicensePhoto: UploadFile[];
}

const EditProfileModal: React.FC<Props> = ({ visible, onCancel, onSuccess, data }) => {
  const [form] = Form.useForm<ProfileFormValues>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //只有弹窗显示时，才去操作 form
    if (visible) {
      if (data) {
        // --- 编辑模式：回显数据 ---
        // 🔥 修复点 1：适应队友的新数据结构，将后端的字符串转为前端上传组件需要的数组格式
        const photoUrl = (data.qualificationInfo as any)?.businessLicensePhoto;
        const licenseImgs = photoUrl ? [{
          uid: '0',
          name: 'license-0',
          status: 'done' as const,
          url: photoUrl
        }] : [];

        // 因为弹窗刚打开时，Form 可能还没来得及挂载到 DOM 上
        // 加上 setTimeout 可以保证在 DOM 渲染完毕后再塞入数据，100% 消除警告
        setTimeout(() => {
          form.setFieldsValue({
            merchantName: data.baseInfo?.merchantName || '',
            contactName: data.baseInfo?.contactName || '',
            contactPhone: data.baseInfo?.contactPhone || '',
            contactEmail: data.baseInfo?.contactEmail || '',
            businessLicenseNo: data.qualificationInfo?.businessLicenseNo || '',
            // 🔥 修复点 2：字段名要和 Form.Item 的 name 保持一致
            businessLicensePhoto: licenseImgs as any, 
          });
        }, 0);
      } else {
        // --- 新建模式：清空表单 ---
        setTimeout(() => {
          form.resetFields();
        }, 0);
      }
    }
    // 当 visible 为 false 时什么都不做，因为 Modal 的 destroyOnClose 会自动销毁表单
  }, [visible, data, form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      let photoUrl: string | undefined;
      
      // 处理营业执照图片上传
      if (values.businessLicensePhoto && values.businessLicensePhoto.length > 0) {
        const file = values.businessLicensePhoto[0];
        
        // 如果已经有 URL（已上传的文件），直接使用
        if (file.url) {
          photoUrl = file.url;
          console.log('使用已上传的图片URL:', photoUrl);
        } 
        // 如果有原始文件对象，需要上传到服务器
        else if (file.originFileObj) {
          const formData = new FormData();
          formData.append('file', file.originFileObj);
          
          try {
            const uploadResponse = await merchantApi.uploadImage(formData);
            // 🔥 修复点 3：兼容 Axios 的返回结构，防止 TS 报错
            photoUrl = (uploadResponse as any).data?.url || (uploadResponse as any).url;
            console.log('新上传的图片URL:', photoUrl);
          } catch (uploadError: any) {
            console.error('上传失败详情:', uploadError);
            throw new Error(uploadError?.response?.data?.message || '图片上传失败，请重试');
          }
        }
      }

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
          businessLicensePhoto: photoUrl, // 给后端的确实是字符串，符合队友的改动
          realNameStatus: 'unverified' 
        },
        auditInfo: {
          verifyStatus: 'unverified' 
        }
      };

      await merchantApi.updateProfile(payload);
      
      message.success('提交成功，资料将进入审核流程');
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || error.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
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
          name="businessLicensePhoto"
          valuePropName="fileList"  // 🔥 修复点 4：配合下面的 normFile，这里必须是 fileList 才能正确回显图片
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