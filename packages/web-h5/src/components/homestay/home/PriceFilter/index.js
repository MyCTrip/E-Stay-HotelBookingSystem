import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 价格筛选组件
 * 从网页窗口底部滑入，高度自适应
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.scss';
const PriceFilter = ({ visible, minPrice = 0, maxPrice = 10000, onSelect, onClose, }) => {
    const [tempMinPrice, setTempMinPrice] = useState(minPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
    const MIN_RANGE = 0;
    const MAX_RANGE = 10000;
    const priceRanges = [
        { label: '¥100以下', min: 0, max: 100 },
        { label: '¥100-200', min: 100, max: 200 },
        { label: '¥200-300', min: 200, max: 300 },
        { label: '¥300-400', min: 300, max: 400 },
        { label: '¥400-600', min: 400, max: 600 },
        { label: '¥600-1000', min: 600, max: 1000 },
        { label: '¥1000-2000', min: 1000, max: 2000 },
        { label: '¥2000以上', min: 2000, max: MAX_RANGE },
    ];
    const handleConfirm = () => {
        onSelect(tempMinPrice, tempMaxPrice);
        onClose();
    };
    const handleReset = () => {
        setTempMinPrice(0);
        setTempMaxPrice(MAX_RANGE);
    };
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= tempMaxPrice) {
            setTempMinPrice(value);
        }
    };
    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= tempMinPrice) {
            setTempMaxPrice(value);
        }
    };
    const isRangeSelected = (min, max) => {
        return tempMinPrice === min && tempMaxPrice === max;
    };
    return createPortal(_jsxs(_Fragment, { children: [visible && (_jsx("div", { className: styles.overlay, onClick: handleClose })), _jsxs("div", { className: `${styles.drawer} ${visible ? styles.active : ''}`, children: [_jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), _jsx("h2", { className: styles.title, children: "\u4EF7\u683C" }), _jsx("div", { className: styles.placeholder })] }), _jsxs("div", { className: styles.content, children: [_jsx("div", { className: styles.priceRangeInfo, children: _jsxs("span", { className: styles.rangeLabel, children: ["\u4EF7\u683C\u533A\u95F4 \u00A5", tempMinPrice, "-", tempMaxPrice === MAX_RANGE ? '不限' : tempMaxPrice] }) }), _jsxs("div", { className: styles.sliderContainer, children: [_jsx("div", { className: styles.sliderTrack, children: _jsx("div", { className: styles.sliderFill, style: {
                                                left: `${(tempMinPrice / MAX_RANGE) * 100}%`,
                                                right: `${100 - (tempMaxPrice / MAX_RANGE) * 100}%`,
                                            } }) }), _jsx("input", { type: "range", min: MIN_RANGE, max: MAX_RANGE, value: tempMinPrice, onChange: handleMinChange, className: `${styles.slider} ${styles.sliderMin}` }), _jsx("input", { type: "range", min: MIN_RANGE, max: MAX_RANGE, value: tempMaxPrice, onChange: handleMaxChange, className: `${styles.slider} ${styles.sliderMax}` })] }), _jsx("div", { className: styles.priceRanges, children: priceRanges.map((range, index) => (_jsx("button", { className: `${styles.priceBtn} ${isRangeSelected(range.min, range.max) ? styles.active : ''}`, onClick: () => {
                                        setTempMinPrice(range.min);
                                        setTempMaxPrice(range.max);
                                    }, children: range.label }, index))) })] }), _jsxs("div", { className: styles.footer, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u6E05\u7A7A" }), _jsx("button", { className: styles.confirmBtn, onClick: handleConfirm, children: "\u786E\u8BA4" })] })] })] }), document.body);
};
export default PriceFilter;
//# sourceMappingURL=index.js.map