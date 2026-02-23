import type { HomeStay } from '@estay/shared'

export const RECOMMENDED_HOMESTAYS: HomeStay[] = [
  {
    _id: 'homestay-recommended-1',
    merchantId: 'merchant-rec-001',
    baseInfo: {
      nameCn: '静谧山间别墅',
      address: '杭州市西湖区翠苑3路25号',
      city: 'hangzhou',
      star: 4.8,
      reviewCount: 124,
      phone: '13812345678',
      description: '坐落在竹林深处，远离城市喧嚣，独特的山间体验',
      facilities: [],
      policies: [],
    },
    images: ['https://picsum.photos/300/200?random=recommended1'],
    rooms: [],
    typeConfig: {
      hostName: '李女士',
      hostPhone: '13812345678',
      responseTimeHours: 1,
      instantBooking: true,
      minStay: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'homestay-recommended-2',
    merchantId: 'merchant-rec-002',
    baseInfo: {
      nameCn: '海景度假民宿',
      address: '宁波市象山县定塘镇',
      city: 'ningbo',
      star: 4.9,
      reviewCount: 156,
      phone: '13812345679',
      description: '面朝大海，春暖花开，有厨房可自做海鲜大餐',
      facilities: [],
      policies: [],
    },
    images: ['https://picsum.photos/300/200?random=recommended2'],
    rooms: [],
    typeConfig: {
      hostName: '张先生',
      hostPhone: '13812345679',
      responseTimeHours: 1,
      instantBooking: true,
      minStay: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'homestay-recommended-3',
    merchantId: 'merchant-rec-003',
    baseInfo: {
      nameCn: '古镇文艺民宿',
      address: '绍兴市越城区',
      city: 'shaoxing',
      star: 4.7,
      reviewCount: 98,
      phone: '13812345680',
      description: '古镇老房改造，保留原汁原味，体验江南风情',
      facilities: [],
      policies: [],
    },
    images: ['https://picsum.photos/300/200?random=recommended3'],
    rooms: [],
    typeConfig: {
      hostName: '王女士',
      hostPhone: '13812345680',
      responseTimeHours: 1,
      instantBooking: true,
      minStay: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function getRecommendedHomestays(city?: string, priceMin?: number, priceMax?: number) {
  // TODO: 暂时显示所有推荐民宿，不按城市过滤
  // 匹配搜索条件的功能后续实现
  return RECOMMENDED_HOMESTAYS
}
