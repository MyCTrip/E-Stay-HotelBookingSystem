/**
 * Hotel search result list container view.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HotelDomainModel } from '@estay/shared'
import SearchResultHeader from '../SearchResultHeader'
import SearchBar from '../SearchBar'
import FilterSortBar from '../FilterSortBar'
import SelectedTagsBar from '../SelectedTagsBar'
import FloatingActionButtons from '../FloatingActionButtons'
import SearchResultCard from '../SearchResultCard'
import HotelCard from '../../home/HotelCard'
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
  bedTypes?: string[]
  breakfastIncluded?: 'any' | 'included' | 'not_included'
  brands?: string[]
  facilities?: string[]
}

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'
type ViewMode = 'list' | 'grid'

interface SearchResultListProps {
  data?: HotelDomainModel[]
  loading?: boolean
  hasMore?: boolean
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  onModifySearch?: () => void
  onLoadMore?: () => Promise<void>
}

const STAR_LABEL_TO_VALUE: Record<string, number> = {
  '3 Star': 3,
  '4 Star': 4,
  '5 Star': 5,
}

const BED_TYPES = ['King Bed', 'Twin Bed', 'Family Bed']
const BRANDS = ['International Chain', 'Domestic Chain', 'Boutique Brand']

const SearchResultList: React.FC<SearchResultListProps> = ({
  data = [],
  loading = false,
  hasMore = false,
  filters = {
    city: '',
    checkInDate: '',
    checkOutDate: '',
    roomCount: 1,
    guestCount: 2,
  },
  onFiltersChange,
  onModifySearch,
  onLoadMore,
}) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortType>('smart')
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerScrollHeight, setContainerScrollHeight] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const selectedTags = useCallback(() => {
    const tags: Array<{ key: string; label: string }> = []

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      tags.push({
        key: 'price',
        label: `¥${filters.priceMin ?? 0}-${filters.priceMax ?? 'NoLimit'}`,
      })
    }

    if (filters.stars && filters.stars.length > 0) {
      tags.push({
        key: 'stars',
        label: `Star ${filters.stars.join('/')}`,
      })
    }

    if (filters.bedTypes && filters.bedTypes.length > 0) {
      tags.push({
        key: 'bedTypes',
        label: `BedType ${filters.bedTypes.length}`,
      })
    }

    if (filters.breakfastIncluded && filters.breakfastIncluded !== 'any') {
      tags.push({
        key: 'breakfastIncluded',
        label: filters.breakfastIncluded === 'included' ? 'Breakfast Included' : 'No Breakfast',
      })
    }

    if (filters.brands && filters.brands.length > 0) {
      tags.push({
        key: 'brands',
        label: `Brand ${filters.brands.length}`,
      })
    }

    return tags
  }, [filters])

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

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth <= 768) {
        setViewMode('list')
      }
    }

    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      setContainerScrollHeight(content.scrollHeight)
    }
  }, [data, viewMode])

  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || loading || !hasMore) {
      return
    }

    setIsLoadingMore(true)
    try {
      await onLoadMore()
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, loading, onLoadMore])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const currentScrollTop = target.scrollTop
      const currentContainerHeight = target.clientHeight
      const currentScrollHeight = target.scrollHeight

      setScrollTop(currentScrollTop)
      setContainerHeight(currentContainerHeight)
      setContainerScrollHeight(currentScrollHeight)

      const distanceToBottom = currentScrollHeight - (currentScrollTop + currentContainerHeight)
      if (distanceToBottom < 200) {
        void handleLoadMore()
      }
    },
    [handleLoadMore]
  )

  useEffect(() => {
    const handleWindowScroll = () => {
      setScrollTop(window.scrollY)

      const scrollElement = document.scrollingElement
      if (!scrollElement) {
        return
      }

      const distanceToBottom =
        scrollElement.scrollHeight - (window.scrollY + window.innerHeight)

      if (distanceToBottom < 200) {
        void handleLoadMore()
      }
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [handleLoadMore])

  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTagRemove = (key: string) => {
    const nextFilters = { ...filters }

    switch (key) {
      case 'price':
        delete nextFilters.priceMin
        delete nextFilters.priceMax
        break
      case 'stars':
        delete nextFilters.stars
        if (nextFilters.facilities) {
          nextFilters.facilities = nextFilters.facilities.filter((item) => !STAR_LABEL_TO_VALUE[item])
        }
        break
      case 'bedTypes':
        delete nextFilters.bedTypes
        if (nextFilters.facilities) {
          nextFilters.facilities = nextFilters.facilities.filter((item) => !BED_TYPES.includes(item))
        }
        break
      case 'breakfastIncluded':
        nextFilters.breakfastIncluded = 'any'
        if (nextFilters.facilities) {
          nextFilters.facilities = nextFilters.facilities.filter(
            (item) => item !== 'Breakfast Included' && item !== 'No Breakfast'
          )
        }
        break
      case 'brands':
        delete nextFilters.brands
        if (nextFilters.facilities) {
          nextFilters.facilities = nextFilters.facilities.filter((item) => !BRANDS.includes(item))
        }
        break
      default:
        break
    }

    onFiltersChange?.(nextFilters)
  }

  const handleResetAll = () => {
    const resetFilters: SearchFilters = {
      city: filters.city,
      checkInDate: filters.checkInDate,
      checkOutDate: filters.checkOutDate,
      roomCount: filters.roomCount,
      guestCount: filters.guestCount,
    }
    onFiltersChange?.(resetFilters)
    onModifySearch?.()
  }

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    onFiltersChange?.({
      ...filters,
      priceMin: minPrice,
      priceMax: maxPrice,
    })
  }

  const handleGuestChange = (guests: number, beds: number, rooms: number) => {
    onFiltersChange?.({
      ...filters,
      guestCount: guests,
      roomCount: rooms,
      bedTypes: beds > 0 ? ['Twin Bed'] : filters.bedTypes,
    })
  }

  const handleFacilitiesChange = (facilities: string[]) => {
    const stars = facilities
      .map((item) => STAR_LABEL_TO_VALUE[item])
      .filter((value): value is number => typeof value === 'number')

    const bedTypes = facilities.filter((item) => BED_TYPES.includes(item))
    const brands = facilities.filter((item) => BRANDS.includes(item))

    let breakfastIncluded: SearchFilters['breakfastIncluded'] = 'any'
    if (facilities.includes('Breakfast Included')) {
      breakfastIncluded = 'included'
    } else if (facilities.includes('No Breakfast')) {
      breakfastIncluded = 'not_included'
    }

    onFiltersChange?.({
      ...filters,
      facilities,
      stars: stars.length > 0 ? stars : undefined,
      bedTypes: bedTypes.length > 0 ? bedTypes : undefined,
      brands: brands.length > 0 ? brands : undefined,
      breakfastIncluded,
    })
  }

  const tags = selectedTags()
  const hasActiveFilters = tags.length > 0

  return (
    <SlideDrawerProvider>
      <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
        <SearchResultHeader
          city={filters?.city || 'City'}
          marketLabel="Hotel"
          resultCount={data.length}
          loading={loading}
          hasMore={hasMore}
        />

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
          onLocationChange={() => undefined}
        />

        <FilterSortBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          minPrice={filters.priceMin || 0}
          maxPrice={filters.priceMax || 10000}
          guests={filters.guestCount || 1}
          beds={(filters.bedTypes || []).length}
          rooms={filters.roomCount || 0}
          onPriceChange={handlePriceChange}
          onGuestChange={handleGuestChange}
          facilities={filters.facilities || []}
          onFacilitiesChange={handleFacilitiesChange}
          hasActiveFilters={hasActiveFilters}
        />

        <div className={styles.content} ref={contentRef}>
          {tags.length > 0 && (
            <SelectedTagsBar tags={tags} onTagRemove={handleTagRemove} onResetAll={handleResetAll} />
          )}

          <div className={`${styles.listWrapper} ${styles[viewMode]}`}>
            {loading && data.length === 0 ? (
              <div className={styles.skeletonContainer}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            ) : data.length > 0 ? (
              <>
                {viewMode === 'list'
                  ? data.map((item) => (
                      <SearchResultCard
                        key={item.id}
                        data={item}
                        onClick={(id) => {
                          navigate(`/hotel/${id}/hotel`)
                        }}
                      />
                    ))
                  : data.map((item) => (
                      <HotelCard
                        key={item.id}
                        data={item}
                        onClick={(id) => {
                          navigate(`/hotel/${id}/hotel`)
                        }}
                      />
                    ))}
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏨</div>
                <div className={styles.emptyTitle}>No matching hotels found</div>
                <div className={styles.emptyDesc}>Try adjusting filters or checking nearby areas</div>
                <button className={styles.resetBtn} onClick={handleResetAll}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {(isLoadingMore || (loading && data.length > 0)) && (
            <div className={styles.loadingMore}>
              <p>Loading...</p>
            </div>
          )}

          {!loading && data.length > 0 && !hasMore && (
            <div className={styles.loadingMore}>
              <p>All {data.length} hotels are loaded</p>
            </div>
          )}
        </div>

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

export type { SearchFilters }
export default SearchResultList
