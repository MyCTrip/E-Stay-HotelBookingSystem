/**
 * 价格滑块筛选组件
 */

import React, { useState, useEffect } from 'react'
import styles from './PriceSlider.module.scss'

interface PriceSliderProps {
  min: number
  max: number
  onChange?: (min: number, max: number) => void
  minRange?: number
  maxRange?: number
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  min = 0,
  max = 2000,
  onChange,
  minRange = 0,
  maxRange = 10000,
}) => {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  useEffect(() => {
    setLocalMin(min)
    setLocalMax(max)
  }, [min, max])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value <= localMax) {
      setLocalMin(value)
      onChange?.(value, localMax)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= localMin) {
      setLocalMax(value)
      onChange?.(localMin, value)
    }
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (!isNaN(value) && value <= localMax) {
      setLocalMin(value)
    }
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (!isNaN(value) && value >= localMin) {
      setLocalMax(value)
    }
  }

  const handleMinInputBlur = () => {
    onChange?.(localMin, localMax)
  }

  const handleMaxInputBlur = () => {
    onChange?.(localMin, localMax)
  }

  const minPercent = ((localMin - minRange) / (maxRange - minRange)) * 100
  const maxPercent = ((localMax - minRange) / (maxRange - minRange)) * 100

  return (
    <div className={styles.priceSlider}>
      <div className={styles.header}>
        <h4 className={styles.title}>价格范围</h4>
        <span className={styles.range}>¥{localMin} - ¥{localMax}</span>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.trackBg} />
        <div
          className={styles.track}
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={localMin}
          onChange={handleMinChange}
          className={styles.thumb}
          style={{ zIndex: localMin > maxRange - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={localMax}
          onChange={handleMaxChange}
          className={styles.thumb}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <label>最低价</label>
          <input
            type="number"
            value={localMin}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            className={styles.input}
          />
        </div>
        <div className={styles.divider}>-</div>
        <div className={styles.inputWrapper}>
          <label>最高价</label>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  )
}

export default PriceSlider
