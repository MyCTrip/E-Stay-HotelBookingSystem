import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 底部固定预订栏
 * 左侧：房东头像按钮 + 时间选择 | 右侧：预订按钮
 */
import { useState, useRef } from 'react';
import styles from './index.module.scss';
import SlideDrawer from '../../../homestay/shared/SlideDrawer';
import DateRangeCalendar from '../../home/DateRangeCalendar';
const BookingBar = ({ data, onBook, onContactHost, onDateChange }) => {
    // 获取房东信息
    const hostAvatar = data?.host?.avatar || 'https://picsum.photos/40/40?random=host';
    const hostName = data?.host?.name || '房东';
    // 日期状态
    const [checkInDate, setCheckInDate] = useState('02-22');
    const [checkOutDate, setCheckOutDate] = useState('02-23');
    const [showCalendar, setShowCalendar] = useState(false);
    const dateAreaRef = useRef(null);
    const handleContactHost = () => {
        onContactHost?.();
    };
    const handleDateChange = (checkIn, checkOut) => {
        const checkInStr = `${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`;
        const checkOutStr = `${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`;
        setCheckInDate(checkInStr);
        setCheckOutDate(checkOutStr);
        onDateChange?.(checkInStr, checkOutStr);
        setShowCalendar(false);
    };
    const handleOpenCalendar = () => {
        setShowCalendar(true);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.bookingBar, children: [_jsxs("button", { className: styles.hostButton, onClick: handleContactHost, title: `联系房东 - ${hostName}`, children: [_jsx("img", { src: hostAvatar, alt: hostName, className: styles.hostAvatar }), _jsx("span", { className: styles.tooltip, children: "\u804A\u5929" })] }), _jsxs("div", { className: styles.dateArea, ref: dateAreaRef, onClick: handleOpenCalendar, children: [_jsxs("div", { className: styles.dateItem, children: [_jsx("label", { className: styles.dateLabel, children: "\u5165\u4F4F" }), _jsx("div", { className: styles.dateInput, children: checkInDate })] }), _jsx("div", { className: styles.separator, children: "-" }), _jsxs("div", { className: styles.dateItem, children: [_jsx("label", { className: styles.dateLabel, children: "\u79BB\u4F4F" }), _jsx("div", { className: styles.dateInput, children: checkOutDate })] })] }), _jsx("button", { className: styles.bookBtn, onClick: onBook, children: "\u7ACB\u5373\u9884\u8BA2" })] }), _jsx(SlideDrawer, { visible: showCalendar, direction: "down", source: "screen", position: "top", elementRef: dateAreaRef, onClose: () => setShowCalendar(false), onToggle: (isOpen) => isOpen && setShowCalendar(true), showBackButton: false, showHeader: false, children: _jsx(DateRangeCalendar, { onSelect: handleDateChange, onClose: () => setShowCalendar(false) }) })] }));
};
export default BookingBar;
//# sourceMappingURL=index.js.map