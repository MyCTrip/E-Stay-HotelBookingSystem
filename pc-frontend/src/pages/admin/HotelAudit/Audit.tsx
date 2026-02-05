import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'antd';

const Audit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 定义 Tab 的样式逻辑
  // 这种写法完全复刻了 Beach Resort 的简洁风格
  const getTabStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: isActive ? 600 : 500,
      color: isActive ? '#1890ff' : '#666',
      borderBottom: isActive ? '3px solid #1890ff' : '3px solid transparent',
      transition: 'all 0.3s',
    };
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 白色卡片容器，贯穿整个右侧区域 */}
      <Card variant="borderless" styles={{ body: { padding: 0, minHeight: '80vh' } }}>
        {/* === 顶部 Tab 区域 === */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 24,
            padding: '0 12px',
          }}
        >
          {/* Tab 1: 列表 */}
          <div style={getTabStyle('/admin/Audit/merchants')} onClick={() => navigate('/admin/Audit/merchants')}>
            商户资料审核
          </div>

          {/* Tab 2: 新建 (点击直接在下方显示表单) */}
          <div
            style={getTabStyle('/admin/Audit/hotels')}
            onClick={() => navigate('/admin/Audit/hotels')}
          >
            酒店信息审核
          </div>
          <div
            style={getTabStyle('/admin/Audit/rooms')}
            onClick={() => navigate('/admin/Audit/rooms')}
          >
            房间信息审核
          </div>
        </div>

        {/* === 内容渲染区域 (Outlet) === */}
        {/* 这里的 Outlet 会根据路由自动变成 HotelList 或 HotelForm */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <Outlet />
        </div>
      </Card>
    </div>
  );
};

export default Audit;
