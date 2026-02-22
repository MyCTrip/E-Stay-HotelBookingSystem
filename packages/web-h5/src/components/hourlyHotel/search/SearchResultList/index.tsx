import React, { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { HourlyRoom } from '@estay/shared'

import HourlySearchResultCard from '../SearchResultCard'

// 直接复用民宿那边完美的筛选栏组件，保证UI和交互100%一致
import FilterSortBar from '../FilterSortBar'
// 引入下拉抽屉的 Provider (筛选栏内部依赖这个上下文)
import { SlideDrawerProvider } from '../../shared/SlideDrawer/context'

import CitySearch from '../../home/CitySearch'
import DateDurationSelector from '../../home/DateDurationSelector'
import LocationSearch from '../../home/LocationSearch'

import styles from './index.module.scss'

export interface HourlySearchFilters {
  city?: string
  checkInDate?: string
  checkInTime?: string
  duration?: number
  keyword?: string
  priceMin?: number
  priceMax?: number
  guestCount?: number
  facilities?: string[]
}

export interface HourlySearchResultListProps {
  data?: HourlyRoom[]
  loading?: boolean
  filters?: HourlySearchFilters
  onFiltersChange?: (filters: HourlySearchFilters) => void
  onModifySearch: () => void
  onClick?: (id: string) => void
}

const HourlySearchResultList: React.FC<HourlySearchResultListProps> = ({
  data = [],
  loading = false,
  filters,
  onFiltersChange,
  onClick,
}) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // 排序与视图模式状态
  const [sortBy, setSortBy] = useState<'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'>('smart')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list') // 支持 list 和 grid 切换

  // 弹窗状态
  const [showCityPopup, setShowCityPopup] = useState(false)
  const [showDatePopup, setShowDatePopup] = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  // 🌟 新增：用于强制重置 FilterSortBar 的 key
  const [filterKey, setFilterKey] = useState(0)

  const formattedDate = filters?.checkInDate ? dayjs(filters.checkInDate).format('MM.DD') : dayjs().format('MM.DD')

  // --- 统筹管理弹窗，确保每次只开一个，'none' 用于一键关闭所有头部弹窗 ---
  const handleOpenPopup = (type: 'city' | 'date' | 'location' | 'none') => {

    // 🌟 核心魔法：当点击头部弹窗时，改变 key，让筛选栏瞬间销毁重建，自动收起遮罩
    if (type !== 'none') {
      setFilterKey(Date.now())
    }

    setShowCityPopup(type === 'city')
    setShowDatePopup(type === 'date')
    setShowLocationPopup(type === 'location')
  }

  // --- 各种弹窗的确认回调 ---
  const handleCitySelect = (selectedCity: string) => {
    onFiltersChange?.({ ...filters, city: selectedCity })
    setShowCityPopup(false)
  }

  const handleDateConfirm = (date: Date, duration: number) => {
    onFiltersChange?.({
      ...filters,
      checkInDate: dayjs(date).format('YYYY-MM-DD'),
      duration
    })
    setShowDatePopup(false) // 选完自动关闭
  }

  const handleLocationSelect = (location: string) => {
    onFiltersChange?.({ ...filters, keyword: location })
    setShowLocationPopup(false)
  }

  // --- 筛选栏专用的回调函数 ---
  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    onFiltersChange?.({
      ...filters,
      priceMin: minPrice >= 0 ? minPrice : undefined,
      priceMax: maxPrice <= 10000 ? maxPrice : undefined,
    })
  }

  const handleGuestChange = (guests: number) => {
    onFiltersChange?.({
      ...filters,
      guestCount: guests || undefined,
    })
  }

  const handleFacilitiesChange = (facilities: string[]) => {
    onFiltersChange?.({
      ...filters,
      facilities: facilities.length > 0 ? facilities : undefined,
    })
  }

  const hasActiveFilters = !!(filters?.priceMin || filters?.priceMax || filters?.facilities?.length)

  return (
    // 最外层包裹 SlideDrawerProvider，支持筛选下拉
    <SlideDrawerProvider>
      <div className={styles.container} ref={containerRef}>

        {/* --- 头部区域 --- */}
        <div className={styles.headerArea}>
          <div className={styles.navBar}>
            <div className={styles.backButton} onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
              </svg>
            </div>
            <div className={styles.navTitle}>{filters?.city || '上海'}钟点房</div>
          </div>

          <div className={styles.searchCapsule}>
            <div className={styles.capsuleLeft}>
              {/* 点击时只开启 city，关闭其他 */}
              <span className={styles.cityText} onClick={() => handleOpenPopup('city')}>
                {filters?.city || '上海'}
              </span>
              {/* 点击时只开启 date，关闭其他 */}
              <div className={styles.dateInfo} onClick={() => handleOpenPopup('date')}>
                <span>{formattedDate}入驻</span>
                <span>{filters?.duration || 4}小时</span>
              </div>
            </div>

            {/* 点击时只开启 location，关闭其他 */}
            <div className={styles.capsuleRight} onClick={() => handleOpenPopup('location')}>
              <span className={styles.searchIcon}>🔍</span>
              <span className={styles.searchPlaceholder}>
                {filters?.keyword ? filters.keyword : '搜索酒店/地标'}
              </span>
            </div>
          </div>
        </div>

        {/* --- 筛选栏 FilterSortBar --- */}
        {/* onClickCapture 拦截点击，用户点击筛选栏时立刻关闭头部所有的弹窗 */}
        <div onClickCapture={() => handleOpenPopup('none')}>
          <FilterSortBar
            key={filterKey}    /* 🌟 核心：加上这个动态 key */
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as 'list' | 'grid')}
            minPrice={filters?.priceMin || 0}
            maxPrice={filters?.priceMax || 10000}
            guests={filters?.guestCount || 1}
            beds={0} // 钟点房不一定需要床数筛选，传 0 即可
            rooms={0}
            onPriceChange={handlePriceChange}
            onGuestChange={handleGuestChange}
            facilities={filters?.facilities || []}
            onFacilitiesChange={handleFacilitiesChange}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* --- 列表区 --- */}
        <div className={styles.content}>
          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading ? (
              <div className={styles.loadingText}>加载中...</div>
            ) : data.length > 0 ? (
              data.map((item) => (
                <HourlySearchResultCard key={item._id} data={item} onClick={onClick} />
              ))
            ) : (
              <div className={styles.emptyState}>找不到匹配的钟点房</div>
            )}
          </div>
        </div>

        {/* --- 弹窗挂载区 --- */}
        <CitySearch
          visible={showCityPopup}
          currentCity={filters?.city || '上海'}
          onSelect={handleCitySelect}
          onClose={() => setShowCityPopup(false)}
        />

        <DateDurationSelector
          isPopupOnly={true}
          visible={showDatePopup}
          date={filters?.checkInDate ? dayjs(filters.checkInDate).toDate() : dayjs().toDate()}
          duration={filters?.duration || 4}
          onClose={() => setShowDatePopup(false)}
          onChange={handleDateConfirm}
        />

        <LocationSearch
          visible={showLocationPopup}
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPopup(false)}
        />
      </div>
    </SlideDrawerProvider>
  )
}

export default HourlySearchResultList