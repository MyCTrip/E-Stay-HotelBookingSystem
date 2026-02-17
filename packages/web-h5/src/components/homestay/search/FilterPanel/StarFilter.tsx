/**
 * 星级多选筛选组件
 */

import React from 'react'
import styles from './StarFilter.module.scss'

interface StarFilterProps {
  selectedStars: number[]
  onChange?: (stars: number[]) => void
}

const StarFilter: React.FC<StarFilterProps> = ({
  selectedStars = [],
  onChange,
}) => {
  const stars = [
    { value: 5, label: '5星' },
    { value: 4, label: '4-5星' },
    { value: 3, label: '3-4星' },
    { value: 2, label: '2-3星' },
    { value: 1, label: '1-2星' },
  ]

  const handleStarChange = (star: number) => {
    let newStars: number[]
    if (selectedStars.includes(star)) {
      newStars = selectedStars.filter(s => s !== star)
    } else {
      newStars = [...selectedStars, star]
    }
    onChange?.(newStars)
  }

  const handleReset = () => {
    onChange?.([])
  }

  return (
    <div className={styles.starFilter}>
      <div className={styles.header}>
        <h4 className={styles.title}>星级评分</h4>
        {selectedStars.length > 0 && (
          <button className={styles.resetBtn} onClick={handleReset}>
            重置
          </button>
        )}
      </div>

      <div className={styles.starList}>
        {stars.map((star) => (
          <label key={star.value} className={styles.starItem}>
            <input
              type="checkbox"
              checked={selectedStars.includes(star.value)}
              onChange={() => handleStarChange(star.value)}
              className={styles.checkbox}
            />
            <div className={styles.content}>
              <span className={styles.rating}>
                {'⭐'.repeat(Math.min(star.value, 5))}
              </span>
              <span className={styles.label}>{star.label}</span>
            </div>
            {selectedStars.includes(star.value) && (
              <span className={styles.checkmark}>✓</span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export default StarFilter
