import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// 引入你的三个页面组件
// 只要上面的文件创建正确，这些红色波浪线保存后就会消失
import Login from '@/pages/auth/Login';
import HotelEntry from '@/pages/merchant/HotelEntry';
import HotelAudit from '@/pages/admin/HotelAudit';

// 如果你之前保留了 MainLayout，可以在这里引入，没有的话先注释掉
// import MainLayout from '@/layouts/MainLayout';

const RouterConfig: React.FC = () => {
  const element = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      // element: <MainLayout />, // 如果有布局组件，取消注释这一行
      // 暂时用一个简单的 Outlet 容器替代布局，防止报错
      element: <div style={{ minHeight: '100vh' }}>{/* 这里未来放 Layout */}<HotelEntry /></div>, 
      children: [
        // 1. 默认跳转逻辑：访问根路径 / 时，重定向到登录或商户端
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        // 2. 商户端路由
        {
          path: 'merchant/entry',
          element: <HotelEntry />,
        },
        // 3. 管理员端路由
        {
          path: 'admin/audit',
          element: <HotelAudit />,
        },
      ],
    },
    // 404 页面
    {
      path: '*',
      element: <div style={{ textAlign: 'center', marginTop: 50 }}>404 Not Found</div>,
    }
  ]);

  return element;
};

export default RouterConfig;