/**
 * 钟点房详情页 - 主容器
 */
import React, { useEffect, useRef, useState } from 'react'
// 🌟 1. 引入 useNavigate 用于处理返回上一页
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import DetailHeader from '../../../components/hourlyHotel/detail/DetailHeader'
import ImageCarousel from '../../../components/hourlyHotel/detail/ImageCarousel'
import DetailTabs, { type TabKey } from '../../../components/hourlyHotel/detail/DetailTabs'
import FacilitiesSection from '../../../components/hourlyHotel/detail/FacilitiesSection'
import ReviewSection from '../../../components/hourlyHotel/detail/ReviewSection'
import PolicySection from '../../../components/hourlyHotel/detail/PolicySection'
import NearbyRecommendations from '../../../components/hourlyHotel/detail/NearbyRecommendations'
import HourlyHotelInfo from '../../../components/hourlyHotel/detail/HourlyHotelInfo'
import HourlyRoomSelection from '../../../components/hourlyHotel/detail/HourlyRoomSelection'
import HourlyBookingBar from '../../../components/hourlyHotel/detail/HourlyBookingBar'
import HourlyTimePicker from '../../../components/hourlyHotel/detail/HourlyTimePicker'

import { HourlyRoomDetail } from '@estay/shared'
import HourlyRoomDetailDrawer from '../../../components/hourlyHotel/HourlyRoomDetailDrawer'

import styles from './index.module.scss'

const mockHourlyData: any = {
  _id: 'hourly_123',
  baseInfo: {
    nameCn: '全季酒店(上海浦东世纪大道店)',
    address: '上海市浦东新区潍坊路',
    star: 4.5,
    reviewCount: 320,
    timeWindow: '08:00-20:00',
    tags: ['秒确认']
  },
  images: [
    'https://picsum.photos/1080/900?random=11',
    'https://picsum.photos/1080/900?random=12',
    'https://picsum.photos/1080/900?random=13',
  ],
  price: 90,
  duration: 3,
  location: '上海市浦东新区潍坊路',
}

interface DetailPageProps {
  initialData?: any
}

const HourlyDetailPage: React.FC<DetailPageProps> = ({ initialData = mockHourlyData }) => {
  // 🌟 2. 实例化 navigate
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('rooms')
  const [headerOpacity, setHeaderOpacity] = useState(0)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<HourlyRoomDetail | null>(null)

  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [startTime, setStartTime] = useState<string>('14:00')
  const [duration, setDuration] = useState<number>(initialData.duration || 3)

  const handleTimeChange = (date: string, start: string, hours: number) => {
    setSelectedDate(date)
    setStartTime(start)
    setDuration(hours)
  }

  const sectionRefs = {
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const top = target.scrollTop
    setScrollTop(top)
    const imageHeight = 300
    setHeaderOpacity(Math.min(top / imageHeight, 1))
    updateActiveTab(top)
  }

  const updateActiveTab = (scrollPosition: number) => {
    const tabPositions = {
      rooms: sectionRefs.rooms.current?.offsetTop || 0,
      reviews: sectionRefs.reviews.current?.offsetTop || 1000,
      facilities: sectionRefs.facilities.current?.offsetTop || 2000,
      policies: sectionRefs.policies.current?.offsetTop || 3000,
      nearby: sectionRefs.nearby.current?.offsetTop || 4000,
    }
    const offset = 50
    for (const [tab, position] of Object.entries(tabPositions)) {
      if (scrollPosition + offset >= position) {
        setActiveTab(tab as TabKey)
      }
    }
  }

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    const ref = sectionRefs[tab]
    if (ref.current && containerRef.current) {
      const offset = ref.current.offsetTop - 44
      containerRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  const handleBook = () => {
    const ref = sectionRefs.rooms
    if (ref.current && containerRef.current) {
      const offset = ref.current.offsetTop - 44
      containerRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  const handleOpenRoomDetail = (room: HourlyRoomDetail) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  // 🌟 3. 新增顶部导航栏所需的交互事件
  const handleBack = () => {
    navigate(-1) // 返回上一页
  }

  const handleShare = () => {
    console.log('Share clicked')
    // TODO: 这里可以唤起系统的分享面板或自定义分享弹窗
  }

  const handleCollectionChange = () => {
    console.log('Collection toggled')
    // TODO: 调用收藏/取消收藏接口
  }

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>

      {/* 🌟 4. 把事件方法全部传给 DetailHeader */}
      <DetailHeader
        ref={headerRef}
        data={initialData}
        opacity={headerOpacity}
        onBack={handleBack}
        onShare={handleShare}
        onCollectionChange={handleCollectionChange}
      />

      <div className={styles.content} ref={contentRef}>
        <ImageCarousel images={initialData.images} />
        <HourlyHotelInfo data={initialData} />
        <div className={styles.stickyTabsWrapper}>
          <DetailTabs activeTab={activeTab} onChange={handleTabChange} />
        </div>

        <div ref={sectionRefs.rooms}>
          <HourlyTimePicker
            date={selectedDate}
            startTime={startTime}
            duration={duration}
            onChange={handleTimeChange}
          />
          <HourlyRoomSelection
            data={initialData}
            onOpenDetail={handleOpenRoomDetail}
          />
        </div>

        <div ref={sectionRefs.reviews}>
          <ReviewSection hostelId={initialData._id} />
        </div>
        <div ref={sectionRefs.facilities}>
          <FacilitiesSection data={initialData} />
        </div>
        <div ref={sectionRefs.nearby}>
          <NearbyRecommendations location={initialData.location} />
        </div>
        <div ref={sectionRefs.policies}>
          <PolicySection data={initialData} />
        </div>


        {/* 底部的留白垫片 */}
        <div className={styles.spacer} />
      </div>

      <HourlyBookingBar data={initialData} onBook={handleBook} />

      <HourlyRoomDetailDrawer
        room={selectedRoom}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setTimeout(() => setSelectedRoom(null), 300)
        }}
        selectedDuration={initialData.duration || 3}
        availableTime={initialData.baseInfo?.timeWindow || '08:00-20:00'}
        onBook={(roomId) => {
          console.log('用户点击了抽屉里的预订，roomId:', roomId)
          setIsDrawerOpen(false)
        }}
      />
    </div>
  )
}

export default HourlyDetailPage