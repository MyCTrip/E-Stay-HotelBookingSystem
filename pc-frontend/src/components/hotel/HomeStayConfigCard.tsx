import React from 'react';
import { Card, Form, Row, Col, Input, InputNumber, Checkbox, Select, Tag } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export const HomeStayConfigCard: React.FC = () => {
  return (
    <Card title={<><HomeOutlined /> 民宿配置</>} variant="borderless" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="主人名称" name={['typeConfig', 'homestay', 'hostName']}>
            <Input placeholder="例如：小王" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="主人电话" name={['typeConfig', 'homestay', 'hostPhone']}>
            <Input placeholder="例如：13800000000" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="回复时间(小时)" name={['typeConfig', 'homestay', 'responseTimeHours']}>
            <InputNumber min={0} placeholder="例如：2" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="最少入住天数" name={['typeConfig', 'homestay', 'minStay']}>
            <InputNumber min={1} placeholder="例如：1" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="最长入住天数" name={['typeConfig', 'homestay', 'maxStay']}>
            <InputNumber min={1} placeholder="不限则留空" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item 
            label="取消政策" 
            name={['typeConfig', 'homestay', 'cancellationPolicy']}
            initialValue="moderate"
          >
            <Select placeholder="选择取消政策">
              <Select.Option value="flexible">灵活（可随时取消）</Select.Option>
              <Select.Option value="moderate">温和（7天内免费取消）</Select.Option>
              <Select.Option value="strict">严格（3天内免费取消）</Select.Option>
              <Select.Option value="non_refundable">不可退（不支持取消）</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="安全押金(元)" name={['typeConfig', 'homestay', 'securityDeposit']}>
            <InputNumber min={0} placeholder="例如：500" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="允许即时预订"
        name={['typeConfig', 'homestay', 'instantBooking']}
        valuePropName="checked"
        initialValue={true}
      >
        <Checkbox>启用即时预订（无需房主确认）</Checkbox>
      </Form.Item>

      <Form.Item label="设施标签" name={['typeConfig', 'homestay', 'amenityTags']}>
        <Select
          mode="multiple"
          placeholder="选择该民宿的特色设施标签"
          options={[
            { label: '🏊 游泳池', value: 'swimming_pool' },
            { label: '🚴 自行车', value: 'bicycle' },
            { label: '😺 宠物友好', value: 'pet_friendly' },
            { label: '🧘 瑜伽垫', value: 'yoga_mat' },
            { label: '🎮 游戏机', value: 'gaming' },
            { label: '🎸 乐器', value: 'musical_instruments' },
            { label: '📚 书籍', value: 'books' },
            { label: '🧩 棋牌游戏', value: 'board_games' },
            { label: '🌳 花园', value: 'garden' },
            { label: '🔥 壁炉', value: 'fireplace' },
            { label: '🎬 电影院', value: 'home_theater' },
            { label: '⚽ 乒乓球', value: 'ping_pong' },
          ]}
        />
      </Form.Item>
    </Card>
  );
};
