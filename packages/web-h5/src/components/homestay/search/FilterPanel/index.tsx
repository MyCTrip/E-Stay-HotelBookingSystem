/**
 * 完整的筛选面板 - 侧滑抽屉式
 */

import React, { useEffect } from 'react'
import PriceSlider from './PriceSlider'
import StarFilter from './StarFilter'
import FacilityFilter from './FacilityFilter'
import styles from './index.module.scss'

export interface FilterState {
  priceMin: number
  priceMax: number
  stars: number[]
  facilities: string[]
}

interface FilterPanelProps {
  visible: boolean
  onClose?: () => void
  onApply?: (filters: FilterState) => void
  initialFilters?: FilterState
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {
    priceMin: 0,
    priceMax: 2000,
    stars: [],
    facilities: [],
  },
}) => {
  const [filters, setFilters] = React.useState<FilterState>(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters, visible])

  // 阻止滑动穿透
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [visible])

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceMin: 0,
      priceMax: 2000,
      stars: [],
      facilities: [],
    }
    setFilters(resetFilters)
  }

  const handleApply = () => {
    onApply?.(filters)
    onClose?.()
  }

  const hasActiveFilters =
    filters.priceMin !== 0 ||
    filters.priceMax !== 2000 ||
    filters.stars.length > 0 ||
    filters.facilities.length > 0

  return (
    <>
      {/* 背景遮罩 */}
      {visible && (
        <div
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      {/* 筛选面板 */}
      <div className={`${styles.panel} ${visible ? styles.visible : ''}`}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <h3 className={styles.title}>筛选</h3>
          <div style={{ width: '24px' }} />
        </div>

        {/* 筛选内容 */}
        <div className={styles.content}>
          <PriceSlider
            min={filters.priceMin}
            max={filters.priceMax}
            onChange={(min, max) =>
              setFilters({ ...filters, priceMin: min, priceMax: max })
            }
          />

          <StarFilter
            selectedStars={filters.stars}
            onChange={(stars) => setFilters({ ...filters, stars })}
          />

          <FacilityFilter
            selectedFacilities={filters.facilities}
            onChange={(facilities) =>
              setFilters({ ...filters, facilities })
            }
          />
        </div>

        {/* 底部操作栏 */}
        <div className={styles.footer}>
          <button
            className={styles.resetBtn}
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            重置
          </button>
          <button className={styles.applyBtn} onClick={handleApply}>
            应用筛选
          </button>
        </div>
      </div>
    </>
  )
}

export default FilterPanel

