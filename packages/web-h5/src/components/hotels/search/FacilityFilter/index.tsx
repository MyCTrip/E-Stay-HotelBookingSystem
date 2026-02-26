/**
 * Hotel facility filter content
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

interface FacilityFilterProps {
  selectedFacilities?: string[]
  onFacilitiesChange?: (facilities: string[]) => void
  onConfirm?: () => void
}

interface FilterItem {
  label: string
  icon: string
}

interface FilterCategory {
  category: string
  facilities: FilterItem[]
}

const facilityCategories: FilterCategory[] = [
  {
    category: '星级',
    facilities: [
      { label: '3星级', icon: '⭐' },
      { label: '4星级', icon: '⭐⭐' },
      { label: '5星级', icon: '⭐⭐⭐' },
    ],
  },
  {
    category: '床型',
    facilities: [
      { label: '高级大床房', icon: '🛏️' },
      { label: '高级双床房', icon: '🛌' },
      { label: '家庭房', icon: '👨‍👩‍👧' },
    ],
  },
  {
    category: '早餐',
    facilities: [
      { label: '含早餐', icon: '🍳' },
      { label: '不含早餐', icon: '☕' },
    ],
  },
  {
    category: '品牌',
    facilities: [
      { label: '国际连锁', icon: '🏨' },
      { label: '国内连锁', icon: '🏢' },
      { label: '精品品牌', icon: '✨' },
    ],
  },
]

const FacilityFilter: React.FC<FacilityFilterProps> = ({
  selectedFacilities = [],
  onFacilitiesChange,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedFacilities))

  const handleToggle = (facilityLabel: string) => {
    const next = new Set(selected)
    if (next.has(facilityLabel)) {
      next.delete(facilityLabel)
    } else {
      next.add(facilityLabel)
    }

    setSelected(next)
    onFacilitiesChange?.(Array.from(next))
  }

  const handleReset = () => {
    setSelected(new Set())
    onFacilitiesChange?.([])
  }

  return (
    <div className={styles.facilityFilter}>
      <div className={styles.facilities}>
        {facilityCategories.map((cat) => (
          <div key={cat.category} className={styles.facilityGroup}>
            <div className={styles.categoryLabel}>{cat.category}</div>
            <div className={styles.facilityGrid}>
              {cat.facilities.map((fac) => (
                <button
                  key={fac.label}
                  className={`${styles.facilityBtn} ${selected.has(fac.label) ? styles.selected : ''}`}
                  onClick={() => handleToggle(fac.label)}
                >
                  <span className={styles.icon}>{fac.icon}</span>
                  <span className={styles.label}>{fac.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.resetBtn} onClick={handleReset}>
          重置
        </button>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          确认
        </button>
      </div>
    </div>
  )
}

export default FacilityFilter
