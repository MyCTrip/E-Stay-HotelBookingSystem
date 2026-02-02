import React from 'react';
import { Card, Button, Typography, Statistic, Row, Col } from 'antd';
import { ShopOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss'; // 还是复用之前的样式文件

const { Title, Paragraph } = Typography;

const HotelEntry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>商户工作台</Title>
        <Paragraph type="secondary">欢迎回来！在这里管理您的酒店资产和房型数据。</Paragraph>
      </div>

      <Row gutter={24}>
        {/* 左侧：快捷入口 */}
        <Col span={16}>
          <Card title="快捷操作" className={styles.card}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/merchant/hotels/new')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                发布新酒店
              </Button>

              <Button
                size="large"
                icon={<UnorderedListOutlined />}
                onClick={() => navigate('/merchant/hotels')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                管理我的酒店
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧：数据概览 (静态展示，后续可接 API) */}
        <Col span={8}>
          <Card className={styles.card}>
            <Statistic title="已发布酒店" value={1} prefix={<ShopOutlined />} />
            <div style={{ marginTop: 16 }}>
              <Statistic title="待审核房型" value={0} valueStyle={{ color: '#faad14' }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HotelEntry;
