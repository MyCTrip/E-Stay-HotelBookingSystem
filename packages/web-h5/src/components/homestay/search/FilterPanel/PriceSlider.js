import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 价格滑块筛选组件
 */
import { useState, useEffect } from 'react';
import styles from './PriceSlider.module.scss';
const PriceSlider = ({ min = 0, max = 2000, onChange, minRange = 0, maxRange = 10000, }) => {
    const [localMin, setLocalMin] = useState(min);
    const [localMax, setLocalMax] = useState(max);
    useEffect(() => {
        setLocalMin(min);
        setLocalMax(max);
    }, [min, max]);
    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value <= localMax) {
            setLocalMin(value);
            onChange?.(value, localMax);
        }
    };
    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value >= localMin) {
            setLocalMax(value);
            onChange?.(localMin, value);
        }
    };
    const handleMinInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value <= localMax) {
            setLocalMin(value);
        }
    };
    const handleMaxInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= localMin) {
            setLocalMax(value);
        }
    };
    const handleMinInputBlur = () => {
        onChange?.(localMin, localMax);
    };
    const handleMaxInputBlur = () => {
        onChange?.(localMin, localMax);
    };
    const minPercent = ((localMin - minRange) / (maxRange - minRange)) * 100;
    const maxPercent = ((localMax - minRange) / (maxRange - minRange)) * 100;
    return (_jsxs("div", { className: styles.priceSlider, children: [_jsxs("div", { className: styles.header, children: [_jsx("h4", { className: styles.title, children: "\u4EF7\u683C\u8303\u56F4" }), _jsxs("span", { className: styles.range, children: ["\u00A5", localMin, " - \u00A5", localMax] })] }), _jsxs("div", { className: styles.sliderContainer, children: [_jsx("div", { className: styles.trackBg }), _jsx("div", { className: styles.track, style: {
                            left: `${minPercent}%`,
                            right: `${100 - maxPercent}%`,
                        } }), _jsx("input", { type: "range", min: minRange, max: maxRange, value: localMin, onChange: handleMinChange, className: styles.thumb, style: { zIndex: localMin > maxRange - 100 ? 5 : 3 } }), _jsx("input", { type: "range", min: minRange, max: maxRange, value: localMax, onChange: handleMaxChange, className: styles.thumb, style: { zIndex: 4 } })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsxs("div", { className: styles.inputWrapper, children: [_jsx("label", { children: "\u6700\u4F4E\u4EF7" }), _jsx("input", { type: "number", value: localMin, onChange: handleMinInputChange, onBlur: handleMinInputBlur, className: styles.input })] }), _jsx("div", { className: styles.divider, children: "-" }), _jsxs("div", { className: styles.inputWrapper, children: [_jsx("label", { children: "\u6700\u9AD8\u4EF7" }), _jsx("input", { type: "number", value: localMax, onChange: handleMaxInputChange, onBlur: handleMaxInputBlur, className: styles.input })] })] })] }));
};
export default PriceSlider;
//# sourceMappingURL=PriceSlider.js.map