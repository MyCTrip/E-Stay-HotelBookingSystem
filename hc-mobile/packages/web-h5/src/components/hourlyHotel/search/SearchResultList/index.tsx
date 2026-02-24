import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { HourlyRoom } from '../../types'
import SearchResultHeader from '../SearchResultHeader'
import FilterSortBar from '../FilterSortBar'
import SelectedTagsBar from '../SelectedTagsBar'
import FloatingActionButtons from '../FloatingActionButtons'
import HourlyRoomCard from '../../home/HourlyRoomCard'
import FilterPanel, { type FilterState } from '../FilterPanel'
import MapView from '../MapView'
import styles from './index.module.scss'

export interface HourlySearchFilters {
  city?: string
  date?: string
  duration?: number
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
  onClick?: (id: string) => void
}

const DEFAULT_FILTERS: HourlySearchFilters = {
  city: 'Shanghai',
  date: dayjs().format('YYYY-MM-DD'),
  duration: 4,
  guestCount: 1,
}

const HourlySearchResultList: React.FC<HourlySearchResultListProps> = ({
  data = [],
  loading = false,
  filters = DEFAULT_FILTERS,
  onFiltersChange,
  onModifySearch,
  onClick,
}) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortType>('smart')
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerScrollHeight, setContainerScrollHeight] = useState(0)
  const [filterPanelVisible, setFilterPanelVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const handleResize = () => setContainerHeight(container.clientHeight)
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    handleResize()

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      setContainerScrollHeight(content.scrollHeight)
    }
  }, [data, viewMode])

  const tags = useMemo<Array<{ key: string; label: string }>>(() => {
    const selected: Array<{ key: string; label: string }> = []

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      selected.push({
        key: 'price',
        label: `Price ¥${filters.priceMin ?? 0}-${filters.priceMax ?? 'NoLimit'}`,
      })
    }

    if ((filters.stars?.length ?? 0) > 0) {
      selected.push({ key: 'stars', label: `Stars ${filters.stars?.join('/')}` })
    }

    if ((filters.facilities?.length ?? 0) > 0) {
      selected.push({ key: 'facilities', label: `Facilities ${filters.facilities?.length}` })
    }

    return selected
  }, [filters])

  const hasActiveFilters = tags.length > 0

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    setScrollTop(target.scrollTop)
    setContainerHeight(target.clientHeight)
    setContainerScrollHeight(target.scrollHeight)
  }

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTagRemove = (key: string) => {
    const nextFilters: HourlySearchFilters = { ...filters }

    if (key === 'price') {
      delete nextFilters.priceMin
      delete nextFilters.priceMax
    }

    if (key === 'stars') {
      delete nextFilters.stars
    }

    if (key === 'facilities') {
      delete nextFilters.facilities
    }

    onFiltersChange?.(nextFilters)
  }

  const handleResetAll = () => {
    onFiltersChange?.({
      city: filters.city,
      date: filters.date,
      duration: filters.duration,
      guestCount: filters.guestCount,
    })
  }

  const handleApplyFilters = useCallback(
    (nextState: FilterState) => {
      onFiltersChange?.({
        ...filters,
        priceMin: nextState.priceMin || undefined,
        priceMax: nextState.priceMax || undefined,
        stars: nextState.stars.length > 0 ? nextState.stars : undefined,
        facilities: nextState.facilities.length > 0 ? nextState.facilities : undefined,
      })
      setFilterPanelVisible(false)
    },
    [filters, onFiltersChange]
  )

  const sortedData = useMemo(() => {
    const copied = [...data]

    if (sortBy === 'priceAsc') {
      copied.sort((a, b) => (a.baseInfo.price ?? 0) - (b.baseInfo.price ?? 0))
    }

    if (sortBy === 'priceDesc') {
      copied.sort((a, b) => (b.baseInfo.price ?? 0) - (a.baseInfo.price ?? 0))
    }

    if (sortBy === 'ratingDesc') {
      copied.sort((a, b) => (b.baseInfo.star ?? 0) - (a.baseInfo.star ?? 0))
    }

    return copied
  }, [data, sortBy])

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      <SearchResultHeader filters={filters} onModifyClick={onModifySearch} />

      <FilterSortBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasActiveFilters={hasActiveFilters}
        onFilterClick={() => setFilterPanelVisible(true)}
      />

      {viewMode === 'map' ? (
        <MapView
          data={sortedData}
          filters={{ city: filters.city, checkInDate: filters.date }}
          onMarkerClick={(id) => (onClick ? onClick(id) : navigate(`/hotel-detail/hourly/${id}`))}
        />
      ) : (
        <div className={styles.content} ref={contentRef}>
          {tags.length > 0 && (
            <SelectedTagsBar tags={tags} onTagRemove={handleTagRemove} onResetAll={handleResetAll} />
          )}

          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading ? (
              <div className={styles.skeletonContainer}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className={styles.skeletonCard} />
                ))}
              </div>
            ) : sortedData.length > 0 ? (
              sortedData.map((item) => (
                <HourlyRoomCard
                  key={item._id}
                  data={item}
                  onClick={() => (onClick ? onClick(item._id) : navigate(`/hotel-detail/hourly/${item._id}`))}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>⏱️</div>
                <div className={styles.emptyTitle}>No matching hourly rooms</div>
                <div className={styles.emptyDesc}>Try adjusting filters or switching city</div>
                <button className={styles.resetBtn} onClick={handleResetAll}>
                  Reset filters
                </button>
              </div>
            )}
          </div>
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
        onClose={() => setFilterPanelVisible(false)}
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
