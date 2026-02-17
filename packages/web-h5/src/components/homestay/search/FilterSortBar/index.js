import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 搜索结果页 - 筛选/排序栏
 */
import { useState } from 'react';
import styles from './index.module.scss';
const sortOptions = [
    { label: '智能排序', value: 'smart' },
    { label: '价格低到高', value: 'priceAsc' },
    { label: '价格高到低', value: 'priceDesc' },
    { label: '评分最高', value: 'ratingDesc' },
    { label: '距离最近', value: 'distanceAsc' },
];
const FilterSortBar = ({ sortBy, onSortChange, viewMode, onViewModeChange, onPriceFilter, onStarFilter, onFacilityFilter, onFilterClick, hasActiveFilters = false, }) => {
    const [sortOpen, setSortOpen] = useState(false);
    const currentSort = sortOptions.find(opt => opt.value === sortBy)?.label || '智能排序';
    // 统一的筛选点击处理
    const handleFilterClick = () => {
        if (onFilterClick) {
            onFilterClick();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.filterSortBar, children: [_jsxs("div", { className: styles.buttonGroup, children: [_jsxs("button", { className: `${styles.filterBtn} ${sortOpen ? styles.active : ''}`, onClick: () => setSortOpen(!sortOpen), children: [_jsx("span", { children: currentSort }), _jsx("span", { className: styles.arrow, children: "\u2228" })] }), _jsxs("button", { className: `${styles.filterBtn} ${hasActiveFilters ? styles.active : ''}`, onClick: handleFilterClick, title: "\u6253\u5F00\u7B5B\u9009\u9762\u677F", children: [_jsx("span", { children: "\u7B5B\u9009" }), hasActiveFilters && _jsx("span", { className: styles.badge }), _jsx("span", { className: styles.arrow, children: "\u2228" })] })] }), _jsxs("div", { className: styles.viewToggle, children: [_jsx("button", { className: `${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`, onClick: () => onViewModeChange('list'), title: "\u5217\u8868\u6A21\u5F0F", children: "\u2261" }), _jsx("button", { className: `${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`, onClick: () => onViewModeChange('grid'), title: "\u7F51\u683C\u6A21\u5F0F", children: "\u229E" }), _jsx("button", { className: `${styles.viewBtn} ${viewMode === 'map' ? styles.active : ''}`, onClick: () => onViewModeChange('map'), title: "\u5730\u56FE\u6A21\u5F0F", children: "\uD83D\uDDFA\uFE0F" })] })] }), sortOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.overlay, onClick: () => setSortOpen(false) }), _jsx("div", { className: styles.sortDropdown, children: sortOptions.map(option => (_jsxs("button", { className: `${styles.sortOption} ${sortBy === option.value ? styles.selected : ''}`, onClick: () => {
                                onSortChange(option.value);
                                setSortOpen(false);
                            }, children: [option.label, sortBy === option.value && _jsx("span", { className: styles.checkmark, children: "\u2713" })] }, option.value))) })] }))] }));
};
export default FilterSortBar;
//# sourceMappingURL=index.js.map