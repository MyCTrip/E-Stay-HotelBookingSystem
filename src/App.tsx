import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HotelList from './pages/HotelList'
import HotelDetail from './pages/HotelDetail'

/**
 * 规范化路由定义（Data Router 架构）
 * 好处：清晰的层级结构，便于维护和日后跨平台扩展
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'hotels',
        element: <HotelList />,
      },
      {
        path: 'hotels/:id',
        element: <HotelDetail />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
