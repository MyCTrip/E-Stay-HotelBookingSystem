import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 价格选择器 - 显示组件
 * Web H5版本
 */
import React, { useState, useEffect } from 'react';
import PriceFilter from '../PriceFilter';
import styles from './index.module.scss';
const PriceSelector = ({ minPrice = 0, maxPrice = 10000, onPriceChange, }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [displayMinPrice, setDisplayMinPrice] = useState(minPrice);
    const [displayMaxPrice, setDisplayMaxPrice] = useState(maxPrice);
    // 当 minPrice 或 maxPrice props 变化时，更新显示值
    useEffect(() => {
        setDisplayMinPrice(minPrice);
        setDisplayMaxPrice(maxPrice);
    }, [minPrice, maxPrice]);
    const handleSelect = (newMinPrice, newMaxPrice) => {
        setDisplayMinPrice(newMinPrice);
        setDisplayMaxPrice(newMaxPrice);
        onPriceChange?.(newMinPrice, newMaxPrice);
    };
    const displayPrice = () => {
        if (displayMaxPrice === 10000) {
            return `¥${displayMinPrice}-不限`;
        }
        return `¥${displayMinPrice}-${displayMaxPrice}`;
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.displayBox, onClick: () => setShowFilter(true), children: [_jsx("div", { className: styles.text, children: displayPrice() }), _jsx("div", { className: styles.suffixIcon, children: _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) }) })] }), _jsx(PriceFilter, { visible: showFilter, minPrice: displayMinPrice, maxPrice: displayMaxPrice, onSelect: handleSelect, onClose: () => setShowFilter(false) })] }));
};
export default React.memo(PriceSelector);
//# sourceMappingURL=index.js.map