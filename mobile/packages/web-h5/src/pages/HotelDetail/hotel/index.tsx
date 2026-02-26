import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHotelStore } from '@estay/shared'
import type {
  CheckinInfoModel,
  FacilityModel,
  HotelDomainModel,
  HotelRoomSKUModel,
  PolicyModel,
  SurroundingModel,
} from '@estay/shared'

// 🌟 移除旧的 DetailLayout 依赖，改为引入头部组件 (假设你有或可以直接复用钟点房的 Header)
import DetailHeader from '../../../components/hourlyHotel/detail/DetailHeader' 
import DetailTabs from '../../../components/hotels/detail/DetailTabs'
import type { DetailTabKey } from '../../../layouts/DetailLayout'

import ImageCarousel from '../../../components/hotels/detail/ImageCarousel'
import HotelInfo from '../../../components/hotels/detail/HotelInfo'
import DatePicker from '../../../components/hotels/detail/DatePicker'
import RoomSelection from '../../../components/hotels/detail/RoomSelection'
import RoomFeatures from '../../../components/hotels/detail/RoomFeatures'
import ReviewSection from '../../../components/hotels/detail/ReviewSection'
import FacilitiesSection from '../../../components/hotels/detail/FacilitiesSection'
import PolicySection from '../../../components/hotels/detail/PolicySection'
import PolicyText from '../../../components/hotels/detail/PolicyText';
import NearbyRecommendations from '../../../components/hotels/detail/NearbyRecommendations'
import BookingBar from '../../../components/hotels/detail/BookingBar'
// import PropertyCardContainer from '../../../components/hotels/detail/PropertyCardContainer0'
import styles from './index.module.scss'

type VisibleDetailTabKey = Exclude<DetailTabKey, 'host'>
type HotelBaseInfo = HotelDomainModel['baseInfo'] & { nameCn?: string; nameEn?: string }

