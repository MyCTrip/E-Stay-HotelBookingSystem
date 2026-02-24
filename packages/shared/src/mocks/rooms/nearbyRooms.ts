/**
 * 周边房源 Mock 数据
 * 用于详情页同房东附近其他房源
 * 严格遵循 HomeStayRoom 类型结构
 */

import type { HomeStayRoom } from '@estay/shared'

export const NEARBY_ROOMS: HomeStayRoom[] = [
  {
    // ===== DB字段 =====
    _id: 'nearby-1',
    hotelId: 'homestay-001',
    category: 'homestay',
    
    // ===== 房间基本信息（RoomDrawerBasicInfoData）=====
    basicInfo: {
      name: '市景五室二厅套房',
      type: 'suite',
      area: 190,
      guests: 12,
      bedRemark: ['5床', '1.8m大床'],
    },
    
    // ===== 房间图片（RoomDrawerBannerData）=====
    banner: {
      images: ['https://picsum.photos/240/320?random=room1'],
      description: '宽敞套房，视野开阔',
    },
    
    // ===== 床铺信息 =====
    bedInfo: [
      { bedType: '双人床', bedNumber: 1, bedSize: '2.0m*2.2m' },
      { bedType: '沙发床', bedNumber: 1, bedSize: '1.5m*2m' },
    ],
    
    // ===== 早餐信息 =====
    breakfastInfo: {
      breakfastType: '套餐',
      cuisine: '中式',
      bussinessTime: '06:00-10:00',
    },
    
    // ===== 设施（FacilityCategory[]）=====
    facilities: [
      {
        id: 'fac-1',
        name: '客厅设施',
        facilities: [
          { id: 'f1', name: '客厅', available: true },
          { id: 'f2', name: '电视', available: true },
        ],
      },
      {
        id: 'fac-2',
        name: '卧室设施',
        facilities: [
          { id: 'f3', name: '空调', available: true },
          { id: 'f4', name: '床头灯', available: true },
        ],
      },
    ],
    
    // ===== 政策（CancellationPolicy[]）=====
    policies: [
      {
        id: 'policy-1',
        title: '灵活取消',
        content: '入住前48小时可免费取消',
        checkoutTime: '11:00',
        cancelMinute: 2880,
      },
    ],
    
    // ===== 费用通知（RoomDrawerFeeNoticeData）=====
    feeNotice: {
      basePrice: 1280,
      cleaningFee: 150,
      serviceFee: 128,
      taxFee: 51.2,
      totalPrice: 1609.2,
      notice: '房费包含税费和服务费',
    },
    
    // ===== 价格（RoomDrawerPriceData）=====
    price: {
      originPrice: 1280,
      currentPrice: 1280,
    },
    
    // ===== 价格列表及套餐 =====
    priceList: [
      {
        packageId: 1,
        originPrice: 1280,
        currentPrice: 1280,
      },
    ],
    packageCount: 1,
    confirmTime: '立即确认',
    showBreakfastTag: true,
    breakfastCount: 3,
    showCancelTag: true,
    cancelMunite: 48,
    packages: [
      {
        packageId: 1,
        name: '标准套餐',
        showPackageDetail: false,
        showBreakfastTag: true,
        breakfastCount: 3,
        showCancelTag: true,
        cancelMunite: 48,
        showComfirmTag: true,
        confirmTime: 0,
      },
    ],
    
    // ===== 套餐详情 =====
    packageDetail: {
      name: '标准套餐',
      benefits: ['免费WiFi', '免费停车', '房间内免费WiFi', '免费早餐'],
      confirmTimeHours: 30,
    },
    
    // ===== 系统字段 =====
    auditInfo: {
      status: 'approved',
      auditedAt: new Date('2025-01-01'),
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-23'),
  },
  {
    _id: 'nearby-2',
    hotelId: 'homestay-001',
    category: 'homestay',
    basicInfo: {
      name: '惠选经典三室一厅套房',
      type: 'triple',
      area: 95,
      guests: 6,
      bedRemark: ['3床', '1.8m大床'],
    },
    banner: {
      images: ['https://picsum.photos/240/320?random=room2'],
      description: '温馨三室，适合家庭',
    },
    bedInfo: [
      { bedType: '双人床', bedNumber: 1, bedSize: '1.8m*2m' },
      { bedType: '单人床', bedNumber: 2, bedSize: '1.2m*2m' },
    ],
    breakfastInfo: undefined,
    facilities: [
      {
        id: 'fac-1',
        name: '家庭设施',
        facilities: [
          { id: 'f1', name: '厨房', available: true },
          { id: 'f2', name: 'WiFi', available: true },
        ],
      },
    ],
    policies: [
      {
        id: 'policy-1',
        title: '适用取消政策',
        content: '入住前72小时可免费取消',
        cancelMinute: 4320,
      },
    ],
    feeNotice: {
      basePrice: 840,
      cleaningFee: 80,
      serviceFee: 84,
      taxFee: 33.6,
      totalPrice: 1037.6,
      notice: '包含清洁费',
    },
    price: {
      originPrice: 840,
      currentPrice: 840,
    },
    
    // ===== 价格列表及套餐 =====
    priceList: [
      {
        packageId: 1,
        originPrice: 840,
        currentPrice: 840,
      },
    ],
    packageCount: 1,
    confirmTime: '15分钟',
    showBreakfastTag: false,
    showCancelTag: true,
    cancelMunite: 72,
    packages: [
      {
        packageId: 1,
        name: '经济套餐',
        showPackageDetail: false,
        showBreakfastTag: false,
        showCancelTag: true,
        cancelMunite: 72,
        showComfirmTag: true,
        confirmTime: 15,
      },
    ],
    
    packageDetail: {
      name: '经济套餐',
      benefits: ['免费WiFi', '免费停车'],
      confirmTimeHours: 15,
    },
    auditInfo: { status: 'approved' },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-02-22'),
  },
  {
    _id: 'nearby-3',
    hotelId: 'homestay-001',
    category: 'homestay',
    basicInfo: {
      name: '温馨二室二厅套房',
      type: 'double',
      area: 95,
      guests: 4,
      bedRemark: ['2床', '1.8m大床'],
    },
    banner: {
      images: ['https://picsum.photos/240/320?random=room3'],
      description: '舒适二室，布局合理',
    },
    bedInfo: [
      { bedType: '双人床', bedNumber: 1, bedSize: '1.8m*2m' },
      { bedType: '单人床', bedNumber: 1, bedSize: '1.2m*2m' },
    ],
    breakfastInfo: {
      breakfastType: '自助',
      cuisine: '中式早餐',
      bussinessTime: '06:30-09:00',
    },
    facilities: [
      {
        id: 'fac-1',
        name: '基础设施',
        facilities: [
          { id: 'f1', name: '空调', available: true },
          { id: 'f2', name: '热水器', available: true },
        ],
      },
    ],
    policies: [
      {
        id: 'policy-1',
        title: '一般取消政策',
        content: '入住前3天可取消',
        cancelMinute: 4320,
      },
    ],
    feeNotice: {
      basePrice: 1189,
      cleaningFee: 80,
      serviceFee: 119,
      taxFee: 47.56,
      totalPrice: 1435.56,
      notice: '含所有税费和服务费',
    },
    price: {
      originPrice: 1189,
      currentPrice: 1189,
    },
    
    // ===== 价格列表及套餐 =====
    priceList: [
      {
        packageId: 1,
        originPrice: 1189,
        currentPrice: 1189,
      },
    ],
    packageCount: 1,
    confirmTime: '15分钟',
    showBreakfastTag: true,
    breakfastCount: 1,
    showCancelTag: true,
    cancelMunite: 72,
    packages: [
      {
        packageId: 1,
        name: '标准套餐',
        showPackageDetail: false,
        showBreakfastTag: true,
        breakfastCount: 1,
        showCancelTag: true,
        cancelMunite: 72,
        showComfirmTag: true,
        confirmTime: 15,
      },
    ],
    
    packageDetail: {
      name: '标准套餐',
      confirmTimeHours: 15,
    },
    auditInfo: { status: 'approved' },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-02-21'),
  },
  {
    _id: 'nearby-4',
    hotelId: 'homestay-001',
    category: 'homestay',
    basicInfo: {
      name: '豪华单床间',
      type: 'single',
      area: 45,
      guests: 2,
      bedRemark: ['1床', '1.5m大床'],
    },
    banner: {
      images: ['https://picsum.photos/240/320?random=room4'],
      description: '小而精致的单人房',
    },
    bedInfo: [
      { bedType: '大床', bedNumber: 1, bedSize: '1.5m*2m' },
    ],
    facilities: [
      {
        id: 'fac-1',
        name: '房间设施',
        facilities: [
          { id: 'f1', name: 'WiFi', available: true },
          { id: 'f2', name: '独立卫浴', available: true },
        ],
      },
    ],
    policies: [
      {
        id: 'policy-1',
        title: '不可退款',
        content: '预订后不支持退款',
      },
    ],
    feeNotice: {
      basePrice: 520,
      cleaningFee: 50,
      serviceFee: 52,
      taxFee: 20.8,
      totalPrice: 642.8,
      notice: '单房较小，价格相对优惠',
    },
    price: {
      originPrice: 520,
      currentPrice: 520,
    },
    auditInfo: { status: 'approved' },
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2025-02-20'),
  },
  {
    _id: 'nearby-5',
    hotelId: 'homestay-001',
    category: 'homestay',
    basicInfo: {
      name: '亲子家庭房',
      type: 'family',
      area: 120,
      guests: 6,
      bedRemark: ['2床', '1.8m+1.5m'],
    },
    banner: {
      images: ['https://picsum.photos/240/320?random=room5'],
      description: '专为家庭设计，温馨舒适',
    },
    bedInfo: [
      { bedType: '双人床', bedNumber: 1, bedSize: '1.8m*2m' },
      { bedType: '大床', bedNumber: 1, bedSize: '1.5m*2m' },
    ],
    breakfastInfo: {
      breakfastType: '铺',
      cuisine: '中西合璧',
      bussinessTime: '06:00-10:00',
      addBreakfast: '可加购儿童早餐',
    },
    facilities: [
      {
        id: 'fac-1',
        name: '儿童设施',
        facilities: [
          { id: 'f1', name: '儿童床', available: true },
          { id: 'f2', name: '安全插座', available: true },
        ],
      },
      {
        id: 'fac-2',
        name: '家庭设施',
        facilities: [
          { id: 'f3', name: '厨房', available: true },
          { id: 'f4', name: '洗衣机', available: true },
        ],
      },
    ],
    policies: [
      {
        id: 'policy-1',
        title: '家庭友好政策',
        content: '儿童免费入住，宠物可协商',
      },
    ],
    feeNotice: {
      basePrice: 1050,
      cleaningFee: 100,
      serviceFee: 105,
      taxFee: 42,
      totalPrice: 1297,
      notice: '亲子专享，包含儿童福利',
    },
    price: {
      originPrice: 1050,
      currentPrice: 1050,
    },
    packageDetail: {
      name: '亲子套餐',
      benefits: ['免费停车', '儿童福利', '免费早餐', 'WiFi'],
      confirmTimeHours: 15,
    },
    auditInfo: { status: 'approved' },
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2025-02-19'),
  },
]

