import React from 'react';
import { Card, Button, Space, Divider } from 'antd';
import { PlusOutlined, FileSearchOutlined, AuditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card title="快捷操作" variant="borderless" style={{ height: '100%', minHeight: 400 }}>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button type="primary" block icon={<PlusOutlined />} onClick={() => navigate('/merchant/manage')}>
            发布新房型
          </Button>
          <Button block icon={<AuditOutlined />}>
            处理退款申请
          </Button>
          <Button block icon={<FileSearchOutlined />}>
            查看入住报表
          </Button>
       </div>
       
       <Divider orientation="left" style={{ fontSize: 12, color: '#999' }}>系统公告</Divider>
       <div style={{ color: '#666', fontSize: 13 }}>
          <p>📢 2月15日系统停机维护通知</p>
          <p>🎉 春节期间商户结算规则调整</p>
       </div>
    </Card>
  );
};