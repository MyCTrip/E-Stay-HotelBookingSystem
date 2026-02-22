import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 日期范围选择组件 - Web H5版本
 */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import SlideDrawer from '../../shared/SlideDrawer';
import DateRangeCalendar from '../DateRangeCalendar';
import styles from './index.module.scss';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const DateTimeRangeSelector = ({ checkIn, checkOut, onDateChange, }) => {
    const [tempCheckIn, setTempCheckIn] = useState(checkIn || dayjs().toDate());
    const [tempCheckOut, setTempCheckOut] = useState(checkOut || dayjs().add(1, 'day').toDate());
    const [showCalendar, setShowCalendar] = useState(false);
    const nights = dayjs(tempCheckOut).diff(dayjs(tempCheckIn), 'day');
    const formatDateLabel = (date) => {
        const d = dayjs(date);
        const today = dayjs();
        const tomorrow = today.add(1, 'day');
        const dayAfterTomorrow = today.add(2, 'day');
        if (d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 今天`;
        }
        if (d.format('YYYY-MM-DD') === tomorrow.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 明天`;
        }
        if (d.format('YYYY-MM-DD') === dayAfterTomorrow.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 后天`;
        }
        return d.format('M月D日');
    };
    const handleDateRangeSelect = (newCheckIn, newCheckOut) => {
        setTempCheckIn(newCheckIn);
        setTempCheckOut(newCheckOut);
        onDateChange?.(newCheckIn, newCheckOut);
        setShowCalendar(false);
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.wrapper, children: [_jsxs("div", { className: styles.dateSection, onClick: () => setShowCalendar(true), children: [_jsx("div", { className: styles.dateValue, children: formatDateLabel(tempCheckIn) }), _jsx("div", { className: styles.dateLabel, children: "\u5165\u4F4F" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.dateSection, onClick: () => setShowCalendar(true), children: [_jsx("div", { className: styles.dateValue, children: formatDateLabel(tempCheckOut) }), _jsx("div", { className: styles.dateLabel, children: "\u79BB\u4F4F" })] }), _jsx("div", { className: styles.rightSection, children: _jsx("div", { className: styles.nightsInfo, children: _jsxs("span", { className: styles.nightsLabel, children: ["\u5171", nights, "\u665A"] }) }) })] }), _jsx(SlideDrawer, { visible: showCalendar, title: "\u9009\u62E9\u5165\u79BB\u65E5\u671F", direction: "bottom", onClose: () => setShowCalendar(false), children: _jsx(DateRangeCalendar, { checkIn: tempCheckIn, checkOut: tempCheckOut, onSelect: handleDateRangeSelect, onClose: () => setShowCalendar(false) }) })] }));
};
export default React.memo(DateTimeRangeSelector);
//# sourceMappingURL=index.js.map