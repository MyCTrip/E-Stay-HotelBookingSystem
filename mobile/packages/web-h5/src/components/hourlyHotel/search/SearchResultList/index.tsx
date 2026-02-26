import React, { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { HourlyRoom } from '@estay/shared'

import HourlySearchResultCard from '../SearchResultCard'
import FilterSortBar from '../FilterSortBar'
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

  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

const HourlySearchResultList: React.FC<HourlySearchResultListProps> = ({
  data = [],
  loading = false,
  filters,
  onFiltersChange,
  onClick,
  loadingMore = false,
  hasMore = true,
  onLoadMore,
}) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [sortBy, setSortBy] = useState<'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'>('smart')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showCityPopup, setShowCityPopup] = useState(false)
  const [showDatePopup, setShowDatePopup] = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [filterKey, setFilterKey] = useState(0)

  const formattedDate = filters?.checkInDate ? dayjs(filters.checkInDate).format('MM.DD') : dayjs().format('MM.DD')

  const handleOpenPopup = (type: 'city' | 'date' | 'location' | 'none') => {
    if (type !== 'none') {
      setFilterKey(Date.now())
    }
    setShowCityPopup(type === 'city')
    setShowDatePopup(type === 'date')
    setShowLocationPopup(type === 'location')
  }

  const handleCitySelect = (selectedCity: string) => { /* ... */ }
  const handleDateConfirm = (date: Date, duration: number) => { /* ... */ }
  const handleLocationSelect = (location: string) => { /* ... */ }
  const handlePriceChange = (minPrice: number, maxPrice: number) => { /* ... */ }
  const handleGuestChange = (guests: number) => { /* ... */ }
  const handleFacilitiesChange = (facilities: string[]) => { /* ... */ }

  const hasActiveFilters = !!(filters?.priceMin || filters?.priceMax || filters?.facilities?.length)

  // 监听内容区滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget

    // 触底阈值：距离底部还有 50px 时触发
    if (scrollHeight - scrollTop - clientHeight <= 50) {
      if (onLoadMore && !loadingMore && hasMore) {
        onLoadMore()
      }
    }
  }, [onLoadMore, loadingMore, hasMore])

  return (
    <SlideDrawerProvider>
      {/* 🌟 这里的 onScroll 已经被去掉了，保证外层绝对不滚动 */}
      <div className={styles.container} ref={containerRef}>

        <div className={styles.headerArea}>
          {/* 顶部导航栏 (返回按钮和标题) */}
          <div className={styles.navBar}>
            <div className={styles.backButton} onClick={() => navigate(-1)}>
              {/* 假设这里有你的返回图标 */}
              &lt;
            </div>
            <div className={styles.navTitle}>上海钟点房</div>
          </div>

          {/* 搜索胶囊栏 */}
          <div className={styles.searchCapsule}>
            <div className={styles.capsuleLeft} onClick={() => setShowCityPopup(true)}>
              <span className={styles.cityText}>{filters?.city || '上海'}</span>
              <div className={styles.dateInfo} onClick={(e) => { e.stopPropagation(); setShowDatePopup(true); }}>
                <span>{formattedDate}</span>
                <span>{filters?.duration}小时</span>
              </div>
            </div>
            <div className={styles.capsuleRight} onClick={() => setShowLocationPopup(true)}>
              <span className={styles.searchPlaceholder}>🔍 搜索酒店/地标</span>
            </div>
          </div>
        </div>

        <div className={styles.filterBarWrapper} onClickCapture={() => handleOpenPopup('none')}>
          <FilterSortBar
            key={filterKey}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as 'list' | 'grid')}
            minPrice={filters?.priceMin || 0}
            maxPrice={filters?.priceMax || 10000}
            guests={filters?.guestCount || 1}
            beds={0}
            rooms={0}
            onPriceChange={handlePriceChange}
            onGuestChange={handleGuestChange}
            facilities={filters?.facilities || []}
            onFacilitiesChange={handleFacilitiesChange}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* 🌟 真正的滚动容器在这里：加上 onScroll={handleScroll} */}
        <div className={styles.content} onScroll={handleScroll}>
          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading ? (
              <div className={styles.loadingText}>加载中...</div>
            ) : data.length > 0 ? (
              <>
                {data.map((item) => (
                  <HourlySearchResultCard key={item._id} data={item} onClick={onClick} />
                ))}

                {/* 底部加载状态提示 */}
                {loadingMore && <div className={styles.loadingMoreText}>正在加载更多...</div>}
                {!hasMore && <div className={styles.loadingMoreText}>没有更多钟点房了</div>}
              </>
            ) : (
              <div className={styles.emptyState}>找不到匹配的钟点房</div>
            )}
          </div>
        </div>

        <CitySearch visible={showCityPopup} currentCity={filters?.city || '上海'} onSelect={handleCitySelect} onClose={() => setShowCityPopup(false)} />
        <DateDurationSelector isPopupOnly={true} visible={showDatePopup} date={filters?.checkInDate ? dayjs(filters.checkInDate).toDate() : dayjs().toDate()} duration={filters?.duration || 4} onClose={() => setShowDatePopup(false)} onChange={handleDateConfirm} />
        <LocationSearch visible={showLocationPopup} onSelect={handleLocationSelect} onClose={() => setShowLocationPopup(false)} />
      </div>
    </SlideDrawerProvider>
  )
}

export default HourlySearchResultList