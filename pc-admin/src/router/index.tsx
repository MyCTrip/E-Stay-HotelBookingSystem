import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import MainLayout from '@/layouts/MainLayout';
//商户端
import Dashboard from '@/pages/merchant/overview';
import Manage from '@/pages/merchant/HotelEntry/HotelManage';
import OrderManage from '@/pages/merchant/Orders';
import Profile from '@/pages/merchant/Profile'; 
import RoomManage from '@/pages/merchant/HotelEntry/RoomManage';
import HotelEntry from '@/pages/merchant/HotelEntry'; 
//管理员端
import HotelAudit from '@/pages/admin/HotelAudit/dashboard';
import Audit from '@/pages/admin/HotelAudit/Audit';
import Logs from '@/pages/admin/HotelAudit/Logs';
import AuditMerchants from '@/pages/admin/HotelAudit/Audit3/merchants';
import AuditHotel from '@/pages/admin/HotelAudit/Audit3/hotels';
import AuditRoom from '@/pages/admin/HotelAudit/Audit3/rooms';

const RouterConfig: React.FC = () => {
  return useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    // 2. 商户端路由
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // 1. 默认跳转逻辑：访问根路径 / 时，重定向到登录或商户端的仪表盘
        { index: true, element: <Navigate to="/login" replace /> },
        // 2. 商户端路由
        { path: 'merchant/overview', element: <Dashboard /> },
        // 现有的 Dashboard / Entry
        // { path: 'merchant/entry', element: <HotelEntry /> },
        { path: 'merchant/manage', element: <Manage /> },
        // 在这里添加 Profile 路由！
        // 访问 /merchant/profile 时，渲染 Profile 组件
        { path: 'merchant/profile', element: <Profile /> },
        // Hotel Rooms 模块
        {
          path: 'merchant/hotels', // 对应侧边栏的“房间信息”
          element: <RoomManage /> 
        },
        // 在这里添加 Orders 路由！
        // 访问 /merchant/orders 时，渲染 OrderManage 组件
        { path: 'merchant/orders', element: <OrderManage /> },

        // 3. 管理员端路由
        {
          path: 'admin/dashboard',
          element: <HotelAudit />,
        },
        {
          path: 'admin/Audit',
          element: <Audit />,
          children: [
            { index: true, element: <Navigate to="merchants" replace /> },
            { path: 'merchants', element: <AuditMerchants /> },
            { path: 'hotels', element: <AuditHotel /> },
            { path: 'rooms', element: <AuditRoom /> },
          ],
        },
        {
          path: 'admin/logs',
          element: <Logs />,
        },
      ]
    },
    { path: '*', element: <div>404 Not Found</div> }
  ]);
};

export default RouterConfig;