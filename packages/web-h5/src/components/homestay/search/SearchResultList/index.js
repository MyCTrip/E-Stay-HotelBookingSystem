import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 搜索结果列表容器 - 组合所有4层组件
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchResultHeader from '../SearchResultHeader';
import FilterSortBar from '../FilterSortBar';
import SelectedTagsBar from '../SelectedTagsBar';
import FloatingActionButtons from '../FloatingActionButtons';
import SearchResultCard from '../SearchResultCard';
import HomeStayCard from '../../home/HomeStayCard';
import FilterPanel from '../FilterPanel';
import MapView from '../MapView';
import styles from './index.module.scss';
const SearchResultList = ({ data = [], loading = false, filters = {
    city: '上海',
    checkInDate: '2024-02-17',
    checkOutDate: '2024-02-18',
    roomCount: 1,
    guestCount: 2,
}, onFiltersChange, onModifySearch, }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    // 状态管理
    const [scrollTop, setScrollTop] = useState(0);
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('smart');
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerScrollHeight, setContainerScrollHeight] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
    const [filterPanelVisible, setFilterPanelVisible] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [displayedData, setDisplayedData] = useState(data);
    const [pageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    // 计算选中的标签
    const selectedTags = useCallback(() => {
        const tags = [];
        if (filters.priceMin || filters.priceMax) {
            tags.push({
                key: 'price',
                label: `¥${filters.priceMin || '0'}-${filters.priceMax || '∞'}`,
            });
        }
        if (filters.stars && filters.stars.length > 0) {
            tags.push({
                key: 'stars',
                label: `${filters.stars.join('/')}星`,
            });
        }
        if (filters.facilities && filters.facilities.length > 0) {
            tags.push({
                key: 'facilities',
                label: `${filters.facilities.length}项设施`,
            });
        }
        return tags;
    }, [filters]);
    // 监听容器大小变化
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleResize = () => {
            setContainerHeight(container.clientHeight);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize();
        return () => resizeObserver.disconnect();
    }, []);
    // 数据同步 - 当原始数据变化时重置分页
    useEffect(() => {
        setDisplayedData(data.slice(0, pageSize));
        setCurrentPage(1);
    }, [data, pageSize]);
    // 监听窗口大小变化，根据断点自动调整视图模式
    useEffect(() => {
        const handleWindowResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            // 768px是MainLayout导航栏变化的断点
            // <= 768px时显示单列，> 768px时显示双列
            if (width <= 768 && viewMode !== 'map') {
                setViewMode('list');
            }
        };
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize(); // 初始化调用
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [viewMode]);
    // 更新滚动高度
    useEffect(() => {
        const content = contentRef.current;
        if (content) {
            setContainerScrollHeight(content.scrollHeight);
        }
    }, [data, viewMode]);
    // 处理容器滚动
    const handleScroll = (e) => {
        const target = e.currentTarget;
        const scrollPosition = target.scrollTop;
        const containerHeight = target.clientHeight;
        const scrollHeight = target.scrollHeight;
        setScrollTop(scrollPosition);
        setContainerHeight(containerHeight);
        setContainerScrollHeight(scrollHeight);
        // 无限滚动：距离底部200px时加载更多
        const distanceToBottom = scrollHeight - (scrollPosition + containerHeight);
        if (distanceToBottom < 200 && !isLoadingMore && currentPage * pageSize < data.length) {
            handleLoadMore();
        }
    };
    // 滚动到顶部
    const handleScrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };
    // 处理标签移除
    const handleTagRemove = (key) => {
        const newFilters = { ...filters };
        switch (key) {
            case 'price':
                delete newFilters.priceMin;
                delete newFilters.priceMax;
                break;
            case 'stars':
                delete newFilters.stars;
                break;
            case 'facilities':
                delete newFilters.facilities;
                break;
        }
        onFiltersChange?.(newFilters);
    };
    // 重置所有筛选
    const handleResetAll = () => {
        const resetFilters = {
            city: filters.city,
            checkInDate: filters.checkInDate,
            checkOutDate: filters.checkOutDate,
            roomCount: filters.roomCount,
            guestCount: filters.guestCount,
        };
        onFiltersChange?.(resetFilters);
    };
    // 处理排序变化
    const handleSortChange = (sort) => {
        setSortBy(sort);
    };
    // 处理视图模式变化
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };
    // 处理FilterPanel打开
    const handleOpenFilterPanel = () => {
        setFilterPanelVisible(true);
    };
    // 处理FilterPanel关闭
    const handleCloseFilterPanel = () => {
        setFilterPanelVisible(false);
    };
    // 处理应用筛选条件
    const handleApplyFilters = (filterState) => {
        const newFilters = {
            ...filters,
            priceMin: filterState.priceMin || undefined,
            priceMax: filterState.priceMax || undefined,
            stars: filterState.stars.length > 0 ? filterState.stars : undefined,
            facilities: filterState.facilities.length > 0 ? filterState.facilities : undefined,
        };
        // 清除undefined属性
        Object.keys(newFilters).forEach(key => newFilters[key] === undefined && delete newFilters[key]);
        onFiltersChange?.(newFilters);
        setFilterPanelVisible(false);
        setCurrentPage(1);
        setDisplayedData(data.slice(0, pageSize));
    };
    // 处理无限滚动 - 加载更多数据
    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || currentPage * pageSize >= data.length)
            return;
        setIsLoadingMore(true);
        // 模拟网络延迟
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const newData = data.slice(0, nextPage * pageSize);
            setDisplayedData(newData);
            setCurrentPage(nextPage);
            setIsLoadingMore(false);
        }, 300);
    }, [currentPage, pageSize, data, isLoadingMore]);
    const tags = selectedTags();
    const hasActiveFilters = tags.length > 0;
    return (_jsxs("div", { className: styles.container, ref: containerRef, onScroll: handleScroll, children: [_jsx(SearchResultHeader, { filters: filters, onModifyClick: onModifySearch }), _jsx(FilterSortBar, { sortBy: sortBy, onSortChange: handleSortChange, viewMode: viewMode, onViewModeChange: handleViewModeChange, hasActiveFilters: hasActiveFilters, onFilterClick: handleOpenFilterPanel }), viewMode === 'map' ? (_jsx(MapView, { data: displayedData, filters: filters, onMarkerClick: (id) => {
                    console.log('Navigate to detail:', id);
                } })) : (_jsx(_Fragment, { children: _jsxs("div", { className: styles.content, ref: contentRef, children: [tags.length > 0 && (_jsx(SelectedTagsBar, { tags: tags, onTagRemove: handleTagRemove, onResetAll: handleResetAll })), _jsx("div", { className: `${styles.listWrapper} ${styles[viewMode]}`, children: loading ? (
                            // 骨架屏
                            _jsx("div", { className: styles.skeletonContainer, children: [...Array(6)].map((_, i) => (_jsx("div", { className: styles.skeletonCard }, i))) })) : displayedData.length > 0 ? (
                            // 数据列表
                            _jsx(_Fragment, { children: viewMode === 'list'
                                    ? displayedData.map((item) => (_jsx(SearchResultCard, { data: item, onClick: (id) => {
                                            navigate(`/homeStay/${id}`);
                                        } }, item._id)))
                                    : displayedData.map((item) => (_jsx(HomeStayCard, { data: item, onClick: (id) => {
                                            navigate(`/homeStay/${id}`);
                                        } }, item._id))) })) : (
                            // 空状态
                            _jsxs("div", { className: styles.emptyState, children: [_jsx("div", { className: styles.emptyIcon, children: "\uD83C\uDFE0" }), _jsx("div", { className: styles.emptyTitle, children: "\u627E\u4E0D\u5230\u5339\u914D\u7684\u6C11\u5BBF" }), _jsx("div", { className: styles.emptyDesc, children: "\u8BD5\u8BD5\u8C03\u6574\u641C\u7D22\u6761\u4EF6\u6216\u67E5\u770B\u5176\u4ED6\u57CE\u5E02" }), _jsx("button", { className: styles.resetBtn, onClick: handleResetAll, children: "\u91CD\u7F6E\u7B5B\u9009\u6761\u4EF6" })] })) }), displayedData.length > 0 && currentPage * pageSize < data.length && (_jsx("div", { className: styles.loadingMore, children: isLoadingMore ? _jsx("p", { children: "\u52A0\u8F7D\u4E2D..." }) : _jsx("p", { children: "\u4E0A\u62C9\u52A0\u8F7D\u66F4\u591A" }) })), displayedData.length > 0 && currentPage * pageSize >= data.length && data.length > 0 && (_jsx("div", { className: styles.loadingMore, children: _jsxs("p", { children: ["\u5DF2\u4E3A\u60A8\u52A0\u8F7D\u5168\u90E8", data.length, "\u4E2A\u7ED3\u679C"] }) }))] }) })), _jsx(FloatingActionButtons, { scrollTop: scrollTop, containerHeight: containerHeight, containerScrollHeight: containerScrollHeight, onScrollToTop: handleScrollToTop }), _jsx(FilterPanel, { visible: filterPanelVisible, onClose: handleCloseFilterPanel, onApply: handleApplyFilters, initialFilters: {
                    priceMin: filters.priceMin || 0,
                    priceMax: filters.priceMax || 10000,
                    stars: filters.stars || [],
                    facilities: filters.facilities || [],
                } })] }));
};
export default SearchResultList;
//# sourceMappingURL=index.js.map