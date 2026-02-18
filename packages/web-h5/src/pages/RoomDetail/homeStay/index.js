import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 房型详情抽屉栏 - 底部上滑展示房型完整信息
 */
import { useState, useEffect } from 'react';
import styles from './index.module.css';
import RoomDrawerBanner from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBanner';
import RoomDrawerBasicInfo from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBasicInfo';
import RoomDrawerFacilities from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerFacilities';
import RoomDrawerPolicy from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPolicy';
import RoomDrawerPrice from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPrice';
const RoomDetailDrawer = ({ room, isOpen, onClose, onBook, }) => {
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    useEffect(() => {
        if (isOpen) {
            // 延迟一帧以触发动画
            setTimeout(() => setIsAnimatingIn(true), 10);
        }
        else {
            setIsAnimatingIn(false);
        }
    }, [isOpen]);
    if (!room)
        return null;
    const handleBackdropClick = (e) => {
        if (e.currentTarget === e.target) {
            onClose();
        }
    };
    const handleBook = () => {
        onBook?.(room.id);
        onClose();
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`, onClick: handleBackdropClick }), _jsxs("div", { className: `${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), _jsxs("div", { className: styles.drawerContent, children: [_jsx(RoomDrawerBanner, { room: room }), _jsx(RoomDrawerBasicInfo, { room: room }), _jsx(RoomDrawerFacilities, { room: room }), _jsx(RoomDrawerPolicy, { room: room }), _jsx(RoomDrawerPrice, { room: room }), _jsx("div", { className: styles.drawerSpacer })] }), _jsx("div", { className: styles.drawerFooter, children: _jsxs("button", { className: styles.bookButton, onClick: handleBook, children: ["\u00A5", room.price, " \u9884\u8BA2\u6B64\u623F\u578B"] }) })] })] }));
};
export default RoomDetailDrawer;
//# sourceMappingURL=index.js.map