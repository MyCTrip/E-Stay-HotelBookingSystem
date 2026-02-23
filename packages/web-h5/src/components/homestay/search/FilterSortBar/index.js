import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 搜索结果页 - 筛选/排序栏
 * 包含4个筛选组件：排序、位置、价格/人数、设施
 * 滚动隐藏/显示功能 - 使用 Intersection Observer
 */
import { useState, useRef, useEffect } from 'react';
import SlideDrawer from '../../shared/SlideDrawer';
import SortFilter from '../SortFilter';
import LocationFilter from '../LocationFilter';
import FacilityFilter from '../FacilityFilter';
import PriceFilter from '../../home/PriceFilter';
import RoomTypeModal from '../../home/RoomTypeModal';
import styles from './index.module.scss';
const FilterSortBar = ({ sortBy, onSortChange, viewMode, onViewModeChange, location, onLocationChange, minPrice = 0, maxPrice = 10000, guests = 1, beds = 0, rooms = 0, onPriceChange, onGuestChange, facilities = [], onFacilitiesChange, hasActiveFilters = false, }) => {
    // 各筛选器的打开/关闭状态
    const [sortOpen, setSortOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [priceGuestOpen, setPriceGuestOpen] = useState(false);
    const [facilityOpen, setFacilityOpen] = useState(false);
    // 元素引用，用于元素边缘定位
    const filterBarRef = useRef(null);
    const sortButtonRef = useRef(null);
    const locationButtonRef = useRef(null);
    const priceGuestButtonRef = useRef(null);
    const facilityButtonRef = useRef(null);
    // 隐藏状态
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollYRef = useRef(0);
    const scrollContainerRef = useRef(null);
    // 监听滚动：下滑隐藏，上滑显示
    useEffect(() => {
        let scrollContainer = null;
        // 查找最近的可滚动容器
        const findScrollContainer = () => {
            let el = filterBarRef.current?.parentElement;
            while (el) {
                const overflowY = window.getComputedStyle(el).overflowY;
                if (overflowY !== 'visible' && overflowY !== 'auto' && overflowY !== 'scroll') {
                    el = el.parentElement;
                    continue;
                }
                // 检查是否真的可以滚动
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    return el;
                }
                el = el.parentElement;
            }
            // 没找到，默认用 window（但实际上这里用window对象）
            return null;
        };
        scrollContainer = findScrollContainer();
        scrollContainerRef.current = scrollContainer;
        if (!scrollContainer) {
            // 如果是 window 滚动
            lastScrollYRef.current = window.scrollY;
            const handleWindowScroll = () => {
                const currentScrollY = window.scrollY;
                const lastScrollY = lastScrollYRef.current;
                if (currentScrollY > lastScrollY) {
                    // 向下滚动 - 隐藏
                    setIsHidden(true);
                }
                else if (currentScrollY < lastScrollY) {
                    // 向上滚动 - 显示
                    setIsHidden(false);
                }
                lastScrollYRef.current = currentScrollY;
            };
            window.addEventListener('scroll', handleWindowScroll, { passive: true });
            return () => {
                window.removeEventListener('scroll', handleWindowScroll);
            };
        }
        else {
            // 如果是容器滚动
            lastScrollYRef.current = scrollContainer.scrollTop;
            const handleContainerScroll = () => {
                const currentScrollTop = scrollContainer.scrollTop;
                const lastScrollTop = lastScrollYRef.current;
                if (currentScrollTop > lastScrollTop) {
                    // 向下滚动 - 隐藏
                    setIsHidden(true);
                }
                else if (currentScrollTop < lastScrollTop) {
                    // 向上滚动 - 显示
                    setIsHidden(false);
                }
                lastScrollYRef.current = currentScrollTop;
            };
            scrollContainer.addEventListener('scroll', handleContainerScroll, { passive: true });
            return () => {
                scrollContainer.removeEventListener('scroll', handleContainerScroll);
            };
        }
    }, []);
    // 根据 sortBy 获取排序标签
    const getSortLabel = () => {
        const sortLabels = {
            smart: '欢迎度',
            ratingDesc: '好评优先',
            distanceAsc: '点评数',
            priceAsc: '低价优先',
            priceDesc: '高价优先',
        };
        return sortLabels[sortBy] || '排序';
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: `${styles.filterSortBar} ${isHidden ? styles.hidden : ''}`, ref: filterBarRef, children: [_jsxs("button", { ref: sortButtonRef, className: `${styles.filterItem} ${sortOpen ? styles.active : ''}`, onClick: () => setSortOpen(true), children: [_jsx("span", { className: styles.label, children: getSortLabel() }), _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.arrow, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) })] }), _jsxs("button", { ref: locationButtonRef, className: `${styles.filterItem} ${locationOpen ? styles.active : ''}`, onClick: () => setLocationOpen(true), children: [_jsx("span", { className: styles.label, children: "\u4F4D\u7F6E" }), _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.arrow, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) })] }), _jsxs("button", { ref: priceGuestButtonRef, className: `${styles.filterItem} ${priceGuestOpen ? styles.active : ''}`, onClick: () => setPriceGuestOpen(true), children: [_jsx("span", { className: styles.label, children: "\u4EF7\u683C/\u4EBA\u6570" }), _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.arrow, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) })] }), _jsxs("button", { ref: facilityButtonRef, className: `${styles.filterItem} ${facilityOpen ? styles.active : ''} ${hasActiveFilters ? styles.hasFilters : ''}`, onClick: () => setFacilityOpen(true), children: [_jsx("span", { className: styles.label, children: "\u7B5B\u9009" }), hasActiveFilters && _jsx("span", { className: styles.badge }), _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.arrow, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) })] }), _jsxs("div", { className: styles.viewToggle, children: [_jsx("button", { className: `${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`, onClick: () => onViewModeChange('list'), title: "\u5217\u8868\u6A21\u5F0F", children: "\u2261" }), _jsx("button", { className: `${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`, onClick: () => onViewModeChange('grid'), title: "\u7F51\u683C\u6A21\u5F0F", children: "\u229E" })] })] }), _jsx(SlideDrawer, { visible: sortOpen, direction: "down", source: "element", position: "bottom", elementRef: filterBarRef, toggleRef: sortButtonRef, onClose: () => setSortOpen(false), onToggle: (isOpen) => isOpen && setSortOpen(true), showBackButton: false, showHeader: false, children: _jsx(SortFilter, { sortBy: sortBy, onSortChange: (sort) => {
                        onSortChange(sort);
                        setSortOpen(false);
                    } }) }), _jsx(SlideDrawer, { visible: locationOpen, direction: "down", source: "element", position: "bottom", elementRef: filterBarRef, toggleRef: locationButtonRef, onClose: () => setLocationOpen(false), onToggle: (isOpen) => isOpen && setLocationOpen(true), showBackButton: false, showHeader: false, children: _jsx(LocationFilter, { selectedLocation: location, onLocationChange: (loc) => {
                        onLocationChange?.(loc);
                        setLocationOpen(false);
                    } }) }), _jsx(SlideDrawer, { visible: priceGuestOpen, direction: "down", source: "element", position: "bottom", elementRef: filterBarRef, toggleRef: priceGuestButtonRef, onClose: () => setPriceGuestOpen(false), onToggle: (isOpen) => isOpen && setPriceGuestOpen(true), showBackButton: false, showHeader: false, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '20px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }, children: "\u4EF7\u683C\u8303\u56F4" }), _jsx(PriceFilter, { usePortal: false, minPrice: minPrice, maxPrice: maxPrice, onSelect: (min, max) => {
                                        onPriceChange?.(min, max);
                                    }, onClose: () => { } })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }, children: "\u5165\u4F4F\u6761\u4EF6" }), _jsx(RoomTypeModal, { usePortal: false, guests: guests, beds: beds, rooms: rooms, showFooter: true, onSelect: (g, b, r) => {
                                        onGuestChange?.(g, b, r);
                                        setPriceGuestOpen(false);
                                    }, onClose: () => {
                                        // 内容模式下不需要关闭逻辑
                                    } })] })] }) }), _jsx(SlideDrawer, { visible: facilityOpen, direction: "down", source: "element", position: "bottom", elementRef: filterBarRef, toggleRef: facilityButtonRef, onClose: () => setFacilityOpen(false), onToggle: (isOpen) => isOpen && setFacilityOpen(true), showBackButton: false, showHeader: false, children: _jsx(FacilityFilter, { selectedFacilities: facilities, onFacilitiesChange: onFacilitiesChange, onConfirm: () => setFacilityOpen(false) }) })] }));
};
export default FilterSortBar;
//# sourceMappingURL=index.js.map