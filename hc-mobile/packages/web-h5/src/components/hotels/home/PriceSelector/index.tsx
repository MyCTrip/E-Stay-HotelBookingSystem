import React, { useState } from 'react'
import PriceFilter from '../PriceFilter'
import styles from './index.module.scss'

interface PriceSelectorProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (minPrice: number, maxPrice: number) => void
}

const PriceSelector: React.FC<PriceSelectorProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
}) => {
  const [showFilter, setShowFilter] = useState(false)

  const handleSelect = (newMinPrice: number, newMaxPrice: number) => {
    onPriceChange(newMinPrice, newMaxPrice)
  }

  const displayPrice = () => {
    if (maxPrice === 10000) {
      return `¥${minPrice}-不限`
    }
    return `¥${minPrice}-${maxPrice}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.displayBox} onClick={() => setShowFilter(true)}>
        <div className={styles.text}>{displayPrice()}</div>
        <div className={styles.suffixIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <PriceFilter
        visible={showFilter}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onSelect={handleSelect}
        showFooter={true}
        onClose={() => setShowFilter(false)}
      />
    </div>
  )
}

export default React.memo(PriceSelector)
