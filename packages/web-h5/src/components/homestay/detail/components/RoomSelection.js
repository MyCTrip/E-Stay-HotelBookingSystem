import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 房型选择区 - 核心转化模块
 */
import { useState } from 'react';
import DatePicker from './DatePicker';
import RoomCard from './RoomCard';
import RoomDetailDrawer from './RoomDetailDrawer';
import styles from './RoomSelection.module.scss';
// 模拟房型数据
const mockRooms = [
    {
        id: '1',
        name: '市景五室二厅套房',
        area: '190㎡',
        beds: '5床 | 1.8m大床',
        guests: '12人',
        image: 'https://picsum.photos/100/100?random=room1',
        price: 1280,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车', '房间内免费WiFi'],
        packageCount: 3,
    },
    {
        id: '2',
        name: '惠选经典三室一厅套房',
        area: '95㎡',
        beds: '3床 | 1.8m大床',
        guests: '6人',
        image: 'https://picsum.photos/100/100?random=room2',
        price: 840,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车'],
        packageCount: 2,
    },
    {
        id: '3',
        name: '温馨二室二厅套房',
        area: '95㎡',
        beds: '2床 | 1.8m大床',
        guests: '4人',
        image: 'https://picsum.photos/100/100?random=room3',
        price: 1189,
        priceNote: '含税',
        benefits: ['免费WiFi'],
        packageCount: 1,
    },
];
const RoomSelection = ({ data }) => {
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleToggleExpand = (roomId) => {
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };
    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setIsDrawerOpen(true);
    };
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedRoom(null), 300); // 等待动画完成后清除数据
    };
    const handleBooking = (roomId) => {
        console.log('预订房型:', roomId);
        // 这里可以添加预订逻辑
    };
    return (_jsxs("div", { className: styles.roomSelection, children: [_jsx(DatePicker, {}), _jsxs("div", { className: styles.header, children: [_jsx("h2", { className: styles.title, children: "\u9009\u62E9\u623F\u578B" }), _jsxs("p", { className: styles.subtitle, children: ["\u5171", mockRooms.length, "\u4E2A\u623F\u578B"] })] }), _jsx("div", { className: styles.roomList, children: mockRooms.map((room) => (_jsx(RoomCard, { room: room, isExpanded: expandedRoomId === room.id, onToggleExpand: () => handleToggleExpand(room.id), onViewDetails: handleViewDetails }, room.id))) }), _jsx(RoomDetailDrawer, { room: selectedRoom, isOpen: isDrawerOpen, onClose: handleCloseDrawer, onBook: handleBooking })] }));
};
export default RoomSelection;
//# sourceMappingURL=RoomSelection.js.map