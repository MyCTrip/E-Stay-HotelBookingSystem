import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import MainLayout from '@/layouts/MainLayout';
import HotelLayout from '@/pages/merchant/HotelEntry/HotelLayout';
import Manage from '@/pages/merchant/HotelEntry/Manage';


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
        // 默认跳转：你可以决定是跳去 manage 还是 entry
        { index: true, element: <Navigate to="/merchant/entry" replace /> },

        // /merchant/entry 访问
        { path: 'merchant/entry', element: <HotelEntry /> },

        // Manage 统计页
        { path: 'merchant/manage', element: <Manage /> },

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