/**
 * 搜索结果页 - 筛选/排序栏
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'
type ViewMode = 'list' | 'grid' | 'map'

interface FilterSortBarProps {
  sortBy: SortType
  onSortChange: (sort: SortType) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onPriceFilter?: () => void
  onStarFilter?: () => void
  onFacilityFilter?: () => void
  onFilterClick?: () => void
  hasActiveFilters?: boolean
}

const sortOptions = [
  { label: '智能排序', value: 'smart' },
  { label: '价格低到高', value: 'priceAsc' },
  { label: '价格高到低', value: 'priceDesc' },
  { label: '评分最高', value: 'ratingDesc' },
  { label: '距离最近', value: 'distanceAsc' },
]

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onPriceFilter,
  onStarFilter,
  onFacilityFilter,
  onFilterClick,
  hasActiveFilters = false,
}) => {
  const [sortOpen, setSortOpen] = useState(false)
  const currentSort = sortOptions.find(opt => opt.value === sortBy)?.label || '智能排序'

  // 统一的筛选点击处理
  const handleFilterClick = () => {
    if (onFilterClick) {
      onFilterClick()
    }
  }

  return (
    <>
      <div className={styles.filterSortBar}>
        {/* 排序按钮 */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.filterBtn} ${sortOpen ? styles.active : ''}`}
            onClick={() => setSortOpen(!sortOpen)}
          >
            <span>{currentSort}</span>
            <span className={styles.arrow}>∨</span>
          </button>

          {/* 统一筛选按钮 */}
          <button
            className={`${styles.filterBtn} ${hasActiveFilters ? styles.active : ''}`}
            onClick={handleFilterClick}
            title="打开筛选面板"
          >
            <span>筛选</span>
            {hasActiveFilters && <span className={styles.badge}></span>}
            <span className={styles.arrow}>∨</span>
          </button>
        </div>

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
          <button
            className={`${styles.viewBtn} ${viewMode === 'map' ? styles.active : ''}`}
            onClick={() => onViewModeChange('map')}
            title="地图模式"
          >
            🗺️
          </button>
        </div>
      </div>

      {/* 排序选项下拉 */}
      {sortOpen && (
        <>
          <div className={styles.overlay} onClick={() => setSortOpen(false)} />
          <div className={styles.sortDropdown}>
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`${styles.sortOption} ${sortBy === option.value ? styles.selected : ''}`}
                onClick={() => {
                  onSortChange(option.value as SortType)
                  setSortOpen(false)
                }}
              >
                {option.label}
                {sortBy === option.value && <span className={styles.checkmark}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default FilterSortBar
