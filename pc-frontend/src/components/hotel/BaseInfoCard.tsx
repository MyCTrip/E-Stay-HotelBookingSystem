import React from 'react';
import { Card, Form, Row, Col, Input, DatePicker, Rate, Divider } from 'antd';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/shared/ImageUpload';

const { TextArea } = Input;

export const BaseInfoCard: React.FC = () => {
  // 处理 Upload 组件的值转换
  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Card title={<><HomeOutlined /> 基础信息</>} variant="borderless" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="酒店中文名称" name="nameCn" rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="例如：易宿大酒店" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="英文名称" name="nameEn">
            <Input placeholder="E.g. E-Stay Hotel" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="所在城市" name="city" rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="例如：上海" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '必填' }]}>
            <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder="详细地址" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="酒店星级" name="star">
            <Rate allowHalf />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="开业时间" name="openTime">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item 
        label="酒店封面/相册" 
        name="images" 
        valuePropName="value" // 注意：ImageUpload 使用 value 接收数据
        getValueFromEvent={normFile}
      >
        <ImageUpload maxCount={8} maxSize={5} />
      </Form.Item>

      <Form.Item label="酒店简介" name="description">
        <TextArea rows={3} showCount maxLength={800} placeholder="酒店简介..." />
      </Form.Item>
    </Card>
  );
};