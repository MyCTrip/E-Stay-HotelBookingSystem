/**
 * Search result page filter/sort bar
 */

import React, { useState, useRef, useEffect, useMemo } from 'react'
import SlideDrawer from '../../shared/SlideDrawer'
import SortFilter from '../SortFilter'
import LocationFilter from '../LocationFilter'
import FacilityFilter from '../FacilityFilter'
import PriceGuestFilter, { type BreakfastIncluded, type HotelFilterSelections } from '../PriceGuestFilter'
import styles from './index.module.scss'

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'
type ViewMode = 'list' | 'grid'

interface FilterSortBarProps {
  sortBy: SortType
  onSortChange: (sort: SortType) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  location?: string
  onLocationChange?: (location: string) => void
  minPrice?: number
  maxPrice?: number
  guests?: number
  beds?: number
  rooms?: number
  onPriceChange?: (minPrice: number, maxPrice: number) => void
  onGuestChange?: (guests: number, beds: number, rooms: number) => void
  facilities?: string[]
  onFacilitiesChange?: (facilities: string[]) => void
  hotelFilters?: HotelFilterSelections
  onHotelFiltersChange?: (filters: HotelFilterSelections) => void
  hasActiveFilters?: boolean
}

const STAR_OPTIONS = ['3 Star', '4 Star', '5 Star']
const BED_TYPE_OPTIONS = ['King Bed', 'Twin Bed', 'Family Bed']
const BRAND_OPTIONS = ['International Chain', 'Domestic Chain', 'Boutique Brand']

const mapFacilitiesToHotelFilters = (facilities: string[]): HotelFilterSelections => {
  const stars = facilities.filter((item) => STAR_OPTIONS.includes(item))
  const bedTypes = facilities.filter((item) => BED_TYPE_OPTIONS.includes(item))
  const brands = facilities.filter((item) => BRAND_OPTIONS.includes(item))

  let breakfastIncluded: BreakfastIncluded = 'any'
  if (facilities.includes('Breakfast Included')) {
    breakfastIncluded = 'included'
  } else if (facilities.includes('No Breakfast')) {
    breakfastIncluded = 'not_included'
  }

  return {
    stars,
    bedTypes,
    breakfastIncluded,
    brands,
  }
}

