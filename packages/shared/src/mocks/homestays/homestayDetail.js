import { NEARBY_ROOMS } from '../rooms';
/**
 * 民宿详情 Mock 数据
 * 严格遵循 HomeStayHotel 类型结构
 */
export const HOMESTAY_DETAIL_MOCK = {
    // ===== DB字段 =====
    _id: 'homestay-001',
    merchantId: 'merchant-001',
    // ===== 基础信息（DetailBaseInfo）=====
    baseInfo: {
        name: '逸可民宿',
        nameEn: 'Yike Homestay',
        address: '浙江省杭州市上城区清河坊街道清平路1号',
        city: 'hangzhou',
        star: 4.9,
        reviewCount: 128,
        phone: '0571-86123456',
        description: '位于西湖北面，拥有优美的湖景和传统的建筑风格。距西湖步行仅5分钟，环境优雅,交通便利。',
        propertyType: 'homeStay',
    },
    // ===== 房东信息（DetailHostInfo）=====
    hostInfo: {
        name: '王女士',
        responseTimeHours: 1,
        instantBooking: true,
        minStay: 1,
        maxStay: 30,
        avatar: 'https://picsum.photos/80/80?random=host',
        securityDeposit: 500,
        amenityTags: ['温馨', '现代', '干净', '安全'],
    },
    // ===== 入住信息 =====
    checkinInfo: {
        checkinTime: '14:00',
        checkoutTime: '11:00',
    },
    // ===== 地理位置 =====
    location: {
        type: 'Point',
        coordinates: [120.1551, 30.2741],
    },
    // ===== 图片 =====
    images: [
        'https://picsum.photos/600/400?random=main1',
        'https://picsum.photos/600/400?random=main2',
        'https://picsum.photos/600/400?random=main3',
    ],
    // ===== 评论 =====
    reviews: [
        {
            _id: 'review-001',
            userId: 'user-001',
            userName: '张先生',
            rating: 5,
            content: '环境优美，房间宽敞舒适，房东非常热情周到。强烈推荐！',
            createdAt: new Date('2025-02-10'),
            images: ['https://picsum.photos/200/200?random=review1'],
        },
        {
            _id: 'review-002',
            userId: 'user-002',
            userName: '李女士',
            rating: 5,
            content: '地理位置绝佳，离西湖很近，设施完善，下次还会来住。',
            createdAt: new Date('2025-02-05'),
        },
        {
            _id: 'review-003',
            userId: 'user-003',
            userName: '王先生',
            rating: 4,
            content: '总体不错，只是有些房间需要更新一下家具。',
            createdAt: new Date('2025-01-28'),
        },
        {
            _id: 'review-004',
            userId: 'user-004',
            userName: '陈女士',
            rating: 5,
            content: '一个温暖的家！早餐很好吃，房东朋友很贴心。',
            createdAt: new Date('2025-01-15'),
        },
        {
            _id: 'review-005',
            userId: 'user-005',
            userName: '刘先生',
            rating: 5,
            content: '以为会很一般，没想到惊喜这么大。完美！',
            createdAt: new Date('2025-01-02'),
        },
    ],
    reviews_count: 128,
    // ===== 设施分类（FacilityCategory[]）=====
    facilities: [
        {
            id: 'service',
            name: '服务',
            facilities: [
                { id: 'free_parking', name: '免费停车位', available: false },
                { id: 'paid_parking', name: '付费停车位', available: false },
                { id: 'luggage_storage', name: '行李寄存', available: true },
                { id: 'front_desk', name: '前台接待', available: true },
                { id: 'concierge', name: '管家式服务', available: false },
            ],
        },
        {
            id: 'basic',
            name: '基础',
            facilities: [
                { id: 'wifi', name: '无线网络', available: true },
                { id: 'elevator', name: '电梯', available: true },
                { id: 'window', name: '窗户', available: true },
                { id: 'bedroom_ac', name: '卧室 - 冷暖空调', available: true },
                { id: 'living_ac', name: '客厅 - 冷暖空调', available: false },
                { id: 'heater', name: '暖气', available: true },
                { id: 'drying_rack', name: '晾衣架', available: true },
                { id: 'electric_kettle', name: '电热水壶', available: true },
                { id: 'sofa', name: '沙发', available: true },
                { id: 'tv', name: '电视', available: true },
                { id: 'fridge', name: '冰箱', available: true },
                { id: 'washing_machine', name: '洗衣机', available: true },
                { id: 'air_purifier', name: '空气净化器', available: false },
                { id: 'humidifier', name: '加湿器', available: false },
                { id: 'dryer', name: '烘干机', available: false },
                { id: 'iron', name: '电熨斗', available: true },
                { id: 'water', name: '免费瓶装水', available: true },
            ],
        },
        {
            id: 'bathroom',
            name: '卫浴',
            facilities: [
                { id: 'slippers', name: '一次性拖鞋', available: true },
                { id: 'hot_water', name: '热水', available: true },
                { id: 'private_bathroom', name: '独立卫浴', available: true },
                { id: 'hair_dryer', name: '电吹风', available: true },
                { id: 'toiletries', name: '洗浴用品', available: true },
                { id: 'toothbrush', name: '牙具', available: true },
                { id: 'bath_towel', name: '浴巾', available: true },
                { id: 'towel', name: '毛巾', available: true },
                { id: 'smart_toilet', name: '智能马桶', available: false },
            ],
        },
        {
            id: 'kitchen',
            name: '厨房',
            facilities: [
                { id: 'microwave', name: '微波炉', available: false },
                { id: 'tableware', name: '餐具', available: true },
                { id: 'knife_board', name: '刀具菜板', available: true },
                { id: 'cooking_pots', name: '烹饪锅具', available: true },
                { id: 'induction', name: '电磁炉', available: false },
                { id: 'gas_stove', name: '燃气灶', available: false },
                { id: 'detergent', name: '洗涤用品', available: true },
                { id: 'rice_cooker', name: '电饭煲', available: false },
                { id: 'oven', name: '烤箱', available: false },
                { id: 'dining_table', name: '餐桌', available: true },
            ],
        },
        {
            id: 'nearby',
            name: '周边',
            facilities: [
                { id: 'supermarket', name: '超市', available: true },
                { id: 'convenience_store', name: '便利店', available: true },
                { id: 'restaurant', name: '餐厅', available: true },
                { id: 'pharmacy', name: '药店', available: true },
                { id: 'park', name: '公园', available: false },
                { id: 'market', name: '菜市场', available: true },
                { id: 'atm', name: '提款机', available: true },
                { id: 'playground', name: '儿童乐园', available: false },
            ],
        },
        {
            id: 'safety',
            name: '安全',
            facilities: [
                { id: 'smart_lock', name: '智能门锁', available: true },
                { id: 'card_key', name: '门禁卡', available: true },
                { id: 'security', name: '保安', available: false },
                { id: 'fire_alarm', name: '火灾警报器', available: true },
                { id: 'extinguisher', name: '灭火器', available: true },
            ],
        },
        {
            id: 'entertainment',
            name: '娱乐',
            facilities: [{ id: 'projector', name: '投影设备', available: false }],
        },
        {
            id: 'leisure',
            name: '休闲',
            facilities: [{ id: 'living_room', name: '独立客厅', available: true }],
        },
        {
            id: 'children',
            name: '儿童',
            facilities: [
                { id: 'toys', name: '儿童玩具', available: false },
                { id: 'high_chair', name: '儿童餐椅', available: false },
                { id: 'baby_tub', name: '婴儿浴盆', available: false },
            ],
        },
    ],
    // ===== 取消政策（CancellationPolicy[]）=====
    policies: [
        {
            id: 'policy-1',
            title: '灵活取消',
            content: '入住前48小时可免费取消，退款到原账户',
            description: '系统自动处理，立即返款',
            checkInSpan: [
                { early: '14:00', later: '23:00' },
            ],
            checkoutTime: '11:00',
            cancelMinute: 2880, // 48小时
            deadlineTime: 48,
        },
        {
            id: 'policy-2',
            title: '入住规则',
            content: '办理入住时间：14:00-23:00，办理离店时间：08:00-11:00。可根据情况提前/延后（另计费）',
            description: '部分时段可能加收费用',
        },
        {
            id: 'policy-3',
            title: '额外费用',
            content: '每位额外客人另收费¥100/晚；宠物另收费¥50/只/晚；延迟退房¥50/小时',
            description: '合理安排以避免额外费用',
        },
        {
            id: 'policy-4',
            title: '房间守则',
            content: '不允许吸烟（违规罚款¥500），不允许举办聚会，需要保持安静（22:00-08:00）',
            description: '所有客人须遵守，违规将被没收押金',
        },
    ],
    // ===== 周边信息（SurroundingInfo）=====
    surroundings: {
        poi: [
            { type: 'metro', name: '龙翔桥地铁站', distance: { value: 500, unit: 'm' } },
            { type: 'metro', name: '南山路地铁站', distance: { value: 800, unit: 'm' } },
            { type: 'attraction', name: '西湖', distance: { value: 300, unit: 'm' } },
            { type: 'attraction', name: '灵隐寺', distance: { value: 2000, unit: 'm' } },
            { type: 'business', name: '清河坊美食街', distance: { value: 100, unit: 'm' } },
            { type: 'business', name: '南山路文化街', distance: { value: 800, unit: 'm' } },
        ],
    },
    // ===== 房间列表 =====
    rooms: NEARBY_ROOMS,
    // ===== 系统字段 =====
    auditInfo: {
        status: 'approved',
        auditedBy: 'admin-001',
        auditedAt: new Date('2025-01-01'),
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-23'),
};
/**
 * 搜索结果 Mock 数据
 */
export const SEARCH_RESULT_HOMESTAYS = [HOMESTAY_DETAIL_MOCK];
/**
 * 热门民宿 Mock 数据
 */
export const POPULAR_HOMESTAYS = [HOMESTAY_DETAIL_MOCK];
/**
 * 推荐民宿函数
 */
export function getRecommendedHomestays(city, priceMin, priceMax) {
    return [HOMESTAY_DETAIL_MOCK];
}
//# sourceMappingURL=homestayDetail.js.map