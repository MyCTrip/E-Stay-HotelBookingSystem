import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 房型选择区 - 核心转化模块
 */
import { useState } from 'react';
import RoomCard from '../RoomCard';
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay';
import styles from './index.module.scss';
// 已删除所有硬编码的 mockRooms 数据
const RoomSelection = ({ rooms, displayCount, onSelectRoom, checkIn, checkOut, facilities, policies, feeInfo, }) => {
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedPackageId, setSelectedPackageId] = useState(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // 类型转换函数：直接使用中间件提供的房间数据，无默认值
    const convertRoom = (room) => {
        return {
            id: room._id || room.id,
            name: room.name,
            area: room.area,
            beds: room.beds,
            guests: room.guests,
            image: room.image,
            priceList: room.priceList,
            priceNote: room.priceNote,
            benefits: room.benefits,
            packageCount: room.packageCount,
            confirmTime: room.confirmTime,
            hasPackageDetail: room.hasPackageDetail,
            // 映射新增字段
            showBreakfastTag: room.showBreakfastTag,
            breakfastCount: room.breakfastCount,
            showCancelTag: room.showCancelTag,
            cancelMunite: room.cancelMunite,
            // 映射套餐数组
            packages: room.packages,
        };
    };
    // 直接使用传入的 rooms 数据，无默认值
    const convertedRooms = Array.isArray(rooms) ? rooms.map(convertRoom) : [];
    // 使用传入的 displayCount，如果没有则显示全部
    const itemsToShow = displayCount !== undefined ? convertedRooms.slice(0, displayCount) : convertedRooms;
    const handleToggleExpand = (roomId) => {
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };
    const handleViewDetails = (room, packageId) => {
        setSelectedRoom(room);
        setSelectedPackageId(packageId);
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
    return (_jsxs("div", { className: styles.roomSelection, children: [_jsx("div", { className: styles.roomList, children: itemsToShow.map((room) => (_jsx(RoomCard, { room: room, isExpanded: expandedRoomId === room.id, onToggleExpand: () => handleToggleExpand(room.id), onViewDetails: handleViewDetails, onOpenDetail: handleViewDetails }, room.id))) }), _jsx(RoomDetailDrawer, { room: selectedRoom, selectedPackageId: selectedPackageId, isOpen: isDrawerOpen, onClose: handleCloseDrawer, onBook: handleBooking, checkIn: checkIn, checkOut: checkOut, facilitiesData: facilities, policiesData: policies, feeInfoData: feeInfo })] }));
};
export default RoomSelection;
//# sourceMappingURL=index.js.map