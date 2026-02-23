/**
 * 价格/人数筛选组件 - 内容only 合并了 PriceFilter 和 RoomTypeModal
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

interface PriceGuestFilterProps {
  minPrice?: number
  maxPrice?: number
  guests?: number
  beds?: number
  rooms?: number
  onPriceChange?: (minPrice: number, maxPrice: number) => void
  onGuestChange?: (guests: number, beds: number, rooms: number) => void
  onConfirm?: () => void
}

const priceRanges = [
  { label: '¥100以下', min: 0, max: 100 },
  { label: '¥100-200', min: 100, max: 200 },
  { label: '¥200-300', min: 200, max: 300 },
  { label: '¥300-400', min: 300, max: 400 },
  { label: '¥400-600', min: 400, max: 600 },
  { label: '¥600-1000', min: 600, max: 1000 },
  { label: '¥1000-2000', min: 1000, max: 2000 },
  { label: '¥2000以上', min: 2000, max: 10000 },
]

const PriceGuestFilter: React.FC<PriceGuestFilterProps> = ({
  minPrice = 0,
  maxPrice = 10000,
  guests = 1,
  beds = 0,
  rooms = 0,
  onPriceChange,
  onGuestChange,
  onConfirm,
}) => {
  const [tempMinPrice, setTempMinPrice] = useState(minPrice)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)
  const [tempGuests, setTempGuests] = useState(guests)
  const [tempBeds, setTempBeds] = useState(beds)
  const [tempRooms, setTempRooms] = useState(rooms)

  const MIN_RANGE = 0
  const MAX_RANGE = 10000

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value <= tempMaxPrice) {
      setTempMinPrice(value)
      onPriceChange?.(value, tempMaxPrice)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= tempMinPrice) {
      setTempMaxPrice(value)
      onPriceChange?.(tempMinPrice, value)
    }
  }

  const handleGuestChange = (num: number) => {
    setTempGuests(num)
    onGuestChange?.(num, tempBeds, tempRooms)
  }

  const handleBedsChange = (value: number) => {
    setTempBeds(Math.max(value, 0))
    onGuestChange?.(tempGuests, Math.max(value, 0), tempRooms)
  }

  const handleRoomsChange = (value: number) => {
    setTempRooms(Math.max(value, 0))
    onGuestChange?.(tempGuests, tempBeds, Math.max(value, 0))
  }

  const handleReset = () => {
    setTempMinPrice(0)
    setTempMaxPrice(MAX_RANGE)
    setTempGuests(1)
    setTempBeds(0)
    setTempRooms(0)
    onPriceChange?.(0, MAX_RANGE)
    onGuestChange?.(1, 0, 0)
  }

  const isRangeSelected = (min: number, max: number) => {
    return tempMinPrice === min && tempMaxPrice === max
  }

  const CounterRow: React.FC<{
    label: string
    value: number
    onChange: (value: number) => void
  }> = ({ label, value, onChange }) => (
    <div className={styles.counterRow}>
      <span className={styles.counterLabel}>{label}</span>
      <div className={styles.counterControl}>
        <button className={styles.minusBtn} onClick={() => onChange(Math.max(value - 1, 0))}>
          −
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button className={styles.plusBtn} onClick={() => onChange(Math.min(value + 1, 10))}>
          +
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.priceGuestFilter}>
      {/* 内容区域 - 可滚动 */}
      <div className={styles.content}>
        {/* 价格部分 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>价格</h3>

          {/* 价格范围说明 */}
          <div className={styles.priceRangeInfo}>
            <span className={styles.rangeLabel}>
              价格区间 ¥{tempMinPrice}-{tempMaxPrice === MAX_RANGE ? '不限' : tempMaxPrice}
            </span>
          </div>

          {/* 范围滑块 */}
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack}>
              <div
                className={styles.sliderFill}
                style={{
                  left: `${(tempMinPrice / MAX_RANGE) * 100}%`,
                  right: `${100 - (tempMaxPrice / MAX_RANGE) * 100}%`,
                }}
              />
            </div>
            <input
              type="range"
              min={MIN_RANGE}
              max={MAX_RANGE}
              value={tempMinPrice}
              onChange={handleMinChange}
              className={`${styles.slider} ${styles.sliderMin}`}
            />
            <input
              type="range"
              min={MIN_RANGE}
              max={MAX_RANGE}
              value={tempMaxPrice}
              onChange={handleMaxChange}
              className={`${styles.slider} ${styles.sliderMax}`}
            />
          </div>

          {/* 预设价格范围 */}
          <div className={styles.priceRanges}>
            {priceRanges.map((range, index) => (
              <button
                key={index}
                className={`${styles.priceBtn} ${isRangeSelected(range.min, range.max) ? styles.active : ''}`}
                onClick={() => {
                  setTempMinPrice(range.min)
                  setTempMaxPrice(range.max)
                  onPriceChange?.(range.min, range.max)
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 入住条件部分 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>入住条件</h3>

          {/* 总人数 */}
          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>总人数</div>
            <div className={styles.guestOptions}>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`${styles.optionBtn} ${tempGuests === num ? styles.active : ''}`}
                  onClick={() => handleGuestChange(num)}
                >
                  {num}人
                </button>
              ))}
            </div>
          </div>

          {/* 床铺数 */}
          <div className={styles.subsection}>
            <CounterRow label="床铺数" value={tempBeds} onChange={handleBedsChange} />
          </div>

          {/* 居室数 */}
          <div className={styles.subsection}>
            <CounterRow label="居室数" value={tempRooms} onChange={handleRoomsChange} />
          </div>
        </div>
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

export default PriceGuestFilter
