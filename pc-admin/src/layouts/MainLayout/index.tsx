import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip, Avatar } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MERCHANT_MENU } from '@/config/menu'; // 引入刚才抽离的菜单


const { Header, Sider, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 根据当前 URL 自动选中菜单项
  const selectedKey = location.pathname;

  // 全屏切换逻辑
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // 菜单点击处理
  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      // 处理退出逻辑
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      // 路由跳转
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* === 侧边栏 === */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        
        {/* 用户简略信息 (参考代码里的 UserBox) */}
        {!collapsed && (
          <div style={{ padding: '0 20px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
             <Avatar size={64} src="https://ui-avatars.com/api/?name=Admin" />
             <div style={{ marginTop: 10 }}>欢迎回来, 商户</div>
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={MERCHANT_MENU}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* === 右侧主体 === */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        
        {/* 顶部 Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {/* 左侧：收缩按钮 + 全屏按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Tooltip title={isFullscreen ? "退出全屏" : "全屏"}>
              <Button 
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
                onClick={toggleFullScreen}
                style={{ width: 40, height: 40 }} // 调整按钮大小和收缩按钮适配
              />
            </Tooltip>
          </div>

          {/* 右侧：欢迎回来 + 退出登录 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            color: '#999' 
          }}>
            <span>欢迎回来</span>
            <span 
              style={{ 
                color: '#f04141', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              退出登录
            </span>
          </div>
        </Header>

        {/* 内容区域 (核心变化：使用 Outlet) */}
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280, borderRadius: 8 }}>
          {/* 👇 这里是神奇的地方，子路由的内容会自动显示在这里 */}
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          E-Stay Hotel System ©2026 Created by Frontend Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;