const flattenHotelFilters = (filters: HotelFilterSelections): string[] => {
  const next = [...filters.stars, ...filters.bedTypes, ...filters.brands]

  if (filters.breakfastIncluded === 'included') {
    next.push('Breakfast Included')
  } else if (filters.breakfastIncluded === 'not_included') {
    next.push('No Breakfast')
  }

  return next
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  location,
  onLocationChange,
  minPrice = 0,
  maxPrice = 10000,
  onPriceChange,
  facilities = [],
  onFacilitiesChange,
  hotelFilters,
  onHotelFiltersChange,
  hasActiveFilters = false,
}) => {
  const [sortOpen, setSortOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [priceGuestOpen, setPriceGuestOpen] = useState(false)
  const [facilityOpen, setFacilityOpen] = useState(false)

  const filterBarRef = useRef<HTMLDivElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const locationButtonRef = useRef<HTMLButtonElement>(null)
  const priceGuestButtonRef = useRef<HTMLButtonElement>(null)
  const facilityButtonRef = useRef<HTMLButtonElement>(null)

  const [isHidden, setIsHidden] = useState(false)
  const lastScrollYRef = useRef(0)

  const mergedHotelFilters = useMemo(
    () => hotelFilters ?? mapFacilitiesToHotelFilters(facilities),
    [facilities, hotelFilters]
  )

  useEffect(() => {
    const findScrollContainer = () => {
      let el = filterBarRef.current?.parentElement
      while (el) {
        const overflowY = window.getComputedStyle(el).overflowY
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return el
        }
        el = el.parentElement
      }
      return null
    }

    const scrollContainer = findScrollContainer()

    if (!scrollContainer) {
      lastScrollYRef.current = window.scrollY

      const handleWindowScroll = () => {
        const currentScrollY = window.scrollY
        const lastScrollY = lastScrollYRef.current

        if (currentScrollY > lastScrollY) {
          setIsHidden(true)
        } else if (currentScrollY < lastScrollY) {
          setIsHidden(false)
        }

        lastScrollYRef.current = currentScrollY
      }

      window.addEventListener('scroll', handleWindowScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleWindowScroll)
      }
    }

    lastScrollYRef.current = scrollContainer.scrollTop

    const handleContainerScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop
      const lastScrollTop = lastScrollYRef.current

      if (currentScrollTop > lastScrollTop) {
        setIsHidden(true)
      } else if (currentScrollTop < lastScrollTop) {
        setIsHidden(false)
      }

      lastScrollYRef.current = currentScrollTop
    }

    scrollContainer.addEventListener('scroll', handleContainerScroll, { passive: true })
    return () => {
      scrollContainer.removeEventListener('scroll', handleContainerScroll)
    }
  }, [])

  const getSortLabel = () => {
    const sortLabels: Record<SortType, string> = {
      smart: 'Recommended',
      ratingDesc: 'Top Rated',
      distanceAsc: 'Distance',
      priceAsc: 'Low Price',
      priceDesc: 'High Price',
    }
    return sortLabels[sortBy] || 'Sort'
  }

  const syncHotelFilters = (next: HotelFilterSelections) => {
    onHotelFiltersChange?.(next)
    onFacilitiesChange?.(flattenHotelFilters(next))
  }

  return (
    <>
      <div
        className={`${styles.filterSortBar} ${isHidden ? styles.hidden : ''}`}
        ref={filterBarRef}
      >
        <button
          ref={sortButtonRef}
          className={`${styles.filterItem} ${sortOpen ? styles.active : ''}`}
          onClick={() => setSortOpen(true)}
        >
          <span className={styles.label}>{getSortLabel()}</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className={styles.arrow}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <button
          ref={locationButtonRef}
          className={`${styles.filterItem} ${locationOpen ? styles.active : ''}`}
          onClick={() => setLocationOpen(true)}
        >
          <span className={styles.label}>Location</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className={styles.arrow}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <button
          ref={priceGuestButtonRef}
          className={`${styles.filterItem} ${priceGuestOpen ? styles.active : ''}`}
          onClick={() => setPriceGuestOpen(true)}
        >
          <span className={styles.label}>Price/Filter</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className={styles.arrow}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <button
          ref={facilityButtonRef}
          className={`${styles.filterItem} ${facilityOpen ? styles.active : ''} ${hasActiveFilters ? styles.hasFilters : ''}`}
          onClick={() => setFacilityOpen(true)}
        >
          <span className={styles.label}>Star/Brand</span>
          {hasActiveFilters && <span className={styles.badge}></span>}
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className={styles.arrow}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List view"
          >
            ≡
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid view"
          >
            ⊞
          </button>
        </div>
      </div>

      <SlideDrawer
        visible={sortOpen}
        direction="down"
        source="element"
        position="bottom"
        elementRef={filterBarRef}
        toggleRef={sortButtonRef}
        onClose={() => setSortOpen(false)}
        onToggle={(isOpen) => isOpen && setSortOpen(true)}
        showBackButton={false}
        showHeader={false}
      >
        <SortFilter
          sortBy={sortBy}
          onSortChange={(sort) => {
            onSortChange(sort)
            setSortOpen(false)
          }}
        />
      </SlideDrawer>

      <SlideDrawer
        visible={locationOpen}
        direction="down"
        source="element"
        position="bottom"
        elementRef={filterBarRef}
        toggleRef={locationButtonRef}
        onClose={() => setLocationOpen(false)}
        onToggle={(isOpen) => isOpen && setLocationOpen(true)}
        showBackButton={false}
        showHeader={false}
      >
        <LocationFilter
          selectedLocation={location}
          onLocationChange={(loc) => {
            onLocationChange?.(loc)
            setLocationOpen(false)
          }}
        />
      </SlideDrawer>

      <SlideDrawer
        visible={priceGuestOpen}
        direction="down"
        source="element"
        position="bottom"
        elementRef={filterBarRef}
        toggleRef={priceGuestButtonRef}
        onClose={() => setPriceGuestOpen(false)}
        onToggle={(isOpen) => isOpen && setPriceGuestOpen(true)}
        showBackButton={false}
        showHeader={false}
      >
        <PriceGuestFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          hotelFilters={mergedHotelFilters}
          onPriceChange={(min, max) => {
            onPriceChange?.(min, max)
          }}
          onHotelFiltersChange={syncHotelFilters}
          onConfirm={() => setPriceGuestOpen(false)}
        />
      </SlideDrawer>

      <SlideDrawer
        visible={facilityOpen}
        direction="down"
        source="element"
        position="bottom"
        elementRef={filterBarRef}
        toggleRef={facilityButtonRef}
        onClose={() => setFacilityOpen(false)}
        onToggle={(isOpen) => isOpen && setFacilityOpen(true)}
        showBackButton={false}
        showHeader={false}
      >
        <FacilityFilter
          selectedFacilities={facilities}
          onFacilitiesChange={(nextFacilities) => {
            onFacilitiesChange?.(nextFacilities)
            onHotelFiltersChange?.(mapFacilitiesToHotelFilters(nextFacilities))
          }}
          onConfirm={() => setFacilityOpen(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default FilterSortBar