export default function HotelDetailHotelPage() {
  const navigate = useNavigate()
  const { id: hotelId = '' } = useParams<{ id: string }>()

  const {
    currentHotelDetail,
    roomSPUList,
    loading,
    fetchHotelDetail,
    fetchHotelRooms,
    setCurrentSelectedRoomId,
    setSearchParams,
  } = useHotelStore()

  // 🌟 1. 引入沉浸式滚动所需的状态和 Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [activeTab, setActiveTab] = useState<VisibleDetailTabKey>('overview')

  const sectionRefs: Record<VisibleDetailTabKey, React.RefObject<HTMLDivElement>> = {
    overview: useRef<HTMLDivElement>(null),
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    knowledge: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
  }

  // 🌟 2. 核心滚动监听：控制头部渐变与 Tab 自动切换 (Scroll Spy)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop
    const imageHeight = 300 // 首图高度
    setHeaderOpacity(Math.min(top / imageHeight, 1))
    updateActiveTab(top)
  }

  const updateActiveTab = (scrollPosition: number) => {
    const offset = 50 // 偏移补偿量
    const tabPositions = {
      overview: sectionRefs.overview.current?.offsetTop || 0,
      rooms: sectionRefs.rooms.current?.offsetTop || 500,
      reviews: sectionRefs.reviews.current?.offsetTop || 1000,
      facilities: sectionRefs.facilities.current?.offsetTop || 1500,
      policies: sectionRefs.policies.current?.offsetTop || 2000,
      knowledge: sectionRefs.knowledge.current?.offsetTop || 2500,
      nearby: sectionRefs.nearby.current?.offsetTop || 3000,
    }
    
    for (const [tab, position] of Object.entries(tabPositions)) {
      if (scrollPosition + offset >= position) {
        setActiveTab(tab as VisibleDetailTabKey)
      }
    }
  }

  // 🌟 3. Tab 点击平滑滚动锚点定位
  const handleTabChange = (tab: DetailTabKey) => {
    if (tab === 'host') return
    const targetTab = tab as VisibleDetailTabKey
    setActiveTab(targetTab)
    const ref = sectionRefs[targetTab]
    if (ref.current && containerRef.current) {
      const offset = ref.current.offsetTop - 44 // 减去 Header 和吸顶 Tab 的高度
      containerRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!hotelId) return
    void fetchHotelDetail(hotelId)
  }, [fetchHotelDetail, hotelId])

  useEffect(() => {
    if (!hotelId || roomSPUList[hotelId]) return
    void fetchHotelRooms(hotelId)
  }, [fetchHotelRooms, hotelId, roomSPUList])

  const roomGroups = useMemo(() => (hotelId ? (roomSPUList[hotelId] ?? []) : []), [hotelId, roomSPUList])

  const handleBook = useCallback(
    (sku: HotelRoomSKUModel | null) => {
      if (!sku) return
      setCurrentSelectedRoomId(sku.roomId)
      navigate(`/room/${sku.roomId}/hotel`)
    },
    [navigate, setCurrentSelectedRoomId]
  )

  const handleDateChange = useCallback(
    (checkIn: string, checkOut: string) => {
      setSearchParams({ checkInDate: checkIn, checkOutDate: checkOut, page: 1 })
    },
    [setSearchParams]
  )

  const handleBack = useCallback(() => navigate(-1), [navigate])
  const handleShare = useCallback(() => console.log('Share clicked'), [])
  const handleCollectionChange = useCallback(() => console.log('Collection toggled'), [])

  if (!hotelId) return <div style={{ padding: 16 }}>酒店 ID 无效</div>
  if (loading && !currentHotelDetail) return <div style={{ padding: 16 }}>加载酒店详情中...</div>
  if (!currentHotelDetail) return <div style={{ padding: 16 }}>暂无酒店详情</div>

  const baseInfo = currentHotelDetail.baseInfo || {} as HotelBaseInfo
  
  const hotelBaseInfo = {
    nameCn: baseInfo.nameCn || '未知酒店',
    nameEn: baseInfo.nameEn || '',
    star: baseInfo.star || 0,
    address: baseInfo.address || '',
    description: baseInfo.description || '',
  }

  const facilities = (baseInfo.facilities || []) as FacilityModel[]
  const rawPolicies = baseInfo.policies || []
  const cancelPolicyStr = rawPolicies.find((p: any) => p.policyType === 'cancellation')?.content || '详见酒店政策'
  const policies: PolicyModel[] = [{ policyType: 'cancellation', content: cancelPolicyStr, summary: cancelPolicyStr }]
  const checkinInfo: CheckinInfoModel = {
    checkinTime: currentHotelDetail.checkinInfo?.checkinTime || '14:00',
    checkoutTime: currentHotelDetail.checkinInfo?.checkoutTime || '12:00',
  }

  const nearbyBaseInfo = {
    address: baseInfo.address || '',
    surroundings: ((currentHotelDetail as any).surroundings || []).map(
      (item: any): SurroundingModel => ({
        surName: item.surName,
        surType: ['metro', 'attraction', 'business'].includes(item.surType) ? item.surType : 'business',
        distance: item.distanceMeters ?? 0,
      })
    ),
  }

  const safeRating = (currentHotelDetail as any).rating || { count: 0, score: 0 }
  const safeDistanceText = (currentHotelDetail as any).distanceText || ''

  // 🌟 4. 全新的沉浸式页面结构
  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      
      {/* 沉浸式透明渐变 Header */}
      <DetailHeader
        ref={headerRef}
        data={currentHotelDetail}
        opacity={headerOpacity}
        onBack={handleBack}
        onShare={handleShare}
        onCollectionChange={handleCollectionChange}
      />

      <div className={styles.content} ref={contentRef}>
        {/* 1. 轮播图区域 */}
        <ImageCarousel baseInfo={{ images: currentHotelDetail.baseInfo.images }} />
        
        {/* 2. 酒店概览：圆角上浮白色区域 */}
        <div ref={sectionRefs.overview} className={styles.infoWrapper}>
          <HotelInfo baseInfo={hotelBaseInfo} reviewCount={safeRating.count} />
        </div>

        {/* 3. 吸顶标签栏 */}
        <div className={styles.stickyTabsWrapper}>
          <DetailTabs activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {/* 4. 房型列表：组合区块，统一白底 */}
        <div ref={sectionRefs.rooms} className={styles.roomsSection}>
          <DatePicker onDateChange={handleDateChange} />
          <RoomSelection hotelId={hotelId} rooms={roomGroups} />
        </div>

        {/* 5. 评价、设施、须知等：利用 sectionGap 产生间距，内部组件自备白底卡片 */}
        <div ref={sectionRefs.reviews} className={styles.sectionGap}>
          <ReviewSection rating={safeRating} />
        </div>

        <div ref={sectionRefs.facilities} className={styles.sectionGap}>
          <FacilitiesSection facilities={facilities} previewImage={currentHotelDetail.baseInfo.images[0]} />
        </div>

        <div ref={sectionRefs.policies} className={styles.sectionGap}>
          <PolicySection policies={policies} checkinInfo={checkinInfo} />
        </div>

        <div ref={sectionRefs.knowledge} className={styles.sectionGap}>
          <RoomFeatures
            data={{
              baseInfo: { description: currentHotelDetail.baseInfo.description, images: currentHotelDetail.baseInfo.images },
              checkinInfo,
            }}
          />
        </div>

        <div ref={sectionRefs.nearby} className={styles.sectionGap}>
          <NearbyRecommendations baseInfo={nearbyBaseInfo} distanceText={safeDistanceText} />
        </div>

        <div ref={sectionRefs.policies} className={styles.sectionGap}>
          {/* 将 currentHotelDetail 传进去以获取入离时间等实时数据 */}
          <PolicyText data={currentHotelDetail} /> 
        </div>

        {/* 占位垫片 */}
        <div className={styles.spacer} />
      </div>

      {/* 底部固定预定栏1 */}
      <BookingBar hotelId={currentHotelDetail._id!} onBook={handleBook} onDateChange={handleDateChange} />
    </div>
  )
}