import React from 'react';
import { Card, Form, Row, Col, Input, Select, Button } from 'antd';
import { CompassOutlined, PlusOutlined, MinusCircleOutlined, GiftOutlined } from '@ant-design/icons';

const { Option } = Select;

export const MarketingCard: React.FC = () => {
  return (
    <Card title={<><CompassOutlined /> 周边与优惠 (辅助生成简介)</>} variant="borderless" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        {/* 左栏：周边 */}
        <Col span={12}>
          <div style={{ marginBottom: 16, fontWeight: 500 }}>周边交通/景点</div>
          <Form.List name="nearbyList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={6}><Form.Item name={[name, 'type']} noStyle><Select placeholder="类型"><Option value="地铁">地铁</Option><Option value="景点">景点</Option><Option value="商圈">商圈</Option></Select></Form.Item></Col>
                    <Col span={10}><Form.Item name={[name, 'name']} noStyle><Input placeholder="名称" /></Form.Item></Col>
                    <Col span={6}><Form.Item name={[name, 'distance']} noStyle><Input placeholder="距离" /></Form.Item></Col>
                    <Col span={2}><MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} /></Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加周边信息</Button>
              </>
            )}
          </Form.List>
        </Col>
        {/* 右栏：优惠 */}
        <Col span={12}>
          <div style={{ marginBottom: 16, fontWeight: 500 }}>优惠活动</div>
          <Form.List name="discountRules">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={8}><Form.Item name={[name, 'title']} noStyle><Input placeholder="活动标题" /></Form.Item></Col>
                    <Col span={6}><Form.Item name={[name, 'type']} noStyle><Select placeholder="方式"><Option value="折扣">折扣</Option><Option value="立减">立减</Option></Select></Form.Item></Col>
                    <Col span={8}><Form.Item name={[name, 'value']} noStyle><Input placeholder="内容 (如8折)" /></Form.Item></Col>
                    <Col span={2}><MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} /></Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<GiftOutlined />}>添加优惠规则</Button>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Card>
  );
};