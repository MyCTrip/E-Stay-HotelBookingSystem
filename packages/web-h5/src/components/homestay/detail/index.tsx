/**
 * 民宿详情页 - 主容器
 */

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { HomeStay } from '@estay/shared'
import DetailHeader from './components/DetailHeader'
import ImageCarousel from './components/ImageCarousel'
import HotelInfo from './components/HotelInfo'
import DetailTabs, { type TabKey } from './components/DetailTabs'
import RoomSelection from './components/RoomSelection'
import RoomFeatures from './components/RoomFeatures'
import FacilitiesSection from './components/FacilitiesSection'
import ReviewSection from './components/ReviewSection'
import PolicySection from './components/PolicySection'
import NearbyRecommendations from './components/NearbyRecommendations'
import HostInfo from './components/HostInfo'
import BookingBar from './components/BookingBar'
import styles from './index.module.scss'

// 模拟数据 - 实际应从API获取
const mockHomeStayData: any = {
  _id: '123',
  baseInfo: {
    nameCn: '蓬笙·榕奕美宿',
    address: '上海市黄浦区中福城三期北楼',
    star: 4.9,
    reviewCount: 90,
  },
  images: [
    'https://picsum.photos/1080/900?random=1',
    'https://picsum.photos/1080/900?random=2',
    'https://picsum.photos/1080/900?random=3',
    'https://picsum.photos/1080/900?random=4',
    'https://picsum.photos/1080/900?random=5',
  ],
  price: 1280,
  location: '上海市黄浦区中福城三期北楼',
}

interface DetailPageProps {
  initialData?: any
}

const DetailPage: React.FC<DetailPageProps> = ({ initialData = mockHomeStayData }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // 状态
  const [scrollTop, setScrollTop] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('rooms')
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 各区域的ref用于滚动联动
  const sectionRefs = {
    rooms: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
  }

  // 处理滚动
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const top = target.scrollTop

    setScrollTop(top)

    // 计算顶部操作栏透明度渐变 (图片高度约为320-360px)
    const imageHeight = 300
    const opacity = Math.min(top / imageHeight, 1)
    setHeaderOpacity(opacity)

    // Tab固定跟踪逻辑
    updateActiveTab(top)
  }

  // 更新activTab - 根据滚动位置检测当前区域
  const updateActiveTab = (scrollPosition: number) => {
    const tabPositions = {
      rooms: sectionRefs.rooms.current?.offsetTop || 0,
      facilities: sectionRefs.facilities.current?.offsetTop || 1000,
      reviews: sectionRefs.reviews.current?.offsetTop || 2000,
      policies: sectionRefs.policies.current?.offsetTop || 3000,
      nearby: sectionRefs.nearby.current?.offsetTop || 4000,
    }

    // 减去Tab栏高度(44px)以提前识别
    const offset = 50
    for (const [tab, position] of Object.entries(tabPositions)) {
      if (scrollPosition + offset >= position) {
        setActiveTab(tab as TabKey)
      }
    }
  }

  // 处理Tab点击 - 滚动到对应位置
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    const ref = sectionRefs[tab]
    if (ref.current && containerRef.current) {
      const offset = ref.current.offsetTop - 44 // 减去Tab栏高度
      containerRef.current.scrollTo({
        top: offset,
        behavior: 'smooth',
      })
    }
  }

  // 处理预订按钮点击
  const handleBook = () => {
    // 滚动到房型选择区
    const ref = sectionRefs.rooms
    if (ref.current && containerRef.current) {
      const offset = ref.current.offsetTop - 44
      containerRef.current.scrollTo({
        top: offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      {/* 顶部操作栏 - 固定 */}
      <DetailHeader
        ref={headerRef}
        data={initialData}
        opacity={headerOpacity}
        onCollectionChange={() => {
          console.log('Collection toggled')
        }}
      />

      {/* 主要内容区 */}
      <div className={styles.content} ref={contentRef}>
        {/* 图片轮播 */}
        <ImageCarousel images={initialData.images} />

        {/* 酒店核心信息 */}
        <HotelInfo data={initialData} />

        {/* 吸顶导航栏 */}
        <DetailTabs activeTab={activeTab} onChange={handleTabChange} />

        {/* 房型选择区 */}
        <div ref={sectionRefs.rooms}>
          <RoomSelection data={initialData} />
        </div>

        {/* 设施区 */}
        <div ref={sectionRefs.facilities}>
          <FacilitiesSection data={initialData} />
        </div>

        {/* 评价区 */}
        <div ref={sectionRefs.reviews}>
          <ReviewSection hostelId={initialData._id} />
        </div>

        {/* 政策区 */}
        <div ref={sectionRefs.policies}>
          <PolicySection data={initialData} />
        </div>

        {/* 房屋特色区 */}
        <RoomFeatures data={initialData} />

        {/* 位置周边区 */}
        <div ref={sectionRefs.nearby}>
          <NearbyRecommendations location={initialData.location || '上海'} />
        </div>

        {/* 房东介绍区 */}
        <HostInfo data={initialData} />

        {/* 空间 - 确保底部栏不遮挡 */}
        <div className={styles.spacer} />
      </div>

      {/* 底部固定预订栏 */}
      <BookingBar data={initialData} onBook={handleBook} />
    </div>
  )
}

export default DetailPage
