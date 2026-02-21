import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 价格/人数筛选组件 - 内容only 合并了 PriceFilter 和 RoomTypeModal
 */
import { useState } from 'react';
import styles from './index.module.scss';
const priceRanges = [
    { label: '¥100以下', min: 0, max: 100 },
    { label: '¥100-200', min: 100, max: 200 },
    { label: '¥200-300', min: 200, max: 300 },
    { label: '¥300-400', min: 300, max: 400 },
    { label: '¥400-600', min: 400, max: 600 },
    { label: '¥600-1000', min: 600, max: 1000 },
    { label: '¥1000-2000', min: 1000, max: 2000 },
    { label: '¥2000以上', min: 2000, max: 10000 },
];
const PriceGuestFilter = ({ minPrice = 0, maxPrice = 10000, guests = 1, beds = 0, rooms = 0, onPriceChange, onGuestChange, onConfirm, }) => {
    const [tempMinPrice, setTempMinPrice] = useState(minPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
    const [tempGuests, setTempGuests] = useState(guests);
    const [tempBeds, setTempBeds] = useState(beds);
    const [tempRooms, setTempRooms] = useState(rooms);
    const MIN_RANGE = 0;
    const MAX_RANGE = 10000;
    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= tempMaxPrice) {
            setTempMinPrice(value);
            onPriceChange?.(value, tempMaxPrice);
        }
    };
    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= tempMinPrice) {
            setTempMaxPrice(value);
            onPriceChange?.(tempMinPrice, value);
        }
    };
    const handleGuestChange = (num) => {
        setTempGuests(num);
        onGuestChange?.(num, tempBeds, tempRooms);
    };
    const handleBedsChange = (value) => {
        setTempBeds(Math.max(value, 0));
        onGuestChange?.(tempGuests, Math.max(value, 0), tempRooms);
    };
    const handleRoomsChange = (value) => {
        setTempRooms(Math.max(value, 0));
        onGuestChange?.(tempGuests, tempBeds, Math.max(value, 0));
    };
    const handleReset = () => {
        setTempMinPrice(0);
        setTempMaxPrice(MAX_RANGE);
        setTempGuests(1);
        setTempBeds(0);
        setTempRooms(0);
        onPriceChange?.(0, MAX_RANGE);
        onGuestChange?.(1, 0, 0);
    };
    const isRangeSelected = (min, max) => {
        return tempMinPrice === min && tempMaxPrice === max;
    };
    const CounterRow = ({ label, value, onChange }) => (_jsxs("div", { className: styles.counterRow, children: [_jsx("span", { className: styles.counterLabel, children: label }), _jsxs("div", { className: styles.counterControl, children: [_jsx("button", { className: styles.minusBtn, onClick: () => onChange(Math.max(value - 1, 0)), children: "\u2212" }), _jsx("span", { className: styles.counterValue, children: value }), _jsx("button", { className: styles.plusBtn, onClick: () => onChange(Math.min(value + 1, 10)), children: "+" })] })] }));
    return (_jsxs("div", { className: styles.priceGuestFilter, children: [_jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.section, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u4EF7\u683C" }), _jsx("div", { className: styles.priceRangeInfo, children: _jsxs("span", { className: styles.rangeLabel, children: ["\u4EF7\u683C\u533A\u95F4 \u00A5", tempMinPrice, "-", tempMaxPrice === MAX_RANGE ? '不限' : tempMaxPrice] }) }), _jsxs("div", { className: styles.sliderContainer, children: [_jsx("div", { className: styles.sliderTrack, children: _jsx("div", { className: styles.sliderFill, style: {
                                                left: `${(tempMinPrice / MAX_RANGE) * 100}%`,
                                                right: `${100 - (tempMaxPrice / MAX_RANGE) * 100}%`,
                                            } }) }), _jsx("input", { type: "range", min: MIN_RANGE, max: MAX_RANGE, value: tempMinPrice, onChange: handleMinChange, className: `${styles.slider} ${styles.sliderMin}` }), _jsx("input", { type: "range", min: MIN_RANGE, max: MAX_RANGE, value: tempMaxPrice, onChange: handleMaxChange, className: `${styles.slider} ${styles.sliderMax}` })] }), _jsx("div", { className: styles.priceRanges, children: priceRanges.map((range, index) => (_jsx("button", { className: `${styles.priceBtn} ${isRangeSelected(range.min, range.max) ? styles.active : ''}`, onClick: () => {
                                        setTempMinPrice(range.min);
                                        setTempMaxPrice(range.max);
                                        onPriceChange?.(range.min, range.max);
                                    }, children: range.label }, index))) })] }), _jsxs("div", { className: styles.section, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u5165\u4F4F\u6761\u4EF6" }), _jsxs("div", { className: styles.subsection, children: [_jsx("div", { className: styles.subsectionLabel, children: "\u603B\u4EBA\u6570" }), _jsx("div", { className: styles.guestOptions, children: [1, 2, 3, 4].map((num) => (_jsxs("button", { className: `${styles.optionBtn} ${tempGuests === num ? styles.active : ''}`, onClick: () => handleGuestChange(num), children: [num, "\u4EBA"] }, num))) })] }), _jsx("div", { className: styles.subsection, children: _jsx(CounterRow, { label: "\u5E8A\u94FA\u6570", value: tempBeds, onChange: handleBedsChange }) }), _jsx("div", { className: styles.subsection, children: _jsx(CounterRow, { label: "\u5C45\u5BA4\u6570", value: tempRooms, onChange: handleRoomsChange }) })] })] }), _jsxs("div", { className: styles.footer, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u6E05\u7A7A" }), _jsx("button", { className: styles.confirmBtn, onClick: onConfirm, children: "\u786E\u8BA4" })] })] }));
};
export default PriceGuestFilter;
//# sourceMappingURL=index.js.map