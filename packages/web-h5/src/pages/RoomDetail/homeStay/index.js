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
import RoomDrawerFeeNotice from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerFeeNotice';
import RoomDrawerPrice from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPrice';
import RoomPackageDetail from '../../../components/homestay/detail/RoomDetailDrawer/RoomPackageDetail';
import PropertyCardContainer from '../../../components/homestay/detail/PropertyCardContainer';
import { TipIcon } from '../../../components/homestay/icons';
const RoomDetailDrawer = ({ room, isOpen, onClose, onBook, scrollToFacilities = false, facilitiesExpanded = false, scrollToPolicy = false, scrollToFeeNotice = false, actualRoomName = '', checkIn, checkOut, }) => {
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [activeTab, setActiveTab] = useState('room');
    const facilitiesRef = useRef(null);
    const policyRef = useRef(null);
    const feeNoticeRef = useRef(null);
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
            // 如果需要定位到政策组件
            if (scrollToPolicy && policyRef.current && drawerContentRef.current) {
                setTimeout(() => {
                    const policyTop = policyRef.current?.offsetTop || 0;
                    if (drawerContentRef.current) {
                        drawerContentRef.current.scrollTop = policyTop;
                    }
                }, 150); // 等待动画完成后再滚动
            }
            // 如果需要定位到费用须知组件
            if (scrollToFeeNotice && feeNoticeRef.current && drawerContentRef.current) {
                setTimeout(() => {
                    const feeNoticeTop = feeNoticeRef.current?.offsetTop || 0;
                    if (drawerContentRef.current) {
                        drawerContentRef.current.scrollTop = feeNoticeTop;
                    }
                }, 150); // 等待动画完成后再滚动
            }
        }
        else {
            setIsAnimatingIn(false);
        }
    }, [isOpen, scrollToFacilities, scrollToPolicy, scrollToFeeNotice, room?.hasPackageDetail]);
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`, onClick: handleBackdropClick }), _jsxs("div", { className: `${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), room?.hasPackageDetail && (_jsxs("div", { className: styles.tabHeader, children: [_jsx("button", { className: `${styles.tabBtn} ${activeTab === 'room' ? styles.active : ''}`, onClick: () => setActiveTab('room'), children: "\u623F\u5C4B\u8BE6\u60C5" }), _jsx("button", { className: `${styles.tabBtn} ${activeTab === 'package' ? styles.active : ''}`, onClick: () => setActiveTab('package'), children: "\u5957\u9910\u8BE6\u60C5" })] })), _jsxs("div", { className: styles.drawerContent, ref: drawerContentRef, children: [(activeTab === 'room' || !room?.hasPackageDetail) && (_jsxs(_Fragment, { children: [_jsx(RoomDrawerBanner, { room: room, showTabHeader: Boolean(room?.hasPackageDetail) }), _jsx(PropertyCardContainer, { showLabel: false, showExpandBtn: false, children: _jsx(RoomDrawerBasicInfo, { room: room, actualRoomName: actualRoomName }) }), _jsx("div", { ref: facilitiesRef, children: _jsx(PropertyCardContainer, { showExpandBtn: false, headerConfig: {
                                                show: true,
                                                title: {
                                                    text: '设施/服务',
                                                    show: true,
                                                }
                                            }, children: _jsx(RoomDrawerFacilities, { room: room, expandedInitially: facilitiesExpanded }) }) }), _jsx("div", { ref: policyRef, children: _jsx(PropertyCardContainer, { showExpandBtn: false, headerConfig: {
                                                show: true,
                                                title: {
                                                    text: '预订须知',
                                                    show: true,
                                                },
                                                tipTag: {
                                                    show: true,
                                                    icon: TipIcon,
                                                    text: '以下规则由房东制定，请仔细读并遵守',
                                                }
                                            }, children: _jsx(RoomDrawerPolicy, { room: room }) }) }), _jsx("div", { ref: feeNoticeRef, children: _jsx(RoomDrawerFeeNotice, { room: room, deposit: 500, standardGuests: 2, joinNumber: 2, joinPrice: 100, otherDescription: "\u623F\u4E1C\u8981\u6C42\u8BF7\u4FDD\u6301\u623F\u95F4\u6574\u6D01\uFF0C\u4E0D\u53EF\u5728\u623F\u95F4\u5185\u5438\u70DF\uFF0C\u5BA0\u7269\u9700\u63D0\u524D\u6C9F\u901A\u3002", showOther: true }) }), _jsx(PropertyCardContainer, { headerConfig: {
                                            show: true,
                                            title: {
                                                text: '价格和优惠',
                                                show: true,
                                            },
                                        }, children: _jsx(RoomDrawerPrice, { room: room, checkIn: checkIn, checkOut: checkOut }) }), _jsx("div", { className: styles.drawerSpacer })] })), room?.hasPackageDetail && activeTab === 'package' && _jsx(RoomPackageDetail, { room: room })] })] })] }));
};
export default RoomDetailDrawer;
//# sourceMappingURL=index.js.map