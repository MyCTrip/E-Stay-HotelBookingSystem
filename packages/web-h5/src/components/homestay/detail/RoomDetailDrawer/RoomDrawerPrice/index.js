import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 价格与优惠信息 - 符合行业规范
 * 展示房费、优惠、最终价格等信息
 */
import { useState } from 'react';
import DownArrowIcon from '../../../../icons/DownArrowIcon';
import UpArrowIcon from '../../../../icons/UpArrowIcon';
import styles from './index.module.scss';
/**
 * 格式化日期为中文显示
 * @param dateStr ISO 格式的日期字符串
 * @returns 格式化的日期字符串，如 '2月25日'
 */
const formatDateCh = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
};
/**
 * 计算日期范围内的所有日期
 * @param checkInStr 检入日期
 * @param checkOutStr 检出日期
 * @returns 日期数组
 */
const getDateRange = (checkInStr, checkOutStr) => {
    const dates = [];
    const current = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    while (current < checkOut) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
};
/**
 * 计算晚数
 */
const calculateNights = (checkInStr, checkOutStr) => {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
};
const RoomDrawerPrice = ({ room, checkIn, checkOut, }) => {
    // 生成默认日期：明天到后天
    const getDefaultDates = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const afterTomorrow = new Date(tomorrow);
        afterTomorrow.setDate(afterTomorrow.getDate() + 2);
        return {
            checkIn: tomorrow.toISOString().split('T')[0],
            checkOut: afterTomorrow.toISOString().split('T')[0],
        };
    };
    const defaultDates = getDefaultDates();
    const finalCheckIn = checkIn || defaultDates.checkIn;
    const finalCheckOut = checkOut || defaultDates.checkOut;
    // 状态：房费卡片第三行的展开收起
    const [isRoomFeesExpanded, setIsRoomFeesExpanded] = useState(false);
    // 计算晚数
    const nights = calculateNights(finalCheckIn, finalCheckOut);
    // 基础房费 - 从 priceList 的第一个套餐提取 currentPrice
    const basePrice = room.priceList?.[0]?.currentPrice || 0;
    // 折扣信息
    const discounts = room.discounts || [];
    // 每晚总折扣
    const dailyDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
    // 总折扣
    const totalDiscount = dailyDiscount * nights;
    // 折扣后每晚价格
    const finalDailyPrice = basePrice - dailyDiscount;
    // 折扣后总价
    const finalTotalPrice = finalDailyPrice * nights;
    // 获取日期范围
    const dateRange = getDateRange(finalCheckIn, finalCheckOut);
    return (_jsxs("div", { className: styles.priceSection, children: [_jsxs("div", { className: styles.timeInfo, children: [_jsx("span", { children: formatDateCh(finalCheckIn) }), _jsx("span", { className: styles.separator, children: "-" }), _jsx("span", { children: formatDateCh(finalCheckOut) }), _jsx("span", { className: styles.separator, children: "|" }), _jsxs("span", { children: ["\u5171", nights, "\u665A"] })] }), _jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label, children: "\u623F\u8D39" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { children: "\u6BCF\u95F4\u6BCF\u665A" }), " ", _jsxs("span", { className: styles.price, children: ["\u00A5", basePrice] })] })] }), _jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label }), _jsxs("div", { className: styles.valueRow, children: [_jsxs("div", { className: styles.value, children: [_jsxs("span", { children: [nights, "\u665A"] }), " ", _jsxs("span", { className: styles.price, children: ["\u00A5", basePrice * nights] })] }), nights > 3 && (_jsx("button", { className: styles.toggleBtn, onClick: () => setIsRoomFeesExpanded(!isRoomFeesExpanded), children: isRoomFeesExpanded ? (_jsx(UpArrowIcon, { width: 12, height: 12, color: "#B1B1B1" })) : (_jsx(DownArrowIcon, { width: 12, height: 12, color: "#B1B1B1" })) }))] })] }), nights <= 3 && (_jsx("div", { className: styles.datesDetail, children: dateRange.map((date, index) => (_jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label, children: formatDateCh(date) }), _jsxs("div", { className: styles.value, children: ["\u00A5", basePrice] })] }, index))) })), nights > 3 && (_jsx("div", { className: `${styles.datesDetail} ${isRoomFeesExpanded ? styles.expanded : styles.collapsed}`, children: dateRange.map((date, index) => (_jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label, children: formatDateCh(date) }), _jsxs("div", { className: styles.value, children: ["\u00A5", basePrice] })] }, index))) }))] }), discounts.length > 0 && (_jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label, children: "\u4F18\u60E0" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { children: "\u6BCF\u95F4\u6BCF\u665A" }), " ", _jsxs("span", { className: styles.discount, children: ["-\u00A5", dailyDiscount] })] })] }), _jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label }), _jsxs("div", { className: styles.value, children: [_jsxs("span", { children: [nights, "\u665A"] }), " ", _jsxs("span", { className: styles.discount, children: ["-\u00A5", totalDiscount] })] })] }), discounts.map((discount, index) => (_jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.labelWithDesc, children: [_jsx("div", { className: styles.title, children: discount.name }), _jsx("div", { className: styles.desc, children: discount.description })] }), _jsxs("div", { className: styles.discount, children: ["-\u00A5", discount.amount] })] }, index)))] })), _jsxs("div", { className: styles.card, style: { backgroundColor: 'white' }, children: [_jsxs("div", { className: styles.row, style: { marginBottom: "-10px" }, children: [_jsx("div", { className: styles.label, style: { fontSize: '20px' }, children: "\u4F18\u60E0\u540E" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { children: "\u6BCF\u95F4\u6BCF\u665A" }), " ", _jsxs("span", { className: styles.finalPrice, children: ["\u00A5", finalDailyPrice] })] })] }), _jsxs("div", { className: styles.row, children: [_jsx("div", { className: styles.label }), _jsxs("div", { className: styles.value, style: { fontWeight: "600" }, children: [_jsxs("span", { style: { color: "#ff6e16" }, children: [nights, "\u665A"] }), " ", _jsxs("span", { className: styles.finalPrice, style: { color: '#ff6e16', fontSize: "24px" }, children: ["\u00A5", finalTotalPrice] })] })] })] })] }));
};
export default RoomDrawerPrice;
//# sourceMappingURL=index.js.map