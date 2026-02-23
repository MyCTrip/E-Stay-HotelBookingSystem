import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useHomestayStore } from '@estay/shared';
import LocationInput from '../../../components/homestay/home/LocationInput';
import DateTimeRangeSelector from '../../../components/homestay/home/DateTimeRangeSelector';
import RoomTypeSelector from '../../../components/homestay/home/RoomTypeSelector';
import PriceSelector from '../../../components/homestay/home/PriceSelector';
import QuickFilters from '../../../components/homestay/home/QuickFilters';
import SearchButton from '../../../components/homestay/home/SearchButton';
import RecommendTypes from '../../../components/homestay/home/RecommendTypes';
import HomeStayCard from '../../../components/homestay/home/HomeStayCard';
import HomeStayCardSkeleton from '../../../components/homestay/home/HomeStayCardSkeleton';
import BannerCarousel from '../../../components/homestay/home/BannerCarousel';
import { QUICK_FILTER_TAGS } from '@estay/shared';
import styles from './index.module.scss';
const HomeStayPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    // 获取 Store 状态和 Action
    const { hotHomestays, searchParams, setSearchParams, searchLoading, loadHotHomestays, fetchSearchResults, } = useHomestayStore();
    // UI 状态
    const [refreshing, setRefreshing] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    // 首次加载时显示热门民宿推荐
    useEffect(() => {
        loadHotHomestays();
    }, [loadHotHomestays]);
    // 监听滚动事件
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleScroll = () => {
            setScrollTop(container.scrollTop);
        };
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);
    // 下拉刷新处理
    const handlePullRefresh = () => {
        if (refreshing)
            return;
        setRefreshing(true);
        // 延迟 800ms 后停止刷新
        setTimeout(() => {
            loadHotHomestays();
            setRefreshing(false);
        }, 800);
    };
    // 处理容器滚动，监测下拉刷新
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        let startY = 0;
        let currentY = 0;
        const pullThreshold = 60;
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
            currentY = startY;
        };
        const handleTouchMove = (e) => {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            // 仅在页面顶部时响应下拉
            if (container.scrollTop === 0 && diff > 0) {
                const ratio = diff / pullThreshold;
                // 可以用 ratio 来调整视觉反馈
            }
        };
        const handleTouchEnd = () => {
            const diff = currentY - startY;
            if (diff > pullThreshold && container.scrollTop === 0) {
                handlePullRefresh();
            }
        };
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchEnd);
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [refreshing]);
    // 处理地点选择
    const handleLocationSelect = (city) => {
        setSearchParams({
            ...(searchParams || {
                checkIn: dayjs().toDate(),
                checkOut: dayjs().add(1, 'day').toDate(),
                guests: 1,
                rooms: 0,
                beds: 0,
                keyword: '',
                selectedTags: [],
                priceMin: 0,
                priceMax: 10000,
            }),
            city,
        });
    };
    // 处理日期变化
    const handleDateChange = (checkIn, checkOut) => {
        setSearchParams({
            ...(searchParams || {
                city: '上海',
                guests: 1,
                rooms: 0,
                beds: 0,
                keyword: '',
                selectedTags: [],
                priceMin: 0,
                priceMax: 10000,
            }),
            checkIn,
            checkOut,
        });
    };
    // 处理房间类型变化
    const handleRoomTypeChange = (guests, beds, rooms) => {
        setSearchParams({
            ...(searchParams || {
                city: '上海',
                checkIn: dayjs().toDate(),
                checkOut: dayjs().add(1, 'day').toDate(),
                keyword: '',
                selectedTags: [],
                priceMin: 0,
                priceMax: 10000,
            }),
            guests,
            beds,
            rooms,
        });
    };
    // 处理价格筛选
    const handlePriceFilter = (minPrice, maxPrice) => {
        setSearchParams({
            ...(searchParams || {
                city: '上海',
                checkIn: dayjs().toDate(),
                checkOut: dayjs().add(1, 'day').toDate(),
                guests: 1,
                rooms: 0,
                beds: 0,
                keyword: '',
                selectedTags: [],
            }),
            priceMin: minPrice,
            priceMax: maxPrice,
        });
    };
    // 处理快速筛选标签
    const handleTagSelect = (tagId, selected) => {
        const current = searchParams || {
            city: '上海',
            checkIn: dayjs().toDate(),
            checkOut: dayjs().add(1, 'day').toDate(),
            guests: 1,
            rooms: 0,
            beds: 0,
            keyword: '',
            selectedTags: [],
            priceMin: 0,
            priceMax: 10000,
        };
        const tags = new Set(current.selectedTags || []);
        if (selected) {
            tags.add(tagId);
        }
        else {
            tags.delete(tagId);
        }
        setSearchParams({
            ...current,
            selectedTags: Array.from(tags),
        });
    };
    // 处理搜索
    const handleSearch = async () => {
        const params = searchParams || {
            city: '上海',
            checkIn: dayjs().toDate(),
            checkOut: dayjs().add(1, 'day').toDate(),
            guests: 1,
            rooms: 0,
            beds: 0,
            keyword: '',
            selectedTags: [],
            priceMin: 0,
            priceMax: 10000,
        };
        if (!params.city) {
            alert('请选择城市');
            return;
        }
        try {
            // 调用 Store 的搜索函数
            await fetchSearchResults({
                ...params,
                page: 1,
                limit: 20,
            });
            // 构建查询参数并跳转到搜索结果页
            const queryParams = new URLSearchParams({
                city: params.city,
                checkIn: params.checkIn ? dayjs(params.checkIn).format('YYYY-MM-DD') : '',
                checkOut: params.checkOut ? dayjs(params.checkOut).format('YYYY-MM-DD') : '',
                rooms: String(params.rooms || 1),
                guests: String(params.guests || 1),
            });
            navigate(`/search/homeStay?${queryParams.toString()}`);
        }
        catch (error) {
            console.error('Failed to search:', error);
            alert('搜索失败，请重试');
        }
    };
    // 处理我的附近
    const handleNearby = async () => {
        try {
            if (!navigator.geolocation) {
                alert('您的浏览器不支持地理定位');
                return;
            }
            navigator.geolocation.getCurrentPosition((position) => {
                // TODO: 根据坐标获取城市信息
                alert('已获取您的位置');
            }, (error) => {
                alert('获取位置失败，请授予定位权限');
            });
        }
        catch (error) {
            console.error('Geolocation error:', error);
        }
    };
    // 确保 searchParams 有默认值
    const currentSearchParams = searchParams || {
        city: '上海',
        checkIn: dayjs().toDate(),
        checkOut: dayjs().add(1, 'day').toDate(),
        guests: 1,
        rooms: 0,
        beds: 0,
        keyword: '',
        selectedTags: [],
        priceMin: 0,
        priceMax: 10000,
    };
    return (_jsxs("div", { ref: containerRef, className: styles.container, children: [_jsx(BannerCarousel, { autoPlay: true, interval: 3500, onBannerClick: (item) => {
                    if (item.link) {
                        navigate(item.link);
                    }
                } }), _jsx("div", { className: styles.compactSearchSection, children: _jsxs("div", { className: styles.searchCard, children: [_jsx("div", { className: styles.cardItem, children: _jsx(LocationInput, { city: currentSearchParams.city, onCityChange: handleLocationSelect }) }), _jsx("div", { className: styles.cardItem, children: _jsx(DateTimeRangeSelector, { checkIn: currentSearchParams.checkIn, checkOut: currentSearchParams.checkOut, onDateChange: handleDateChange }) }), _jsxs("div", { className: styles.dualRowContainer, children: [_jsx("div", { className: styles.cardItem, children: _jsx(RoomTypeSelector, { rooms: currentSearchParams.rooms, beds: currentSearchParams.beds, guests: currentSearchParams.guests, onChange: handleRoomTypeChange }) }), _jsx("div", { className: styles.cardItem, children: _jsx(PriceSelector, { minPrice: currentSearchParams.priceMin, maxPrice: currentSearchParams.priceMax, onPriceChange: handlePriceFilter }) })] }), _jsx("div", { className: styles.cardItem, children: _jsx(QuickFilters, { tags: QUICK_FILTER_TAGS, selectedTags: currentSearchParams.selectedTags, onTagSelect: handleTagSelect }) }), _jsx("div", { className: styles.cardItem, children: _jsx(SearchButton, { loading: searchLoading, onClick: handleSearch, label: "\u5F00\u59CB\u641C\u7D22" }) })] }) }), _jsx(RecommendTypes, {}), _jsxs("div", { className: styles.listSection, children: [refreshing && (_jsxs("div", { className: styles.refreshTip, children: [_jsx("span", { className: styles.spinner }), "\u6B63\u5728\u5237\u65B0\u6570\u636E\u4E2D..."] })), _jsx("div", { className: styles.cardGrid, children: searchLoading ? (_jsx(HomeStayCardSkeleton, { count: 6 })) : hotHomestays.length > 0 ? (hotHomestays.map((homestay) => (_jsx("div", { className: styles.cardWrapper, children: _jsx(HomeStayCard, { data: homestay, onClick: () => navigate(`/hotel-detail/homestay/${homestay._id}`), showStar: true }) }, homestay._id)))) : (_jsx("div", { className: styles.emptyState, children: _jsx("p", { children: "\u6682\u65E0\u76F8\u5173\u6C11\u5BBF" }) })) }), searchLoading && (_jsx("div", { className: styles.loadingState, children: _jsx("p", { children: "\u52A0\u8F7D\u4E2D..." }) }))] }), _jsx("div", { className: styles.bottomSpacer })] }));
};
export default HomeStayPage;
//# sourceMappingURL=index.js.map