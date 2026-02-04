import {
  DashboardOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

// 商户菜单
export const MERCHANT_MENU = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '概览',
  },
  {
    key: '/merchant/profile',
    icon: <ShopOutlined />,
    label: '商户资料',
  },
  {
    key: '/merchant/hotels',
    icon: <FileTextOutlined />,
    label: '我的酒店', // 对应 Hotel CRUD
  },
];

// 管理员菜单
export const ADMIN_MENU = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/admin/audit',
    icon: <SafetyCertificateOutlined />,
    label: '酒店审核', // 对应 Audit flows
  },
  {
    key: '/admin/logs',
    icon: <FileTextOutlined />,
    label: '操作日志', // 对应 AuditLog
  },
];
