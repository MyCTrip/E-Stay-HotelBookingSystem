import { createBrowserRouter, RouterProviderProps } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/Home'
import SearchResultPage from '../pages/SearchResult'
import HotelDetailPage from '../pages/HotelDetail'
import RoomDetailPage from '../pages/RoomDetail'
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
        path: '',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchResultPage />,
      },
      {
        path: 'hotel/:id',
        element: <HotelDetailPage />,
      },
      {
        path: 'room/:id',
        element: <RoomDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default router
