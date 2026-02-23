/**
 * 设施/特性多选筛选组件
 */

import React from 'react'
import styles from './FacilityFilter.module.scss'

interface FacilityFilterProps {
  selectedFacilities: string[]
  onChange?: (facilities: string[]) => void
}

const FACILITY_OPTIONS = [
  { id: 'wifi', label: '🛜 WiFi' },
  { id: 'kitchen', label: '🍳 厨房' },
  { id: 'parking', label: '🅿️ 停车位' },
  { id: 'washer', label: '🧺 洗衣机' },
  { id: 'ac', label: '❄️ 空调' },
  { id: 'heating', label: '🔥 暖气' },
  { id: 'tv', label: '📺 电视' },
  { id: 'elevator', label: '🛗 电梯' },
  { id: 'balcony', label: '🪟 阳台' },
  { id: 'pet', label: '🐕 宠物友好' },
  { id: 'smoking', label: '🚭 无烟' },
  { id: 'air_purifier', label: '💨 空气净化器' },
]

const FacilityFilter: React.FC<FacilityFilterProps> = ({
  selectedFacilities = [],
  onChange,
}) => {
  const handleFacilityChange = (id: string) => {
    let newFacilities: string[]
    if (selectedFacilities.includes(id)) {
      newFacilities = selectedFacilities.filter(f => f !== id)
    } else {
      newFacilities = [...selectedFacilities, id]
    }
    onChange?.(newFacilities)
  }

  const handleReset = () => {
    onChange?.([])
  }

  return (
    <div className={styles.facilityFilter}>
      <div className={styles.header}>
        <h4 className={styles.title}>设施和服务</h4>
        {selectedFacilities.length > 0 && (
          <button className={styles.resetBtn} onClick={handleReset}>
            重置
          </button>
        )}
      </div>

      <div className={styles.facilityGrid}>
        {FACILITY_OPTIONS.map((facility) => (
          <button
            key={facility.id}
            className={`${styles.facilityItem} ${
              selectedFacilities.includes(facility.id) ? styles.selected : ''
            }`}
            onClick={() => handleFacilityChange(facility.id)}
          >
            <span className={styles.label}>{facility.label}</span>
            {selectedFacilities.includes(facility.id) && (
              <span className={styles.checkmark}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FacilityFilter
