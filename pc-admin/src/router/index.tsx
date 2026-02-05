import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import MainLayout from '@/layouts/MainLayout';
// import HotelLayout from '@/pages/merchant/HotelEntry/HotelLayout';
import Dashboard from '@/pages/merchant/overview';
import Manage from '@/pages/merchant/HotelEntry/HotelManage';
import OrderManage from '@/pages/merchant/Orders';
import Profile from '@/pages/merchant/Profile'; 

import HotelEntry from '@/pages/merchant/HotelEntry'; 
// import HotelList from '@/pages/merchant/HotelEntry/Rooms/HotelList';
// import HotelForm from '@/pages/merchant/HotelEntry/HotelForm';
// import HotelDetails from '@/pages/merchant/HotelEntry/Rooms/HotelDetails';

import RoomManage from '@/pages/merchant/HotelEntry/RoomManage';


const RouterConfig: React.FC = () => {
  return useRoutes([
    { path: '/login', element: <Login /> },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/merchant/overview" replace /> },

        { path: 'merchant/overview', element: <Dashboard /> },

        // 现有的 Dashboard / Entry
        // { path: 'merchant/entry', element: <HotelEntry /> },
        { path: 'merchant/manage', element: <Manage /> },

        // ✅ 2. 在这里添加 Profile 路由！
        // 访问 /merchant/profile 时，渲染 Profile 组件
        { path: 'merchant/profile', element: <Profile /> },

        // Hotel Rooms 模块
        {
          path: 'merchant/hotels', // 对应侧边栏的“房间信息”
          element: <RoomManage /> 
        },

        // ✅ 3. 在这里添加 Orders 路由！
        // 访问 /merchant/orders 时，渲染 OrderManage 组件
        { path: 'merchant/orders', element: <OrderManage /> },
      ]
    },
    { path: '*', element: <div>404 Not Found</div> }
  ]);
};

export default RouterConfig;