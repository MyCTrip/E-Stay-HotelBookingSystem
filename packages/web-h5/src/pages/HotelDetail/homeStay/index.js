import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 民宿详情页 - 主容器
 */
import { useRef, useState } from 'react';
import DetailHeader from '../../../components/homestay/detail/DetailHeader';
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel';
import HotelInfo from '../../../components/homestay/detail/HotelInfo';
import DetailTabs from '../../../components/homestay/detail/DetailTabs';
import RoomSelection from '../../../components/homestay/detail/RoomSelection';
import RoomFeatures from '../../../components/homestay/detail/RoomFeatures';
import FacilitiesSection from '../../../components/homestay/detail/FacilitiesSection';
import ReviewSection from '../../../components/homestay/detail/ReviewSection';
import PolicySection from '../../../components/homestay/detail/PolicySection';
import NearbyRecommendations from '../../../components/homestay/detail/NearbyRecommendations';
import HostInfo from '../../../components/homestay/detail/HostInfo';
import BookingBar from '../../../components/homestay/detail/BookingBar';
import styles from './index.module.css';
// 模拟数据 - 实际应从API获取
const mockHomeStayData = {
    _id: '123',
    baseInfo: {
        nameCn: '蓬笙·榕奕美宿',
        address: '上海市黄浦区中福城三期北楼',
        star: 4.9,
        reviewCount: 90,
    },
    images: [
        'https://picsum.photos/1080/900?random=1',
        'https://picsum.photos/1080/900?random=2',
        'https://picsum.photos/1080/900?random=3',
        'https://picsum.photos/1080/900?random=4',
        'https://picsum.photos/1080/900?random=5',
    ],
    price: 1280,
    location: '上海市黄浦区中福城三期北楼',
};
const DetailPage = ({ initialData = mockHomeStayData }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const headerRef = useRef(null);
    // 状态
    const [scrollTop, setScrollTop] = useState(0);
    const [activeTab, setActiveTab] = useState('rooms');
    const [headerOpacity, setHeaderOpacity] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    // 各区域的ref用于滚动联动
    const sectionRefs = {
        rooms: useRef(null),
        facilities: useRef(null),
        reviews: useRef(null),
        policies: useRef(null),
        nearby: useRef(null),
    };
    // 处理滚动
    const handleScroll = (e) => {
        const target = e.currentTarget;
        const top = target.scrollTop;
        setScrollTop(top);
        // 计算顶部操作栏透明度渐变 (图片高度约为320-360px)
        const imageHeight = 300;
        const opacity = Math.min(top / imageHeight, 1);
        setHeaderOpacity(opacity);
        // Tab固定跟踪逻辑
        updateActiveTab(top);
    };
    // 更新activTab - 根据滚动位置检测当前区域
    const updateActiveTab = (scrollPosition) => {
        const tabPositions = {
            rooms: sectionRefs.rooms.current?.offsetTop || 0,
            facilities: sectionRefs.facilities.current?.offsetTop || 1000,
            reviews: sectionRefs.reviews.current?.offsetTop || 2000,
            policies: sectionRefs.policies.current?.offsetTop || 3000,
            nearby: sectionRefs.nearby.current?.offsetTop || 4000,
        };
        // 减去Tab栏高度(44px)以提前识别
        const offset = 50;
        for (const [tab, position] of Object.entries(tabPositions)) {
            if (scrollPosition + offset >= position) {
                setActiveTab(tab);
            }
        }
    };
    // 处理Tab点击 - 滚动到对应位置
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const ref = sectionRefs[tab];
        if (ref.current && containerRef.current) {
            const offset = ref.current.offsetTop - 44; // 减去Tab栏高度
            containerRef.current.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        }
    };
    // 处理预订按钮点击
    const handleBook = () => {
        // 滚动到房型选择区
        const ref = sectionRefs.rooms;
        if (ref.current && containerRef.current) {
            const offset = ref.current.offsetTop - 44;
            containerRef.current.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        }
    };
    return (_jsxs("div", { className: styles.container, ref: containerRef, onScroll: handleScroll, children: [_jsx(DetailHeader, { ref: headerRef, data: initialData, opacity: headerOpacity, onCollectionChange: () => {
                    console.log('Collection toggled');
                } }), _jsxs("div", { className: styles.content, ref: contentRef, children: [_jsx(ImageCarousel, { images: initialData.images }), _jsx(HotelInfo, { data: initialData }), _jsx(DetailTabs, { activeTab: activeTab, onChange: handleTabChange }), _jsx("div", { ref: sectionRefs.rooms, children: _jsx(RoomSelection, { data: initialData }) }), _jsx("div", { ref: sectionRefs.facilities, children: _jsx(FacilitiesSection, { data: initialData }) }), _jsx("div", { ref: sectionRefs.reviews, children: _jsx(ReviewSection, { hostelId: initialData._id }) }), _jsx("div", { ref: sectionRefs.policies, children: _jsx(PolicySection, { data: initialData }) }), _jsx(RoomFeatures, { data: initialData }), _jsx("div", { ref: sectionRefs.nearby, children: _jsx(NearbyRecommendations, { location: initialData.location || '上海' }) }), _jsx(HostInfo, { data: initialData }), _jsx("div", { className: styles.spacer })] }), _jsx(BookingBar, { data: initialData, onBook: handleBook })] }));
};
export default DetailPage;
//# sourceMappingURL=index.js.map