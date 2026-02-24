/**
 * 搜索结果列表容器 - 组合所有4层组件
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HomeStay } from '@estay/shared'
import SearchResultHeader from '../SearchResultHeader'
import SearchBar from '../SearchBar'
import FilterSortBar from '../FilterSortBar'
import SelectedTagsBar from '../SelectedTagsBar'
import FloatingActionButtons from '../FloatingActionButtons'
import SearchResultCard from '../SearchResultCard'
import HomeStayCard from '../../home/HomeStayCard'
import { SlideDrawerProvider } from '../../shared/SlideDrawer/context'
import styles from './index.module.scss'

interface SearchFilters {
  city?: string
  checkInDate?: string
  checkOutDate?: string
  roomCount?: number
  guestCount?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'
type ViewMode = 'list' | 'grid'

interface SearchResultListProps {
  data?: HomeStay[]
  loading?: boolean
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  onModifySearch?: () => void
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  data = [],
  loading = false,
  filters = {
    city: '上海',
    checkInDate: '2024-02-17',
    checkOutDate: '2024-02-18',
    roomCount: 1,
    guestCount: 2,
  },
  onFiltersChange,
  onModifySearch,
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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [displayedData, setDisplayedData] = useState<HomeStay[]>(data)
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
      tags.push({
        key: 'stars',
        label: `${filters.stars.join('/')}星`,
      })
    }

    if (filters.facilities && filters.facilities.length > 0) {
      tags.push({
        key: 'facilities',
        label: `${filters.facilities.length}项设施`,
      })
    }

    return tags
  }, [filters])

  // 监听容器大小变化
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      setContainerHeight(container.clientHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    handleResize()

    return () => resizeObserver.disconnect()
  }, [])

  // 数据同步 - 当原始数据变化时重置分页
  useEffect(() => {
    setDisplayedData(data.slice(0, pageSize))
    setCurrentPage(1)
  }, [data, pageSize])

  // 监听窗口大小变化，根据断点自动调整视图模式
  useEffect(() => {
    const handleWindowResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      // 768px是MainLayout导航栏变化的断点
      // <= 768px时显示单列，> 768px时显示双列
      if (width <= 768) {
        setViewMode('list')
      }
    }

    window.addEventListener('resize', handleWindowResize)
    handleWindowResize() // 初始化调用

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  // 更新滚动高度
  useEffect(() => {
    const content = contentRef.current
    if (content) {
      setContainerScrollHeight(content.scrollHeight)
    }
  }, [data, viewMode])

  // 处理容器滚动
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const scrollPosition = target.scrollTop
    const containerHeight = target.clientHeight
    const scrollHeight = target.scrollHeight

    setScrollTop(scrollPosition)
    setContainerHeight(containerHeight)
    setContainerScrollHeight(scrollHeight)

    // 无限滚动：距离底部200px时加载更多
    const distanceToBottom = scrollHeight - (scrollPosition + containerHeight)
    if (distanceToBottom < 200 && !isLoadingMore && currentPage * pageSize < data.length) {
      handleLoadMore()
    }
  }

  // 使用window滚动事件
  useEffect(() => {
    let ticking = false

    const handleWindowScroll = () => {
      const scrollPosition = window.scrollY
      setScrollTop(scrollPosition)
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  // 滚动到顶部
  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // 处理标签移除
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

  // 重置所有筛选
  const handleResetAll = () => {
    const resetFilters: SearchFilters = {
      city: filters.city,
      checkInDate: filters.checkInDate,
      checkOutDate: filters.checkOutDate,
      roomCount: filters.roomCount,
      guestCount: filters.guestCount,
    }
    onFiltersChange?.(resetFilters)
  }

  // 处理排序变化
  const handleSortChange = (sort: SortType) => {
    setSortBy(sort)
  }

  // 处理视图模式变化
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  // 处理价格变化
  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    const newFilters: SearchFilters = {
      ...filters,
      priceMin: minPrice >= 0 ? minPrice : undefined,
      priceMax: maxPrice <= 10000 ? maxPrice : undefined,
    }
    // 清除undefined属性
    Object.keys(newFilters).forEach(
      (key) =>
        newFilters[key as keyof SearchFilters] === undefined &&
        delete newFilters[key as keyof SearchFilters]
    )
    onFiltersChange?.(newFilters)
    setCurrentPage(1)
    setDisplayedData(data.slice(0, pageSize))
  }

  // 处理人数/房间变化
  const handleGuestChange = (guests: number, beds: number, rooms: number) => {
    const newFilters: SearchFilters = {
      ...filters,
      guestCount: guests || undefined,
      roomCount: rooms || undefined,
    }
    Object.keys(newFilters).forEach(
      (key) =>
        newFilters[key as keyof SearchFilters] === undefined &&
        delete newFilters[key as keyof SearchFilters]
    )
    onFiltersChange?.(newFilters)
    setCurrentPage(1)
    setDisplayedData(data.slice(0, pageSize))
  }

  // 处理位置变化
  const handleLocationChange = (location: string) => {
    // location changed handler
  }

  // 处理设施变化
  const handleFacilitiesChange = (facilities: string[]) => {
    const newFilters: SearchFilters = {
      ...filters,
      facilities: facilities.length > 0 ? facilities : undefined,
    }
    Object.keys(newFilters).forEach(
      (key) =>
        newFilters[key as keyof SearchFilters] === undefined &&
        delete newFilters[key as keyof SearchFilters]
    )
    onFiltersChange?.(newFilters)
    setCurrentPage(1)
    setDisplayedData(data.slice(0, pageSize))
  }

  // 处理无限滚动 - 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || currentPage * pageSize >= data.length) return

    setIsLoadingMore(true)
    // 模拟网络延迟
    setTimeout(() => {
      const nextPage = currentPage + 1
      const newData = data.slice(0, nextPage * pageSize)
      setDisplayedData(newData)
      setCurrentPage(nextPage)
      setIsLoadingMore(false)
    }, 300)
  }, [currentPage, pageSize, data, isLoadingMore])

  const tags = selectedTags()
  const hasActiveFilters = tags.length > 0

  return (
    <SlideDrawerProvider>
      <div className={styles.container} ref={containerRef}>
        {/* 顶部导航栏 */}
        <SearchResultHeader city={filters?.city || '城市'} />

        {/* 搜索条件栏 */}
        <SearchBar
          initialCity={filters?.city}
          initialLocation=""
          onCityChange={(city) => {
            onFiltersChange?.({ ...filters, city })
          }}
          onDateChange={(checkIn, checkOut) => {
            onFiltersChange?.({
              ...filters,
              checkInDate: checkIn.toISOString().split('T')[0],
              checkOutDate: checkOut.toISOString().split('T')[0],
            })
          }}
          onLocationChange={(location) => {
            // location changed
          }}
        />

        {/* 筛选/排序栏 */}
        <FilterSortBar
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          minPrice={filters.priceMin || 0}
          maxPrice={filters.priceMax || 10000}
          guests={filters.guestCount || 1}
          beds={filters.roomCount || 0}
          rooms={0}
          onPriceChange={handlePriceChange}
          onGuestChange={handleGuestChange}
          facilities={filters.facilities || []}
          onFacilitiesChange={handleFacilitiesChange}
          hasActiveFilters={hasActiveFilters}
        />

        {/* 内容区域 */}
        <div className={styles.content} ref={contentRef}>
          {/* 选中的标签 */}
          {tags.length > 0 && (
            <SelectedTagsBar
              tags={tags}
              onTagRemove={handleTagRemove}
              onResetAll={handleResetAll}
            />
          )}

          {/* 结果列表 */}
          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading ? (
              // 骨架屏
              <div className={styles.skeletonContainer}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            ) : displayedData.length > 0 ? (
              // 数据列表
              <>
                {viewMode === 'list'
                  ? displayedData.map((item) => (
                      <SearchResultCard
                        key={item._id}
                        data={item}
                        onClick={(id) => {
                          navigate(`/homeStay/${id}`)
                        }}
                      />
                    ))
                  : displayedData.map((item) => (
                      <HomeStayCard
                        key={item._id}
                        data={item}
                        onClick={(id) => {
                          navigate(`/homeStay/${id}`)
                        }}
                      />
                    ))}
              </>
            ) : (
              // 空状态
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏠</div>
                <div className={styles.emptyTitle}>找不到匹配的民宿</div>
                <div className={styles.emptyDesc}>试试调整搜索条件或查看其他城市</div>
                <button className={styles.resetBtn} onClick={handleResetAll}>
                  重置筛选条件
                </button>
              </div>
            )}
          </div>

          {/* 加载更多指示 */}
          {displayedData.length > 0 && currentPage * pageSize < data.length && (
            <div className={styles.loadingMore}>
              {isLoadingMore ? <p>加载中...</p> : <p>上拉加载更多</p>}
            </div>
          )}

          {/* 已加载全部 */}
          {displayedData.length > 0 && currentPage * pageSize >= data.length && data.length > 0 && (
            <div className={styles.loadingMore}>
              <p>已为您加载全部{data.length}个结果</p>
            </div>
          )}
        </div>

        {/* 悬浮操作按钮 */}
        <FloatingActionButtons
          scrollTop={scrollTop}
          containerHeight={containerHeight}
          containerScrollHeight={containerScrollHeight}
          onScrollToTop={handleScrollToTop}
        />
      </div>
    </SlideDrawerProvider>
  )
}

export default SearchResultList
