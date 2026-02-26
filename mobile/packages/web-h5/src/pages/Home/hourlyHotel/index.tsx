import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import LocationInput from '../../../components/hourlyHotel/home/LocationInput'
import DateDurationSelector from '../../../components/hourlyHotel/home/DateDurationSelector'
import SearchButton from '../../../components/hourlyHotel/home/SearchButton'
import HourlyRoomCard from '../../../components/hourlyHotel/home/HourlyRoomCard'
import HourlyRoomCardSkeleton from '../../../components/hourlyHotel/home/HourlyRoomCardSkeleton'
import BannerCarousel from '../../../components/hourlyHotel/home/BannerCarousel'

import type { HourlyRoomSearchParams, HourlyRoom } from '@estay/shared'
import styles from './index.module.scss'

// 模拟热门钟点房数据 (偏向机场、高铁站、商圈)
const MOCK_HOURLY_ROOMS: HourlyRoom[] = [
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '全季酒店',
      nameEn: 'Cloud Transit Hotel',
      address: '闵行区虹桥机场1公里',
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
    images: ['https://img-md.veimg.cn/meadinindex/img5/2021/11/F87B3809081B4AE0BA6DFC64AE06C24E.jpg'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '维也纳国际酒店(上海浦东机场店)',
      nameEn: 'Cloud Transit Hotel',
      address: '上海市浦东新区祝桥镇',
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
    images: ['https://www.3wen.com/userfiles/files/TUPIAN/1VIENNA1.jpg'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h1',
    merchantId: 'merchant_air1',
    baseInfo: {
      nameCn: '橘子酒店(徐家汇店)',
      nameEn: 'Cloud Transit Hotel',
      address: '上海市徐汇区肇嘉浜路',
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
    images: ['https://img-md.veimg.cn/meadinindex/img5/2023/7/96236556ef280c555fe6a23e0237ea8d.jpg'],
    durationOptions: [3, 4, 6], // 支持的小时数
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h2',
    merchantId: 'merchant_cbd1',
    baseInfo: {
      nameCn: '上海宝安大酒店',
      nameEn: 'IFC Lounge & Room',
      address: '陆家嘴，近世纪大道地铁站',
      city: '上海',
      star: 4.9,
      phone: '021-55556666',
      description: '高端商务休憩空间，位置优越，出行方便。',
      roomTotal: 15,
      facilities: [{ category: '服务', content: '免费咖啡' } as any,
      { category: '服务', content: '极速Wi-Fi' } as any,
      { category: '基础', content: '办公桌' } as any,
      ],
      policies: [{ policyType: '退订', content: '随时退' } as any],
    },
    images: ['https://img-md.veimg.cn/meadinindex/img5/2022/8/3DBD8259557F4887887D98BDA604B086.jpg'],
    durationOptions: [3, 4, 6,],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h3',
    merchantId: 'merchant_train1',
    baseInfo: {
      nameCn: '白玉兰酒店',
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
    images: ['https://5b0988e595225.cdn.sohucs.com/images/20190722/7cdfe3f458ce41d183655f90710c710d.png'],
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
    date: dayjs().toDate(),
    startTime: '14:00',
    duration: 4,
    guests: 1,
    rooms: 1,
    keyword: '',
    selectedTags: [],
    priceMin: 0,
    priceMax: 500,
  })

  // UI状态
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hourlyRooms, setHourlyRooms] = useState<HourlyRoom[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  // 新增：Tab 栏状态
  const [activeTab, setActiveTab] = useState('特色精选')
  const tabs = ['特色精选', '限时特惠', '情侣约会', '影音电竞']

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

  // 监听移动端下拉动作 
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

  // 处理日期与时长变化 
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

  // 切换 Tab 的处理逻辑（可后续扩展请求不同接口）
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // 这里可以加上请求新数据的逻辑
    // loadPopularHourlyRooms() 
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.bannerContainer}>
        <BannerCarousel
          autoPlay={true}
          interval={3500}
          onBannerClick={(item) => navigate(item.link || '#')}
        />
      </div>

      <div className={styles.compactSearchSection}>
        <div className={styles.searchCard}>
          {/* 位置选择 */}
          <div className={styles.cardItem}>
            <LocationInput
              city={searchParams.city}
              onCityChange={(city) => setSearchParams(prev => ({ ...prev, city }))}
            />
          </div>

          {/* 日期与时长选择 */}
          <div className={styles.cardItem}>
            <DateDurationSelector
              date={searchParams.date}
              duration={searchParams.duration}
              onChange={handleDateDurationChange}
            />
          </div>

          {/* 查找按钮（直接跟在日期下面） */}
          <div className={styles.cardItem}>
            <SearchButton
              loading={loading}
              onClick={handleSearch}
              label="查询" // 参考携程改成了"查询"
            />
          </div>
        </div>
      </div>

      {/* 替换原有的 RecommendTypes 为新的 Tab 栏 */}
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
            {activeTab === tab && <div className={styles.tabIndicator} />}
          </div>
        ))}
      </div>

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