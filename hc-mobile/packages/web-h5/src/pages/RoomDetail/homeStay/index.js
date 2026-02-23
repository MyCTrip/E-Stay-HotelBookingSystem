import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 房型详情抽屉栏 - 底部上滑展示房型完整信息
 */
import { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import RoomDrawerBanner from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBanner';
import RoomDrawerBasicInfo from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBasicInfo';
import RoomDrawerFacilities from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerFacilities';
import RoomDrawerPolicy from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPolicy';
import RoomDrawerPrice from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPrice';
import RoomPackageDetail from '../../../components/homestay/detail/RoomDetailDrawer/RoomPackageDetail';
const RoomDetailDrawer = ({ room, isOpen, onClose, onBook, scrollToFacilities = false, facilitiesExpanded = false, }) => {
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [activeTab, setActiveTab] = useState('room');
    const facilitiesRef = useRef(null);
    const drawerContentRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            // 延迟一帧以触发动画
            setTimeout(() => setIsAnimatingIn(true), 10);
            // 如果房间没有套餐详情，强制使用room tab
            if (!room?.hasPackageDetail) {
                setActiveTab('room');
            }
            // 如果需要定位到设施组件
            if (scrollToFacilities && facilitiesRef.current && drawerContentRef.current) {
                setTimeout(() => {
                    const facilitiesTop = facilitiesRef.current?.offsetTop || 0;
                    if (drawerContentRef.current) {
                        drawerContentRef.current.scrollTop = facilitiesTop;
                    }
                }, 150); // 等待动画完成后再滚动
            }
        }
        else {
            setIsAnimatingIn(false);
        }
    }, [isOpen, scrollToFacilities, room?.hasPackageDetail]);
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`, onClick: handleBackdropClick }), _jsxs("div", { className: `${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), room?.hasPackageDetail && (_jsxs("div", { className: styles.tabHeader, children: [_jsx("button", { className: `${styles.tabBtn} ${activeTab === 'room' ? styles.active : ''}`, onClick: () => setActiveTab('room'), children: "\u623F\u5C4B\u8BE6\u60C5" }), _jsx("button", { className: `${styles.tabBtn} ${activeTab === 'package' ? styles.active : ''}`, onClick: () => setActiveTab('package'), children: "\u5957\u9910\u8BE6\u60C5" })] })), _jsxs("div", { className: styles.drawerContent, ref: drawerContentRef, children: [(activeTab === 'room' || !room?.hasPackageDetail) && (_jsxs(_Fragment, { children: [_jsx(RoomDrawerBanner, { room: room, showTabHeader: Boolean(room?.hasPackageDetail) }), _jsx(RoomDrawerBasicInfo, { room: room }), _jsx(RoomDrawerFacilities, { ref: facilitiesRef, room: room, expandedInitially: facilitiesExpanded }), _jsx(RoomDrawerPolicy, { room: room }), _jsx(RoomDrawerPrice, { room: room }), _jsx("div", { className: styles.drawerSpacer })] })), room?.hasPackageDetail && activeTab === 'package' && (_jsx(RoomPackageDetail, { room: room }))] })] })] }));
};
export default RoomDetailDrawer;
//# sourceMappingURL=index.js.map