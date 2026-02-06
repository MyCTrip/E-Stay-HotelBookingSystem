import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';

// 引入拆分的组件
import { WelcomeCard } from '@/components/Dashboard/WelcomeCard';
import { StatsOverview } from '@/components/Dashboard/StatsOverview';
import { SalesTrendChart } from '@/components/Dashboard/SalesTrendChart';
import { QuickActions } from '@/components/Dashboard/QuickActions';

// 定义数据接口 (以后这一块可以移到 types/dashboard.d.ts)
interface DashboardData {
  orders: number;
  sales: number;
  visitors: number;
  rooms: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    orders: 0,
    sales: 0,
    visitors: 0,
    rooms: 0
  });

  // === 模拟 API 请求 ===
  // 真实开发时，这里替换为 useEffect(() => { api.getDashboardStats()... }, [])
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟后端返回的数据
        const mockResponse = {
          orders: 112,
          sales: 98500,
          visitors: 3200,
          rooms: 8
        };
        
        setData(mockResponse);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {/* 1. 顶部欢迎区 (静态，不依赖数据) */}
      <WelcomeCard />

      {/* 2. 核心指标区 (依赖数据) */}
      <div style={{ marginBottom: 24 }}>
        <StatsOverview loading={loading} data={data} />
      </div>

      {/* 3. 图表与操作区 (左右布局) */}
      <Row gutter={24}>
        <Col span={16} xs={24} md={16}>
          <SalesTrendChart loading={loading} />
        </Col>
        <Col span={8} xs={24} md={8}>
          <QuickActions />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;