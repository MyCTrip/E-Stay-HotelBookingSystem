import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import LocationInput from '../../../components/homestay/home/LocationInput'
import DateTimeRangeSelector from '../../../components/homestay/home/DateTimeRangeSelector'
import RoomTypeSelector from '../../../components/homestay/home/RoomTypeSelector'
import PriceSelector from '../../../components/homestay/home/PriceSelector'
import QuickFilters from '../../../components/homestay/home/QuickFilters'
import SearchButton from '../../../components/homestay/home/SearchButton'
import RecommendTypes from '../../../components/homestay/home/RecommendTypes'
import HomeStayCard from '../../../components/homestay/home/HomeStayCard'
import HomeStayCardSkeleton from '../../../components/homestay/home/HomeStayCardSkeleton'
import BannerCarousel from '../../../components/homestay/home/BannerCarousel'
import type { HomeStaySearchParams, HomeStay } from '@estay/shared'
import { QUICK_FILTER_TAGS } from '@estay/shared'
import styles from './index.module.scss'

// 模拟热门民宿数据
const MOCK_HOMESTAYS: HomeStay[] = [
  {
    _id: '1',
    merchantId: 'merchant1',
    baseInfo: {
      nameCn: '江南古韵民宿',
      nameEn: 'Jiangnan Charm',
      address: '黄浦区豫园路88号',
      city: '上海',
      star: 4.8,
      phone: '021-12345678',
      description: '现代简约设计，融合江南古韵，近豫园。',
      roomTotal: 8,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿1'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    merchantId: 'merchant2',
    baseInfo: {
      nameCn: '文创艺术民宿',
      nameEn: 'Art Studio',
      address: '静安区苏州河路166号',
      city: '上海',
      star: 4.9,
      phone: '021-87654321',
      description: '独特艺术风格，每间房个性十足，文创氛围浓厚。',
      roomTotal: 6,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿2'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    merchantId: 'merchant3',
    baseInfo: {
      nameCn: '森林度假小屋',
      nameEn: 'Forest Retreat',
      address: '松江区9号笔山路999号',
      city: '上海',
      star: 4.7,
      phone: '021-98765432',
      description: '远离喧嚣，享受自然，专业设施完善。',
      roomTotal: 5,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿3'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    merchantId: 'merchant4',
    baseInfo: {
      nameCn: '水乡瑞居',
      nameEn: 'Water Village Inn',
      address: '浦东新区陆家嘴环路333号',
      city: '上海',
      star: 4.6,
      phone: '021-11111111',
      description: '濒临黄浦江，景观开阔，现代便利设施。',
      roomTotal: 12,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿4'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    merchantId: 'merchant5',
    baseInfo: {
      nameCn: '老洋房民宿',
      nameEn: 'Classic Villa',
      address: '徐汇区复兴中路1888号',
      city: '上海',
      star: 4.8,
      phone: '021-22222222',
      description: '保留历史痕迹，融合现代舒适，品味生活。',
      roomTotal: 7,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿5'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    merchantId: 'merchant6',
    baseInfo: {
      nameCn: '田园慢居民宿',
      nameEn: 'Countryside Slow Life',
      address: '崇明岛向化镇中心路288号',
      city: '上海',
      star: 4.5,
      phone: '021-33333333',
      description: '远离城市喧嚣，尽享田园风光与宁静生活。',
      roomTotal: 10,
      facilities: [],
      policies: [],
    },
    images: ['https://via.placeholder.com/160x280?text=民宿6'],
    rooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const HomeStayPage: React.FC = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<HomeStaySearchParams>({
    city: '上海',
    checkIn: dayjs().toDate(),
    checkOut: dayjs().add(1, 'day').toDate(),
    guests: 1,
    rooms: 0,
    beds: 0,
    keyword: '',
    selectedTags: [],
    priceMin: 0,
    priceMax: 10000,
  })

  // UI状态
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [homestays, setHomestays] = useState<HomeStay[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [scrollTop, setScrollTop] = useState(0)
  const [modalActive, setModalActive] = useState<'location' | 'date' | 'guests' | null>(null)

  // 首次加载时显示热门民宿推荐
  useEffect(() => {
    loadPopularHomestays()
  }, [])

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // 加载热门民宿推荐
  const loadPopularHomestays = () => {
    setLoading(true)
    try {
      // 模拟异步加载延迟
      setTimeout(() => {
        setHomestays(MOCK_HOMESTAYS)
        setPagination({ page: 1, limit: 20, total: MOCK_HOMESTAYS.length })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Failed to load popular homestays:', error)
      setLoading(false)
    }
  }

  // 下拉刷新处理
  const handlePullRefresh = () => {
    if (refreshing) return

    setRefreshing(true)
    // 模拟刷新延迟
    setTimeout(() => {
      setHomestays(MOCK_HOMESTAYS)
      setRefreshing(false)
    }, 800)
  }

  // 处理容器滚动，监测下拉刷新
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

      // 仅在页面顶部时响应下拉
      if (container.scrollTop === 0 && diff > 0) {
        const ratio = diff / pullThreshold
        // 可以用 ratio 来调整视觉反馈
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

  // 处理地点选择
  const handleLocationSelect = (city: string) => {
    setSearchParams((prev) => ({
      ...prev,
      city,
    }))
  }

  // 处理日期变化
  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    setSearchParams((prev) => ({
      ...prev,
      checkIn,
      checkOut,
    }))
  }

  // 处理房间类型变化
  const handleRoomTypeChange = (guests: number, beds: number, rooms: number) => {
    setSearchParams((prev) => ({
      ...prev,
      guests,
      beds,
      rooms,
    }))
  }

  // 处理价格筛选
  const handlePriceFilter = (minPrice: number, maxPrice: number) => {
    setSearchParams((prev) => ({
      ...prev,
      priceMin: minPrice,
      priceMax: maxPrice,
    }))
  }

  // 处理快速筛选标签
  const handleTagSelect = (tagId: string, selected: boolean) => {
    setSearchParams((prev) => {
      const tags = new Set(prev.selectedTags || [])
      if (selected) {
        tags.add(tagId)
      } else {
        tags.delete(tagId)
      }
      return {
        ...prev,
        selectedTags: Array.from(tags),
      }
    })
  }

  // 处理搜索
  const handleSearch = async () => {
    if (!searchParams.city) {
      alert('请选择城市')
      return
    }

    setLoading(true)
    try {
      // 模拟搜索延迟
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 根据选中的城市和标签过滤数据
      const filtered = MOCK_HOMESTAYS.filter((homestay) => {
        // 城市过滤
        if (homestay.baseInfo.city !== searchParams.city) {
          return false
        }

        // 标签过滤（如果需要）
        if (searchParams.selectedTags && searchParams.selectedTags.length > 0) {
          // TODO: 根据实际的标签逻辑过滤
        }

        return true
      })

      setHomestays(filtered)
      setPagination({ page: 1, limit: 20, total: filtered.length })

      // 构建查询参数并跳转到搜索结果页
      const queryParams = new URLSearchParams({
        city: searchParams.city,
        checkIn: searchParams.checkIn ? dayjs(searchParams.checkIn).format('YYYY-MM-DD') : '',
        checkOut: searchParams.checkOut ? dayjs(searchParams.checkOut).format('YYYY-MM-DD') : '',
        rooms: String(searchParams.rooms || 1),
        guests: String(searchParams.guests || 1),
      })

      navigate(`/search/homeStay?${queryParams.toString()}`)
    } catch (error) {
      console.error('Failed to search:', error)
      alert('搜索失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理我的附近
  const handleNearby = async () => {
    try {
      if (!navigator.geolocation) {
        alert('您的浏览器不支持地理定位')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: 根据坐标获取城市信息
          alert('已获取您的位置')
        },
        (error) => {
          alert('获取位置失败，请授予定位权限')
        }
      )
    } catch (error) {
      console.error('Geolocation error:', error)
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* 轮播 Banner */}
      <BannerCarousel
        autoPlay={true}
        interval={3500}
        onBannerClick={(item) => {
          if (item.link) {
            navigate(item.link)
          }
        }}
      />

      {/* 紧凑搜索筛选区 - 卡片式 */}
      <div className={styles.compactSearchSection}>
        <div className={styles.searchCard}>
          {/* 位置选择 */}
          <div className={styles.cardItem}>
            <LocationInput city={searchParams.city} onCityChange={handleLocationSelect} />
          </div>

          {/* 日期选择 */}
          <div className={styles.cardItem}>
            <DateTimeRangeSelector
              checkIn={searchParams.checkIn}
              checkOut={searchParams.checkOut}
              onDateChange={handleDateChange}
            />
          </div>

          {/* 房间选择 + 价格筛选 同一行 */}
          <div className={styles.dualRowContainer}>
            {/* 房间选择 */}
            <div className={styles.cardItem}>
              <RoomTypeSelector
                rooms={searchParams.rooms}
                beds={searchParams.beds}
                guests={searchParams.guests}
                onChange={handleRoomTypeChange}
              />
            </div>

            {/* 价格筛选 */}
            <div className={styles.cardItem}>
              <PriceSelector
                minPrice={searchParams.priceMin}
                maxPrice={searchParams.priceMax}
                onPriceChange={handlePriceFilter}
              />
            </div>
          </div>

          {/* 快速筛选 */}
          <div className={styles.cardItem}>
            <QuickFilters
              tags={QUICK_FILTER_TAGS}
              selectedTags={searchParams.selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* 搜索按钮 */}
          <div className={styles.cardItem}>
            <SearchButton loading={loading} onClick={handleSearch} label="开始搜索" />
          </div>
        </div>
      </div>

      {/* 推荐类型区域 */}
      <RecommendTypes />

      {/* 民宿列表 */}
      <div className={styles.listSection}>
        {refreshing && (
          <div className={styles.refreshTip}>
            <span className={styles.spinner} />
            正在刷新数据中...
          </div>
        )}

        <div className={styles.cardGrid}>
          {loading ? (
            <HomeStayCardSkeleton count={6} />
          ) : homestays.length > 0 ? (
            homestays.map((homestay) => (
              <div key={homestay._id} className={styles.cardWrapper}>
                <HomeStayCard
                  data={homestay}
                  onClick={() => navigate(`/hotel-detail/homestay/${homestay._id}`)}
                  showStar
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>暂无相关民宿</p>
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <p>加载中...</p>
          </div>
        )}
      </div>

      {/* 底部安全区间距 */}
      <div className={styles.bottomSpacer} />
    </div>
  )
}

export default HomeStayPage
