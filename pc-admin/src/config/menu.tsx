// src/config/menu.tsx
import {
  DashboardOutlined,
  HomeOutlined,
  FileProtectOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';

// 商户端菜单
export const MERCHANT_MENU = [
  {
    key: '/merchant/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘 (Dashboard)'
  },
  {
    key: '/merchant/hotels',
    icon: <HomeOutlined />,
    label: '酒店管理 (Hotel Rooms)'
  },
  {
    key: '/merchant/orders',
    icon: <FileProtectOutlined />,
    label: '订单管理 (Orders)'
  },
  {
    key: '/merchant/profile',
    icon: <UserOutlined />,
    label: '个人资料 (Profile)'
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
    danger: true
  }
];

// 如果有管理员端，也可以写在这里
export const ADMIN_MENU = [ ];