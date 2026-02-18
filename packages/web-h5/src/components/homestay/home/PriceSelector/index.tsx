/**
 * 价格选择器 - 显示组件
 * Web H5版本
 */

import React, { useState, useEffect } from 'react'
import PriceFilter from '../PriceFilter'
import styles from './index.module.scss'

interface PriceSelectorProps {
  minPrice?: number
  maxPrice?: number
  onPriceChange?: (minPrice: number, maxPrice: number) => void
}

const PriceSelector: React.FC<PriceSelectorProps> = ({
  minPrice = 0,
  maxPrice = 10000,
  onPriceChange,
}) => {
  const [showFilter, setShowFilter] = useState(false)
  const [displayMinPrice, setDisplayMinPrice] = useState(minPrice)
  const [displayMaxPrice, setDisplayMaxPrice] = useState(maxPrice)

  // 当 minPrice 或 maxPrice props 变化时，更新显示值
  useEffect(() => {
    setDisplayMinPrice(minPrice)
    setDisplayMaxPrice(maxPrice)
  }, [minPrice, maxPrice])

  const handleSelect = (newMinPrice: number, newMaxPrice: number) => {
    setDisplayMinPrice(newMinPrice)
    setDisplayMaxPrice(newMaxPrice)
    onPriceChange?.(newMinPrice, newMaxPrice)
  }

  const displayPrice = () => {
    if (displayMaxPrice === 10000) {
      return `¥${displayMinPrice}-不限`
    }
    return `¥${displayMinPrice}-${displayMaxPrice}`
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.displayBox}
        onClick={() => setShowFilter(true)}
      >
        <div className={styles.text}>{displayPrice()}</div>
        <div className={styles.suffixIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* 价格筛选模态框 */}
      <PriceFilter
        visible={showFilter}
        minPrice={displayMinPrice}
        maxPrice={displayMaxPrice}
        onSelect={handleSelect}
        onClose={() => setShowFilter(false)}
      />
    </div>
  )
}

export default React.memo(PriceSelector)
