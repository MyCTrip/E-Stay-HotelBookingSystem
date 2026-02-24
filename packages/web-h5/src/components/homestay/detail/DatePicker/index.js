import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 日期选择器 - 房型选择上方
 * 显示入住/离店时间和日期选择
 */
import { useState } from 'react';
import styles from './index.module.scss';
import SlideDrawer from '../../shared/SlideDrawer';
import DateRangeCalendar from '../../home/DateRangeCalendar';
const DatePicker = ({ checkInDate, checkOutDate, onDateChange }) => {
    const parseDate = (dateStr) => {
        if (!dateStr)
            return new Date();
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date() : date;
    };
    const checkInDate_init = parseDate(checkInDate);
    const checkOutDate_init = parseDate(checkOutDate);
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    const [checkIn, setCheckIn] = useState(checkInDate_init);
    const [checkOut, setCheckOut] = useState(checkOutDate_init);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const handleDateChange = (newCheckIn, newCheckOut) => {
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
        setDrawerVisible(false);
        onDateChange?.(formatDate(newCheckIn), formatDate(newCheckOut));
    };
    const formatDateDisplay = (date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekDay = weekDays[date.getDay()];
        return `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日 ${weekDay}`;
    };
    const calculateNights = () => {
        const diffTime = checkOut.getTime() - checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.datePicker, onClick: () => setDrawerVisible(true), children: _jsxs("div", { className: styles.dateBar, children: [_jsxs("div", { className: styles.dateSection, children: [_jsx("span", { className: styles.dateText, children: formatDateDisplay(checkIn) }), _jsx("span", { className: styles.label, children: "\u5165\u4F4F" })] }), _jsx("span", { className: styles.divider, children: "|" }), _jsx("div", { className: styles.nightsSection, children: _jsxs("span", { className: styles.nightsText, children: ["\u5171", calculateNights(), "\u665A"] }) }), _jsx("span", { className: styles.divider, children: "|" }), _jsxs("div", { className: styles.dateSection, children: [_jsx("span", { className: styles.dateText, children: formatDateDisplay(checkOut) }), _jsx("span", { className: styles.label, children: "\u79BB\u5F00" })] })] }) }), _jsx(SlideDrawer, { visible: drawerVisible, onClose: () => setDrawerVisible(false), direction: "down", source: "screen", screenEdge: "top", maxHeight: "80vh", showHeader: true, title: "\u9009\u62E9\u65E5\u671F", closeModes: ['clickOutside', 'backButton'], children: _jsx(DateRangeCalendar, { checkIn: checkIn, checkOut: checkOut, onSelect: handleDateChange, onClose: () => setDrawerVisible(false) }) })] }));
};
export default DatePicker;
//# sourceMappingURL=index.js.map