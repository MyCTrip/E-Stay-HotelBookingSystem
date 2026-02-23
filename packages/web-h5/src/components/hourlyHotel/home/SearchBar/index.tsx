/**
 * 搜索栏组件 - Web H5版本
 * 复刻携程民宿搜索栏样式
 */

import React, { CSSProperties } from 'react'
import styles from './index.module.scss'

interface SearchBarProps {
  location?: string
  checkIn?: string
  onFieldClick?: (field: 'location' | 'date' | 'guests') => void
  scrollTop?: number
  isTransparent?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  location = '上海',
  checkIn = '2月17',
  onFieldClick,
  scrollTop = 0,
  isTransparent = false,
}) => {
  // 根据滚动位置调整背景透明度
  const opacity = isTransparent ? 0 : Math.min(scrollTop / 80, 1)
  const hasBlur = opacity > 0.3

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `rgba(255, 255, 255, ${0.8 + opacity * 0.2})`,
    backdropFilter: hasBlur ? 'blur(10px)' : 'none',
    borderBottom: opacity > 0.5 ? '1px solid #f0f0f0' : 'none',
    transition: 'all 0.3s ease',
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  }

  return (
    <div style={containerStyle} className={styles.container}>
      <div className={styles.inner}>
        {/* 城市选择区 */}
        <div className={styles.citySection} onClick={() => onFieldClick?.('location')}>
          <div className={styles.cityLabel}>目的地</div>
          <div className={styles.cityValue}>{location}</div>
        </div>

        {/* 日期选择区 */}
        <div className={styles.dateSection} onClick={() => onFieldClick?.('date')}>
          <div className={styles.dateLabel}>入住</div>
          <div className={styles.dateValue}>{checkIn}</div>
        </div>

        {/* 搜索按钮 */}
        <button className={styles.searchBtn} onClick={() => onFieldClick?.('location')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default React.memo(SearchBar)
