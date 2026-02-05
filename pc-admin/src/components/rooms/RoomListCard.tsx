import React from 'react';
import { Card, Form, Row, Col, Input, InputNumber, Select, Switch, Button, Empty } from 'antd';
import { TagOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

export const RoomListCard: React.FC = () => {
  return (
    <Card 
      title={<><TagOutlined /> 房型管理</>} 
      variant="borderless"
      style={{ marginBottom: 24 }} 
      extra={<span style={{ fontSize: 12, color: '#999' }}>* 至少录入一种房型</span>}
    >
      <Form.List name="rooms">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无房型" />}
            {fields.map(({ key, name, ...restField }, index) => (
              <Card key={key} type="inner" size="small" style={{ background: '#fafafa' }} title={`房型 #${index + 1}`} extra={fields.length > 1 ? <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button> : null}>
                <Row gutter={16}>
                  <Col span={8}><Form.Item {...restField} name={[name, 'name']} label="房型名称" rules={[{ required: true, message: '必填' }]}><Input placeholder="如：豪华江景房" /></Form.Item></Col>
                  <Col span={8}><Form.Item {...restField} name={[name, 'price']} label="单价 (元/晚)" rules={[{ required: true, message: '必填' }]}><InputNumber min={0} style={{ width: '100%' }} prefix="￥" /></Form.Item></Col>
                  <Col span={8}><Form.Item {...restField} name={[name, 'stock']} label="每日库存" rules={[{ required: true, message: '必填' }]}><InputNumber min={0} max={999} style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}><Form.Item {...restField} name={[name, 'size']} label="面积 (m²)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                  <Col span={12}><Form.Item {...restField} name={[name, 'facilities']} label="基础配套"><Select mode="tags" placeholder="输入后回车"><Option value="WiFi">WiFi</Option><Option value="有窗">有窗</Option><Option value="24h热水">24h热水</Option></Select></Form.Item></Col>
                  <Col span={6}><Form.Item {...restField} name={[name, 'hasBreakfast']} label="包含早餐" valuePropName="checked"><Switch checkedChildren="含早" unCheckedChildren="无早" /></Form.Item></Col>
                </Row>
              </Card>
            ))}
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8, height: 40 }}>添加新房型</Button>
          </div>
        )}
      </Form.List>
    </Card>
  );
};