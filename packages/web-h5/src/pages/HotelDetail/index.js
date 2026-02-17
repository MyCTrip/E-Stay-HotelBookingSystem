import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useHotelStore } from '@estay/shared';
import styles from './index.module.css';
/**
 * 酒店详情页面
 */
export default function HotelDetailPage() {
    const { id } = useParams();
    const hotelStore = useHotelStore();
    const { data: hotel, isLoading } = useQuery({
        queryKey: ['hotel', id],
        queryFn: async () => {
            try {
                await hotelStore.fetchHotelDetail(id || '');
                return hotelStore.currentHotel;
            }
            catch (err) {
                console.error('Failed to fetch hotel:', err);
                return null;
            }
        },
        enabled: !!id,
    });
    if (isLoading) {
        return _jsx("div", { className: styles.loading, children: "\u52A0\u8F7D\u4E2D..." });
    }
    if (!hotel) {
        return _jsx("div", { className: styles.error, children: "\u9152\u5E97\u4E0D\u5B58\u5728\u6216\u52A0\u8F7D\u5931\u8D25" });
    }
    return (_jsxs("div", { className: styles.container, children: [_jsxs("section", { className: styles.gallery, children: [_jsx("div", { className: styles.mainImage, children: _jsx("img", { src: hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/800x400', alt: hotel.baseInfo?.nameCn }) }), _jsx("div", { className: styles.thumbnails, children: hotel.baseInfo?.images?.map((img, idx) => (_jsx("img", { src: img, alt: `Image ${idx}`, className: idx === 0 ? styles.active : '' }, idx))) })] }), _jsxs("section", { className: styles.info, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h1", { children: hotel.baseInfo?.nameCn }), _jsxs("div", { className: styles.meta, children: [_jsx("span", { className: styles.stars, children: '⭐'.repeat(hotel.baseInfo?.star || 3) }), _jsx("span", { className: styles.address, children: hotel.baseInfo?.address })] })] }) }), _jsx("p", { className: styles.description, children: hotel.baseInfo?.description }), hotel.baseInfo?.facilities && hotel.baseInfo.facilities.length > 0 && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u8BBE\u65BD" }), _jsx("div", { className: styles.facilitiesGrid, children: hotel.baseInfo.facilities.map((facility, idx) => (_jsxs("div", { className: styles.facility, children: [_jsx("strong", { children: facility.category }), _jsx("div", { dangerouslySetInnerHTML: { __html: facility.content } })] }, idx))) })] })), hotel.baseInfo?.policies && hotel.baseInfo.policies.length > 0 && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u653F\u7B56" }), _jsx("div", { className: styles.policiesGrid, children: hotel.baseInfo.policies.map((policy, idx) => (_jsxs("div", { className: styles.policy, children: [_jsx("strong", { children: policy.policyType }), _jsx("div", { dangerouslySetInnerHTML: { __html: policy.content } })] }, idx))) })] })), hotel.checkinInfo && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u5165\u4F4F\u4FE1\u606F" }), _jsxs("div", { className: styles.checkinInfo, children: [_jsxs("p", { children: [_jsx("strong", { children: "\u5165\u4F4F\u65F6\u95F4\uFF1A" }), " ", hotel.checkinInfo.checkinTime] }), _jsxs("p", { children: [_jsx("strong", { children: "\u9000\u623F\u65F6\u95F4\uFF1A" }), " ", hotel.checkinInfo.checkoutTime] })] })] })), _jsx("button", { className: styles.bookButton, children: "\u67E5\u770B\u623F\u95F4" })] })] }));
}
//# sourceMappingURL=index.js.map