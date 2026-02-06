import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  PayCircleOutlined, 
  HomeOutlined,
  ArrowUpOutlined 
} from '@ant-design/icons';

// 定义 Props 类型，方便父组件传数据
interface StatsData {
  orders: number;
  sales: number;
  visitors: number;
  rooms: number;
}

interface Props {
  loading: boolean;
  data?: StatsData;
}

export const StatsOverview: React.FC<Props> = ({ loading, data }) => {
  return (
    <Row gutter={24}>
      <Col span={6}>
        <Card variant="borderless" loading={loading} hoverable>
          <Statistic 
            title="今日订单" 
            value={data?.orders || 0} 
            prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
            suffix={<small style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> +5%</small>} 
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" loading={loading} hoverable>
          <Statistic 
            title="总销售额" 
            value={data?.sales || 0} 
            precision={2} 
            prefix={<PayCircleOutlined style={{ color: '#faad14' }} />}
            suffix="CNY"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" loading={loading} hoverable>
          <Statistic 
            title="预订人数" 
            value={data?.visitors || 0} 
            prefix={<UserOutlined style={{ color: '#eb2f96' }} />} 
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" loading={loading} hoverable>
          <Statistic 
            title="在售房型" 
            value={data?.rooms || 0} 
            prefix={<HomeOutlined style={{ color: '#52c41a' }} />} 
          />
        </Card>
      </Col>
    </Row>
  );
};