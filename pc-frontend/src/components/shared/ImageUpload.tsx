import React, { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

// 定义通用的 Props
interface ImageUploadProps {
  // 1. 核心数据绑定 (支持 Form.Item 自动注入)
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;

  // 2. 业务配置 (由父组件决定)
  maxCount?: number;   // 最大张数 (头像=1, 相册=8, 不传则无限制)
  maxSize?: number;    // 最大体积 (MB)
  accept?: string;     // 允许的文件类型
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxCount,          // 不设默认值，undefined 表示无限制
  maxSize = 2,       // 默认 2MB
  accept = '.jpg,.jpeg,.png',
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 监听外部 value 变化 (比如表单回显，或者父组件重置了数据)
  useEffect(() => {
    // 只有当传入的 value 和内部不一致时才更新，防止死循环
    if (value && Array.isArray(value)) {
      setFileList(value);
    }
  }, [value]);

  // 触发改变，通知父组件
  const triggerChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
    if (onChange) {
      onChange(newFileList);
    }
  };

  // 1. 上传前校验
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // 校验大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB!`);
      return Upload.LIST_IGNORE; // 直接忽略，不加入列表
    }
    return false; // 返回 false，阻止 Antd 自动请求后端，改为手动管理
  };

  // 2. 文件状态改变 (选择、删除)
  const handleChange: UploadProps['onChange'] = async ({ file, fileList: newFileList }) => {
    // 如果是新上传的文件，生成本地预览 URL
    // 注意：我们要处理 newFileList，确保每个新文件都有 preview
    const processedList = await Promise.all(newFileList.map(async (item) => {
      if (!item.url && !item.preview && item.originFileObj) {
        item.preview = await getBase64(item.originFileObj);
      }
      return item;
    }));

    triggerChange(processedList);
  };

  // 3. 预览逻辑
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 辅助：转 Base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 动态渲染上传按钮：如果你已经传了 maxCount 张，按钮就消失
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <>
      <Upload
        accept={accept}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        {...(maxCount !== undefined && { maxCount })}
        multiple
      >
        {maxCount === undefined || fileList.length < maxCount ? uploadButton : null}
      </Upload>
      
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;