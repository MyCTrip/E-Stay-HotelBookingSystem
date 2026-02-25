import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 房型选择区 - 核心转化模块
 */
import { useState } from 'react';
import RoomCard from '../RoomCard';
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay';
import styles from './index.module.scss';
// 模拟房型数据
const mockRooms = [
    {
        id: '1',
        name: '市景五室二厅套房',
        area: '190㎡',
        beds: '5床 | 1.8m大床',
        guests: '12人',
        image: 'https://picsum.photos/240/320?random=room1',
        price: 1280,
        priceNote: '晚/起',
        benefits: ['免费WiFi', '免费停车', '房间内免费WiFi'],
        packageCount: 3,
        showBreakfastTag: true,
        breakfastCount: 2,
        showCancelTag: true,
        hasPackageDetail: true,
    },
    {
        id: '2',
        name: '惠选经典三室一厅套房',
        area: '95㎡',
        beds: '3床 | 1.8m大床',
        guests: '6人',
        image: 'https://picsum.photos/240/320?random=room2',
        price: 840,
        priceNote: '晚/起',
        benefits: ['免费WiFi', '免费停车'],
        packageCount: 2,
        showBreakfastTag: true,
        breakfastCount: 0,
        showCancelTag: true,
        hasPackageDetail: true,
    },
    {
        id: '3',
        name: '温馨二室二厅套房',
        area: '95㎡',
        beds: '2床 | 1.8m大床',
        guests: '4人',
        image: 'https://picsum.photos/240/320?random=room3',
        price: 1189,
        priceNote: '晚/起',
        benefits: ['免费WiFi'],
        packageCount: 1,
        showBreakfastTag: true,
        breakfastCount: 1,
        showCancelTag: false,
        hasPackageDetail: false,
    },
    {
        id: '4',
        name: '豪华单床间',
        area: '45㎡',
        beds: '1床 | 1.5m大床',
        guests: '2人',
        image: 'https://picsum.photos/240/320?random=room4',
        price: 520,
        priceNote: '晚/起',
        benefits: ['免费WiFi'],
        packageCount: 1,
        showBreakfastTag: false,
        breakfastCount: 0,
        showCancelTag: false,
        hasPackageDetail: false,
    },
    {
        id: '5',
        name: '亲子家庭房',
        area: '120㎡',
        beds: '2床 | 1.8m+1.5m',
        guests: '6人',
        image: 'https://picsum.photos/240/320?random=room5',
        price: 1050,
        priceNote: '晚/起',
        benefits: ['免费停车', '儿童福利'],
        packageCount: 2,
        showBreakfastTag: true,
        breakfastCount: 2,
        showCancelTag: true,
        hasPackageDetail: false,
    },
];
const RoomSelection = ({ rooms, displayCount }) => {
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // 使用传入的 rooms，如果没有则使用 mockRooms
    const roomsToDisplay = rooms || mockRooms;
    // 使用传入的 displayCount，如果没有则显示全部
    const itemsToShow = displayCount !== undefined ? roomsToDisplay.slice(0, displayCount) : roomsToDisplay;
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
    return (_jsxs("div", { className: styles.roomSelection, children: [_jsx("div", { className: styles.roomList, children: itemsToShow.map((room) => (_jsx(RoomCard, { room: room, isExpanded: expandedRoomId === room.id, onToggleExpand: () => handleToggleExpand(room.id), onViewDetails: handleViewDetails, onOpenDetail: handleViewDetails }, room.id))) }), _jsx(RoomDetailDrawer, { room: selectedRoom, isOpen: isDrawerOpen, onClose: handleCloseDrawer, onBook: handleBooking })] }));
};
export default RoomSelection;
//# sourceMappingURL=index.js.map