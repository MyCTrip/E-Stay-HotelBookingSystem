/**
 * 民宿详情页 - 主容器
 * 使用DetailLayout组件实现三层固定结构
 */

import React, { useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import type { HomeStay } from '@estay/shared'
import DetailLayout, { type DetailTabKey } from '../../../layouts/DetailLayout'
import DetailTabs from '../../../components/homestay/detail/DetailTabs'
import ImageCarousel from '../../../components/homestay/detail/ImageCarousel'
import HotelInfo from '../../../components/homestay/detail/HotelInfo'
import DatePicker from '../../../components/homestay/detail/DatePicker'
import RoomSelection from '../../../components/homestay/detail/RoomSelection'
import RoomFeatures from '../../../components/homestay/detail/RoomFeatures'
import ReviewSection from '../../../components/homestay/detail/ReviewSection'
import FacilitiesSection from '../../../components/homestay/detail/FacilitiesSection'
import PolicySection from '../../../components/homestay/detail/PolicySection'
import NearbyRecommendations from '../../../components/homestay/detail/NearbyRecommendations'
import HostInfo from '../../../components/homestay/detail/HostInfo'
import BookingBar from '../../../components/homestay/detail/BookingBar'
import PropertyCardContainer from '../../../components/homestay/detail/PropertyCardContainer'
import styles from './index.module.scss'

// 模拟数据 - 实际应从API获取
const mockHomeStayData: any = {
  _id: '123',
  baseInfo: {
    nameCn: '蓬笙·榕奕美宿',
    address: '上海市黄浦区中福城三期北楼',
    star: 4.9,
    reviewCount: 90,
    price: 1280,
  },
  images: [
    '/img/OIP.jpg',
    '/img/OIP (1).jpg',
    '/img/OIP (2).jpg',
    '/img/OIP (3).jpg',
    '/img/OIP (4).jpg',
    '/img/OIP (5).jpg',
    '/img/OIP (6).jpg',
    '/img/OIP (7).jpg',
    '/img/OIP (8).jpg',
    '/img/OIP (9).jpg',
    '/img/OIP (10).jpg',
    '/img/OIP (11).jpg',
    '/img/OIP (12).jpg',
  ],
  price: 1280,
  location: '上海市黄浦区中福城三期北楼',
  host: {
    name: '逸可民宿',
    avatar: 'https://picsum.photos/40/40?random=host',
  },
}

// 同房东附近的其他房源列表（作为 Room 类型）
const mockNearbyProperties = [
  {
    id: 'nearby1',
    name: '精选人气民宿套房1',
    area: '120㎡',
    beds: '4床',
    guests: '8人',
    image: 'https://picsum.photos/240/320?random=room2',
    price: 899,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车'],
    packageCount: 2,
    showBreakfastTag: true,
    breakfastCount: 1,
    showCancelTag: true,
  },
  {
    id: 'nearby2',
    name: '精选人气民宿套房2',
    area: '150㎡',
    beds: '5床',
    guests: '10人',
    image: 'https://picsum.photos/240/320?random=room3',
    price: 1099,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车', '免费早餐'],
    packageCount: 2,
    showBreakfastTag: true,
    breakfastCount: 2,
    showCancelTag: true,
  },
  {
    id: 'nearby3',
    name: '精选人气民宿套房3',
    area: '180㎡',
    beds: '5床',
    guests: '11人',
    image: 'https://picsum.photos/240/320?random=room4',
    price: 1299,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车'],
    packageCount: 3,
    showBreakfastTag: true,
    breakfastCount: 0,
    showCancelTag: false,
  },
  {
    id: 'nearby4',
    name: '精选人气民宿套房4',
    area: '200㎡',
    beds: '6床',
    guests: '12人',
    image: 'https://picsum.photos/240/320?random=room5',
    price: 1499,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车', '免费早餐'],
    packageCount: 3,
    showBreakfastTag: true,
    breakfastCount: 3,
    showCancelTag: true,
  },
]

interface DetailPageProps {
  initialData?: any
}

const DetailPage: React.FC<DetailPageProps> = ({ initialData = mockHomeStayData }) => {
  // 状态
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview')
  const [expandNearbyProperties, setExpandNearbyProperties] = useState(false)
  const [checkInDate, setCheckInDate] = useState<string>('')
  const [checkOutDate, setCheckOutDate] = useState<string>('')

  // 各区域的ref用于滚动联动
  const sectionRefs: Record<DetailTabKey, React.RefObject<HTMLDivElement>> = {
    overview: useRef<HTMLDivElement>(null),
    rooms: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    policies: useRef<HTMLDivElement>(null),
    knowledge: useRef<HTMLDivElement>(null),
    nearby: useRef<HTMLDivElement>(null),
    host: useRef<HTMLDivElement>(null),
  }

  // 处理预订按钮点击
  const handleBook = () => {
    // 滚动到房型选择区
    console.log('Book clicked')
  }

  // 处理房东联系
  const handleContactHost = () => {
    console.log('Contact host')
    // TODO: 进入与房东的聊天界面
  }

  // 处理日期变更
  const handleDateChange = (checkIn: string, checkOut: string) => {
    setCheckInDate(checkIn)
    setCheckOutDate(checkOut)
    console.log('Date changed:', checkIn, checkOut)
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

  // 页面内容结构
  const pageContent = (
    <>
      {/* 图片轮播 - 在overview外 */}
      <ImageCarousel images={initialData.images} />
      
      {/* 酒店信息 - 覆盖在轮播上 */}
      <HotelInfo data={initialData} />
      
      {/* 1. 概览区 - 基本信息 */}
      <div ref={sectionRefs.overview} className={styles.sectionGap}>
        <div style={{ height: '60px' }} />
      </div>

      {/* 2. 房源区 - 分两块：当前房源 + 同房东附近房源 */}
      <div ref={sectionRefs.rooms} className={`${styles.roomsSection} ${styles.sectionGap}`}>
        {/* Block 1: 当前房源 - 只显示1个房间 */}
        <PropertyCardContainer showLabel={false} showExpandBtn={false}>
          <DatePicker onDateChange={handleDateChange} />
          <RoomSelection data={initialData} displayCount={1} />
        </PropertyCardContainer>

        {/* Block 2: 同房东附近其他房源 - 初始显示2个，展开显示全部 */}
        <div className={styles.nearbyPropertiesSection}>
          <PropertyCardContainer
            showLabel={true}
            labelText="同房东附近其他房源"
            tooltipText="推荐同房东的其他房源，高性价比选择"
            showExpandBtn={true}
            expandBtnText="展开查看全部房源"
            isExpanded={expandNearbyProperties}
            onExpandToggle={() => setExpandNearbyProperties(!expandNearbyProperties)}
          >
            <RoomSelection 
              data={initialData}
              rooms={mockNearbyProperties}
              displayCount={expandNearbyProperties ? mockNearbyProperties.length : 2}
            />
          </PropertyCardContainer>
        </div>
      </div>
      {/* 3. 点评区 */}
      <div ref={sectionRefs.reviews} className={styles.sectionGap}>
        <ReviewSection hostelId={initialData._id} />
      </div>

      {/* 4. 设施区 */}
      <div ref={sectionRefs.facilities} className={styles.sectionGap}>
        <FacilitiesSection data={initialData} />
      </div>

      {/* 5. 须知区（政策） */}
      <div ref={sectionRefs.policies} className={styles.sectionGap}>
        <PolicySection 
          data={initialData}
          checkInDate={checkInDate}
          checkInTime="14:00"
          deadlinetime={24}
        />
      </div>

      {/* 6. 周边区（知识内容） */}
      <div ref={sectionRefs.knowledge} className={styles.sectionGap}>
        {/* 预留位置：周边信息、攻略等 */}
        <div style={{ padding: '16px', color: '#999' }}>
          <h3>周边信息</h3>
          <p>内容待完善...</p>
        </div>
      </div>

      {/* 7. 附近区（推荐） */}
      <div ref={sectionRefs.nearby} className={styles.sectionGap}>
        <NearbyRecommendations location={initialData.location || '上海'} />
      </div>

      {/* 8. 房东区 */}
      <div ref={sectionRefs.host} className={styles.sectionGap}>
        <HostInfo data={initialData} />
      </div>

      {/* 底部间隔 */}
      <div style={{ height: '20px' }} />
    </>
  )

  return (
    <DetailLayout
      data={initialData}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onContactHost={handleContactHost}
      onBack={handleBack}
      onShare={handleShare}
      onCollectionChange={handleCollectionChange}
      tabs={<DetailTabs />}
      footer={
        <BookingBar
          data={initialData}
          onBook={handleBook}
          onContactHost={handleContactHost}
          onDateChange={handleDateChange}
        />
      }
    >
      {pageContent}
    </DetailLayout>
  )
}

export default DetailPage
