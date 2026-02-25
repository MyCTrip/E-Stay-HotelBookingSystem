import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 日期选择器 - 房型选择上方
 * 显示入住/离店时间和日期选择
 */
import { useState } from 'react';
import styles from './DatePicker.module.scss';
const DatePicker = ({ onDateChange }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(afterTomorrow.getDate() + 1);
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
    const [checkOut, setCheckOut] = useState(formatDate(afterTomorrow));
    const handleDateChange = (type, value) => {
        if (type === 'checkIn') {
            setCheckIn(value);
        }
        else {
            setCheckOut(value);
        }
        onDateChange?.(checkIn, checkOut);
    };
    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekDay = weekDays[date.getDay()];
        return `${month}月${day}日 (周${weekDay})`;
    };
    const calculateNights = () => {
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const checkOutDate = new Date(checkOut + 'T00:00:00');
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    };
    return (_jsxs("div", { className: styles.datePicker, children: [_jsxs("div", { className: styles.timeRow, children: [_jsxs("div", { className: styles.timeBlock, children: [_jsx("label", { className: styles.label, children: "\u5165\u4F4F" }), _jsxs("div", { className: styles.timeInfo, children: [_jsx("span", { className: styles.time, children: "15:00" }), _jsx("span", { className: styles.date, children: "\u540E\u8FDB\u623F" })] })] }), _jsx("div", { className: styles.separator }), _jsxs("div", { className: styles.timeBlock, children: [_jsx("label", { className: styles.label, children: "\u79BB\u5E97" }), _jsxs("div", { className: styles.timeInfo, children: [_jsx("span", { className: styles.time, children: "12:00" }), _jsx("span", { className: styles.date, children: "\u524D\u9000\u623F" })] })] }), _jsxs("div", { className: styles.nights, children: [_jsx("span", { className: styles.count, children: calculateNights() }), _jsx("span", { className: styles.unit, children: "\u665A" })] })] }), _jsxs("div", { className: styles.dateRow, children: [_jsxs("div", { className: styles.dateBlock, children: [_jsx("label", { className: styles.label, children: "\u5165\u4F4F\u65E5\u671F" }), _jsx("input", { type: "date", className: styles.dateInput, value: checkIn, onChange: (e) => handleDateChange('checkIn', e.target.value) }), _jsx("span", { className: styles.dateText, children: formatDateDisplay(checkIn) })] }), _jsx("span", { className: styles.rangeSeparator, children: "\u301C" }), _jsxs("div", { className: styles.dateBlock, children: [_jsx("label", { className: styles.label, children: "\u79BB\u5E97\u65E5\u671F" }), _jsx("input", { type: "date", className: styles.dateInput, value: checkOut, onChange: (e) => handleDateChange('checkOut', e.target.value) }), _jsx("span", { className: styles.dateText, children: formatDateDisplay(checkOut) })] })] }), _jsx("button", { className: styles.changeBtn, children: "\u4FEE\u6539\u65E5\u671F" })] }));
};
export default DatePicker;
//# sourceMappingURL=DatePicker.js.map