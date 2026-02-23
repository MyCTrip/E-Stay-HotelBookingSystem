import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 民宿详情页 - 主容器
 * 集成 Zustand Store 管理详情数据
 */
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHomestayStore, NEARBY_ROOMS } from '@estay/shared';
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
 * 页面内容组件 - 接收registerSentinel来注册各区域的哨兵
 */
const PageContent = ({ registerSentinel, expandNearbyProperties, onExpandNearbyProperties, initialData, checkInDate, checkOutDate, deadlineTime, onDateChange, recommendedHomestays, currentRooms, }) => {
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
    return (_jsxs(_Fragment, { children: [_jsx(ImageCarousel, { images: initialData.images }), _jsx(HotelInfo, { data: initialData }), _jsx("div", { ref: sentinelRefs.overview, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx("div", { style: { height: '76px' } }) }), _jsx("div", { ref: sentinelRefs.rooms, style: { height: 0 } }), _jsxs("div", { className: `${styles.roomsSection} ${styles.sectionGap}`, children: [_jsxs(PropertyCardContainer, { showLabel: false, showExpandBtn: false, children: [_jsx(DatePicker, { onDateChange: onDateChange }), _jsx(RoomSelection, { data: initialData, displayCount: 1, onSelectRoom: (room) => setSelectedRoomName(room.name), checkIn: checkInDate, checkOut: checkOutDate })] }), _jsx(PropertyCardContainer, { showLabel: true, labelText: "\u540C\u623F\u4E1C\u9644\u8FD1\u5176\u4ED6\u623F\u6E90", tooltipText: "\u63A8\u8350\u540C\u623F\u4E1C\u7684\u5176\u4ED6\u623F\u6E90\uFF0C\u9AD8\u6027\u4EF7\u6BD4\u9009\u62E9", showExpandBtn: true, expandBtnText: "\u5C55\u5F00\u67E5\u770B\u5168\u90E8\u623F\u6E90", isExpanded: expandNearbyProperties, onExpandToggle: () => onExpandNearbyProperties(!expandNearbyProperties), children: _jsx(RoomSelection, { data: initialData, rooms: NEARBY_ROOMS, displayCount: expandNearbyProperties ? NEARBY_ROOMS.length : 2, checkIn: checkInDate, checkOut: checkOutDate }) })] }), _jsx("div", { ref: sentinelRefs.reviews, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(ReviewSection, { hostelId: initialData._id, roomName: selectedRoomName }) }), _jsx("div", { ref: sentinelRefs.facilities, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(FacilitiesSection, { data: initialData, roomName: selectedRoomName }) }), _jsx("div", { ref: sentinelRefs.policies, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(PolicySection, { data: initialData, checkInDate: checkInDate, checkInTime: "14:00", deadlineTime: deadlineTime, roomName: selectedRoomName }) }), _jsx("div", { className: styles.sectionGap, children: _jsx(FeeNoticeSection, { deposit: 500, standardGuests: 2, joinNumber: 2, joinPrice: 100, otherDescription: "\u623F\u4E1C\u8981\u6C42\u8BF7\u4FDD\u6301\u623F\u95F4\u6574\u6D01\uFF0C\u4E0D\u53EF\u5728\u623F\u95F4\u5185\u5438\u70DF\uFF0C\u5BA0\u7269\u9700\u63D0\u524D\u6C9F\u901A\u3002", showOther: true, roomName: selectedRoomName }) }), _jsx("div", { ref: sentinelRefs.host, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(HostInfo, { data: initialData }) }), _jsx("div", { ref: sentinelRefs.knowledge, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsx(NearbyRecommendations, { location: initialData.location || '上海' }) }), _jsx("div", { ref: sentinelRefs.nearby, style: { height: 0 } }), _jsx("div", { className: styles.sectionGap, children: _jsxs("div", { style: { padding: '16px' }, children: [_jsx("h3", { style: { marginBottom: '12px', fontSize: '16px', fontWeight: '600' }, children: "\u5468\u8FB9\u76F8\u4F3C\u623F\u5C4B" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: recommendedHomestays.length > 0 ? (recommendedHomestays.map((homestay) => (_jsx("div", { children: _jsx(RecommendCard, { homestay: homestay }) }, homestay._id)))) : (_jsx("p", { children: "\u6682\u65E0\u63A8\u8350\u623F\u5C4B" })) })] }) }), _jsx("div", { style: { height: '60px' } })] }));
};
const DetailPage = () => {
    // 获取 URL 参数
    const { id } = useParams();
    // 获取 Store 状态和 Action
    const { currentHomestay, detailContext, updateDetailContext, detailLoading, recommendedHomestays, loadRecommendedHomestays, fetchHomestayDetail, } = useHomestayStore();
    // 本地状态
    const [activeTab, setActiveTab] = useState('overview');
    // 首次加载详情和推荐
    useEffect(() => {
        if (id) {
            fetchHomestayDetail(id);
            loadRecommendedHomestays();
        }
    }, [id, fetchHomestayDetail, loadRecommendedHomestays]);
    // 转换 currentHomestay 为 HomeStayData 格式
    const homeStayData = currentHomestay
        ? {
            _id: currentHomestay._id,
            baseInfo: {
                nameCn: currentHomestay.baseInfo.nameCn,
                address: currentHomestay.baseInfo.address,
                star: currentHomestay.baseInfo.star,
                reviewCount: 90, // 使用默认值
                price: currentHomestay.rooms?.[0]?.baseInfo?.price || 0,
            },
            images: currentHomestay.images || [],
            price: currentHomestay.rooms?.[0]?.baseInfo?.price || 0,
            location: currentHomestay.baseInfo.city,
            host: {
                name: currentHomestay.typeConfig?.hostName || '房东',
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
    // 处理日期变更
    const handleDateChange = (checkIn, checkOut) => {
        updateDetailContext({
            checkInDate: checkIn,
            checkOutDate: checkOut,
        });
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
    if (detailLoading || !homeStayData) {
        return (_jsx("div", { className: styles.container, children: _jsx("div", { style: { padding: '20px', textAlign: 'center' }, children: "\u52A0\u8F7D\u4E2D..." }) }));
    }
    return (_jsx(DetailLayout, { data: homeStayData, activeTab: activeTab, onTabChange: setActiveTab, onContactHost: handleContactHost, onBack: handleBack, onShare: handleShare, onCollectionChange: handleCollectionChange, tabs: _jsx(DetailTabs, {}), footer: _jsx(BookingBar, { data: homeStayData, onBook: handleBook, onContactHost: handleContactHost, onDateChange: handleDateChange }), children: _jsx(PageContent, { expandNearbyProperties: detailContext.expandNearbyProperties, onExpandNearbyProperties: (expand) => updateDetailContext({ expandNearbyProperties: expand }), initialData: homeStayData, checkInDate: detailContext.checkInDate, checkOutDate: detailContext.checkOutDate, deadlineTime: detailContext.deadlineTime, onDateChange: handleDateChange, recommendedHomestays: recommendedHomestays, currentRooms: currentHomestay?.rooms || [] }) }));
};
export default DetailPage;
//# sourceMappingURL=index.js.map