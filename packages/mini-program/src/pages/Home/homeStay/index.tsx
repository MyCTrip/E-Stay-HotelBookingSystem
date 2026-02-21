import React, { useState, useEffect } from 'react'
import { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Toast } from '@nutui/nutui-taro-react'
import dayjs from 'dayjs'
import SearchBar from '../../../components/homestay/home/SearchBar'
import LocationTabs from '../../../components/homestay/home/LocationTabs'
import LocationInput from '../../../components/homestay/home/LocationInput'
import DateTimeRangeSelector from '../../../components/homestay/home/DateTimeRangeSelector'
import RoomTypeSelector from '../../../components/homestay/home/RoomTypeSelector'
import QuickFilters from '../../../components/homestay/home/QuickFilters'
import SearchButton from '../../../components/homestay/home/SearchButton'
import HotStaysSection from '../../../components/homestay/home/HotStaysSection'
import type { HomeStaySearchParams, HomeStay } from '@estay/shared'
import { QUICK_FILTER_TAGS } from '@estay/shared'
import styles from './index.module.scss'

type LocationTabType = 'domestic' | 'overseas' | 'weekly'

const HomeStayPage: React.FC = () => {
  const router = useRouter()

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<HomeStaySearchParams>({
    city: '上海',
    checkIn: dayjs().toDate(),
    checkOut: dayjs().add(1, 'day').toDate(),
    guests: 1,
    rooms: 1,
    beds: 1,
    keyword: '',
    selectedTags: [],
  })

  // UI状态
  const [scrollTop, setScrollTop] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hotStays, setHotStays] = useState<HomeStay[]>([])
  const [activeTab, setActiveTab] = useState<LocationTabType>('domestic')

  // 初始化加载热门民宿
  useEffect(() => {
    loadHotStays()
  }, [])

  // 加载热门民宿数据
  const loadHotStays = async () => {
    setLoading(true)
    try {
      // TODO: 从store获取热门民宿
      // const data = await useHomeStayStore().fetchHotStays(24)
      // setHotStays(data)
      // 暂时使用mock数据
      setHotStays([])
    } catch (error) {
      console.error('Failed to load hot stays:', error)
      Toast.fail('加载热门民宿失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理滚动
  const handleScroll = (e: any) => {
    setScrollTop(e.detail.scrollTop)
  }

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
  const handleRoomTypeChange = (rooms: number, beds: number, guests: number) => {
    setSearchParams((prev) => ({
      ...prev,
      rooms,
      beds,
      guests,
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
    // 验证必填项
    if (!searchParams.city) {
      Toast.fail('请选择城市')
      return
    }

    // 存储搜索参数并导航到结果页
    // TODO: 存储到store
    router.push(
      `/pages/search-result/homeStay/index?city=${searchParams.city}&checkIn=${dayjs(searchParams.checkIn).format('YYYY-MM-DD')}&checkOut=${dayjs(searchParams.checkOut).format('YYYY-MM-DD')}&guests=${searchParams.guests}`
    )
  }

  // 处理我的附近
  const handleNearby = async () => {
    try {
      // Taro 地理定位 API
      // const location = await Taro.getLocation()
      // TODO: 根据坐标获取城市信息
      Toast.success('已获取您的位置')
    } catch (error) {
      Toast.fail('获取位置失败，请授予定位权限')
    }
  }

  return (
    <View className={styles.container}>
      {/* 固定搜索栏 */}
      <SearchBar
        location={searchParams.city}
        scrollTop={scrollTop}
        onClick={() => router.push('/pages/search/index')}
      />

      {/* 可滚动内容 */}
      <ScrollView scrollY className={styles.scrollView} onScroll={handleScroll}>
        <View className={styles.content}>
          {/* 地点分类Tabs */}
          <LocationTabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

          {/* 地点输入 */}
          <LocationInput
            value={searchParams.city}
            onLocationSelect={handleLocationSelect}
            onNearbyClick={handleNearby}
          />

          {/* 日期范围选择 */}
          <DateTimeRangeSelector
            checkIn={searchParams.checkIn}
            checkOut={searchParams.checkOut}
            onDateChange={handleDateChange}
          />

          {/* 房间类型选择 */}
          <RoomTypeSelector
            rooms={searchParams.rooms}
            beds={searchParams.beds}
            guests={searchParams.guests}
            onChange={handleRoomTypeChange}
          />

          {/* 快速筛选标签 */}
          <QuickFilters
            tags={QUICK_FILTER_TAGS}
            selectedTags={searchParams.selectedTags}
            onTagSelect={handleTagSelect}
          />

          {/* 搜索按钮 */}
          <SearchButton loading={loading} onClick={handleSearch} label="查询" />

          {/* 分割线 */}
          <View className={styles.divider} />

          {/* 热门推荐区 */}
          <HotStaysSection
            title="推荐"
            data={hotStays.slice(0, 8)}
            onCardClick={(id) => router.push(`/pages/hotel-detail/homeStay/index?id=${id}`)}
            loading={loading}
          />

          <HotStaysSection
            title="都会团购"
            data={hotStays.slice(8, 16)}
            onCardClick={(id) => router.push(`/pages/hotel-detail/homeStay/index?id=${id}`)}
            loading={loading}
          />

          <HotStaysSection
            title="迪士尼出门"
            data={hotStays.slice(16, 24)}
            onCardClick={(id) => router.push(`/pages/hotel-detail/homeStay/index?id=${id}`)}
            loading={loading}
          />

          {/* 底部安全区间距 */}
          <View className={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeStayPage
