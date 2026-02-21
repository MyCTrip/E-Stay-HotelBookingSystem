/**
 * 搜索结果页 - 筛选/排序栏
 * 包含4个筛选组件：排序、位置、价格/人数、设施
 * 滚动隐藏/显示功能 - 使用 Intersection Observer
 */

import React, { useState, useRef, useEffect } from 'react'
import SlideDrawer from '../../shared/SlideDrawer'
import SortFilter from '../SortFilter'
import LocationFilter from '../LocationFilter'
import FacilityFilter from '../FacilityFilter'
import PriceFilter from '../../home/PriceFilter'
import RoomTypeModal from '../../home/RoomTypeModal'
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
  hasActiveFilters?: boolean
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
  guests = 1,
  beds = 0,
  rooms = 0,
  onPriceChange,
  onGuestChange,
  facilities = [],
  onFacilitiesChange,
  hasActiveFilters = false,
}) => {
  // 各筛选器的打开/关闭状态
  const [sortOpen, setSortOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [priceGuestOpen, setPriceGuestOpen] = useState(false)
  const [facilityOpen, setFacilityOpen] = useState(false)

  // 元素引用，用于元素边缘定位
  const filterBarRef = useRef<HTMLDivElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const locationButtonRef = useRef<HTMLButtonElement>(null)
  const priceGuestButtonRef = useRef<HTMLButtonElement>(null)
  const facilityButtonRef = useRef<HTMLButtonElement>(null)

  // 隐藏状态
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  // 监听滚动：下滑隐藏，上滑显示
  useEffect(() => {
    let scrollContainer: HTMLElement | null = null

    // 查找最近的可滚动容器
    const findScrollContainer = () => {
      let el = filterBarRef.current?.parentElement
      while (el) {
        const overflowY = window.getComputedStyle(el).overflowY
        if (overflowY !== 'visible' && overflowY !== 'auto' && overflowY !== 'scroll') {
          el = el.parentElement
          continue
        }
        // 检查是否真的可以滚动
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return el
        }
        el = el.parentElement
      }
      // 没找到，默认用 window（但实际上这里用window对象）
      return null
    }

    scrollContainer = findScrollContainer()
    scrollContainerRef.current = scrollContainer

    if (!scrollContainer) {
      // 如果是 window 滚动
      lastScrollYRef.current = window.scrollY

      const handleWindowScroll = () => {
        const currentScrollY = window.scrollY
        const lastScrollY = lastScrollYRef.current

        if (currentScrollY > lastScrollY) {
          // 向下滚动 - 隐藏
          setIsHidden(true)
        } else if (currentScrollY < lastScrollY) {
          // 向上滚动 - 显示
          setIsHidden(false)
        }

        lastScrollYRef.current = currentScrollY
      }

      window.addEventListener('scroll', handleWindowScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleWindowScroll)
      }
    } else {
      // 如果是容器滚动
      lastScrollYRef.current = scrollContainer.scrollTop

      const handleContainerScroll = () => {
        const currentScrollTop = scrollContainer!.scrollTop
        const lastScrollTop = lastScrollYRef.current

        if (currentScrollTop > lastScrollTop) {
          // 向下滚动 - 隐藏
          setIsHidden(true)
        } else if (currentScrollTop < lastScrollTop) {
          // 向上滚动 - 显示
          setIsHidden(false)
        }

        lastScrollYRef.current = currentScrollTop
      }

      scrollContainer.addEventListener('scroll', handleContainerScroll, { passive: true })
      return () => {
        scrollContainer.removeEventListener('scroll', handleContainerScroll)
      }
    }
  }, [])

  // 根据 sortBy 获取排序标签
  const getSortLabel = () => {
    const sortLabels: Record<SortType, string> = {
      smart: '欢迎度',
      ratingDesc: '好评优先',
      distanceAsc: '点评数',
      priceAsc: '低价优先',
      priceDesc: '高价优先',
    }
    return sortLabels[sortBy] || '排序'
  }

  return (
    <>
      <div
        className={`${styles.filterSortBar} ${isHidden ? styles.hidden : ''}`}
        ref={filterBarRef}
      >
        {/* 排序按钮 */}
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

        {/* 位置按钮 */}
        <button
          ref={locationButtonRef}
          className={`${styles.filterItem} ${locationOpen ? styles.active : ''}`}
          onClick={() => setLocationOpen(true)}
        >
          <span className={styles.label}>位置</span>
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

        {/* 价格/人数按钮 */}
        <button
          ref={priceGuestButtonRef}
          className={`${styles.filterItem} ${priceGuestOpen ? styles.active : ''}`}
          onClick={() => setPriceGuestOpen(true)}
        >
          <span className={styles.label}>价格/人数</span>
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

        {/* 筛选按钮 */}
        <button
          ref={facilityButtonRef}
          className={`${styles.filterItem} ${facilityOpen ? styles.active : ''} ${hasActiveFilters ? styles.hasFilters : ''}`}
          onClick={() => setFacilityOpen(true)}
        >
          <span className={styles.label}>筛选</span>
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

        {/* 视图切换 */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => onViewModeChange('list')}
            title="列表模式"
          >
            ≡
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="网格模式"
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 价格筛选 */}
          <div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}
            >
              价格范围
            </div>
            <PriceFilter
              usePortal={false}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onSelect={(min, max) => {
                onPriceChange?.(min, max)
              }}
              onClose={() => {}}
            />
          </div>

          {/* 房间类型选择 */}
          <div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}
            >
              入住条件
            </div>
            <RoomTypeModal
              usePortal={false}
              guests={guests}
              beds={beds}
              rooms={rooms}
              showFooter={true}
              onSelect={(g, b, r) => {
                onGuestChange?.(g, b, r)
                setPriceGuestOpen(false)
              }}
              onClose={() => {
                // 内容模式下不需要关闭逻辑
              }}
            />
          </div>
        </div>
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
          onFacilitiesChange={onFacilitiesChange}
          onConfirm={() => setFacilityOpen(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default FilterSortBar
