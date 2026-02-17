import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { Navigate } from 'react-router-dom'
import HomeHotel from '../pages/Home/hotel'
import HomeHourly from '../pages/Home/hourlyHotel'
import HomeHomeStay from '../pages/Home/homeStay'
import SearchResultPage from '../pages/SearchResult'
import SearchResultHomeStay from '../pages/SearchResult/homeStay'
import SearchResultHotel from '../pages/SearchResult/hotel'
import SearchResultHourly from '../pages/SearchResult/hourlyHotel'
import HotelDetailPage from '../pages/HotelDetail'
import HotelDetailHotel from '../pages/HotelDetail/hotel'
import HotelDetailHourly from '../pages/HotelDetail/hourlyHotel'
import HomeStayDetailPage from '../pages/HotelDetail/homeStay'
import RoomDetailPage from '../pages/RoomDetail'
import RoomDetailHotel from '../pages/RoomDetail/hotel'
import RoomDetailHourly from '../pages/RoomDetail/hourlyHotel'
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // HomeStay 详情页 - 不使用 MainLayout 包裹
  {
    path: '/homeStay/:id',
    element: <HomeStayDetailPage />,
  },
  {
    path: '/homeStay/:id/homeStay',
    element: <HomeStayDetailPage />,
  },
  {
    path: '/search',
    element: <SearchResultPage />,
  },
  {
    path: '/search/homeStay',
    element: <SearchResultHomeStay />,
  },
  {
    path: '/search/hotel',
    element: <SearchResultHotel />,
  },
  {
    path: '/search/hourlyHotel',
    element: <SearchResultHourly />,
  },
])

export default router
