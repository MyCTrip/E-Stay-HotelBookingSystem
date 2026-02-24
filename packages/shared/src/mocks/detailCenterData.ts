/**
 * 统一的 Detail 页面中央数据 Mock
 * 包含完整的 DetailCenterData 对象
 * 提供所有16个组件所需的完整数据
 */

import type { DetailCenterData } from '../types'
import { FACILITY_CATEGORIES } from './common/facilities'

/**
 * 完整的 Detail 页面中央数据 Mock
 */
export const DETAIL_CENTER_DATA_MOCK = {
  _id: 'homestay-001',
  merchantId: 'merchant-001',

  // ========== 1. HotelInfo ==========
  baseInfo: {
    _id: 'homestay-001',
    name: '温暖的海滨民宿',
    brand: 'Premium Stay',
    tags: ['海滨', '宠物友好', '免费WiFi', '厨房', '24小时入住'],
    rating: 4.8,
    reviewCount: 328,
    star: 4.8,
    address: '深圳市南山区海滨大道1号',
    area: '180㎡',
    room: '3室2厅2卫',
    bed: 5,
    guests: 10,
    city: '深圳',
    phone: '0755-12345678',
    description: '这是一个温暖舒适的海滨民宿，拥有一流的设施和热情的房东服务。位于深圳南山海滨区域，靠近欢乐谷和海滨公园，交通便利。民宿由热情的房东精心打理，提供温暖的居住环境和优质的服务。',
  },

  // ========== 2. BookingBar ==========
  bookingBar: {
    host: {
      name: '李房东',
      avatar: 'https://picsum.photos/40/40?random=host',
    },
    priceList: [
      { originPrice: 888, currentPrice: 688 },
      { originPrice: 968, currentPrice: 688 },
      { originPrice: 1048, currentPrice: 788 },
    ],
    totalPrice: 2164,
    deadlineTime: 24,
  },

  // ========== 3. FacilitiesSection ==========
  facilites: {
    facilities: FACILITY_CATEGORIES,
  },

  // ========== 4. FeeNoticeSection ==========
  feeNotice: {
    deposit: 500,
    standardGuests: 2,
    joinNumber: 1,
    joinPrice: 100,
    otherDescription: '房东要求保持房间整洁，不可在房间内吸烟。入住时请爱护民宿设施，退房时请整理房间。',
    showOther: true,
  },

  // ========== 5. HostInfo ==========
  hostInfo: {
    name: '李房东',
    avatar: 'https://picsum.photos/100/100?random=host',
    badge: '优秀房东',
    responseRate: 99,
    responseTime: '1小时内',
    totalReviews: 328,
    orderConfirmationRate: 98,
    overallRating: 4.8,
    tags: ['热情好客', '沟通快速', '卫生达标', '推荐指数高', '专业管理'],
  },

  // ========== 6. ImageCarousel ==========
  images: {
    images: [
      { url: 'https://picsum.photos/800/600?random=home1', category: '全景' },
      { url: 'https://picsum.photos/800/600?random=home2', category: '卧室' },
      { url: 'https://picsum.photos/800/600?random=home3', category: '客厅' },
      { url: 'https://picsum.photos/800/600?random=home4', category: '厨房' },
      { url: 'https://picsum.photos/800/600?random=home5', category: '海景' },
    ],
  },

  // ========== 7. NearbyRecommendations ==========
  surroundings: {
    fullAddress: '深圳市南山区海滨大道1号',
    community: {
      name: '海滨社区',
      belongTo: '南山区',
      buildAge: 8,
      buildType: '高层住宅',
    },
    surroundings: [
      {
        type: 'transportations',
        content: [
          { name: '地铁1号线华侨城站', distance: { value: 0.5, unit: 'km' } },
          { name: '公交站（海滨大道）', distance: { value: 0.3, unit: 'km' } },
          { name: '出租车上车点', distance: { value: 0.2, unit: 'km' } },
        ],
      },
      {
        type: 'attractions',
        content: [
          { name: '欢乐谷', distance: { value: 2, unit: 'km' } },
          { name: '海滨公园', distance: { value: 0.8, unit: 'km' } },
          { name: '文化创意园', distance: { value: 1.5, unit: 'km' } },
        ],
      },
      {
        type: 'shopping',
        content: [
          { name: '南山万象城', distance: { value: 1.2, unit: 'km' } },
          { name: '海港城购物广场', distance: { value: 0.6, unit: 'km' } },
          { name: '超级购物中心', distance: { value: 1.8, unit: 'km' } },
        ],
      },
      {
        type: 'restaurants',
        content: [
          { name: '海滨海鲜餐厅', distance: { value: 0.4, unit: 'km' } },
          { name: '茶餐厅街', distance: { value: 0.7, unit: 'km' } },
        ],
      },
    ],
  },

  // ========== 8. PolicySection ==========
  policies: {
    checkInSpan: [
      { early: '14:00', later: '23:00' },
    ],
    checkoutTime: '11:00',
    cancelMinute: 30,
    cancellationHour:'18:00',
    deadlineTime: 24,
    amenities: {
      baby: true,
      children: true,
      elderly: true,
      overseas: true,
      hongKongMacaoTaiwan: true,
      pets: true,
    },
  },

  // ========== 9. RoomCard (列表) ==========
  rooms: [
    {
      _id: 'room-001',
      roomId: 'room-001',
      name: '海景一室一厅套房',
      beds: '1张1.8m双人床,1张1.2m单人床',
      guests: '4人',
      image: 'https://picsum.photos/800/600?random=room1',
      priceList: [
        {
          packageId:1,
          originPrice: 888,
          currentPrice: 688,
        },
        {
          packageId:2,
          originPrice: 968,
          currentPrice: 708,
        },
      ],
      priceNote: '晚/起',
      benefits: ['免费WiFi', '早餐', '接送服务', '免费停车'],
      confirmTime: '30分钟',
      showPackageTag:true,
      packageCount: 2,
      showBreakfastTag: true,
      breakfastCount: 2,
      showCancelTag: true,
      cancelMunite: 30,
      showComfirmTag: true, 
      packages: [
        {
          packageId:1,
          name: '标准套餐',
          showPackageDetail: true,
          showBreakfastTag: true,
          breakfastCount: 2,
          showCancelTag: true,
          cancelMunite: 30,
          showComfirmTag: true,
          confirmTime: 0,
        },
        {
          packageId:2,
          name: '景点接送套餐',
          showPackageDetail: true,
          showBreakfastTag: true,
          breakfastCount: 2,
          showCancelTag: true,
          cancelMunite: 30,
          showComfirmTag: true,
          confirmTime: 30,
        }
      ]
    },
    {
      _id: 'room-002',
      roomId: 'room-002',
      name: '海景两室两厅套房',
      area: '100㎡',
      beds: '2张1.8m双人床,1张1.5m单人床',
      guests: '6人',
      image: 'https://picsum.photos/800/600?random=room2',
      priceList: [
        {
          packageId: 1,
          originPrice: 1088,
          currentPrice: 988,
        },
      ],
      priceNote: '晚/起',
      benefits: ['免费WiFi', '双人早餐', '接送服务', '免费停车', '厨房用具'],
      confirmTime: '30分钟',
      showBreakfastTag: true,
      breakfastCount: 2,
      showCancelTag: true,
      cancelMunite: 30,
      packageCount: 1,
      packages: [
        {
          packageId: 1,
          name: '标准套餐',
          showPackageDetail: false,
          showBreakfastTag: true,
          breakfastCount: 2,
          showCancelTag: true,
          cancelMunite: 30,
          showComfirmTag: true,
          confirmTime: 0,
        },
      ],
    },
    {
      _id: 'room-003',
      roomId: 'room-003',
      name: '经济单间',
      area: '30㎡',
      beds: '1张1.5m双人床',
      guests: '2人',
      image: 'https://picsum.photos/800/600?random=room3',
      priceList: [
        {
          packageId: 1,
          originPrice: 488,
          currentPrice: 388,
        },
      ],
      priceNote: '晚/起',
      benefits: ['免费WiFi', '独立卫浴'],
      confirmTime: '立即确认',
      showBreakfastTag: false,
      showCancelTag: true,
      cancelMunite: 30,
      packageCount: 1,
      packages: [
        {
          packageId: 1,
          name: '基础套餐',
          showPackageDetail: false,
          showBreakfastTag: false,
          showCancelTag: true,
          cancelMunite: 30,
          showComfirmTag: true,
          confirmTime: 0,
        },
      ],
    },
  ],

  // ========== 10-16. RoomDrawer系列 (选中房间) ==========
  selectedRoom: {
    _id: 'room-001',
    hotelId: 'homestay-001',
    
    // 11. RoomDrawerBasicInfo
    basicInfo: {
      name: '海景一室一厅套房',
      type: 'suite',
      area: 60,
      guests: 4,
      bedRemark: ['1张1.8m双人床', '1张1.2m单人床'],
    },
    
    // 10. RoomDrawerBanner
    banner: {
      images: [
        { url: 'https://picsum.photos/800/600?random=room1-1' },
        { url: 'https://picsum.photos/800/600?random=room1-2' },
        { url: 'https://picsum.photos/800/600?random=room1-3' },
      ],
    },
    
    // 12. RoomDrawerFacilities
    facilities: {
      facilities: FACILITY_CATEGORIES,
    },
    
    // 14. RoomDrawerPolicy
    policy: {
      checkInSpan: [
        { early: '14:00', later: '23:00' },
      ],
      checkoutTime: '11:00',
      cancelMinute: 10080,
      deadlineTime: 168,
      amenities: {
        baby: true,
        children: true,
        pets: true,
        elderly: true,
        overseas: true,
        hongKongMacaoTaiwan: true,
      },
    },
    
    // 13. RoomDrawerFeeNotice
    feeNotice: {
      deposit: 300,
      standardGuests: 2,
      joinNumber: 1,
      joinPrice: 100,
      otherDescription: '房间费用已包含清洁费和基础服务费。额外人员按加价收费。',
      showOther: true,
    },
    
    // 16. RoomDrawerPrice
    price: {
      originPrice: 888,
      currentPrice: 688,
      discounts: [
        { name: '早鸟优惠', description: '提前7天预订享受8折优惠', amount: 200 },
        { name: '长住优惠', description: '连住3晚以上享受9折优惠', amount: 100 },
      ],
    },
    
    // 15. RoomPackageDetail - 以packageId为key的映射
    packageDetails: {
      1: {
        roomId: 'room-001',
        packageId: 1,
        title: '标准套餐',
        checkInService: '下午2点至晚上11点灵活入住，房东会提前1小时告知具体入住时间',
        enjoyService: '免费WiFi、中式早餐、免费接送服务、行李寄存、24小时热水',
        details: [
          { lable: '入住时间', value: '14:00之后' },
          { lable: '退房时间', value: '11:00之前' },
          { lable: '早餐', value: '次日免费' },
          { lable: '停车', value: '免费停车位2个' },
          { lable: '网络', value: '100M高速WiFi' },
        ],
      },
      2: {
        roomId: 'room-001',
        packageId: 2,
        title: '景点接送套餐',
        checkInService: '下午2点至晚上11点灵活入住，房东会提前1小时告知具体入住时间及接送时间',
        enjoyService: '免费WiFi、中式早餐、免费接送服务、景点门票优惠、行李寄存、24小时热水',
        details: [
          { lable: '入住时间', value: '14:00之后' },
          { lable: '退房时间', value: '11:00之前' },
          { lable: '早餐', value: '次日免费' },
          { lable: '接送范围', value: '距离酒店5公里内景点' },
          { lable: '接送时间', value: '09:00-18:00' },
          { lable: '停车', value: '免费停车位2个' },
          { lable: '网络', value: '100M高速WiFi' },
        ],
      },
    },
    
    
    // 系统字段
    auditInfo: {
      status: 'approved',
      auditedAt: new Date('2025-01-01'),
      auditedBy: 'admin',
      reason: '审核通过',
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-02-19'),
  },

  // ========== 系统字段 ==========
  auditInfo: {
    status: 'approved',
    auditedAt: new Date('2025-01-01'),
    auditedBy: 'admin',
    reason: '审核通过，资质完整',
  },
  createdAt: new Date('2024-12-01'),
  updatedAt: new Date('2025-02-19'),
} as any
