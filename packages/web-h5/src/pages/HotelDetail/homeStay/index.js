import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 民宿详情页 - 主容器
 * 集成 Zustand Store 管理详情数据
 * 集成数据中间件统一处理数据
 */
import { useRef, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useHomestayStore, NEARBY_ROOMS, initializeDetailData, DETAIL_CENTER_DATA_MOCK, } from '@estay/shared';
import DetailLayout from '../../../layouts/DetailLayout';
import DetailTabs from '../../../components/homestay/detail/DetailTabs';
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel';
import HotelInfo from '../../../components/homestay/detail/HotelInfo';
import DatePicker from '../../../components/homestay/detail/DatePicker';
import RoomSelection from '../../../components/homestay/detail/RoomSelection';
import ReviewSection from '../../../components/homestay/detail/ReviewSection';
import FacilitiesSection from '../../../components/homestay/detail/FacilitiesSection';
import PolicySection from '../../../components/homestay/detail/PolicySection';
import FeeNoticeSection from '../../../components/homestay/detail/FeeNoticeSection';
import NearbyRecommendations from '../../../components/homestay/detail/NearbyRecommendations';
import HostInfo from '../../../components/homestay/detail/HostInfo';
import BookingBar from '../../../components/homestay/detail/BookingBar';
import PropertyCardContainer from '../../../components/homestay/detail/PropertyCardContainer';
import RecommendCard from '../../../components/homestay/home/RecommendCard';
import styles from './index.module.scss';
/**
 * 适配函数：从共享类型的Room转换为RoomSelection组件期望的格式
 */
const adaptSharedRoomToSelection = (room) => {
    // 构建 priceList：如果 room 有 priceList，使用它；否则从 price 构建
    const priceList = Array.isArray(room.priceList)
        ? room.priceList
        : [{
                packageId: 1,
                originPrice: room.price?.originPrice || 0,
                currentPrice: room.price?.currentPrice || 0,
            }];
    return {
        id: room._id || '',
        name: room.basicInfo?.name || 'Unknown Room',
        area: String(room.basicInfo?.area || 0) + '㎡',
        beds: Array.isArray(room.basicInfo?.bedRemark)
            ? room.basicInfo.bedRemark.join(',')
            : (room.basicInfo?.bedRemark || 'Unknown'),
        guests: String(room.basicInfo?.guests || 'Unknown'),
        image: room.banner?.images?.[0]?.url || '',
        priceList: priceList,
        priceNote: '晚/起',
        benefits: [],
        packageCount: room.packageCount || 0,
        confirmTime: '30分钟',
        showBreakfastTag: room.showBreakfastTag,
        breakfastCount: room.breakfastCount,
        showCancelTag: room.showCancelTag,
        cancelMunite: room.cancelMunite,
        hasPackageDetail: room.hasPackageDetail,
        packages: room.packages,
    };
};
/**
 * 页面内容组件 - 接收registerSentinel来注册各区域的哨兵
 */
