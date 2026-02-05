import React from 'react';
import { Card, Button, Typography, Statistic, Row, Col } from 'antd';
import { ShopOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss'; // 还是复用之前的样式文件

const { Title, Paragraph } = Typography;

const HotelAudit: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>管理员工作台</Title>
        <Paragraph type="secondary">欢迎回来！在这里审核商户及其提交的酒店信息。</Paragraph>
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
                onClick={() => navigate('/admin/Audit/merchants')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                审核商户资料
              </Button>

              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/Audit/hotels')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                审核酒店信息
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/Audit/rooms')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                审核房间信息
              </Button>
              <Button
                size="large"
                icon={<UnorderedListOutlined />}
                onClick={() => navigate('/admin/logs')}
                style={{ height: '80px', width: '200px', fontSize: '16px' }}
              >
                查看审核日志
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧：数据概览 (静态展示，后续可接 API) */}
        <Col span={8}>
          <Card className={styles.card}>
            <Statistic title="待审核商户" value={12} prefix={<ShopOutlined />} />
            <div style={{ marginTop: 16 }}>
              <Statistic title="待审核酒店" value={25} valueStyle={{ color: '#faad14' }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HotelAudit;
