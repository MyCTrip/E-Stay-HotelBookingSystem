/**
 * 钟点房详情页 - 主容器
 */
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
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

// 🌟 1. 引入真实的类型和我们写好的抽屉组件
import { HourlyRoomDetail } from '@estay/shared'
import HourlyRoomDetailDrawer from '../../RoomDetail/hourlyHotel/index'

import styles from './index.module.css'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('rooms')
  const [headerOpacity, setHeaderOpacity] = useState(0)

  // 🌟 2. 新增控制弹窗的状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<HourlyRoomDetail | null>(null)

  const sectionRefs = {
    rooms: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
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
      facilities: sectionRefs.facilities.current?.offsetTop || 1000,
      reviews: sectionRefs.reviews.current?.offsetTop || 2000,
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

  // 🌟 3. 打开抽屉的处理函数
  const handleOpenRoomDetail = (room: HourlyRoomDetail) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      <DetailHeader
        ref={headerRef}
        data={initialData}
        opacity={headerOpacity}
        onCollectionChange={() => console.log('Collection toggled')}
      />

      <div className={styles.content} ref={contentRef}>
        <ImageCarousel images={initialData.images} />
        <HourlyHotelInfo data={initialData} />
        <DetailTabs activeTab={activeTab} onChange={handleTabChange} />

        <div ref={sectionRefs.rooms}>
          {/* 🌟 4. 把打开弹窗的方法作为 prop 传给子组件 */}
          <HourlyRoomSelection
            data={initialData}
            onOpenDetail={handleOpenRoomDetail}
          />
        </div>

        <div ref={sectionRefs.facilities}>
          <FacilitiesSection data={initialData} />
        </div>
        <div ref={sectionRefs.reviews}>
          <ReviewSection hostelId={initialData._id} />
        </div>
        <div ref={sectionRefs.policies}>
          <PolicySection data={initialData} />
        </div>
        <div ref={sectionRefs.nearby}>
          <NearbyRecommendations location={initialData.location} />
        </div>
        <div className={styles.spacer} />
      </div>

      <HourlyBookingBar data={initialData} onBook={handleBook} />

      {/* 🌟 5. 在页面最外层挂载房型详情抽屉 */}
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
          setIsDrawerOpen(false) // 预订后关闭弹窗
        }}
      />
    </div>
  )
}

export default HourlyDetailPage