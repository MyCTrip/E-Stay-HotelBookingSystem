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
import type { DetailTabKey } from '../../../layouts/DetailLayout'
import DetailLayout from '../../../layouts/DetailLayout'
import DetailTabs from '../../../components/hotels/detail/DetailTabs'
import ImageCarousel from '../../../components/hotels/detail/ImageCarousel'
import HotelInfo from '../../../components/hotels/detail/HotelInfo'
import DatePicker from '../../../components/hotels/detail/DatePicker'
import RoomSelection from '../../../components/hotels/detail/RoomSelection'
import RoomFeatures from '../../../components/hotels/detail/RoomFeatures'
import ReviewSection from '../../../components/hotels/detail/ReviewSection'
import FacilitiesSection from '../../../components/hotels/detail/FacilitiesSection'
import PolicySection from '../../../components/hotels/detail/PolicySection'
import NearbyRecommendations from '../../../components/hotels/detail/NearbyRecommendations'
import BookingBar from '../../../components/hotels/detail/BookingBar'
import PropertyCardContainer from '../../../components/hotels/detail/PropertyCardContainer0'
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

  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview')
  const sectionRefs: Record<VisibleDetailTabKey, React.RefObject<HTMLDivElement>> = {
    overview: useRef<HTMLDivElement>(null),
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    knowledge: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    if (!hotelId) {
      return
    }
    void fetchHotelDetail(hotelId)
  }, [fetchHotelDetail, hotelId])

  useEffect(() => {
    if (!hotelId || roomSPUList[hotelId]) {
      return
    }
    void fetchHotelRooms(hotelId)
  }, [fetchHotelRooms, hotelId, roomSPUList])

  const roomGroups = useMemo(() => (hotelId ? (roomSPUList[hotelId] ?? []) : []), [hotelId, roomSPUList])

  const handleBook = useCallback(
    (sku: HotelRoomSKUModel | null) => {
      if (!sku) {
        return
      }
      setCurrentSelectedRoomId(sku.roomId)
      navigate(`/room/${sku.roomId}/hotel`)
    },
    [navigate, setCurrentSelectedRoomId]
  )

  const handleDateChange = useCallback(
    (checkIn: string, checkOut: string) => {
      setSearchParams({
        checkInDate: checkIn,
        checkOutDate: checkOut,
        page: 1,
      })
    },
    [setSearchParams]
  )

  const handleBack = useCallback(() => {
    window.history.back()
  }, [])

  const handleShare = useCallback(() => {
    return
  }, [])

  const handleCollectionChange = useCallback(() => {
    return
  }, [])

  if (!hotelId) {
    return <div style={{ padding: 16 }}>酒店 ID 无效</div>
  }

  if (loading && !currentHotelDetail) {
    return <div style={{ padding: 16 }}>加载酒店详情中...</div>
  }

  if (!currentHotelDetail) {
    return <div style={{ padding: 16 }}>暂无酒店详情</div>
  }

  const baseInfo = currentHotelDetail.baseInfo as HotelBaseInfo
  const hotelBaseInfo = {
    nameCn: baseInfo.nameCn ?? baseInfo.name,
    nameEn: baseInfo.nameEn,
    star: baseInfo.star,
    address: baseInfo.address,
    description: baseInfo.description,
  }

  const facilities = currentHotelDetail.facilities as FacilityModel[]

  const policies: PolicyModel[] = [
    {
      policyType: 'cancellation',
      content: currentHotelDetail.policies.cancellationPolicy,
      summary: currentHotelDetail.policies.cancellationPolicy,
    },
  ]

  const checkinInfo: CheckinInfoModel = {
    checkinTime: currentHotelDetail.policies.checkInTime,
    checkoutTime: currentHotelDetail.policies.checkOutTime ?? '12:00',
  }

  const nearbyBaseInfo = {
    address: currentHotelDetail.baseInfo.address,
    surroundings: currentHotelDetail.surroundings.map(
      (item): SurroundingModel => ({
        surName: item.surName,
        surType:
          item.surType === 'metro' || item.surType === 'attraction' || item.surType === 'business'
            ? item.surType
            : 'business',
        distance: item.distanceMeters ?? 0,
      })
    ),
  }

  const pageContent = (
    <div className={styles.pageContainer}>
      <ImageCarousel baseInfo={{ images: currentHotelDetail.baseInfo.images }} />

      <HotelInfo baseInfo={hotelBaseInfo} reviewCount={currentHotelDetail.rating.count} />

      <div ref={sectionRefs.overview} className={styles.sectionGap}>
        <div style={{ height: '12px' }} />
      </div>

      <div ref={sectionRefs.rooms} className={`${styles.roomsSection} ${styles.sectionGap}`}>
        <PropertyCardContainer showLabel={false} showExpandBtn={false}>
          <DatePicker onDateChange={handleDateChange} />
          <RoomSelection hotelId={hotelId} rooms={roomGroups} />
        </PropertyCardContainer>
      </div>

      <div ref={sectionRefs.reviews} className={styles.sectionGap}>
        <ReviewSection rating={currentHotelDetail.rating} />
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
            baseInfo: {
              description: currentHotelDetail.baseInfo.description,
              images: currentHotelDetail.baseInfo.images,
            },
            checkinInfo,
          }}
        />
      </div>

      <div ref={sectionRefs.nearby} className={styles.sectionGap}>
        <NearbyRecommendations baseInfo={nearbyBaseInfo} distanceText={currentHotelDetail.distanceText} />
      </div>

      <div style={{ height: '20px' }} />
    </div>
  )

  return (
    <DetailLayout
      data={currentHotelDetail}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      onShare={handleShare}
      onCollectionChange={handleCollectionChange}
      tabs={<DetailTabs />}
      footer={<BookingBar hotelId={currentHotelDetail.id} onBook={handleBook} onDateChange={handleDateChange} />}
    >
      {pageContent}
    </DetailLayout>
  )
}
