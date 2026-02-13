import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Navigate } from 'react-router-dom';
import HomeHotel from '../pages/Home/hotel';
import HomeHourly from '../pages/Home/hourlyHotel';
import HomeHomeStay from '../pages/Home/homeStay';
import SearchResultPage from '../pages/SearchResult';
import SearchResultHotel from '../pages/SearchResult/hotel';
import SearchResultHourly from '../pages/SearchResult/hourlyHotel';
import SearchResultHomeStay from '../pages/SearchResult/homeStay';
import HotelDetailPage from '../pages/HotelDetail';
import HotelDetailHotel from '../pages/HotelDetail/hotel';
import HotelDetailHourly from '../pages/HotelDetail/hourlyHotel';
import HotelDetailHomeStay from '../pages/HotelDetail/homeStay';
import RoomDetailPage from '../pages/RoomDetail';
import RoomDetailHotel from '../pages/RoomDetail/hotel';
import RoomDetailHourly from '../pages/RoomDetail/hourlyHotel';
import RoomDetailHomeStay from '../pages/RoomDetail/homeStay';
import NotFoundPage from '../pages/NotFound';
/**
 * 应用路由配置
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(MainLayout, {}),
        errorElement: _jsx(NotFoundPage, {}),
        children: [
            {
                path: "/",
                element: _jsx(Navigate, { to: "/hotel", replace: true }),
            },
            {
                path: 'home/hotel',
                element: _jsx(HomeHotel, {}),
            },
            {
                path: 'hotel',
                element: _jsx(HomeHotel, {}),
            },
            {
                path: 'home/hourlyHotel',
                element: _jsx(HomeHourly, {}),
            },
            {
                path: 'hourlyHotel',
                element: _jsx(HomeHourly, {}),
            },
            {
                path: 'home/homeStay',
                element: _jsx(HomeHomeStay, {}),
            },
            {
                path: 'homeStay',
                element: _jsx(HomeHomeStay, {}),
            },
            {
                path: 'search',
                element: _jsx(SearchResultPage, {}),
            },
            {
                path: 'search/hotel',
                element: _jsx(SearchResultHotel, {}),
            },
            {
                path: 'search/hourlyHotel',
                element: _jsx(SearchResultHourly, {}),
            },
            {
                path: 'search/homeStay',
                element: _jsx(SearchResultHomeStay, {}),
            },
            {
                path: 'hotel/:id',
                element: _jsx(HotelDetailPage, {}),
            },
            {
                path: 'hotel/:id/hotel',
                element: _jsx(HotelDetailHotel, {}),
            },
            {
                path: 'hotel/:id/hourlyHotel',
                element: _jsx(HotelDetailHourly, {}),
            },
            {
                path: 'hotel/:id/homeStay',
                element: _jsx(HotelDetailHomeStay, {}),
            },
            {
                path: 'room/:id',
                element: _jsx(RoomDetailPage, {}),
            },
            {
                path: 'room/:id/hotel',
                element: _jsx(RoomDetailHotel, {}),
            },
            {
                path: 'room/:id/hourlyHotel',
                element: _jsx(RoomDetailHourly, {}),
            },
            {
                path: 'room/:id/homeStay',
                element: _jsx(RoomDetailHomeStay, {}),
            },
            {
                path: '*',
                element: _jsx(NotFoundPage, {}),
            },
        ],
    },
]);
export default router;
//# sourceMappingURL=index.js.map