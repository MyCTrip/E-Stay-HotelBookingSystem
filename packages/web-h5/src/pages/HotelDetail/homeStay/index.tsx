/**
 * 民宿详情页 - 主容器
 * 集成 Zustand Store 管理详情数据
 */

import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useHomestayStore, NEARBY_ROOMS } from '@estay/shared'
import DetailLayout, { type DetailTabKey } from '../../../layouts/DetailLayout'
import DetailTabs from '../../../components/homestay/detail/DetailTabs'
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel'
import HotelInfo from '../../../components/homestay/detail/HotelInfo'
import DatePicker from '../../../components/homestay/detail/DatePicker'
import RoomSelection from '../../../components/homestay/detail/RoomSelection'
import ReviewSection from '../../../components/homestay/detail/ReviewSection'
import FacilitiesSection from '../../../components/homestay/detail/FacilitiesSection'
import PolicySection from '../../../components/homestay/detail/PolicySection'
import FeeNoticeSection from '../../../components/homestay/detail/FeeNoticeSection'
import NearbyRecommendations from '../../../components/homestay/detail/NearbyRecommendations'
import HostInfo from '../../../components/homestay/detail/HostInfo'
import BookingBar from '../../../components/homestay/detail/BookingBar'
import PropertyCardContainer from '../../../components/homestay/detail/PropertyCardContainer'
import RecommendCard from '../../../components/homestay/home/RecommendCard'
import type { HomeStay } from '@estay/shared'
import styles from './index.module.scss'

interface HomeStayData {
  _id: string
  baseInfo: {
    nameCn: string
    address: string
    star: number
    reviewCount: number
    price: number
  }
  images: string[]
  price: number
  location: string
  host: {
    name: string
    avatar: string
  }
}

interface PageContentProps {
  registerSentinel?: (key: DetailTabKey, sentinelEl: HTMLDivElement) => void
  expandNearbyProperties: boolean
  onExpandNearbyProperties: (expand: boolean) => void
  initialData: HomeStayData
  checkInDate: string
  checkOutDate: string
  deadlineTime: number
  onDateChange: (checkIn: string, checkOut: string) => void
  recommendedHomestays: HomeStay[]
  currentRooms: any[]
}

/**
 * 页面内容组件 - 接收registerSentinel来注册各区域的哨兵
 */
const PageContent: React.FC<PageContentProps> = ({
  registerSentinel,
  expandNearbyProperties,
  onExpandNearbyProperties,
  initialData,
  checkInDate,
  checkOutDate,
  deadlineTime,
  onDateChange,
  recommendedHomestays,
  currentRooms,
}) => {
  // 为每个 section 创建哨兵 ref
  const sentinelRefs: Record<DetailTabKey, React.RefObject<HTMLDivElement>> = {
    overview: useRef<HTMLDivElement>(null),
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    knowledge: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
    host: useRef<HTMLDivElement>(null),
  }

  // 选中的房间名称状态
  const [selectedRoomName, setSelectedRoomName] = useState<string>('市景五室二厅套房')

  /**
   * 组件挂载时注册所有哨兵
   */
  useEffect(() => {
    if (registerSentinel) {
      Object.entries(sentinelRefs).forEach(([key, ref]) => {
        if (ref.current) {
          registerSentinel(key as DetailTabKey, ref.current)
        }
      })
    }
  }, [registerSentinel])

  return (
    <>
      {/* 图片轮播 - 在overview外 */}
      <ImageCarousel images={initialData.images} />

      {/* 酒店信息 - 覆盖在轮播上 */}
      <HotelInfo data={initialData} />

      {/* 1. 概览区 - 基本信息 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.overview} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <div style={{ height: '76px' }} />
      </div>

      {/* 2. 房源区 - 分两块：当前房源 + 同房东附近房源 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.rooms} style={{ height: 0 }} />
      <div className={`${styles.roomsSection} ${styles.sectionGap}`}>
        {/* Block 1: 当前房源 - 只显示1个房间 */}
        <PropertyCardContainer showLabel={false} showExpandBtn={false}>
          <DatePicker onDateChange={onDateChange} />
          <RoomSelection 
            data={initialData} 
            displayCount={1}
            onSelectRoom={(room) => setSelectedRoomName(room.name)}
            checkIn={checkInDate}
            checkOut={checkOutDate}
          />
        </PropertyCardContainer>

        {/* Block 2: 同房东附近其他房源 - 初始显示2个，展开显示全部 */}
        <PropertyCardContainer
          showLabel={true}
          labelText="同房东附近其他房源"
          tooltipText="推荐同房东的其他房源，高性价比选择"
          showExpandBtn={true}
          expandBtnText="展开查看全部房源"
          isExpanded={expandNearbyProperties}
          onExpandToggle={() => onExpandNearbyProperties(!expandNearbyProperties)}
        >
          <RoomSelection
            data={initialData}
            rooms={NEARBY_ROOMS}
            displayCount={expandNearbyProperties ? NEARBY_ROOMS.length : 2}
            checkIn={checkInDate}
            checkOut={checkOutDate}
          />
        </PropertyCardContainer>
      </div>

      {/* 3. 点评区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.reviews} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <ReviewSection hostelId={initialData._id} roomName={selectedRoomName} />
      </div>

      {/* 4. 设施区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.facilities} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <FacilitiesSection data={initialData} roomName={selectedRoomName} />
      </div>

      {/* 5. 须知区（政策） */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.policies} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <PolicySection
          data={initialData}
          checkInDate={checkInDate}
          checkInTime="14:00"
          deadlineTime={deadlineTime}          roomName={selectedRoomName}        />
      </div>

      {/* 6. 费用须知区 */}
      <div className={styles.sectionGap}>
        <FeeNoticeSection
          deposit={500}
          standardGuests={2}
          joinNumber={2}
          joinPrice={100}
          otherDescription="房东要求请保持房间整洁，不可在房间内吸烟，宠物需提前沟通。"
          showOther={true}          roomName={selectedRoomName}        />
      </div>

      {/* 7. 房东区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.host} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <HostInfo data={initialData} />
      </div>
      {/* 7. 周边区（知识内容） */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.knowledge} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <NearbyRecommendations location={initialData.location || '上海'} />
      </div>
      {/* 8. 附近区（推荐） */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.nearby} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <div style={{ padding: '16px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>周边相似房屋</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {recommendedHomestays.length > 0 ? (
              recommendedHomestays.map((homestay) => (
                <div key={homestay._id}>
                  <RecommendCard homestay={homestay} />
                </div>
              ))
            ) : (
              <p>暂无推荐房屋</p>
            )}
          </div>
        </div>
      </div>

      {/* 底部间隔 */}
      <div style={{ height: '60px' }} />
    </>
  )
}