const PageContent = ({ registerSentinel, expandNearbyProperties, onExpandNearbyProperties, initialData, checkInDate, checkOutDate, deadlineTime, onDateChange, onSelectRoom, recommendedHomestays, initializedData, }) => {
    // 为每个 section 创建哨兵 ref
    const sentinelRefs = {
        overview: useRef(null),
        rooms: useRef(null),
        reviews: useRef(null),
        facilities: useRef(null),
        policies: useRef(null),
        knowledge: useRef(null),
        nearby: useRef(null),
        host: useRef(null),
    };
    // 选中的房间名称状态
    const [selectedRoomName, setSelectedRoomName] = useState('市景五室二厅套房');
    // 转换 NEARBY_ROOMS 为 RoomSelection 组件期望的格式
    const adaptedNearbyRooms = useMemo(() => NEARBY_ROOMS.map(adaptSharedRoomToSelection), []);
    // 处理房间选择 - 更新本地状态和调用父组件回调
    const handleSelectRoomInContent = (room) => {
        setSelectedRoomName(room.name);
        onSelectRoom?.(room);
    };
    /**
     * 组件挂载时注册所有哨兵
     */
    useEffect(() => {
        if (registerSentinel) {
            Object.entries(sentinelRefs).forEach(([key, ref]) => {
                if (ref.current) {
                    registerSentinel(key, ref.current);
                }
            });
        }
    }, [registerSentinel]);
    return (_jsxs(_Fragment, { children: [_jsx(ImageCarousel, { images: initializedData.images?.map(img => img.url) || [] }), _jsx(HotelInfo, { data: initializedData.hotelInfo }), _jsx("div", { ref: sentinelRefs.overview, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx("div", { style: { height: '76px' } }) }), _jsx("div", { ref: sentinelRefs.rooms, style: { height: 0 } }), _jsxs("div", { className: `${styles.roomsSection} ${styles.sectionGap}`, children: [_jsxs(PropertyCardContainer, { showLabel: false, showExpandBtn: false, children: [_jsx(DatePicker, { checkInDate: checkInDate, checkOutDate: checkOutDate, onDateChange: onDateChange }), _jsx(RoomSelection, { rooms: initializedData.rooms, displayCount: 1, onSelectRoom: handleSelectRoomInContent, checkIn: checkInDate, checkOut: checkOutDate })] }), _jsx(PropertyCardContainer, { showLabel: true, labelText: "\u540C\u623F\u4E1C\u9644\u8FD1\u5176\u4ED6\u623F\u6E90", tooltipText: "\u63A8\u8350\u540C\u623F\u4E1C\u7684\u5176\u4ED6\u623F\u6E90\uFF0C\u9AD8\u6027\u4EF7\u6BD4\u9009\u62E9", showExpandBtn: true, expandBtnText: "\u5C55\u5F00\u67E5\u770B\u5168\u90E8\u623F\u6E90", isExpanded: expandNearbyProperties, onExpandToggle: () => onExpandNearbyProperties(!expandNearbyProperties), children: _jsx(RoomSelection, { rooms: adaptedNearbyRooms, displayCount: expandNearbyProperties ? adaptedNearbyRooms.length : 2, onSelectRoom: handleSelectRoomInContent, checkIn: checkInDate, checkOut: checkOutDate }) })] }), _jsx("div", { ref: sentinelRefs.reviews, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(ReviewSection, { hostelId: initialData._id || '', roomName: selectedRoomName, reviews: [] }) }), _jsx("div", { ref: sentinelRefs.facilities, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(FacilitiesSection, { facilities: initializedData.facilities, policiesData: initializedData.policies, feeInfoData: initializedData.feeNotice }) }), _jsx("div", { ref: sentinelRefs.policies, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(PolicySection, { policies: initializedData.policies, checkInDate: checkInDate, checkOutDate: checkOutDate, facilitiesData: initializedData.facilities, feeInfoData: initializedData.feeNotice }) }), _jsx("div", { className: styles.sectionGap, children: _jsx(FeeNoticeSection, { feeInfo: initializedData.feeNotice, policiesData: initializedData.policies, facilitiesData: initializedData.facilities }) }), _jsx("div", { ref: sentinelRefs.host, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(HostInfo, { data: initializedData.hostInfo, hostInfo: initializedData.hostInfo }) }), _jsx("div", { ref: sentinelRefs.knowledge, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(NearbyRecommendations, { surroundings: initializedData.surroundings?.surroundings, baseInfo: initializedData.surroundings }) }), _jsx("div", { ref: sentinelRefs.nearby, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsxs("div", { style: { padding: '16px' }, children: [_jsx("h3", { style: { marginBottom: '12px', fontSize: '16px', fontWeight: '600' }, children: "\u5468\u8FB9\u76F8\u4F3C\u623F\u5C4B" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: recommendedHomestays.length > 0 ? (recommendedHomestays.map((homestay) => (_jsx("div", { children: _jsx(RecommendCard, { homestay: homestay }) }, homestay._id)))) : (_jsx("p", { children: "\u6682\u65E0\u63A8\u8350\u623F\u5C4B" })) })] }) }), _jsx("div", { style: { height: '60px' } })] }));
};
const DetailPage = () => {
    // 获取 URL 参数
    const { id } = useParams();
    // 获取 Store 状态和 Action
    const { currentHomestay, detailContext, searchParams, updateDetailContext, detailLoading, recommendedHomestays, loadRecommendedHomestays, fetchHomestayDetail, startEditingDetail, setDetailLocalCopy, commitDetailLocalCopy, revertDetailLocalCopy, } = useHomestayStore();
    // 本地状态
    const [activeTab, setActiveTab] = useState('overview');
    const [initializedData, setInitializedData] = useState(null);
    const [hasInitializedDates, setHasInitializedDates] = useState(false);
    // 日期格式化辅助函数 - 将任何日期格式转换为 MM-DD
    const formatDateToMMDD = (date) => {
        if (!date)
            return '';
        let dateObj;
        // 如果是字符串
        if (typeof date === 'string') {
            // 如果已经是 MM-DD 格式，直接返回
            if (/^\d{2}-\d{2}$/.test(date))
                return date;
            // 如果是 YYYY-MM-DD 格式，提取 MM-DD
            if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
                const parts = date.split('-');
                return `${parts[1]}-${parts[2]}`;
            }
            // 其他格式，尝试解析为日期对象
            dateObj = new Date(date);
        }
        else if (date instanceof Date) {
            dateObj = date;
        }
        else {
            return '';
        }
        // 确保日期有效
        if (isNaN(dateObj.getTime()))
            return '';
        // 转换为 MM-DD 格式
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    };
    // 首次加载详情和推荐
    useEffect(() => {
        if (id) {
            fetchHomestayDetail(id);
            loadRecommendedHomestays();
            // 进入详情页时，创建本地副本用于编辑
            startEditingDetail();
        }
    }, [id, fetchHomestayDetail, loadRecommendedHomestays, startEditingDetail]);
    // 从搜索参数初始化详情页日期，并初始化中间件数据（仅一次）
    useEffect(() => {
        // 只在尚未初始化时执行一次
        if (hasInitializedDates)
            return;
        let effectiveSearchParams = searchParams;
        // 如果 Store 中没有 searchParams，尝试从 localStorage 恢复
        if (!effectiveSearchParams) {
            try {
                const stored = localStorage.getItem('homestay-store');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    effectiveSearchParams = parsed.state?.searchParams;
                }
            }
            catch (e) {
                console.warn('Failed to restore searchParams from localStorage', e);
            }
        }
        // 1. 如果 searchParams 存在，用其日期初始化 detailContext（转换为 MM-DD 格式）
        if (effectiveSearchParams?.checkIn && effectiveSearchParams?.checkOut) {
            const checkInStr = formatDateToMMDD(effectiveSearchParams.checkIn);
            const checkOutStr = formatDateToMMDD(effectiveSearchParams.checkOut);
            if (checkInStr && checkOutStr) {
                updateDetailContext({
                    checkInDate: checkInStr,
                    checkOutDate: checkOutStr,
                });
                setHasInitializedDates(true);
            }
        }
        else {
            // 没有搜索参数时，使用默认日期（今天和明天）
            const today = formatDateToMMDD(new Date().toISOString());
            const tomorrow = formatDateToMMDD(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
            updateDetailContext({
                checkInDate: today,
                checkOutDate: tomorrow,
            });
            setHasInitializedDates(true);
        }
        // 2. 初始化中间件数据
        const data = initializeDetailData(DETAIL_CENTER_DATA_MOCK);
        setInitializedData(data);
    }, [searchParams, hasInitializedDates, updateDetailContext]);
    // 转换 currentHomestay 为 HomeStayData 格式
    const homeStayData = currentHomestay
        ? {
            _id: currentHomestay._id,
            baseInfo: {
                nameCn: currentHomestay.baseInfo.name,
                address: currentHomestay.baseInfo.address,
                star: currentHomestay.baseInfo.star || 5,
                reviewCount: currentHomestay.baseInfo.reviewCount || 0,
                price: currentHomestay.rooms?.[0]?.price?.currentPrice || currentHomestay.rooms?.[0]?.price?.originPrice || 0,
            },
            images: currentHomestay.images || [],
            price: currentHomestay.rooms?.[0]?.price?.currentPrice || currentHomestay.rooms?.[0]?.price?.originPrice || 0,
            location: currentHomestay.baseInfo.city,
            host: {
                name: '房东',
                avatar: 'https://picsum.photos/40/40?random=host',
            },
        }
        : null;
    // 处理预订按钮点击
    const handleBook = () => {
        console.log('Book clicked');
    };
    // 处理房东联系
    const handleContactHost = () => {
        console.log('Contact host');
        // TODO: 进入与房东的聊天界面
    };
    // 处理日期变更 - 使用本地副本机制
    const handleDateChange = (checkIn, checkOut) => {
        if (detailContext.isEditing) {
            // 编辑模式：更新本地副本
            setDetailLocalCopy({
                checkInDate: checkIn,
                checkOutDate: checkOut,
            });
        }
        else {
            // 非编辑模式：直接更新上下文（向后兼容）
            updateDetailContext({
                checkInDate: checkIn,
                checkOutDate: checkOut,
            });
        }
    };
    // 处理保存修改
    const handleSave = () => {
        commitDetailLocalCopy();
        console.log('Changes saved');
    };
    // 处理取消修改
    const handleCancel = () => {
        revertDetailLocalCopy();
        console.log('Changes cancelled');
    };
    // 处理房间选择
    const handleSelectRoom = (room) => {
        // 更新Store中的selectedRoomId
        if (detailContext.isEditing) {
            // 编辑模式：更新本地副本
            setDetailLocalCopy({
                selectedRoomId: room.id,
            });
        }
        else {
            // 显示模式：直接更新context
            updateDetailContext({
                selectedRoomName: room.name,
                selectedRoomId: room.id,
            });
        }
    };
    // 处理返回
    const handleBack = () => {
        window.history.back();
    };
    // 处理分享
    const handleShare = () => {
        console.log('Share clicked');
        // TODO: 分享功能
    };
    // 处理收藏
    const handleCollectionChange = () => {
        console.log('Collection toggled');
    };
    if (detailLoading || !homeStayData || !initializedData) {
        return (_jsx("div", { className: styles.container, children: _jsx("div", { style: { padding: '20px', textAlign: 'center' }, children: "\u52A0\u8F7D\u4E2D..." }) }));
    }
    return (_jsx(DetailLayout, { data: homeStayData, activeTab: activeTab, onTabChange: setActiveTab, onContactHost: handleContactHost, onBack: handleBack, onShare: handleShare, onCollectionChange: handleCollectionChange, tabs: _jsx(DetailTabs, {}), footer: _jsx(BookingBar, { data: homeStayData, checkIn: detailContext.checkInDate, checkOut: detailContext.checkOutDate, onBook: handleBook, onContactHost: handleContactHost, onDateChange: handleDateChange, onSave: detailContext.isEditing ? handleSave : undefined, onCancel: detailContext.isEditing ? handleCancel : undefined, isEditing: detailContext.isEditing }), children: _jsx(PageContent, { expandNearbyProperties: detailContext.expandNearbyProperties, onExpandNearbyProperties: (expand) => updateDetailContext({ expandNearbyProperties: expand }), initialData: homeStayData, checkInDate: detailContext.checkInDate, checkOutDate: detailContext.checkOutDate, deadlineTime: detailContext.deadlineTime, onDateChange: handleDateChange, onSelectRoom: handleSelectRoom, recommendedHomestays: recommendedHomestays, initializedData: initializedData || { hotelInfo: {}, facilities: [], policies: {}, feeNotice: {}, hostInfo: {}, surroundings: {} } }) }));
};
export default DetailPage;
//# sourceMappingURL=index.js.map