/**
 * Detail 页面数据初始化服务
 * 职责：
 * 1. 加载中央数据（DETAIL_CENTER_DATA_MOCK）
 * 2. 将数据分别传给各个中间件进行处理
 * 3. 返回所有格式化后的数据供各组件使用
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'
import type { HomeStaySearchParams } from '../types/homestay'
import { DETAIL_CENTER_DATA_MOCK } from '../mocks/detailCenterData'

import { hotelInfoMiddleware } from './HotelInfoMiddleware'
import { bookingBarMiddleware } from './BookingBarMiddleware'
import { facilitiesSectionMiddleware } from './FacilitiesSectionMiddleware'
import { feeNoticeSectionMiddleware } from './FeeNoticeSectionMiddleware'
import { hostInfoMiddleware } from './HostInfoMiddleware'
import { imageCarouselMiddleware } from './ImageCarouselMiddleware'
import { nearbyRecommendationsMiddleware } from './NearbyRecommendationsMiddleware'
import { policySectionMiddleware } from './PolicySectionMiddleware'
import { roomCardMiddleware } from './RoomCardMiddleware'
import { roomDrawerBannerMiddleware } from './RoomDrawerBannerMiddleware'
import { roomDrawerBasicInfoMiddleware } from './RoomDrawerBasicInfoMiddleware'
import { roomDrawerFacilitiesMiddleware } from './RoomDrawerFacilitiesMiddleware'
import { roomDrawerFeeNoticeMiddleware } from './RoomDrawerFeeNoticeMiddleware'
import { roomDrawerPolicyMiddleware } from './RoomDrawerPolicyMiddleware'
import { roomPackageDetailMiddleware } from './RoomPackageDetailMiddleware'
import { roomDrawerPriceMiddleware } from './RoomDrawerPriceMiddleware'

/**
 * 初始化后的完整中央数据映射
 */
export interface InitializedDetailData {
  // 1. HotelInfo
  hotelInfo: ReturnType<typeof hotelInfoMiddleware['getData']>
  
  // 2. BookingBar
  bookingBar: ReturnType<typeof bookingBarMiddleware['getData']>
  
  // 3. FacilitiesSection
  facilities: ReturnType<typeof facilitiesSectionMiddleware['getData']>
  
  // 4. FeeNoticeSection
  feeNotice: ReturnType<typeof feeNoticeSectionMiddleware['getData']>
  
  // 5. HostInfo
  hostInfo: ReturnType<typeof hostInfoMiddleware['getData']>
  
  // 6. ImageCarousel
  images: ReturnType<typeof imageCarouselMiddleware['getData']>
  
  // 7. NearbyRecommendations
  surroundings: ReturnType<typeof nearbyRecommendationsMiddleware['getData']>
  
  // 8. PolicySection
  policies: ReturnType<typeof policySectionMiddleware['getData']>
  
  // 9. RoomCard (列表)
  rooms: ReturnType<typeof roomCardMiddleware['getData']>
  
  // 10. RoomDrawerBanner
  roomDrawerBanner: ReturnType<typeof roomDrawerBannerMiddleware['getData']>
  
  // 11. RoomDrawerBasicInfo
  roomDrawerBasicInfo: ReturnType<typeof roomDrawerBasicInfoMiddleware['getData']>
  
  // 12. RoomDrawerFacilities
  roomDrawerFacilities: ReturnType<typeof roomDrawerFacilitiesMiddleware['getData']>
  
  // 13. RoomDrawerFeeNotice
  roomDrawerFeeNotice: ReturnType<typeof roomDrawerFeeNoticeMiddleware['getData']>
  
  // 14. RoomDrawerPolicy
  roomDrawerPolicy: ReturnType<typeof roomDrawerPolicyMiddleware['getData']>
  
  // 15. RoomPackageDetail
  roomPackageDetail: ReturnType<typeof roomPackageDetailMiddleware['getData']>
  
  // 16. RoomDrawerPrice
  roomDrawerPrice: ReturnType<typeof roomDrawerPriceMiddleware['getData']>
}

/**
 * 初始化详情页数据
 * 在页面挂载时调用此函数进行数据初始化
 */
export const initializeDetailData = (
  centerData: DetailCenterData = DETAIL_CENTER_DATA_MOCK,
  searchParams?: HomeStaySearchParams
): InitializedDetailData => {
  return {
    // 1. HotelInfo
    hotelInfo: hotelInfoMiddleware.getData(centerData),
    
    // 2. BookingBar
    bookingBar: bookingBarMiddleware.getData(centerData),
    
    // 3. FacilitiesSection
    facilities: facilitiesSectionMiddleware.getData(centerData),
    
    // 4. FeeNoticeSection
    feeNotice: feeNoticeSectionMiddleware.getData(centerData),
    
    // 5. HostInfo
    hostInfo: hostInfoMiddleware.getData(centerData),
    
    // 6. ImageCarousel
    images: imageCarouselMiddleware.getData(centerData),
    
    // 7. NearbyRecommendations
    surroundings: nearbyRecommendationsMiddleware.getData(centerData),
    
    // 8. PolicySection
    policies: policySectionMiddleware.getData(centerData, searchParams),
    
    // 9. RoomCard (列表)
    rooms: roomCardMiddleware.getData(centerData),
    
    // 10. RoomDrawerBanner
    roomDrawerBanner: roomDrawerBannerMiddleware.getData(centerData),
    
    // 11. RoomDrawerBasicInfo
    roomDrawerBasicInfo: roomDrawerBasicInfoMiddleware.getData(centerData),
    
    // 12. RoomDrawerFacilities
    roomDrawerFacilities: roomDrawerFacilitiesMiddleware.getData(centerData),
    
    // 13. RoomDrawerFeeNotice
    roomDrawerFeeNotice: roomDrawerFeeNoticeMiddleware.getData(centerData),
    
    // 14. RoomDrawerPolicy
    roomDrawerPolicy: roomDrawerPolicyMiddleware.getData(centerData, searchParams),
    
    // 15. RoomPackageDetail
    roomPackageDetail: roomPackageDetailMiddleware.getData(centerData),
    
    // 16. RoomDrawerPrice
    roomDrawerPrice: roomDrawerPriceMiddleware.getData(centerData, searchParams),
  }
}