const DetailPage: React.FC = () => {
  // 获取 URL 参数
  const { id } = useParams<{ id: string }>()
  
  // 获取 Store 状态和 Action
  const {
    currentHomestay,
    detailContext,
    updateDetailContext,
    detailLoading,
    recommendedHomestays,
    loadRecommendedHomestays,
    fetchHomestayDetail,
  } = useHomestayStore()

  // 本地状态
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview')

  // 首次加载详情和推荐
  useEffect(() => {
    if (id) {
      fetchHomestayDetail(id)
      loadRecommendedHomestays()
    }
  }, [id, fetchHomestayDetail, loadRecommendedHomestays])

  // 转换 currentHomestay 为 HomeStayData 格式
  const homeStayData: HomeStayData | null = currentHomestay
    ? {
        _id: currentHomestay._id,
        baseInfo: {
          nameCn: currentHomestay.baseInfo.nameCn,
          address: currentHomestay.baseInfo.address,
          star: currentHomestay.baseInfo.star,
          reviewCount: 90, // 使用默认值
          price: currentHomestay.rooms?.[0]?.baseInfo?.price || 0,
        },
        images: currentHomestay.images || [],
        price: currentHomestay.rooms?.[0]?.baseInfo?.price || 0,
        location: currentHomestay.baseInfo.city,
        host: {
          name: currentHomestay.typeConfig?.hostName || '房东',
          avatar: 'https://picsum.photos/40/40?random=host',
        },
      }
    : null

  // 处理预订按钮点击
  const handleBook = () => {
    console.log('Book clicked')
  }

  // 处理房东联系
  const handleContactHost = () => {
    console.log('Contact host')
    // TODO: 进入与房东的聊天界面
  }

  // 处理日期变更
  const handleDateChange = (checkIn: string, checkOut: string) => {
    updateDetailContext({
      checkInDate: checkIn,
      checkOutDate: checkOut,
    })
  }

  // 处理返回
  const handleBack = () => {
    window.history.back()
  }

  // 处理分享
  const handleShare = () => {
    console.log('Share clicked')
    // TODO: 分享功能
  }

  // 处理收藏
  const handleCollectionChange = () => {
    console.log('Collection toggled')
  }

  if (detailLoading || !homeStayData) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
      </div>
    )
  }

  return (
    <DetailLayout
      data={homeStayData}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onContactHost={handleContactHost}
      onBack={handleBack}
      onShare={handleShare}
      onCollectionChange={handleCollectionChange}
      tabs={<DetailTabs />}
      footer={
        <BookingBar
          data={homeStayData}
          onBook={handleBook}
          onContactHost={handleContactHost}
          onDateChange={handleDateChange}
        />
      }
    >
      <PageContent
        expandNearbyProperties={detailContext.expandNearbyProperties}
        onExpandNearbyProperties={(expand) =>
          updateDetailContext({ expandNearbyProperties: expand })
        }
        initialData={homeStayData}
        checkInDate={detailContext.checkInDate}
        checkOutDate={detailContext.checkOutDate}
        deadlineTime={detailContext.deadlineTime}
        onDateChange={handleDateChange}
        recommendedHomestays={recommendedHomestays}
        currentRooms={currentHomestay?.rooms || []}
      />
    </DetailLayout>
  )
}

export default DetailPage
