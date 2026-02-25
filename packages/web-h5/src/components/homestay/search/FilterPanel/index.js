import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 完整的筛选面板 - 侧滑抽屉式
 */
import React, { useEffect } from 'react';
import PriceSlider from './PriceSlider';
import StarFilter from './StarFilter';
import FacilityFilter from './FacilityFilter';
import styles from './index.module.scss';
const FilterPanel = ({ visible, onClose, onApply, initialFilters = {
    priceMin: 0,
    priceMax: 2000,
    stars: [],
    facilities: [],
}, }) => {
    const [filters, setFilters] = React.useState(initialFilters);
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters, visible]);
    // 阻止滑动穿透
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [visible]);
    const handleReset = () => {
        const resetFilters = {
            priceMin: 0,
            priceMax: 2000,
            stars: [],
            facilities: [],
        };
        setFilters(resetFilters);
    };
    const handleApply = () => {
        onApply?.(filters);
        onClose?.();
    };
    const hasActiveFilters = filters.priceMin !== 0 ||
        filters.priceMax !== 2000 ||
        filters.stars.length > 0 ||
        filters.facilities.length > 0;
    return (_jsxs(_Fragment, { children: [visible && (_jsx("div", { className: styles.overlay, onClick: onClose })), _jsxs("div", { className: `${styles.panel} ${visible ? styles.visible : ''}`, children: [_jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), _jsx("h3", { className: styles.title, children: "\u7B5B\u9009" }), _jsx("div", { style: { width: '24px' } })] }), _jsxs("div", { className: styles.content, children: [_jsx(PriceSlider, { min: filters.priceMin, max: filters.priceMax, onChange: (min, max) => setFilters({ ...filters, priceMin: min, priceMax: max }) }), _jsx(StarFilter, { selectedStars: filters.stars, onChange: (stars) => setFilters({ ...filters, stars }) }), _jsx(FacilityFilter, { selectedFacilities: filters.facilities, onChange: (facilities) => setFilters({ ...filters, facilities }) })] }), _jsxs("div", { className: styles.footer, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, disabled: !hasActiveFilters, children: "\u91CD\u7F6E" }), _jsx("button", { className: styles.applyBtn, onClick: handleApply, children: "\u5E94\u7528\u7B5B\u9009" })] })] })] }));
};
export default FilterPanel;
//# sourceMappingURL=index.js.map