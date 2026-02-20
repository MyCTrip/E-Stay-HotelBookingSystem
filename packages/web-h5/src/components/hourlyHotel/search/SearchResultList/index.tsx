/**
 * 钟点房搜索结果列表容器 - 组合所有层组件
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { HourlyRoom } from '@estay/shared'
// 注意：以下这些通用子组件，如果你已经在 homestay 写好了，建议直接抽取到 common 目录下复用
import SearchResultHeader from '../SearchResultHeader'
import FilterSortBar from '../FilterSortBar'
import SelectedTagsBar from '../SelectedTagsBar'
import FloatingActionButtons from '../FloatingActionButtons'
import HourlyRoomCard from '../../home/HourlyRoomCard' // 🌟 直接复用我们写好的钟点房大卡片
import FilterPanel, { type FilterState } from '../FilterPanel'
import MapView from '../MapView'
import styles from './index.module.scss'

// 🌟 核心修改 1：搜索条件适配钟点房（改用 date 和 duration）
export interface HourlySearchFilters {
  city?: string
  date?: string
  duration?: number // 入住时长：如 3, 4, 6
  guestCount?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'
type ViewMode = 'list' | 'grid' | 'map'

export interface HourlySearchResultListProps {
  data?: HourlyRoom[]
  loading?: boolean
  filters?: HourlySearchFilters
  onFiltersChange?: (filters: HourlySearchFilters) => void
  onModifySearch?: () => void
  // ✅ 新增 onClick 属性声明，解决报错
  onClick?: (id: string) => void
}

const HourlySearchResultList: React.FC<HourlySearchResultListProps> = ({
  data = [],
  loading = false,
  filters = {
    city: '上海',
    date: dayjs().format('YYYY-MM-DD'),
    duration: 4,
    guestCount: 1,
  },
  onFiltersChange,
  onModifySearch,
  onClick, // ✅ 解构 onClick
}) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 状态管理
  const [scrollTop, setScrollTop] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortType>('smart')
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerScrollHeight, setContainerScrollHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768)
  const [filterPanelVisible, setFilterPanelVisible] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [displayedData, setDisplayedData] = useState<HourlyRoom[]>(data)
  const [pageSize] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)

  // 计算选中的标签
  const selectedTags = useCallback(() => {
    const tags: Array<{ key: string; label: string }> = []
    if (filters.priceMin || filters.priceMax) {
      tags.push({
        key: 'price',
        label: `¥${filters.priceMin || '0'}-${filters.priceMax || '∞'}`,
      })
    }
    if (filters.stars && filters.stars.length > 0) {
      tags.push({ key: 'stars', label: `${filters.stars.join('/')}星` })
    }
    if (filters.facilities && filters.facilities.length > 0) {
      tags.push({ key: 'facilities', label: `${filters.facilities.length}项设施` })
    }
    return tags
  }, [filters])

  // 监听容器大小变化
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleResize = () => setContainerHeight(container.clientHeight)
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    handleResize()
    return () => resizeObserver.disconnect()
  }, [])

  // 数据同步
  useEffect(() => {
    setDisplayedData(data.slice(0, pageSize))
    setCurrentPage(1)
  }, [data, pageSize])

  // 监听窗口大小变化
  useEffect(() => {
    const handleWindowResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      if (width <= 768 && viewMode !== 'map') {
        setViewMode('list')
      }
    }
    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [viewMode])

  useEffect(() => {
    const content = contentRef.current
    if (content) setContainerScrollHeight(content.scrollHeight)
  }, [data, viewMode])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
    setContainerHeight(target.clientHeight)
    setContainerScrollHeight(target.scrollHeight)

    const distanceToBottom = target.scrollHeight - (target.scrollTop + target.clientHeight)
    if (distanceToBottom < 200 && !isLoadingMore && currentPage * pageSize < data.length) {
      handleLoadMore()
    }
  }

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTagRemove = (key: string) => {
    const newFilters = { ...filters }
    switch (key) {
      case 'price':
        delete newFilters.priceMin
        delete newFilters.priceMax
        break
      case 'stars':
        delete newFilters.stars
        break
      case 'facilities':
        delete newFilters.facilities
        break
    }
    onFiltersChange?.(newFilters)
  }

  const handleResetAll = () => {
    const resetFilters: HourlySearchFilters = {
      city: filters.city,
      date: filters.date,
      duration: filters.duration,
      guestCount: filters.guestCount,
    }
    onFiltersChange?.(resetFilters)
  }

  const handleSortChange = (sort: SortType) => setSortBy(sort)
  const handleViewModeChange = (mode: ViewMode) => setViewMode(mode)
  const handleOpenFilterPanel = () => setFilterPanelVisible(true)
  const handleCloseFilterPanel = () => setFilterPanelVisible(false)

  const handleApplyFilters = (filterState: FilterState) => {
    const newFilters: HourlySearchFilters = {
      ...filters,
      priceMin: filterState.priceMin || undefined,
      priceMax: filterState.priceMax || undefined,
      stars: filterState.stars.length > 0 ? filterState.stars : undefined,
      facilities: filterState.facilities.length > 0 ? filterState.facilities : undefined,
    }
    Object.keys(newFilters).forEach(
      key => newFilters[key as keyof HourlySearchFilters] === undefined && delete newFilters[key as keyof HourlySearchFilters]
    )
    onFiltersChange?.(newFilters)
    setFilterPanelVisible(false)
    setCurrentPage(1)
    setDisplayedData(data.slice(0, pageSize))
  }

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || currentPage * pageSize >= data.length) return
    setIsLoadingMore(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      setDisplayedData(data.slice(0, nextPage * pageSize))
      setCurrentPage(nextPage)
      setIsLoadingMore(false)
    }, 300)
  }, [currentPage, pageSize, data, isLoadingMore])

  const tags = selectedTags()
  const hasActiveFilters = tags.length > 0

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      {/* 顶部导航栏 */}
      <SearchResultHeader
        filters={filters as any} // ⚠️ 注意：这里的 SearchResultHeader 内部需要适配钟点房显示 date 和 duration
        onModifyClick={onModifySearch}
      />

      <FilterSortBar
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasActiveFilters={hasActiveFilters}
        onFilterClick={handleOpenFilterPanel}
      />

      {viewMode === 'map' ? (
        <MapView
          data={displayedData}
          filters={filters as any}
          // ✅ 替换为 onClick
          onMarkerClick={(id) => onClick ? onClick(id) : navigate(`/hotel-detail/hourly/${id}`)}
        />
      ) : (
        <div className={styles.content} ref={contentRef}>
          {tags.length > 0 && (
            <SelectedTagsBar tags={tags} onTagRemove={handleTagRemove} onResetAll={handleResetAll} />
          )}

          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading ? (
              <div className={styles.skeletonContainer}>
                {[...Array(6)].map((_, i) => <div key={i} className={styles.skeletonCard} />)}
              </div>
            ) : displayedData.length > 0 ? (
              <>
                {/* 🌟 核心修改 2：不论是网格还是列表，钟点房直接复用我们的 HourlyRoomCard (因为它自适应极好) */}
                {displayedData.map((item) => (
                  <HourlyRoomCard
                    key={item._id}
                    data={item}
                    // ✅ 替换为调用外部传入的 onClick
                    onClick={() => onClick ? onClick(item._id) : navigate(`/hotel-detail/hourly/${item._id}`)}
                  />
                ))}
              </>
            ) : (
              <div className={styles.emptyState}>
                {/* 换成了钟点房的图标和文案 */}
                <div className={styles.emptyIcon}>⏱️</div>
                <div className={styles.emptyTitle}>找不到匹配的钟点房</div>
                <div className={styles.emptyDesc}>
                  试试调整可住时段、入住时长或查看其他城市
                </div>
                <button className={styles.resetBtn} onClick={handleResetAll}>
                  重置筛选条件
                </button>
              </div>
            )}
          </div>

          {displayedData.length > 0 && currentPage * pageSize < data.length && (
            <div className={styles.loadingMore}>
              {isLoadingMore ? <p>加载中...</p> : <p>上拉加载更多</p>}
            </div>
          )}

          {displayedData.length > 0 && currentPage * pageSize >= data.length && data.length > 0 && (
            <div className={styles.loadingMore}>
              <p>已为您加载全部{data.length}个钟点房</p>
            </div>
          )}
        </div>
      )}

      <FloatingActionButtons
        scrollTop={scrollTop}
        containerHeight={containerHeight}
        containerScrollHeight={containerScrollHeight}
        onScrollToTop={handleScrollToTop}
      />

      <FilterPanel
        visible={filterPanelVisible}
        onClose={handleCloseFilterPanel}
        onApply={handleApplyFilters}
        initialFilters={{
          priceMin: filters.priceMin || 0,
          priceMax: filters.priceMax || 10000,
          stars: filters.stars || [],
          facilities: filters.facilities || [],
        }}
      />
    </div>
  )
}

export default HourlySearchResultList