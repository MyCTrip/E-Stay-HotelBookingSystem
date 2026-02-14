import React from 'react';
import { Card, Input, Radio, Space } from 'antd';

interface Props {
  status: string;
  onStatusChange: (val: string) => void;
  onSearch: (val: string) => void;
}

export const OrderFilter: React.FC<Props> = ({ status, onStatusChange, onSearch }) => {
  return (
    <Card variant="borderless" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Radio.Group value={status} onChange={(e) => onStatusChange(e.target.value)} buttonStyle="solid">
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="paid">待入住</Radio.Button>
          <Radio.Button value="checked_in">入住中</Radio.Button>
          <Radio.Button value="completed">已离店</Radio.Button>
          <Radio.Button value="cancelled">已取消</Radio.Button>
        </Radio.Group>

        <Space>
          <Input.Search 
            placeholder="搜索订单号/姓名/手机" 
            onSearch={onSearch} 
            style={{ width: 300 }} 
            allowClear
          />
        </Space>
      </div>
    </Card>
  );
};