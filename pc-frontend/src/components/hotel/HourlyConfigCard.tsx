import React from 'react';
import { Card, Row, Col, InputNumber, Form } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

// 固定的时间段配置：每天8:00-22:00
const FIXED_TIME_SLOTS = [
  { dayOfWeek: 0, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 1, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 2, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 3, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 4, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 5, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
  { dayOfWeek: 6, startTime: '08:00', endTime: '22:00', minStayHours: 2, maxBookingsPerSlot: 10, content: '' },
];

export const HourlyConfigCard: React.FC = () => {
  const form = Form.useFormInstance();

  // 初始化固定的timeSlots
  React.useEffect(() => {
    form?.setFieldValue(['typeConfig', 'hourly', 'baseConfig', 'timeSlots'], FIXED_TIME_SLOTS);
  }, [form]);

  return (
    <Card title={<><ClockCircleOutlined /> 钟点房配置</>} variant="borderless" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="每小时价格" name={['typeConfig', 'hourly', 'baseConfig', 'pricePerHour']} rules={[{ required: true, message: '请输入每小时价格' }]}>
            <InputNumber min={0} placeholder="例如：50" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="最少租住时长(h)" name={['typeConfig', 'hourly', 'baseConfig', 'minimumHours']} rules={[{ required: true, message: '请输入最少租住时长' }]}>
            <InputNumber min={0.5} step={0.5} placeholder="例如：2" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="每日最多预订数" name={['typeConfig', 'hourly', 'baseConfig', 'maxBookingsPerDay']} rules={[{ required: true, message: '请输入每日最多预订数' }]}>
            <InputNumber min={1} placeholder="例如：4" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="清洁时间(分钟)" name={['typeConfig', 'hourly', 'baseConfig', 'cleaningTime']} rules={[{ required: true, message: '请输入清洁时间' }]}>
            <InputNumber min={0} placeholder="例如：45" />
          </Form.Item>
        </Col>
      </Row>

    </Card>
  );
};
