import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 民宿详情页 - 主容器
 * 使用DetailLayout组件实现三层固定结构
 */
import { useRef, useState } from 'react';
import DetailLayout from '../../../layouts/DetailLayout';
import DetailTabs from '../../../components/homestay/detail/DetailTabs';
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel';
import HotelInfo from '../../../components/homestay/detail/HotelInfo';
import DatePicker from '../../../components/homestay/detail/DatePicker';
import RoomSelection from '../../../components/homestay/detail/RoomSelection';
import ReviewSection from '../../../components/homestay/detail/ReviewSection';
import FacilitiesSection from '../../../components/homestay/detail/FacilitiesSection';
import PolicySection from '../../../components/homestay/detail/PolicySection';
import NearbyRecommendations from '../../../components/homestay/detail/NearbyRecommendations';
import HostInfo from '../../../components/homestay/detail/HostInfo';
import BookingBar from '../../../components/homestay/detail/BookingBar';
import PropertyCardContainer from '../../../components/homestay/detail/PropertyCardContainer';
import styles from './index.module.scss';
// 模拟数据 - 实际应从API获取
const mockHomeStayData = {
    _id: '123',
    baseInfo: {
        nameCn: '蓬笙·榕奕美宿',
        address: '上海市黄浦区中福城三期北楼',
        star: 4.9,
        reviewCount: 90,
        price: 1280,
    },
    images: [
        '/img/OIP.jpg',
        '/img/OIP (1).jpg',
        '/img/OIP (2).jpg',
        '/img/OIP (3).jpg',
        '/img/OIP (4).jpg',
        '/img/OIP (5).jpg',
        '/img/OIP (6).jpg',
        '/img/OIP (7).jpg',
        '/img/OIP (8).jpg',
        '/img/OIP (9).jpg',
        '/img/OIP (10).jpg',
        '/img/OIP (11).jpg',
        '/img/OIP (12).jpg',
    ],
    price: 1280,
    location: '上海市黄浦区中福城三期北楼',
    host: {
        name: '逸可民宿',
        avatar: 'https://picsum.photos/40/40?random=host',
    },
};
// 同房东附近的其他房源列表（作为 Room 类型）
const mockNearbyProperties = [
    {
        id: 'nearby1',
        name: '精选人气民宿套房1',
        area: '120㎡',
        beds: '4床',
        guests: '8人',
        image: 'https://picsum.photos/240/320?random=room2',
        price: 899,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车'],
        packageCount: 2,
        showBreakfastTag: true,
        breakfastCount: 1,
        showCancelTag: true,
    },
    {
        id: 'nearby2',
        name: '精选人气民宿套房2',
        area: '150㎡',
        beds: '5床',
        guests: '10人',
        image: 'https://picsum.photos/240/320?random=room3',
        price: 1099,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车', '免费早餐'],
        packageCount: 2,
        showBreakfastTag: true,
        breakfastCount: 2,
        showCancelTag: true,
    },
    {
        id: 'nearby3',
        name: '精选人气民宿套房3',
        area: '180㎡',
        beds: '5床',
        guests: '11人',
        image: 'https://picsum.photos/240/320?random=room4',
        price: 1299,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车'],
        packageCount: 3,
        showBreakfastTag: true,
        breakfastCount: 0,
        showCancelTag: false,
    },
    {
        id: 'nearby4',
        name: '精选人气民宿套房4',
        area: '200㎡',
        beds: '6床',
        guests: '12人',
        image: 'https://picsum.photos/240/320?random=room5',
        price: 1499,
        priceNote: '含税',
        benefits: ['免费WiFi', '免费停车', '免费早餐'],
        packageCount: 3,
        showBreakfastTag: true,
        breakfastCount: 3,
        showCancelTag: true,
    },
];
const DetailPage = ({ initialData = mockHomeStayData }) => {
    // 状态
    const [activeTab, setActiveTab] = useState('overview');
    const [expandNearbyProperties, setExpandNearbyProperties] = useState(false);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    // 各区域的ref用于滚动联动
    const sectionRefs = {
        overview: useRef(null),
        rooms: useRef(null),
        reviews: useRef(null),
        facilities: useRef(null),
        policies: useRef(null),
        knowledge: useRef(null),
        nearby: useRef(null),
        host: useRef(null),
    };
    // 处理预订按钮点击
    const handleBook = () => {
        // 滚动到房型选择区
        console.log('Book clicked');
    };
    // 处理房东联系
    const handleContactHost = () => {
        console.log('Contact host');
        // TODO: 进入与房东的聊天界面
    };
    // 处理日期变更
    const handleDateChange = (checkIn, checkOut) => {
        setCheckInDate(checkIn);
        setCheckOutDate(checkOut);
        console.log('Date changed:', checkIn, checkOut);
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
    // 页面内容结构
    const pageContent = (_jsxs(_Fragment, { children: [_jsx(ImageCarousel, { images: initialData.images }), _jsx(HotelInfo, { data: initialData }), _jsx("div", { ref: sectionRefs.overview, className: styles.sectionGap, children: _jsx("div", { style: { height: '60px' } }) }), _jsxs("div", { ref: sectionRefs.rooms, className: `${styles.roomsSection} ${styles.sectionGap}`, children: [_jsxs(PropertyCardContainer, { showLabel: false, showExpandBtn: false, children: [_jsx(DatePicker, { onDateChange: handleDateChange }), _jsx(RoomSelection, { data: initialData, displayCount: 1 })] }), _jsx("div", { className: styles.nearbyPropertiesSection, children: _jsx(PropertyCardContainer, { showLabel: true, labelText: "\u540C\u623F\u4E1C\u9644\u8FD1\u5176\u4ED6\u623F\u6E90", tooltipText: "\u63A8\u8350\u540C\u623F\u4E1C\u7684\u5176\u4ED6\u623F\u6E90\uFF0C\u9AD8\u6027\u4EF7\u6BD4\u9009\u62E9", showExpandBtn: true, expandBtnText: "\u5C55\u5F00\u67E5\u770B\u5168\u90E8\u623F\u6E90", isExpanded: expandNearbyProperties, onExpandToggle: () => setExpandNearbyProperties(!expandNearbyProperties), children: _jsx(RoomSelection, { data: initialData, rooms: mockNearbyProperties, displayCount: expandNearbyProperties ? mockNearbyProperties.length : 2 }) }) })] }), _jsx("div", { ref: sectionRefs.reviews, className: styles.sectionGap, children: _jsx(ReviewSection, { hostelId: initialData._id }) }), _jsx("div", { ref: sectionRefs.facilities, className: styles.sectionGap, children: _jsx(FacilitiesSection, { data: initialData }) }), _jsx("div", { ref: sectionRefs.policies, className: styles.sectionGap, children: _jsx(PolicySection, { data: initialData, checkInDate: checkInDate, checkInTime: "14:00", deadlinetime: 24 }) }), _jsx("div", { ref: sectionRefs.knowledge, className: styles.sectionGap, children: _jsxs("div", { style: { padding: '16px', color: '#999' }, children: [_jsx("h3", { children: "\u5468\u8FB9\u4FE1\u606F" }), _jsx("p", { children: "\u5185\u5BB9\u5F85\u5B8C\u5584..." })] }) }), _jsx("div", { ref: sectionRefs.nearby, className: styles.sectionGap, children: _jsx(NearbyRecommendations, { location: initialData.location || '上海' }) }), _jsx("div", { ref: sectionRefs.host, className: styles.sectionGap, children: _jsx(HostInfo, { data: initialData }) }), _jsx("div", { style: { height: '20px' } })] }));
    return (_jsx(DetailLayout, { data: initialData, activeTab: activeTab, onTabChange: setActiveTab, onContactHost: handleContactHost, onBack: handleBack, onShare: handleShare, onCollectionChange: handleCollectionChange, tabs: _jsx(DetailTabs, {}), footer: _jsx(BookingBar, { data: initialData, onBook: handleBook, onContactHost: handleContactHost, onDateChange: handleDateChange }), children: pageContent }));
};
export default DetailPage;
//# sourceMappingURL=index.js.map