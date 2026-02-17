import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import LocationInput from '../../../components/homestay/home/LocationInput';
import DateTimeRangeSelector from '../../../components/homestay/home/DateTimeRangeSelector';
import RoomTypeSelector from '../../../components/homestay/home/RoomTypeSelector';
import QuickFilters from '../../../components/homestay/home/QuickFilters';
import SearchButton from '../../../components/homestay/home/SearchButton';
import HomeStayCard from '../../../components/homestay/home/HomeStayCard';
import HomeStayCardSkeleton from '../../../components/homestay/home/HomeStayCardSkeleton';
import { QUICK_FILTER_TAGS } from '@estay/shared';
import styles from './index.module.scss';
// 模拟热门民宿数据
const MOCK_HOMESTAYS = [
    {
        _id: '1',
        merchantId: 'merchant1',
        baseInfo: {
            nameCn: '江南古韵民宿',
            nameEn: 'Jiangnan Charm',
            address: '黄浦区豫园路88号',
            city: '上海',
            star: 4.8,
            phone: '021-12345678',
            description: '现代简约设计，融合江南古韵，近豫园。',
            roomTotal: 8,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿1'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '2',
        merchantId: 'merchant2',
        baseInfo: {
            nameCn: '文创艺术民宿',
            nameEn: 'Art Studio',
            address: '静安区苏州河路166号',
            city: '上海',
            star: 4.9,
            phone: '021-87654321',
            description: '独特艺术风格，每间房个性十足，文创氛围浓厚。',
            roomTotal: 6,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿2'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '3',
        merchantId: 'merchant3',
        baseInfo: {
            nameCn: '森林度假小屋',
            nameEn: 'Forest Retreat',
            address: '松江区9号笔山路999号',
            city: '上海',
            star: 4.7,
            phone: '021-98765432',
            description: '远离喧嚣，享受自然，专业设施完善。',
            roomTotal: 5,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿3'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '4',
        merchantId: 'merchant4',
        baseInfo: {
            nameCn: '水乡瑞居',
            nameEn: 'Water Village Inn',
            address: '浦东新区陆家嘴环路333号',
            city: '上海',
            star: 4.6,
            phone: '021-11111111',
            description: '濒临黄浦江，景观开阔，现代便利设施。',
            roomTotal: 12,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿4'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '5',
        merchantId: 'merchant5',
        baseInfo: {
            nameCn: '老洋房民宿',
            nameEn: 'Classic Villa',
            address: '徐汇区复兴中路1888号',
            city: '上海',
            star: 4.8,
            phone: '021-22222222',
            description: '保留历史痕迹，融合现代舒适，品味生活。',
            roomTotal: 7,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿5'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '6',
        merchantId: 'merchant6',
        baseInfo: {
            nameCn: '田园慢居民宿',
            nameEn: 'Countryside Slow Life',
            address: '崇明岛向化镇中心路288号',
            city: '上海',
            star: 4.5,
            phone: '021-33333333',
            description: '远离城市喧嚣，尽享田园风光与宁静生活。',
            roomTotal: 10,
            facilities: [],
            policies: [],
        },
        images: ['https://via.placeholder.com/160x280?text=民宿6'],
        rooms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
const HomeStayPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    // 搜索参数状态
    const [searchParams, setSearchParams] = useState({
        city: '上海',
        checkIn: dayjs().toDate(),
        checkOut: dayjs().add(1, 'day').toDate(),
        guests: 1,
        rooms: 1,
        beds: 1,
        keyword: '',
        selectedTags: [],
    });
    // UI状态
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [homestays, setHomestays] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    // 首次加载时显示热门民宿推荐
    useEffect(() => {
        loadPopularHomestays();
    }, []);
    // 加载热门民宿推荐
    const loadPopularHomestays = () => {
        setLoading(true);
        try {
            // 模拟异步加载延迟
            setTimeout(() => {
                setHomestays(MOCK_HOMESTAYS);
                setPagination({ page: 1, limit: 20, total: MOCK_HOMESTAYS.length });
                setLoading(false);
            }, 500);
        }
        catch (error) {
            console.error('Failed to load popular homestays:', error);
            setLoading(false);
        }
    };
    // 下拉刷新处理
    const handlePullRefresh = () => {
        if (refreshing)
            return;
        setRefreshing(true);
        // 模拟刷新延迟
        setTimeout(() => {
            setHomestays(MOCK_HOMESTAYS);
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
        setSearchParams((prev) => ({
            ...prev,
            city,
        }));
    };
    // 处理日期变化
    const handleDateChange = (checkIn, checkOut) => {
        setSearchParams((prev) => ({
            ...prev,
            checkIn,
            checkOut,
        }));
    };
    // 处理房间类型变化
    const handleRoomTypeChange = (rooms, beds, guests) => {
        setSearchParams((prev) => ({
            ...prev,
            rooms,
            beds,
            guests,
        }));
    };
    // 处理快速筛选标签
    const handleTagSelect = (tagId, selected) => {
        setSearchParams((prev) => {
            const tags = new Set(prev.selectedTags || []);
            if (selected) {
                tags.add(tagId);
            }
            else {
                tags.delete(tagId);
            }
            return {
                ...prev,
                selectedTags: Array.from(tags),
            };
        });
    };
    // 处理搜索
    const handleSearch = async () => {
        if (!searchParams.city) {
            alert('请选择城市');
            return;
        }
        setLoading(true);
        try {
            // 模拟搜索延迟
            await new Promise(resolve => setTimeout(resolve, 800));
            // 根据选中的城市和标签过滤数据
            const filtered = MOCK_HOMESTAYS.filter(homestay => {
                // 城市过滤
                if (homestay.baseInfo.city !== searchParams.city) {
                    return false;
                }
                // 标签过滤（如果需要）
                if (searchParams.selectedTags && searchParams.selectedTags.length > 0) {
                    // TODO: 根据实际的标签逻辑过滤
                }
                return true;
            });
            setHomestays(filtered);
            setPagination({ page: 1, limit: 20, total: filtered.length });
            // 构建查询参数并跳转到搜索结果页
            const queryParams = new URLSearchParams({
                city: searchParams.city,
                checkIn: searchParams.checkIn ? dayjs(searchParams.checkIn).format('YYYY-MM-DD') : '',
                checkOut: searchParams.checkOut ? dayjs(searchParams.checkOut).format('YYYY-MM-DD') : '',
                rooms: String(searchParams.rooms || 1),
                guests: String(searchParams.guests || 1),
            });
            navigate(`/search/homeStay?${queryParams.toString()}`);
        }
        catch (error) {
            console.error('Failed to search:', error);
            alert('搜索失败，请重试');
        }
        finally {
            setLoading(false);
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
    return (_jsxs("div", { ref: containerRef, className: styles.container, children: [_jsx("div", { className: styles.banner, children: _jsx("div", { className: styles.bannerContent, children: _jsx("span", { children: "\u2728 \u79EF\u5206\u5F53\u94B1\u82B1 - \u6BCF\u665A\u7ACB\u4EAB10\u500D\u79EF\u5206" }) }) }), _jsxs("div", { className: styles.searchSection, children: [_jsx(LocationInput, { value: searchParams.city, city: searchParams.city, onLocationSelect: handleLocationSelect, onCityChange: handleLocationSelect, onNearbyClick: handleNearby }), _jsx(DateTimeRangeSelector, { checkIn: searchParams.checkIn, checkOut: searchParams.checkOut, onDateChange: handleDateChange }), _jsx(RoomTypeSelector, { rooms: searchParams.rooms, beds: searchParams.beds, guests: searchParams.guests, onChange: handleRoomTypeChange }), _jsx(QuickFilters, { tags: QUICK_FILTER_TAGS, selectedTags: searchParams.selectedTags, onTagSelect: handleTagSelect }), _jsx(SearchButton, { loading: loading, onClick: handleSearch, label: "\u67E5\u8BE2" }), _jsx("div", { className: styles.trustText, children: "\u65E0\u5FC6\u4FDD\u969C\uFF0C\u5165\u4F4F\u4E0D\u6EE1\u610F\u968F\u65F6\u9000\u4F4F" })] }), _jsxs("div", { className: styles.listSection, children: [refreshing && (_jsxs("div", { className: styles.refreshTip, children: [_jsx("span", { className: styles.spinner }), "\u6B63\u5728\u5237\u65B0\u6570\u636E\u4E2D..."] })), _jsx("div", { className: styles.listTitle, children: "\uD83D\uDD25 \u70ED\u95E8\u6C11\u5BBF\u63A8\u8350" }), _jsx("div", { className: styles.cardGrid, children: loading ? (
                        // 显示骨架屏加载状态
                        _jsx(HomeStayCardSkeleton, { count: 6 })) : homestays.length > 0 ? (
                        // 显示卡片列表
                        homestays.map((homestay) => (_jsx("div", { className: styles.cardWrapper, children: _jsx(HomeStayCard, { data: homestay, onClick: () => navigate(`/hotel-detail/homestay/${homestay._id}`), showStar: true }) }, homestay._id)))) : (_jsx("div", { className: styles.emptyState, children: _jsx("p", { children: "\u6682\u65E0\u76F8\u5173\u6C11\u5BBF" }) })) }), loading && (_jsx("div", { className: styles.loadingState, children: _jsx("p", { children: "\u52A0\u8F7D\u4E2D..." }) }))] }), _jsx("div", { className: styles.bottomSpacer })] }));
};
export default HomeStayPage;
//# sourceMappingURL=index.js.map