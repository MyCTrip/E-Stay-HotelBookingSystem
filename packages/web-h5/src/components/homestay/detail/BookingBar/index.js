import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 底部固定预订栏
 * 左侧：房东头像按钮 + 时间选择 | 右侧：预订按钮
 */
import { useState, useRef } from 'react';
import styles from './index.module.scss';
import SlideDrawer from '../../../homestay/shared/SlideDrawer';
import DateRangeCalendar from '../../home/DateRangeCalendar';
const BookingBar = ({ data, checkIn, checkOut, onBook, onContactHost, onDateChange, onSave, onCancel, isEditing = false }) => {
    // 获取房东信息和价格 - 不使用默认值，直接使用 data 属性
    const hostAvatar = data?.host?.avatar;
    const hostName = data?.host?.name;
    const price = data?.price;
    // 日期格式化辅助函数 - 将 YYYY-MM-DD 或其他格式转换为 MM-DD
    const formatToMMDD = (dateStr) => {
        if (!dateStr)
            return '';
        // 如果是 YYYY-MM-DD 格式，提取 MM-DD
        if (dateStr.includes('-') && dateStr.length === 10) {
            const parts = dateStr.split('-');
            return `${parts[1]}-${parts[2]}`;
        }
        // 如果已经是 MM-DD 格式或其他格式，直接返回
        return dateStr;
    };
    // 日期状态 - 使用 Props 提供的初始值，并格式化为 MM-DD
    const [checkInDate, setCheckInDate] = useState(formatToMMDD(checkIn));
    const [checkOutDate, setCheckOutDate] = useState(formatToMMDD(checkOut));
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
    const handleSave = () => {
        onSave?.();
    };
    const handleCancel = () => {
        onCancel?.();
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.bookingBar, children: [!isEditing && hostAvatar && hostName && (_jsxs("button", { className: styles.hostButton, onClick: handleContactHost, title: `联系房东 - ${hostName}`, children: [_jsx("img", { src: hostAvatar, alt: hostName, className: styles.hostAvatar }), _jsx("span", { className: styles.tooltip, children: "\u804A\u5929" })] })), _jsxs("div", { className: styles.dateArea, ref: dateAreaRef, onClick: handleOpenCalendar, children: [_jsxs("div", { className: styles.dateItem, children: [_jsx("label", { className: styles.dateLabel, children: "\u5165\u4F4F" }), _jsx("div", { className: styles.dateInput, children: checkInDate })] }), _jsx("div", { className: styles.separator, children: "-" }), _jsxs("div", { className: styles.dateItem, children: [_jsx("label", { className: styles.dateLabel, children: "\u79BB\u4F4F" }), _jsx("div", { className: styles.dateInput, children: checkOutDate })] })] }), _jsxs("div", { className: styles.priceAndBooking, children: [typeof price === 'number' && price > 0 && (_jsxs("div", { className: styles.priceInfo, children: [_jsx("span", { className: styles.priceLabel, children: "\u00A5" }), _jsx("span", { className: styles.priceValue, children: price }), _jsx("span", { className: styles.priceUnit, children: "/\u665A" })] })), _jsx("button", { className: styles.bookBtn, onClick: onBook, title: "\u7ACB\u5373\u9884\u8BA2", children: "\u7ACB\u5373\u9884\u8BA2" })] })] }), _jsx(SlideDrawer, { visible: showCalendar, direction: "down", source: "screen", position: "top", elementRef: dateAreaRef, onClose: () => setShowCalendar(false), onToggle: (isOpen) => isOpen && setShowCalendar(true), showBackButton: false, showHeader: false, children: _jsx(DateRangeCalendar, { onSelect: handleDateChange, onClose: () => setShowCalendar(false) }) })] }));
};
export default BookingBar;
//# sourceMappingURL=index.js.map