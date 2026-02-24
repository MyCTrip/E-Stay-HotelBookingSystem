/**
 * 排序筛选组件 - 内容only
 * 左侧仅文本，右侧选中有√符号
 */

import React from 'react'
import styles from './index.module.scss'

type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc'

interface SortFilterProps {
  sortBy: SortType
  onSortChange: (sort: SortType) => void
}

const sortOptions = [
  { label: '欢迎度排序', value: 'smart' },
  { label: '好评优先', value: 'ratingDesc' },
  { label: '点评数多一少', value: 'distanceAsc' },
  { label: '低价优先', value: 'priceAsc' },
  { label: '高价优先', value: 'priceDesc' },
]

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className={styles.sortFilter}>
      {sortOptions.map((option) => (
        <div
          key={option.value}
          className={`${styles.option} ${sortBy === option.value ? styles.selected : ''}`}
          onClick={() => onSortChange(option.value as SortType)}
        >
          <span className={styles.label}>{option.label}</span>
          {sortBy === option.value && (
            <svg
              className={styles.checkmark}
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

export default SortFilter
