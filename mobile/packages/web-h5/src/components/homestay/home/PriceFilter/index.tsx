/**
 * 价格筛选组件
 * 从网页窗口底部滑入，高度自适应
 */

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface PriceFilterProps {
  visible?: boolean
  minPrice?: number
  maxPrice?: number
  onSelect: (minPrice: number, maxPrice: number) => void
  onClose: () => void
  usePortal?: boolean // 是否使用 portal（默认 true，设为 false 时可嵌入其他容器）
  showFooter?: boolean // 是否显示底部按钮（嵌入模式下默认 false）
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  visible = true,
  minPrice = 0,
  maxPrice = 10000,
  onSelect,
  onClose,
  usePortal = true,
  showFooter = false,
}) => {
  const [tempMinPrice, setTempMinPrice] = useState(minPrice)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)

  const MIN_RANGE = 0
  const MAX_RANGE = 10000

  const priceRanges = [
    { label: '¥100以下', min: 0, max: 100 },
    { label: '¥100-200', min: 100, max: 200 },
    { label: '¥200-300', min: 200, max: 300 },
    { label: '¥300-400', min: 300, max: 400 },
    { label: '¥400-600', min: 400, max: 600 },
    { label: '¥600-1000', min: 600, max: 1000 },
    { label: '¥1000-2000', min: 1000, max: 2000 },
    { label: '¥2000以上', min: 2000, max: MAX_RANGE },
  ]

  const handleConfirm = () => {
    onSelect(tempMinPrice, tempMaxPrice)
    onClose()
  }

  const handleReset = () => {
    setTempMinPrice(0)
    setTempMaxPrice(MAX_RANGE)
  }

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value <= tempMaxPrice) {
      setTempMinPrice(value)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value >= tempMinPrice) {
      setTempMaxPrice(value)
    }
  }

  const isRangeSelected = (min: number, max: number) => {
    return tempMinPrice === min && tempMaxPrice === max
  }

  const content = (
    <>
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
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* 底部按钮 - 仅在 showFooter 为 true 时显示 */}
      {showFooter && (
        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            清空
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            确认
          </button>
        </div>
      )}
    </>
  )

  if (usePortal) {
    return createPortal(
      <>
        {visible && <div className={styles.overlay} onClick={handleClose}></div>}

        <div className={`${styles.drawer} ${visible ? styles.active : ''}`}>
          {/* 头部 */}
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
            <h2 className={styles.title}>价格</h2>
            <div className={styles.placeholder}></div>
          </div>

          {/* 内容 */}
          <div className={styles.content}>{content}</div>
        </div>
      </>,
      document.body
    )
  }

  // 作为内容嵌入使用（不使用 portal）
  return <div className={styles.content}>{content}</div>
}

export default PriceFilter
