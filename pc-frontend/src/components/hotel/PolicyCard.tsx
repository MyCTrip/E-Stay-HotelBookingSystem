import React from 'react';
import { Card, Form, TimePicker, Input, Select, Checkbox, Row, Col, Divider } from 'antd';
import { ClockCircleOutlined, AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { HOTEL_FACILITIES } from '@/config/hotelOptions'; // 记得创建这个文件

const { TextArea } = Input;

export const PolicyCard: React.FC = () => {
  return (
    <Card title="服务与政策" className="mb-24" style={{ marginBottom: 24 }}>
      
      {/* === 1. 入住政策 (对应 checkinInfo 和 baseInfo.policies) === */}
      <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>
        <ClockCircleOutlined /> 入住规则
      </Divider>
      
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label="最早入住时间" name={['checkinInfo', 'checkinTime']} rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="最晚退房时间" name={['checkinInfo', 'checkoutTime']} rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
            <Form.Item label="早餐类型" name={['checkinInfo', 'breakfastType']}>
                <Select placeholder="请选择">
                    <Select.Option value="自助">自助餐</Select.Option>
                    <Select.Option value="单点">单点</Select.Option>
                    <Select.Option value="无">无早餐</Select.Option>
                </Select>
            </Form.Item>
        </Col>
        <Col span={6}>
            <Form.Item label="早餐价格" name={['checkinInfo', 'breakfastPrice']}>
                <Input prefix="¥" suffix="/人" />
            </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
          <Col span={12}>
            <Form.Item 
                label="宠物政策" 
                name={['policies', 'pet']} 
                rules={[{ required: true, message: '请选择宠物政策' }]}
            >
                <Select>
                    <Select.Option value="不可携带宠物">🚫 不可携带宠物</Select.Option>
                    <Select.Option value="允许携带宠物">🐶 允许携带宠物 (可能收费)</Select.Option>
                </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item label="取消规则" name={['policies', 'cancellation']}>
                 <Input placeholder="例如：入住当天18:00前可免费取消" />
             </Form.Item>
          </Col>
      </Row>

      {/* === 2. 设施服务 (对应 baseInfo.facilities) === */}
      <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>
        <AppstoreOutlined /> 设施服务
      </Divider>

      <p style={{ color: '#999', fontSize: 12, marginBottom: 16 }}>勾选酒店提供的设施，这些信息将展示在移动端详情页。</p>

      {HOTEL_FACILITIES.map((group) => (
        <Form.Item key={group.category} label={group.category} name={['facilities', group.category]}>
          <Checkbox.Group>
             <Row>
                {group.options.map(opt => (
                    <Col span={8} key={opt} style={{ marginBottom: 8 }}>
                        <Checkbox value={opt}>{opt}</Checkbox>
                    </Col>
                ))}
             </Row>
          </Checkbox.Group>
        </Form.Item>
      ))}
      
      {/* 补充说明 */}
      <Form.Item label="其他入离需知" name={['policies', 'other']}>
         <TextArea rows={3} placeholder="如有其他特殊规定，请在此补充..." />
      </Form.Item>
      
    </Card>
  );
};