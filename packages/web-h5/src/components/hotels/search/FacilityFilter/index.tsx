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
    category: 'Star',
    facilities: [
      { label: '3 Star', icon: '⭐' },
      { label: '4 Star', icon: '⭐⭐' },
      { label: '5 Star', icon: '⭐⭐⭐' },
    ],
  },
  {
    category: 'BedType',
    facilities: [
      { label: 'King Bed', icon: '🛏️' },
      { label: 'Twin Bed', icon: '🛌' },
      { label: 'Family Bed', icon: '👨‍👩‍👧' },
    ],
  },
  {
    category: 'BreakfastIncluded',
    facilities: [
      { label: 'Breakfast Included', icon: '🍳' },
      { label: 'No Breakfast', icon: '☕' },
    ],
  },
  {
    category: 'Brand',
    facilities: [
      { label: 'International Chain', icon: '🏨' },
      { label: 'Domestic Chain', icon: '🏢' },
      { label: 'Boutique Brand', icon: '✨' },
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
          Reset
        </button>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default FacilityFilter
