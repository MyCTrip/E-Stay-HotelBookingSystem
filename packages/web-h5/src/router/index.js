import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/Home';
import SearchResultPage from '../pages/SearchResult';
import HotelDetailPage from '../pages/HotelDetail';
import RoomDetailPage from '../pages/RoomDetail';
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
                path: '',
                element: _jsx(HomePage, {}),
            },
            {
                path: 'search',
                element: _jsx(SearchResultPage, {}),
            },
            {
                path: 'hotel/:id',
                element: _jsx(HotelDetailPage, {}),
            },
            {
                path: 'room/:id',
                element: _jsx(RoomDetailPage, {}),
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