// import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined
} from '@ant-design/icons';

// 如果你需要保留管理员菜单，可以保留这个 import，否则可以删掉
// import { ADMIN_MENU } from '@/config/menu';

const { Header, Sider, Content } = Layout;

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 获取用户角色
  let role = 'merchant';
  try {
    const userStr =
      localStorage.getItem('user') || localStorage.getItem('BEACH-RESORT-USER-STORAGE');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.role) role = user.role;
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage', err); 
  }

  // 2. 定义最新的商户菜单 (完全对应我们的新开发计划)
  const NEW_MERCHANT_MENU = [
    {
      key: '/merchant/entry', // 之前的仪表盘，或者 '/dashboard'
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/merchant/manage', // ✅ 新增: Manage (对应图中的 User/Manage)
      icon: <AppstoreOutlined />,
      label: 'Manage',
    },
    {
      key: '/merchant/hotels', // ✅ 核心: Hotel Rooms (带 Tab 的容器)
      icon: <HomeOutlined />,
      label: 'Hotel Rooms',
    },
    {
      key: '/merchant/profile', // 个人资料 (保留占位)
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider', // 分割线
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true, // 红色文字，表示危险操作
    },
  ];
  const ADMIN_MENU = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/Audit',
      icon: <SafetyCertificateOutlined />,
      label: 'Audit',
    },
    {
      key: '/admin/logs',
      icon: <FileTextOutlined />,
      label: 'Logs',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true, // 红色文字，表示危险操作
    },
  ]
  // 3. 根据角色选择菜单
  const menuItems: any = role === 'admin' ? ADMIN_MENU : NEW_MERCHANT_MENU;

  // 4. 计算当前选中的菜单 Key (支持子路由高亮)
  // 比如访问 /merchant/hotels/new 时，也能高亮 /merchant/hotels
  const activeKey =
    menuItems.find((m: any) => m.key && location.pathname.startsWith(m.key))?.key || '';

  // 5. 处理菜单点击
  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* 左侧边栏 */}
      <Sider width={240} breakpoint="lg" collapsedWidth="0" style={{ height: '100vh' }}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          易宿后台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[activeKey]}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* 右侧主体 */}
      <Layout style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100vh' }}>
        {/* 顶部 Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: '#999' }}>欢迎回来</span>
            <Button type="link" danger onClick={() => handleMenuClick({ key: 'logout' })}>
              退出登录
            </Button>
          </div>
        </Header>

        {/* 内容区域 (Scrollable) */}
        <Content style={{ margin: 16, overflowY: 'auto', flex: 1, position: 'relative' }}>
          {/* 使用 100% 宽高确保 Outlet 里的容器能撑开 */}
          <div style={{ minHeight: '100%' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
