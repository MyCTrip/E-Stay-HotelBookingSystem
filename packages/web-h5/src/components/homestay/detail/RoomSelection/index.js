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
        confirmTime: 30,
        showBreakfastTag: true,
        breakfastCount: 2,
        showCancelTag: true,
        hasPackageDetail: true,
        discounts: [
            { name: '钻石贵宾', description: '钻石贵宾享受', amount: 230 },
            { name: '连住优惠', description: '连住3晚及以上', amount: 138 },
            { name: '扫零取整', description: '价格优化', amount: 2 },
        ],
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
        confirmTime: 30,
        showBreakfastTag: true,
        breakfastCount: 0,
        showCancelTag: true,
        hasPackageDetail: true,
        discounts: [
            { name: '早鸟优惠', description: '提前30天预订', amount: 100 },
            { name: '会员折扣', description: 'VIP 会员', amount: 50 },
        ],
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
        confirmTime: 30,
        showBreakfastTag: true,
        breakfastCount: 1,
        showCancelTag: false,
        hasPackageDetail: false,
        discounts: [],
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
        confirmTime: 30,
        showBreakfastTag: false,
        breakfastCount: 0,
        showCancelTag: false,
        hasPackageDetail: false,
        discounts: [
            { name: '平台优惠', description: '平台满减', amount: 50 },
        ],
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
        confirmTime: 30,
        showBreakfastTag: true,
        breakfastCount: 2,
        showCancelTag: true,
        hasPackageDetail: false,
        discounts: [
            { name: '家庭优惠', description: '亲子房特享', amount: 150 },
            { name: '套餐折扣', description: '多晚更优惠', amount: 80 },
        ],
    },
];
const RoomSelection = ({ rooms, displayCount, onSelectRoom, checkIn, checkOut }) => {
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // 类型转换函数：将外部Room类型转换为本地Room类型
    const convertRoom = (room) => {
        // 如果已经是本地Room格式，直接返回
        if (room.id && room.name && room.area && room.confirmTime !== undefined) {
            return room;
        }
        // 否则从共享包的Room类型转换
        return {
            id: room._id || room.id,
            name: room.roomDisplayData?.name || room.name,
            area: room.roomDisplayData?.area || room.area,
            beds: room.roomDisplayData?.beds || room.beds,
            guests: room.roomDisplayData?.guests || room.guests,
            image: room.roomDisplayData?.image || room.image || room.baseInfo?.images?.[0],
            price: room.baseInfo?.price || room.price,
            priceNote: room.priceNote || '晚/起',
            benefits: room.benefits || [],
            packageCount: room.packageCount || 1,
            confirmTime: room.confirmTime || 30,
        };
    };
    // 使用传入的 rooms，如果没有则使用 mockRooms
    const rawRooms = rooms || mockRooms;
    const convertedRooms = Array.isArray(rawRooms) ? rawRooms.map(convertRoom) : mockRooms;
    // 使用传入的 displayCount，如果没有则显示全部
    const itemsToShow = displayCount !== undefined ? convertedRooms.slice(0, displayCount) : convertedRooms;
    const handleToggleExpand = (roomId) => {
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };
    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setIsDrawerOpen(true);
        onSelectRoom?.(room);
    };
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedRoom(null), 300); // 等待动画完成后清除数据
    };
    const handleBooking = (roomId) => {
        console.log('预订房型:', roomId);
        // 这里可以添加预订逻辑
    };
    return (_jsxs("div", { className: styles.roomSelection, children: [_jsx("div", { className: styles.roomList, children: itemsToShow.map((room) => (_jsx(RoomCard, { room: room, isExpanded: expandedRoomId === room.id, onToggleExpand: () => handleToggleExpand(room.id), onViewDetails: handleViewDetails, onOpenDetail: handleViewDetails }, room.id))) }), _jsx(RoomDetailDrawer, { room: selectedRoom, isOpen: isDrawerOpen, onClose: handleCloseDrawer, onBook: handleBooking, checkIn: checkIn, checkOut: checkOut })] }));
};
export default RoomSelection;
//# sourceMappingURL=index.js.map