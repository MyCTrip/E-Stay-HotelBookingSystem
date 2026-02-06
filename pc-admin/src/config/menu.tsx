// src/config/menu.tsx
import {
  DashboardOutlined,
  HomeOutlined,
  FileProtectOutlined,
  UserOutlined,
  LogoutOutlined,
  BankOutlined,     
  AppstoreOutlined  
} from '@ant-design/icons';

export const MERCHANT_MENU = [
  {
    key: '/merchant/overview',
    icon: <DashboardOutlined />,
    label: '仪表盘'
  },
  // 👇 修改这里：变成二级菜单
  {
    key: 'hotel-management', // 父级菜单的 key，只要唯一即可
    icon: <HomeOutlined />,
    label: '酒店管理',
    children: [
      {
        key: '/merchant/manage', // 对应路由: 酒店信息 (Manage.tsx 或 HotelDetails)
        icon: <BankOutlined />,
        label: '酒店信息'
      },
      {
        key: '/merchant/hotels', // 对应路由: 房间列表 (HotelList.tsx)
        icon: <AppstoreOutlined />,
        label: '房间信息'
      }
    ]
  },
  {
    key: '/merchant/orders',
    icon: <FileProtectOutlined />,
    label: '订单管理'
  },
  {
    key: '/merchant/profile',
    icon: <UserOutlined />,
    label: '个人资料'
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