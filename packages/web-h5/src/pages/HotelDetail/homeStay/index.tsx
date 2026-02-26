/**
 * 民宿详情页 - 主容器
 * 集成 Zustand Store 管理详情数据
 * 集成数据中间件统一处理数据
 */

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { 
  useHomestayStore, 
  NEARBY_ROOMS, 
  type Room as SharedRoom,
  initializeDetailData,
  type InitializedDetailData,
  DETAIL_CENTER_DATA_MOCK,
} from '@estay/shared'
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

/**
 * RoomSelection 组件期望的房型接口
 */
interface RoomSelectionRoom {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  priceList: Array<{
    packageId: number
    originPrice: number
    currentPrice: number
  }>
  priceNote: string
  benefits: string[]
  packageCount: number
  confirmTime: string
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  cancelMunite?: number
  hasPackageDetail?: boolean
  // 套餐列表
  packages?: Array<{
    packageId: number
    name: string
    showPackageDetail?: boolean
    showBreakfastTag?: boolean
    breakfastCount?: number
    showCancelTag?: boolean
    cancelMunite?: number
    showComfirmTag?: boolean
    confirmTime?: number
  }>
}

/**
 * 适配函数：从共享类型的Room转换为RoomSelection组件期望的格式
 */
const adaptSharedRoomToSelection = (room: SharedRoom): RoomSelectionRoom => {
  // 构建 priceList：如果 room 有 priceList，使用它；否则从 price 构建
  const priceList = Array.isArray((room as any).priceList) 
    ? (room as any).priceList 
    : [{
        packageId: 1,
        originPrice: (room.price as any)?.originPrice || 0,
        currentPrice: (room.price as any)?.currentPrice || 0,
      }]
  
  return {
    id: room._id || '',
    name: room.basicInfo?.name || 'Unknown Room',
    area: String(room.basicInfo?.area || 0) + '㎡',
    beds: Array.isArray(room.basicInfo?.bedRemark) 
      ? room.basicInfo.bedRemark.join(',')
      : (room.basicInfo?.bedRemark || 'Unknown'),
    guests: String(room.basicInfo?.guests || 'Unknown'),
    image: room.banner?.images?.[0]?.url || '',
    priceList: priceList,
    priceNote: '晚/起',
    benefits: [],
    packageCount: (room as any).packageCount || 0,
    confirmTime: '30分钟',
    showBreakfastTag: (room as any).showBreakfastTag,
    breakfastCount: (room as any).breakfastCount,
    showCancelTag: (room as any).showCancelTag,
    cancelMunite: (room as any).cancelMunite,
    hasPackageDetail: (room as any).hasPackageDetail,
    packages: (room as any).packages,
  }
}

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
  location?: string
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
  checkInDate?: string
  checkOutDate?: string
  deadlineTime?: number
  onDateChange: (checkIn: string, checkOut: string) => void
  onSelectRoom?: (room: RoomSelectionRoom) => void
  recommendedHomestays: HomeStay[]
  // 初始化后的格式化数据
  initializedData: InitializedDetailData
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
  onSelectRoom,
  recommendedHomestays,
  initializedData,
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

  // 转换 NEARBY_ROOMS 为 RoomSelection 组件期望的格式
  const adaptedNearbyRooms = useMemo(
    () => NEARBY_ROOMS.map(adaptSharedRoomToSelection),
    []
  )

  // 处理房间选择 - 更新本地状态和调用父组件回调
  const handleSelectRoomInContent = (room: RoomSelectionRoom) => {
    setSelectedRoomName(room.name)
    onSelectRoom?.(room)
  }

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
      <ImageCarousel images={initializedData.images?.map(img => img.url) || []} />

      {/* 酒店信息 - 覆盖在轮播上 */}
      <HotelInfo data={initializedData.hotelInfo as any} />

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
          <DatePicker 
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onDateChange={onDateChange} 
          />
          <RoomSelection 
            rooms={initializedData.rooms as any}
            displayCount={1}
            onSelectRoom={handleSelectRoomInContent}
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
            rooms={adaptedNearbyRooms}
            displayCount={expandNearbyProperties ? adaptedNearbyRooms.length : 2}
            onSelectRoom={handleSelectRoomInContent}
            checkIn={checkInDate}
            checkOut={checkOutDate}
          />
        </PropertyCardContainer>
      </div>

      {/* 3. 点评区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.reviews} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <ReviewSection hostelId={initialData._id || ''} roomName={selectedRoomName} reviews={[]} />
      </div>

      {/* 4. 设施区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.facilities} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <FacilitiesSection facilities={initializedData.facilities as any} policiesData={initializedData.policies as any} feeInfoData={initializedData.feeNotice as any} />
      </div>

      {/* 5. 须知区（政策） */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.policies} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <PolicySection
          policies={initializedData.policies as any}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          facilitiesData={initializedData.facilities as any}
          feeInfoData={initializedData.feeNotice as any}
        />
      </div>

      {/* 6. 费用须知区 */}
      <div className={styles.sectionGap}>
        <FeeNoticeSection
          feeInfo={initializedData.feeNotice as any}
          policiesData={initializedData.policies as any}
          facilitiesData={initializedData.facilities as any}
        />
      </div>

      {/* 7. 房东区 */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.host} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <HostInfo data={initializedData.hostInfo as any} hostInfo={initializedData.hostInfo as any} />
      </div>
      {/* 7. 周边区（知识内容） */}
      {/* 哨兵 */}
      <div ref={sentinelRefs.knowledge} style={{ height: 0 }} />
      <div className={styles.sectionGap}>
        <NearbyRecommendations surroundings={initializedData.surroundings?.surroundings as any} baseInfo={initializedData.surroundings as any} />
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
                  <RecommendCard homestay={homestay} minPrice={(homestay as any).startingPrice} />
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
    searchParams,
    updateDetailContext,
    detailLoading,
    recommendedHomestays,
    loadRecommendedHomestays,
    fetchHomestayDetail,
    startEditingDetail,
    setDetailLocalCopy,
    commitDetailLocalCopy,
    revertDetailLocalCopy,
  } = useHomestayStore()

  // 本地状态
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview')
  const [initializedData, setInitializedData] = useState<InitializedDetailData | null>(null)
  const [hasInitializedDates, setHasInitializedDates] = useState(false)

  // 日期格式化辅助函数 - 将任何日期格式转换为 MM-DD
  const formatDateToMMDD = (date: any): string => {
    if (!date) return ''
    
    let dateObj: Date
    
    // 如果是字符串
    if (typeof date === 'string') {
      // 如果已经是 MM-DD 格式，直接返回
      if (/^\d{2}-\d{2}$/.test(date)) return date
      // 如果是 YYYY-MM-DD 格式，提取 MM-DD
      if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
        const parts = date.split('-')
        return `${parts[1]}-${parts[2]}`
      }
      // 其他格式，尝试解析为日期对象
      dateObj = new Date(date)
    } else if (date instanceof Date) {
      dateObj = date
    } else {
      return ''
    }
    
    // 确保日期有效
    if (isNaN(dateObj.getTime())) return ''
    
    // 转换为 MM-DD 格式
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${month}-${day}`
  }

  // 首次加载详情和推荐
  useEffect(() => {
    if (id) {
      fetchHomestayDetail(id)
      loadRecommendedHomestays()
      // 进入详情页时，创建本地副本用于编辑
      startEditingDetail()
    }
  }, [id, fetchHomestayDetail, loadRecommendedHomestays, startEditingDetail])

  // 从搜索参数初始化详情页日期，并初始化中间件数据（仅一次）
  useEffect(() => {
    // 只在尚未初始化时执行一次
    if (hasInitializedDates) return

    let effectiveSearchParams = searchParams
    
    // 如果 Store 中没有 searchParams，尝试从 localStorage 恢复
    if (!effectiveSearchParams) {
      try {
        const stored = localStorage.getItem('homestay-store')
        if (stored) {
          const parsed = JSON.parse(stored)
          effectiveSearchParams = parsed.state?.searchParams
        }
      } catch (e) {
        console.warn('Failed to restore searchParams from localStorage', e)
      }
    }

    // 1. 如果 searchParams 存在，用其日期初始化 detailContext（转换为 MM-DD 格式）
    if (effectiveSearchParams?.checkIn && effectiveSearchParams?.checkOut) {
      const checkInStr = formatDateToMMDD(effectiveSearchParams.checkIn)
      const checkOutStr = formatDateToMMDD(effectiveSearchParams.checkOut)
      
      if (checkInStr && checkOutStr) {
        updateDetailContext({
          checkInDate: checkInStr,
          checkOutDate: checkOutStr,
        })
        setHasInitializedDates(true)
      }
    } else {
      // 没有搜索参数时，使用默认日期（今天和明天）
      const today = formatDateToMMDD(new Date().toISOString())
      const tomorrow = formatDateToMMDD(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
      
      updateDetailContext({
        checkInDate: today,
        checkOutDate: tomorrow,
      })
      setHasInitializedDates(true)
    }

    // 2. 初始化中间件数据
    const data = initializeDetailData(DETAIL_CENTER_DATA_MOCK)
    setInitializedData(data)
  }, [searchParams, hasInitializedDates, updateDetailContext])

  // 转换 currentHomestay 为 HomeStayData 格式
  const homeStayData: HomeStayData | null = currentHomestay
    ? {
        _id: currentHomestay._id,
        baseInfo: {
          nameCn: currentHomestay.baseInfo.name,
          address: currentHomestay.baseInfo.address,
          star: currentHomestay.baseInfo.star || 5,
          reviewCount: currentHomestay.baseInfo.reviewCount || 0,
          price: currentHomestay.rooms?.[0]?.price?.currentPrice || currentHomestay.rooms?.[0]?.price?.originPrice || 0,
        },
        images: currentHomestay.images || [],
        price: currentHomestay.rooms?.[0]?.price?.currentPrice || currentHomestay.rooms?.[0]?.price?.originPrice || 0,
        location: currentHomestay.baseInfo.city,
        host: {
          name: '房东',
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

  // 处理日期变更 - 使用本地副本机制
  const handleDateChange = (checkIn: string, checkOut: string) => {
    if (detailContext.isEditing) {
      // 编辑模式：更新本地副本
      setDetailLocalCopy({
        checkInDate: checkIn,
        checkOutDate: checkOut,
      })
    } else {
      // 非编辑模式：直接更新上下文（向后兼容）
      updateDetailContext({
        checkInDate: checkIn,
        checkOutDate: checkOut,
      })
    }
  }

  // 处理保存修改
  const handleSave = () => {
    commitDetailLocalCopy()
    console.log('Changes saved')
  }

  // 处理取消修改
  const handleCancel = () => {
    revertDetailLocalCopy()
    console.log('Changes cancelled')
  }

  // 处理房间选择
  const handleSelectRoom = (room: RoomSelectionRoom) => {
    // 更新Store中的selectedRoomId
    if (detailContext.isEditing) {
      // 编辑模式：更新本地副本
      setDetailLocalCopy({
        selectedRoomId: room.id,
      })
    } else {
      // 显示模式：直接更新context
      updateDetailContext({
        selectedRoomName: room.name,
        selectedRoomId: room.id,
      })
    }
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

  if (detailLoading || !homeStayData || !initializedData) {
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
          checkIn={detailContext.checkInDate}
          checkOut={detailContext.checkOutDate}
          onBook={handleBook}
          onContactHost={handleContactHost}
          onDateChange={handleDateChange}
          onSave={detailContext.isEditing ? handleSave : undefined}
          onCancel={detailContext.isEditing ? handleCancel : undefined}
          isEditing={detailContext.isEditing}
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
        onSelectRoom={handleSelectRoom}
        recommendedHomestays={recommendedHomestays}
        initializedData={initializedData || { hotelInfo: {}, facilities: [], policies: {}, feeNotice: {}, hostInfo: {}, surroundings: {} } as any}
      />
    </DetailLayout>
  )
}

export default DetailPage
