import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useHotelStore } from '@estay/shared';
import styles from './index.module.css';
/**
 * 房型详情页面
 */
export default function RoomDetailPage() {
    const { id } = useParams();
    const hotelStore = useHotelStore();
    const { data: room, isLoading } = useQuery({
        queryKey: ['room', id],
        queryFn: async () => {
            try {
                await hotelStore.fetchRoomDetail(id || '');
                return hotelStore.currentRoom;
            }
            catch (err) {
                console.error('Failed to fetch room:', err);
                return null;
            }
        },
        enabled: !!id,
    });
    if (isLoading) {
        return _jsx("div", { className: styles.loading, children: "\u52A0\u8F7D\u4E2D..." });
    }
    if (!room) {
        return _jsx("div", { className: styles.error, children: "\u623F\u95F4\u4E0D\u5B58\u5728\u6216\u52A0\u8F7D\u5931\u8D25" });
    }
    return (_jsxs("div", { className: styles.container, children: [_jsx("section", { className: styles.gallery, children: _jsx("img", { src: room.baseInfo?.images?.[0] || 'https://via.placeholder.com/800x400', alt: room.baseInfo?.type, className: styles.mainImage }) }), _jsxs("section", { className: styles.info, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h1", { children: room.baseInfo?.type }), _jsxs("p", { className: styles.price, children: ["\u00A5", room.baseInfo?.price, "/\u665A"] })] }) }), _jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u5BA2\u5BB9\u91CF" }), _jsxs("p", { children: ["\u6700\u591A\u53EF\u5BB9\u7EB3 ", room.baseInfo?.maxOccupancy, " \u4F4D\u5BA2\u4EBA"] })] }), room.headInfo && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u623F\u95F4\u8BBE\u65BD" }), _jsxs("div", { className: styles.features, children: [_jsxs("div", { className: styles.feature, children: [_jsx("span", { children: "\uD83D\uDCD0 \u623F\u95F4\u5927\u5C0F" }), _jsx("strong", { children: room.headInfo.size })] }), room.headInfo.floor && (_jsxs("div", { className: styles.feature, children: [_jsx("span", { children: "\uD83D\uDCCD \u6240\u5728\u697C\u5C42" }), _jsx("strong", { children: room.headInfo.floor })] })), _jsxs("div", { className: styles.feature, children: [_jsxs("span", { children: [room.headInfo.wifi ? '📡' : '❌', " WiFi"] }), _jsx("strong", { children: room.headInfo.wifi ? '有' : '无' })] }), _jsxs("div", { className: styles.feature, children: [_jsxs("span", { children: [room.headInfo.windowAvailable ? '🪟' : '❌', " \u7A97\u6237"] }), _jsx("strong", { children: room.headInfo.windowAvailable ? '有' : '无' })] }), _jsxs("div", { className: styles.feature, children: [_jsx("span", { children: "\uD83D\uDEAD \u5438\u70DF" }), _jsx("strong", { children: room.headInfo.smokingAllowed ? '允许' : '不允许' })] })] })] })), room.bedInfo && room.bedInfo.length > 0 && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u5E8A\u4F4D\u4FE1\u606F" }), room.bedInfo.map((bed, idx) => (_jsxs("div", { className: styles.bedItem, children: [_jsx("strong", { children: bed.bedType }), _jsxs("p", { children: ["\u6570\u91CF: ", bed.bedNumber, " | \u5C3A\u5BF8: ", bed.bedSize] })] }, idx)))] })), room.breakfastInfo && (_jsxs("div", { className: styles.section, children: [_jsx("h2", { children: "\u65E9\u9910" }), _jsx("p", { children: room.breakfastInfo.breakfastType })] })), _jsx("button", { className: styles.bookButton, children: "\u7ACB\u5373\u9884\u8BA2" })] })] }));
}
//# sourceMappingURL=index.js.map