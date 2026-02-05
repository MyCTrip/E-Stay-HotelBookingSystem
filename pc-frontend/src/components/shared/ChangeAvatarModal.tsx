import React, { useState } from 'react';
import { Modal, message, Alert } from 'antd';
import ImageUpload from '@/components/shared/ImageUpload'; // 引入你的通用组件
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (newAvatarUrl: string) => void;
}

const ChangeAvatarModal: React.FC<Props> = ({ visible, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleOk = () => {
    if (files.length === 0) {
      message.warning('请先选择一张图片');
      return;
    }

    setLoading(true);
    // 模拟上传请求 (真实开发这里用 formData 上传 files[0].originFileObj)
    setTimeout(() => {
      // 假设上传成功，后端返回了新 URL
      const mockNewUrl = files[0].preview || ''; 
      message.success('头像修改成功');
      onSuccess(mockNewUrl);
      setLoading(false);
      setFiles([]); // 清空选择
      onCancel();   // 关闭弹窗
    }, 1500);
  };

  return (
    <Modal
      title="修改头像"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={400}
      destroyOnClose
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ImageUpload 
        maxCount={1}  // 👈 业务参数：只能传1张
        maxSize={2}   // 限制2MB
        value={files} // 绑定状态
        onChange={(files) => setFiles(files)} 
        />
      </div>
    </Modal>
  );
};

export default ChangeAvatarModal;