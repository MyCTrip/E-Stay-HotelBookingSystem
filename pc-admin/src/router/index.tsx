import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import MainLayout from '@/layouts/MainLayout';
import HotelLayout from '@/pages/merchant/HotelEntry/HotelLayout';
import Manage from '@/pages/merchant/HotelEntry/Manage';

// ✅ 1. 引入新创建的 Profile 页面 (一定要检查路径是否正确)
import Profile from '@/pages/merchant/Profile'; 

import HotelEntry from '@/pages/merchant/HotelEntry'; 
import HotelList from '@/pages/merchant/HotelEntry/Rooms/HotelList';
import HotelForm from '@/pages/merchant/HotelEntry/HotelForm';
import HotelDetails from '@/pages/merchant/HotelEntry/Rooms/HotelDetails';

const RouterConfig: React.FC = () => {
  return useRoutes([
    { path: '/login', element: <Login /> },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/merchant/manage" replace /> },

        // 现有的 Dashboard / Entry
        { path: 'merchant/entry', element: <HotelEntry /> },
        { path: 'merchant/manage', element: <Manage /> },

        // ✅ 2. 在这里添加 Profile 路由！
        // 访问 /merchant/profile 时，渲染 Profile 组件
        { path: 'merchant/profile', element: <Profile /> },

        // Hotel Rooms 模块
        {
          path: 'merchant/hotels',
          element: <HotelLayout />,
          children: [
            { index: true, element: <HotelList /> },
            { path: 'new', element: <HotelForm /> },       
            { path: ':id/edit', element: <HotelForm /> },  
            { path: ':id', element: <HotelDetails /> },
          ]
        },
      ]
    },
    { path: '*', element: <div>404 Not Found</div> }
  ]);
};

export default RouterConfig;