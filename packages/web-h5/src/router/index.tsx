import { createBrowserRouter, RouterProviderProps } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { Navigate } from 'react-router-dom'
import HomePage from '../pages/Home'
import HomeHotel from '../pages/Home/hotel'
import HomeHourly from '../pages/Home/hourlyHotel'
import HomeHomeStay from '../pages/Home/homeStay'
import SearchResultPage from '../pages/SearchResult'
// import SearchResultHotel from '../pages/SearchResult/hotel'
import SearchResultHotel from '../pages/SearchResult/hotel-list'
import SearchResultHourly from '../pages/SearchResult/hourlyHotel'
import SearchResultHomeStay from '../pages/SearchResult/homeStay'
import HotelDetailPage from '../pages/HotelDetail'
import HotelDetailHotel from '../pages/HotelDetail/hotel'
import HotelDetailHourly from '../pages/HotelDetail/hourlyHotel'
import HotelDetailHomeStay from '../pages/HotelDetail/homeStay'
import RoomDetailPage from '../pages/RoomDetail'
import RoomDetailHotel from '../pages/RoomDetail/hotel'
import RoomDetailHourly from '../pages/RoomDetail/hourlyHotel'
import RoomDetailHomeStay from '../pages/RoomDetail/homeStay'
import NotFoundPage from '../pages/NotFound'

/**
 * 应用路由配置
 */
export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/hotel" replace />,
      },
      {
        path: 'home/hotel',
        element: <HomeHotel />,
      },
      {
        path: 'hotel',
        element: <HomeHotel />,
      },
      {
        path: 'home/hourlyHotel',
        element: <HomeHourly />,
      },
      {
        path: 'hourlyHotel',
        element: <HomeHourly />,
      },
      {
        path: 'home/homeStay',
        element: <HomeHomeStay />,
      },
      {
        path: 'homeStay',
        element: <HomeHomeStay />,
      },
      // ✅ 改造后的 search 父子嵌套路由
      {
        path: 'search',
        element: <SearchResultPage />,
        // 核心：添加 children 数组，包含所有 search 子页面
        children: [
          {
            path: 'hotel', // 自动拼接为 search/hotel，无需写完整路径
            element: <SearchResultHotel />,
          },
          {
            path: 'hourlyHotel', // 自动拼接为 search/hourlyHotel
            element: <SearchResultHourly />,
          },
          {
            path: 'homeStay', // 自动拼接为 search/homeStay
            element: <SearchResultHomeStay />,
          },
        ]
      },
      // ❌ 已删除原来的三个平级 search/xxx 路由
      {
        path: 'hotel/:id',
        element: <HotelDetailPage />,
      },
      {
        path: 'hotel/:id/hotel',
        element: <HotelDetailHotel />,
      },
      {
        path: 'hotel/:id/hourlyHotel',
        element: <HotelDetailHourly />,
      },
      {
        path: 'hotel/:id/homeStay',
        element: <HotelDetailHomeStay />,
      },
      {
        path: 'room/:id',
        element: <RoomDetailPage />,
      },
      {
        path: 'room/:id/hotel',
        element: <RoomDetailHotel />,
      },
      {
        path: 'room/:id/hourlyHotel',
        element: <RoomDetailHourly />,
      },
      {
        path: 'room/:id/homeStay',
        element: <RoomDetailHomeStay />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default router
