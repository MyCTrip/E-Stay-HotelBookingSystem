import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import LocationInput from '../../../components/hourlyHotel/home/LocationInput'
import DateDurationSelector from '../../../components/hourlyHotel/home/DateDurationSelector' // 替换原有的 DateRange
import RoomTypeSelector from '../../../components/hourlyHotel/home/RoomTypeSelector'
import PriceSelector from '../../../components/hourlyHotel/home/PriceSelector'
import QuickFilters from '../../../components/hourlyHotel/home/QuickFilters'
import SearchButton from '../../../components/hourlyHotel/home/SearchButton'
import RecommendTypes from '../../../components/hourlyHotel/home/RecommendTypes'
import HourlyRoomCard from '../../../components/hourlyHotel/home/HourlyRoomCard' // 钟点房专属卡片
import HourlyRoomCardSkeleton from '../../../components/hourlyHotel/home/HourlyRoomCardSkeleton'
import BannerCarousel from '../../../components/hourlyHotel/home/BannerCarousel'//要改

import type { HourlyRoomSearchParams, HourlyRoom } from '@estay/shared'
import { HOURLY_QUICK_FILTER_TAGS } from '@estay/shared'
import styles from './index.module.scss' // 直接复用民宿的样式表

// 模拟热门钟点房数据 (偏向机场、高铁站、商圈)
const MOCK_HOURLY_ROOMS: HourlyRoom[] = [
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '虹桥机场T2云端中转酒店',
      nameEn: 'Cloud Transit Hotel',
      address: '闵行区虹桥机场T2航站楼内',
      city: '上海',
      star: 4.8,
      phone: '021-33334444',
      description: '不出航站楼即可入住，提供叫醒服务，转机/早班机首选。',
      roomTotal: 50,
      facilities: [{ category: '基础', content: '24小时热水' } as any,
      { category: '服务', content: '叫醒服务' } as any,
      { category: '服务', content: '隔音极佳' } as any,
      ],
      policies: [{ policyType: '押金', content: '无需押金' } as any,
      { policyType: '退订', content: '随时退' } as any,
      ],
    },
    images: ['https://via.placeholder.com/160x280?text=机场钟点房'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '虹桥机场T2云端中转酒店',
      nameEn: 'Cloud Transit Hotel',
      address: '闵行区虹桥机场T2航站楼内',
      city: '上海',
      star: 4.8,
      phone: '021-33334444',
      description: '不出航站楼即可入住，提供叫醒服务，转机/早班机首选。',
      roomTotal: 50,
      facilities: [{ category: '基础', content: '24小时热水' } as any,
      { category: '服务', content: '叫醒服务' } as any,
      { category: '服务', content: '隔音极佳' } as any,
      ],
      policies: [{ policyType: '押金', content: '无需押金' } as any,
      { policyType: '退订', content: '随时退' } as any,
      ],
    },
    images: ['https://via.placeholder.com/160x280?text=机场钟点房'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '虹桥机场T2云端中转酒店',
      nameEn: 'Cloud Transit Hotel',
      address: '闵行区虹桥机场T2航站楼内',
      city: '上海',
      star: 4.8,
      phone: '021-33334444',
      description: '不出航站楼即可入住，提供叫醒服务，转机/早班机首选。',
      roomTotal: 50,
      facilities: [{ category: '基础', content: '24小时热水' } as any,
      { category: '服务', content: '叫醒服务' } as any,
      { category: '服务', content: '隔音极佳' } as any,
      ],
      policies: [{ policyType: '押金', content: '无需押金' } as any,
      { policyType: '退订', content: '随时退' } as any,
      ],
    },
    images: ['https://via.placeholder.com/160x280?text=机场钟点房'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h2',
    merchantId: 'merchant_cbd1',
    baseInfo: {
      nameCn: '陆家嘴国金商务休憩室',
      nameEn: 'IFC Lounge & Room',
      address: '浦东新区世纪大道8号',
      city: '上海',
      star: 4.9,
      phone: '021-55556666',
      description: '高端商务休憩空间，提供免费咖啡和极速Wi-Fi，适合午休/备考。',
      roomTotal: 15,
      facilities: [{ category: '服务', content: '免费咖啡' } as any,
      { category: '服务', content: '极速Wi-Fi' } as any,
      { category: '基础', content: '办公桌' } as any,
      ],
      policies: [{ policyType: '退订', content: '随时退' } as any],
    },
    images: ['https://via.placeholder.com/160x280?text=商务午休'],
    durationOptions: [3, 4, 6,],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h3',
    merchantId: 'merchant_train1',
    baseInfo: {
      nameCn: '上海火车站电竞主题酒店',
      nameEn: 'E-Sports Hub Hotel',
      address: '静安区天目西路100号',
      city: '上海',
      star: 4.6,
      phone: '021-77778888',
      description: '全系RTX4090高配电脑，候车打发时间神器。',
      roomTotal: 30,
      facilities: [{ category: '服务', content: '高端外设' } as any,
      { category: '服务', content: '独立卫浴' } as any,
      { category: '基础', content: '零食吧' } as any,
      ],
      policies: [{ policyType: '退订', content: '随时退' } as any],
    },
    images: ['https://via.placeholder.com/160x280?text=电竞钟点房'],
    durationOptions: [4, 5, 6],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const HourlyRoomPage: React.FC = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // 钟点房核心搜索参数状态
  const [searchParams, setSearchParams] = useState<HourlyRoomSearchParams>({
    city: '上海',
    date: dayjs().toDate(), // 钟点房只需要单日
    startTime: '14:00',     // 预计入住时间
    duration: 4,            // 默认4小时
    guests: 1,
    rooms: 1,
    keyword: '',
    selectedTags: [],
    priceMin: 0,
    priceMax: 500, // 钟点房价格区间通常较小
  })

  // UI状态
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hourlyRooms, setHourlyRooms] = useState<HourlyRoom[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  // 首次加载时显示热门推荐
  useEffect(() => {
    loadPopularHourlyRooms()
  }, [])

  // 加载热门钟点房
  const loadPopularHourlyRooms = () => {
    setLoading(true)
    setTimeout(() => {
      setHourlyRooms(MOCK_HOURLY_ROOMS)
      setPagination({ page: 1, limit: 20, total: MOCK_HOURLY_ROOMS.length })
      setLoading(false)
    }, 500)
  }

  // 下拉刷新处理
  const handlePullRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    setTimeout(() => {
      setHourlyRooms(MOCK_HOURLY_ROOMS)
      setRefreshing(false)
    }, 800)
  }

  // 监听移动端下拉动作 (与民宿一致)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startY = 0
    let currentY = 0
    const pullThreshold = 60

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      currentY = startY
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY
      const diff = currentY - startY
      if (container.scrollTop === 0 && diff > 0) {
        // 视觉反馈拦截
      }
    }

    const handleTouchEnd = () => {
      const diff = currentY - startY
      if (diff > pullThreshold && container.scrollTop === 0) {
        handlePullRefresh()
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [refreshing])

  // 处理日期与时长变化 (钟点房专属逻辑)
  const handleDateDurationChange = (date: Date, duration: number) => {
    setSearchParams((prev) => ({
      ...prev,
      date,
      duration,
    }))
  }

  // 处理搜索
  const handleSearch = async () => {
    if (!searchParams.city) {
      alert('请选择城市')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const filtered = MOCK_HOURLY_ROOMS.filter(room => room.baseInfo.city === searchParams.city)

      setHourlyRooms(filtered)
      setPagination({ page: 1, limit: 20, total: filtered.length })

      // 构建查询参数并跳转
      const queryParams = new URLSearchParams({
        city: searchParams.city,
        date: searchParams.date ? dayjs(searchParams.date).format('YYYY-MM-DD') : '',
        startTime: searchParams.startTime,
        duration: String(searchParams.duration),
        rooms: String(searchParams.rooms || 1),
      })

      navigate(`/search/hourlyHotel?${queryParams.toString()}`)
    } catch (error) {
      console.error('Failed to search:', error)
      alert('搜索失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* 轮播 Banner - 可以换成钟点房的素材 */}
      <BannerCarousel
        autoPlay={true}
        interval={3500}
        onBannerClick={(item) => navigate(item.link || '#')}
      />

      {/* 紧凑搜索筛选区 - 完全复用卡片样式 */}
      <div className={styles.compactSearchSection}>
        <div className={styles.searchCard}>
          {/* 位置选择 */}
          <div className={styles.cardItem}>
            <LocationInput
              city={searchParams.city}
              onCityChange={(city) => setSearchParams(prev => ({ ...prev, city }))}
            />
          </div>

          {/* 日期与时长选择 (钟点房核心改动点) */}
          <div className={styles.cardItem}>
            <DateDurationSelector
              date={searchParams.date}
              // startTime={searchParams.startTime}
              duration={searchParams.duration}
              onChange={handleDateDurationChange}
            />
          </div>

          {/* 房间数 + 价格筛选 同一行 */}
          <div className={styles.dualRowContainer}>
            <div className={styles.cardItem}>
              <RoomTypeSelector
                rooms={searchParams.rooms}
                guests={searchParams.guests}
                onChange={(guests, beds, rooms) => setSearchParams(prev => ({ ...prev, guests, rooms }))}
              />
            </div>
            <div className={styles.cardItem}>
              <PriceSelector
                minPrice={searchParams.priceMin}
                maxPrice={searchParams.priceMax}
                onPriceChange={(priceMin, priceMax) => setSearchParams(prev => ({ ...prev, priceMin, priceMax }))}
              />
            </div>
          </div>

          {/* 快速筛选 - 标签换成"近地铁"、"含淋浴"等 */}
          <div className={styles.cardItem}>
            <QuickFilters
              tags={HOURLY_QUICK_FILTER_TAGS}
              selectedTags={searchParams.selectedTags}
              onTagSelect={(tagId, selected) => {
                setSearchParams(prev => {
                  const tags = new Set(prev.selectedTags)
                  selected ? tags.add(tagId) : tags.delete(tagId)
                  return { ...prev, selectedTags: Array.from(tags) }
                })
              }}
            />
          </div>

          <div className={styles.cardItem}>
            <SearchButton
              loading={loading}
              onClick={handleSearch}
              label="查找钟点房"
            />
          </div>
        </div>
      </div>

      {/* 推荐类型区域 */}
      <RecommendTypes />

      {/* 钟点房列表 */}
      <div className={styles.listSection}>
        {refreshing && (
          <div className={styles.refreshTip}>
            <span className={styles.spinner} />
            正在刷新附近房源...
          </div>
        )}

        <div className={styles.cardGrid}>
          {loading ? (
            <HourlyRoomCardSkeleton count={6} />
          ) : hourlyRooms.length > 0 ? (
            hourlyRooms.map((room) => (
              <div key={room._id} className={styles.cardWrapper}>
                <HourlyRoomCard
                  data={room}
                  onClick={() => navigate(`/hotel-detail/hourly/${room._id}`)}
                  showStar
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>当前时段暂无相关钟点房</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bottomSpacer} />
    </div>
  )
}

export default HourlyRoomPage
