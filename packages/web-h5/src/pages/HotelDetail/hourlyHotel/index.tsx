/**
 * 钟点房详情页 - 主容器
 */
import React, { useEffect, useRef, useState } from 'react'
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
// import HourlyRoomDetailDrawer from '../../../components/hourlyHotel/detail/HourlyRoomDetailDrawer'
import HourlyRoomDetailDrawer from '../../RoomDetail/hourlyHotel/index'
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
    'https://img-md.veimg.cn/meadinindex/img5/2021/11/F87B3809081B4AE0BA6DFC64AE06C24E.jpg',
    'https://th.bing.com/th/id/OIP.Akykor3nSsgINL-1Hi5vDAHaEJ?w=305&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    'https://www.hotelfh.cn/uploads/upfile/2020512121792386.jpg',
    'https://tse1.explicit.bing.net/th/id/OIP.6xzB3YoHZGJd8E5UR4uXCwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
  ],
  price: 90,
  duration: 3,
  location: '上海市浦东新区潍坊路',
}

interface DetailPageProps {
  initialData?: any
}

const HourlyDetailPage: React.FC<DetailPageProps> = ({ initialData = mockHourlyData }) => {
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('rooms')
  const [headerOpacity, setHeaderOpacity] = useState(0)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<HourlyRoomDetail | null>(null)

  // 🌟 核心修改 1：新增并完善所需的状态 (State)
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [roomCount, setRoomCount] = useState<number>(1)  // 默认1间
  const [adultCount, setAdultCount] = useState<number>(1) // 默认1个成人
  const [childCount, setChildCount] = useState<number>(0) // 默认0个儿童

  const sectionRefs = {
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
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
      nearby: sectionRefs.nearby.current?.offsetTop || 4000,
      policies: sectionRefs.policies.current?.offsetTop || 3000,
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
    console.log('点击了房型，准备打开弹窗！当前房型数据:', room)
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleShare = () => {
    console.log('Share clicked')
  }

  const handleCollectionChange = () => {
    console.log('Collection toggled')
  }

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>

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
          {/* 🌟 核心修改 2：接入新版的 HourlyTimePicker 参数和事件 */}
          <HourlyTimePicker
            date={selectedDate}
            roomCount={roomCount}
            adultCount={adultCount}
            childCount={childCount}
            onDateChange={(newDate) => {
              setSelectedDate(newDate) // 接收子组件传回的新日期并保存
            }}
            onGuestChange={(rooms, adults, children) => {
              setRoomCount(rooms)      // 接收子组件传回的房间数并保存
              setAdultCount(adults)    // 接收成人数并保存
              setChildCount(children)  // 接收儿童数并保存
            }}
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