/**
 * 设施筛选组件 - 内容only
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

interface FacilityFilterProps {
  selectedFacilities?: string[]
  onFacilitiesChange?: (facilities: string[]) => void
  onConfirm?: () => void
}

const facilityCategories = [
  {
    category: '热门筛选',
    facilities: [
      { label: '免费wifi', icon: '📶' },
      { label: '大床', icon: '🛏️' },
      { label: '付费停车位', icon: '🅿️' },
    ],
  },
  {
    category: '城市特色',
    facilities: [{ label: '城市特色', icon: '🏙️' }],
  },
  {
    category: '特色推荐',
    facilities: [{ label: '特色推荐', icon: '⭐' }],
  },
  {
    category: '服务',
    facilities: [
      { label: '无线网络', icon: '📡' },
      { label: '停车位', icon: '🅿️' },
    ],
  },
  {
    category: '点评',
    facilities: [{ label: '评价好', icon: '👍' }],
  },
  {
    category: '设施',
    facilities: [
      { label: '私家泳池', icon: '🏊' },
      { label: '观景浴缸', icon: '🛁️' },
      { label: '休闲庭院', icon: '🌳' },
      { label: '私汤', icon: '♨️' },
      { label: '温泉', icon: '🌊' },
      { label: '落地圆', icon: '⭕' },
      { label: '麻将机', icon: '🎰' },
      { label: '可做饭', icon: '🍳' },
    ],
  },
  {
    category: '房型',
    facilities: [{ label: '基础房型', icon: '🏠' }],
  },
]

const FacilityFilter: React.FC<FacilityFilterProps> = ({
  selectedFacilities = [],
  onFacilitiesChange,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedFacilities))

  const handleToggle = (facilityLabel: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(facilityLabel)) {
      newSelected.delete(facilityLabel)
    } else {
      newSelected.add(facilityLabel)
    }
    setSelected(newSelected)
    onFacilitiesChange?.(Array.from(newSelected))
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

      {/* 底部按钮 */}
      <div className={styles.footer}>
        <button className={styles.resetBtn} onClick={handleReset}>
          清空
        </button>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          确认
        </button>
      </div>
    </div>
  )
}

export default FacilityFilter
