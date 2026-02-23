import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 日期范围日历组件 - 只提供日历内容
 */
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import styles from './index.module.scss';
const DateRangeCalendar = ({ checkIn, checkOut, onSelect, onClose, }) => {
    const today = dayjs();
    const [tempCheckIn, setTempCheckIn] = useState(checkIn || null);
    const [tempCheckOut, setTempCheckOut] = useState(checkOut || null);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    // 生成日历数据
    const calendarData = useMemo(() => {
        const months = [];
        for (let i = 0; i < 6; i++) {
            const month = dayjs(currentMonth).add(i, 'month');
            const firstDay = month.startOf('month');
            const lastDay = month.endOf('month');
            const weeks = [];
            let week = [];
            // 填充本月之前的空白
            for (let j = 0; j < firstDay.day(); j++) {
                week.push(null);
            }
            // 填充本月的日期
            let current = firstDay;
            while (current.format('YYYY-MM') === month.format('YYYY-MM')) {
                week.push(current);
                if (week.length === 7) {
                    weeks.push(week);
                    week = [];
                }
                current = current.add(1, 'day');
            }
            // 填充末尾空白
            while (week.length > 0 && week.length < 7) {
                week.push(null);
            }
            if (week.length === 7) {
                weeks.push(week);
            }
            months.push({
                month: month.format('YYYY年M月'),
                weeks,
            });
        }
        return months;
    }, [currentMonth]);
    const nights = tempCheckIn && tempCheckOut ? dayjs(tempCheckOut).diff(dayjs(tempCheckIn), 'day') : 0;
    const isInRange = (date) => {
        if (!tempCheckIn || !tempCheckOut)
            return false;
        return date.isAfter(dayjs(tempCheckIn)) && date.isBefore(dayjs(tempCheckOut));
    };
    const isCheckInDate = (date) => {
        return tempCheckIn && date.format('YYYY-MM-DD') === dayjs(tempCheckIn).format('YYYY-MM-DD');
    };
    const isCheckOutDate = (date) => {
        return tempCheckOut && date.format('YYYY-MM-DD') === dayjs(tempCheckOut).format('YYYY-MM-DD');
    };
    const handleDateClick = (date) => {
        // 不能选择过去的日期
        if (date.isBefore(today, 'day')) {
            return;
        }
        if (!tempCheckIn) {
            setTempCheckIn(date.toDate());
        }
        else if (!tempCheckOut) {
            if (date.isAfter(dayjs(tempCheckIn), 'day')) {
                setTempCheckOut(date.toDate());
            }
            else {
                setTempCheckIn(date.toDate());
                setTempCheckOut(null);
            }
        }
        else {
            // 已选择两个日期，重新开始选择
            setTempCheckIn(date.toDate());
            setTempCheckOut(null);
        }
    };
    const handleConfirm = () => {
        if (tempCheckIn && tempCheckOut) {
            onSelect(tempCheckIn, tempCheckOut);
            setTempCheckIn(null);
            setTempCheckOut(null);
            onClose();
        }
    };
    return (_jsxs("div", { className: styles.wrapper, children: [_jsxs("div", { className: styles.dateInfo, children: [_jsxs("div", { className: styles.dateInfoItem, children: [_jsx("div", { className: styles.dateInfoLabel, children: "\u5165\u4F4F\u65E5\u671F" }), _jsx("div", { className: styles.dateInfoValue, children: tempCheckIn ? dayjs(tempCheckIn).format('M月D日 ddd') : '未选择' })] }), _jsx("div", { className: styles.dateInfoSpacer, children: nights > 0 && _jsxs("div", { className: styles.nightsCount, children: ["\u5171", nights, "\u665A"] }) }), _jsxs("div", { className: styles.dateInfoItem, children: [_jsx("div", { className: styles.dateInfoLabel, children: "\u79BB\u5E97\u65E5\u671F" }), _jsx("div", { className: styles.dateInfoValue, children: tempCheckOut ? dayjs(tempCheckOut).format('M月D日 ddd') : '未选择' })] })] }), _jsxs("div", { className: styles.calendarContainer, children: [calendarData.map((monthData, monthIndex) => (_jsxs("div", { className: styles.calendarMonth, children: [_jsx("div", { className: styles.monthTitle, children: monthData.month }), _jsx("div", { className: styles.weekdayLabels, children: ['日', '一', '二', '三', '四', '五', '六'].map((day) => (_jsx("div", { className: styles.weekdayLabel, children: day }, day))) }), _jsx("div", { className: styles.daysGrid, children: monthData.weeks.map((week, weekIndex) => week.map((date, dayIndex) => (_jsx("button", { className: `${styles.dayButton} ${date === null ? styles.empty : ''} ${date && date.isBefore(today, 'day') ? styles.disabled : ''} ${date && isCheckInDate(date) ? styles.checkIn : ''} ${date && isCheckOutDate(date) ? styles.checkOut : ''} ${date && isInRange(date) ? styles.inRange : ''}`, onClick: () => date && handleDateClick(date), disabled: !date || date.isBefore(today, 'day'), children: date && date.date() }, `${monthIndex}-${weekIndex}-${dayIndex}`)))) })] }, monthIndex))), _jsx("div", { className: styles.endTip, children: "\u5230\u5E95\u4E86\uFF0C\u6700\u957F\u53EF\u8BA26\u4E2A\u6708\u5185\u7684\u623F\u5C4B" })] }), _jsx("div", { className: styles.footer, children: _jsx("button", { className: styles.confirmBtn, onClick: handleConfirm, disabled: !tempCheckIn || !tempCheckOut, children: "\u786E\u5B9A" }) })] }));
};
export default DateRangeCalendar;
//# sourceMappingURL=index.js.map