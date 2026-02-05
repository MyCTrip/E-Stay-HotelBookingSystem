import React from 'react';
import { Card, Form, Row, Col, Input, InputNumber } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export const PolicyCard: React.FC = () => {
  return (
    <Card title={<><ClockCircleOutlined /> 入住政策</>} variant="borderless" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label="最早入住时间" name={['checkinInfo', 'checkinTime']} rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="如: 14:00" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="最晚退房时间" name={['checkinInfo', 'checkoutTime']} rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="如: 12:00" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="早餐类型" name={['checkinInfo', 'breakfastType']}>
            <Input placeholder="如: 自助餐" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="早餐价格" name={['checkinInfo', 'breakfastPrice']}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="￥" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};