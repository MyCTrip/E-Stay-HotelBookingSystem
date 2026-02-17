/**
 * 搜索结果列表容器 - 组合所有4层组件
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HomeStay } from '@estay/shared'
import SearchResultHeader from '../SearchResultHeader'
import FilterSortBar from '../FilterSortBar'
import SelectedTagsBar from '../SelectedTagsBar'
import FloatingActionButtons from '../FloatingActionButtons'
import SearchResultCard from '../SearchResultCard'
import HomeStayCard from '../../home/HomeStayCard'
import FilterPanel, { type FilterState } from '../FilterPanel'
import MapView from '../MapView'
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
type ViewMode = 'list' | 'grid' | 'map'

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768)
  const [filterPanelVisible, setFilterPanelVisible] = useState(false)
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
      if (width <= 768 && viewMode !== 'map') {
        setViewMode('list')
      }
    }

    window.addEventListener('resize', handleWindowResize)
    handleWindowResize() // 初始化调用

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [viewMode])

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

  // 处理FilterPanel打开
  const handleOpenFilterPanel = () => {
    setFilterPanelVisible(true)
  }

  // 处理FilterPanel关闭
  const handleCloseFilterPanel = () => {
    setFilterPanelVisible(false)
  }

  // 处理应用筛选条件
  const handleApplyFilters = (filterState: FilterState) => {
    const newFilters: SearchFilters = {
      ...filters,
      priceMin: filterState.priceMin || undefined,
      priceMax: filterState.priceMax || undefined,
      stars: filterState.stars.length > 0 ? filterState.stars : undefined,
      facilities: filterState.facilities.length > 0 ? filterState.facilities : undefined,
    }

    // 清除undefined属性
    Object.keys(newFilters).forEach(
      key => newFilters[key as keyof SearchFilters] === undefined && delete newFilters[key as keyof SearchFilters]
    )

    onFiltersChange?.(newFilters)
    setFilterPanelVisible(false)
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
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      {/* 顶部导航栏 */}
      <SearchResultHeader
        filters={filters}
        onModifyClick={onModifySearch}
      />

      {/* 筛选/排序栏 */}
      <FilterSortBar
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasActiveFilters={hasActiveFilters}
        onFilterClick={handleOpenFilterPanel}
      />

      {/* 地图视图 - 完全替代内容区域 */}
      {viewMode === 'map' ? (
        <MapView
          data={displayedData}
          filters={filters}
          onMarkerClick={(id) => {
            console.log('Navigate to detail:', id)
          }}
        />
      ) : (
        <>
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
              <div className={styles.emptyDesc}>
                试试调整搜索条件或查看其他城市
              </div>
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
        </>
      )}

      {/* 悬浮操作按钮 */}
      <FloatingActionButtons
        scrollTop={scrollTop}
        containerHeight={containerHeight}
        containerScrollHeight={containerScrollHeight}
        onScrollToTop={handleScrollToTop}
      />

      {/* 筛选面板 */}
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

export default SearchResultList
