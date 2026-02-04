import React from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ImageUpload: React.FC = () => {
  return (
    <>
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={() => false} // 阻止自动上传
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
      </Upload>
      <div style={{ color: '#999', fontSize: 12 }}>(开发阶段：暂未对接后端OSS，仅做UI展示)</div>
    </>
  );
};

export default ImageUpload;
