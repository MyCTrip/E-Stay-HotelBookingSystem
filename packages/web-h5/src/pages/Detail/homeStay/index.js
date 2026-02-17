import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel';
import BasicInfo from '../../../components/homestay/detail/BasicInfo';
import ReviewSection from '../../../components/homestay/detail/ReviewSection';
import RoomSelector from '../../../components/homestay/detail/RoomSelector';
import LocationMap from '../../../components/homestay/detail/LocationMap';
import FacilitiesGrid from '../../../components/homestay/detail/FacilitiesGrid';
import HostInfo from '../../../components/homestay/detail/HostInfo';
import styles from './index.module.css';
/**
 * 民宿详情页
 */
export default function DetailHomeStay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [homestay, setHomestay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    // 模拟加载数据
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            // 生成模拟详情数据
            const mockData = {
                _id: id || 'homestay-1',
                merchantId: 'merchant-1',
                baseInfo: {
                    nameCn: 'Nice公寓 巨幕投影+接待外宾民用广场南京路步行街',
                    nameEn: 'Nice Apartment',
                    address: '上海市黄浦区中福城三期北楼-正门(广西北路汉口路)',
                    city: 'Shanghai',
                    star: 5.0,
                    phone: '021-12345678',
                    description: '温暖舒适的民宿空间，享受家的感觉。大空间、高端品质、位置优越。',
                    images: [
                        'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
                    ],
                    facilities: [
                        { category: 'public', content: '停车位', items: [] },
                        { category: 'public', content: '冷暖空调', items: [] },
                        { category: 'public', content: '电梯', items: [] },
                        { category: 'room', content: '暖气', items: [] },
                        { category: 'room', content: '厨房', items: [] },
                        { category: 'room', content: '冰箱', items: [] },
                        { category: 'room', content: '洗衣机', items: [] },
                        { category: 'room', content: '麻将机', items: [] },
                    ],
                    policies: [],
                    surroundings: [],
                    propertyType: 'homeStay',
                },
                typeConfig: {
                    hostName: 'Nice公寓',
                    hostPhone: '13800138000',
                    hostAvatar: 'https://ui-avatars.com/api/?name=Nice',
                    responseTimeHours: 1,
                    instantBooking: true,
                    minStay: 1,
                    maxStay: 30,
                    securityDeposit: 100,
                    amenityTags: ['WiFi', '厨房', '空调'],
                },
                rooms: [
                    {
                        _id: 'room-1',
                        hotelId: 'homestay-1',
                        baseInfo: {
                            type: '市景五室二厅套房',
                            price: 1280,
                            images: ['https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop'],
                            maxOccupancy: 12,
                            facilities: [],
                            policies: [],
                            bedRemark: [],
                        },
                        category: 'homestay',
                        typeConfig: {
                            pricePerNight: 1280,
                            minimumStay: 1,
                            maxGuests: 12,
                            instantBook: true,
                        },
                        headInfo: {
                            size: '190 sqm',
                            floor: '5',
                            wifi: true,
                            windowAvailable: true,
                            smokingAllowed: false,
                        },
                        bedInfo: [],
                    },
                    {
                        _id: 'room-2',
                        hotelId: 'homestay-1',
                        baseInfo: {
                            type: '惠选经典三室一厅套房',
                            price: 840,
                            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
                            maxOccupancy: 6,
                            facilities: [],
                            policies: [],
                            bedRemark: [],
                        },
                        category: 'homestay',
                        typeConfig: {
                            pricePerNight: 840,
                            minimumStay: 1,
                            maxGuests: 6,
                            instantBook: true,
                        },
                        headInfo: {
                            size: '95 sqm',
                            floor: '3',
                            wifi: true,
                            windowAvailable: true,
                            smokingAllowed: false,
                        },
                        bedInfo: [],
                    },
                    {
                        _id: 'room-3',
                        hotelId: 'homestay-1',
                        baseInfo: {
                            type: '温馨二室二厅套房',
                            price: 1189,
                            images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop'],
                            maxOccupancy: 4,
                            facilities: [],
                            policies: [],
                            bedRemark: [],
                        },
                        category: 'homestay',
                        typeConfig: {
                            pricePerNight: 1189,
                            minimumStay: 1,
                            maxGuests: 4,
                            instantBook: true,
                        },
                        headInfo: {
                            size: '95 sqm',
                            floor: '2',
                            wifi: true,
                            windowAvailable: true,
                            smokingAllowed: false,
                        },
                        bedInfo: [],
                    },
                ],
            };
            setHomestay(mockData);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);
    if (loading) {
        return (_jsx("div", { className: styles.loading, children: _jsx("div", { className: styles.spinner }) }));
    }
    if (!homestay) {
        return (_jsx("div", { className: styles.error, children: _jsx("p", { children: "\u672A\u627E\u5230\u6C11\u5BBF\u4FE1\u606F" }) }));
    }
    const room = homestay.rooms?.[selectedRoom];
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.backButton, onClick: () => navigate(-1), children: "\u2039" }), _jsx("span", { className: styles.title, children: "\u6237\u9009\u6C11\u5BBF" }), _jsxs("div", { className: styles.headerActions, children: [_jsx("button", { className: `${styles.actionButton} ${isFavorite ? styles.favorited : ''}`, onClick: () => setIsFavorite(!isFavorite), title: "\u6536\u85CF", children: isFavorite ? '❤️' : '🤍' }), _jsx("button", { className: styles.actionButton, title: "\u5206\u4EAB", children: "\uD83D\uDCE4" }), _jsx("button", { className: styles.actionButton, title: "\u66F4\u591A", children: "\u22EF" })] })] }), _jsx(ImageCarousel, { images: homestay.baseInfo.images }), _jsx(BasicInfo, { title: homestay.baseInfo.nameCn, location: homestay.baseInfo.address, rating: homestay.baseInfo.star, reviewCount: Math.floor(Math.random() * 500 + 50), isSuperhost: false, description: homestay.baseInfo.description || '暂无描述', amenities: homestay.baseInfo.facilities?.map(f => f.name) || [] }), _jsx(ReviewSection, { rating: homestay.baseInfo.star, reviewCount: Math.floor(Math.random() * 500 + 50), cleanliness: 4.8, communication: 4.9, checkIn: 4.7, accuracy: 4.6, location: 4.8, value: 4.5 }), _jsx(RoomSelector, { rooms: homestay.rooms?.map((room, index) => ({
                    id: room._id || `room-${index}`,
                    name: room.name,
                    price: room.price,
                    originalPrice: room.price * 1.2,
                    description: room.description || '',
                    maxGuests: room.maxGuests || 2,
                    amenities: room.amenities || []
                })) || [], onRoomSelect: (roomId) => setSelectedRoom(parseInt(roomId)) }), _jsx(LocationMap, { location: homestay.baseInfo.address, transportInfo: ['地铁1号线 距离 500m', '公交10路 距离 200m'], nearbyAttractions: ['故宫', '颐和园', '北欧海贸城'] }), _jsx(HostInfo, { name: homestay.typeConfig?.hostName || '房东', avatar: homestay.typeConfig?.hostAvatar, isSuperhost: false, yearsAsHost: 3, responseTime: "1\u5C0F\u65F6\u5185", responseRate: 98, bio: homestay.typeConfig?.bio || '热情待客', languages: ['中文', '英文'], verifications: ['身份证已验证', '电话已验证'] }), _jsx(FacilitiesGrid, { facilities: homestay.baseInfo.facilities?.map((f) => ({
                    name: f.name || f.content || 'Facility',
                    icon: f.icon || '✓',
                    available: true
                })) || [] }), room && (_jsxs("div", { className: styles.footer, children: [_jsx("div", { className: styles.priceInfo, children: _jsxs("div", { className: styles.price, children: ["\u00A5", room.baseInfo.price, _jsx("span", { className: styles.priceUnit, children: "/\u665A" })] }) }), _jsx("button", { className: styles.bookButton, children: "\u7ACB\u5373\u9884\u8BA2" })] }))] }));
}
//# sourceMappingURL=index.js.map