import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useHotelStore } from '@estay/shared';
import styles from './index.module.css';
/**
 * 搜索结果页面
 */
export default function SearchResultPage() {
    const [searchParams] = useSearchParams();
    const hotelStore = useHotelStore();
    const propertyType = hotelStore.searchParams?.propertyType;
    const city = searchParams.get('city') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    // 从 store 获取酒店数据
    const { data: hotels = [] } = useQuery({
        queryKey: ['hotels', { city, checkIn, checkOut, propertyType }],
        queryFn: async () => {
            try {
                await hotelStore.fetchHotels({ city, checkIn, checkOut });
                return hotelStore.hotels;
            }
            catch (err) {
                console.error('Failed to fetch hotels:', err);
                return [];
            }
        },
        enabled: !!city,
    });
    if (!city) {
        return (_jsx("div", { className: styles.container, children: _jsx("div", { className: styles.empty, children: _jsx("p", { children: "\u8BF7\u8F93\u5165\u641C\u7D22\u6761\u4EF6" }) }) }));
    }
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { children: "\u641C\u7D22\u7ED3\u679C" }), _jsxs("p", { children: [city, " \u00B7 ", checkIn, " \u81F3 ", checkOut] })] }), hotels.length === 0 ? (_jsx("div", { className: styles.empty, children: _jsx("p", { children: "\u672A\u627E\u5230\u9152\u5E97\uFF0C\u8BF7\u5C1D\u8BD5\u8C03\u6574\u641C\u7D22\u6761\u4EF6" }) })) : (_jsx("div", { className: styles.hotelList, children: hotels.map((hotel) => (_jsxs(Link, { to: `/hotel/${hotel._id}`, className: styles.hotelCard, children: [_jsx("div", { className: styles.image, children: _jsx("img", { src: hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/300x200', alt: hotel.baseInfo?.nameCn }) }), _jsxs("div", { className: styles.content, children: [_jsx("h3", { children: hotel.baseInfo?.nameCn }), _jsxs("div", { className: styles.rating, children: [_jsx("span", { className: styles.stars, children: '⭐'.repeat(hotel.baseInfo?.star || 3) }), _jsxs("span", { className: styles.star, children: [hotel.baseInfo?.star, " \u661F"] })] }), _jsx("p", { className: styles.address, children: hotel.baseInfo?.address }), _jsx("p", { className: styles.description, children: hotel.baseInfo?.description }), _jsxs("div", { className: styles.footer, children: [_jsxs("span", { className: styles.price, children: ["\u00A5", hotel.baseInfo?.price || '0', "/\u665A"] }), _jsx("span", { className: styles.cta, children: "\u67E5\u770B\u8BE6\u60C5 \u2192" })] })] })] }, hotel._id))) }))] }));
}
//# sourceMappingURL=index.js.map