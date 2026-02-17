/**
 * 搜索栏组件 - Web H5版本
 */

import React, { useState, useEffect, CSSProperties } from 'react'
import styles from './index.module.scss'

interface SearchBarProps {
  location?: string
  onSearch?: () => void
  onClick?: () => void
  fixed?: boolean
  scrollTop?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
  location = '上海',
  onSearch,
  onClick,
  fixed = true,
  scrollTop = 0,
}) => {
  // 计算透明度：滚动超过100px时变为不透明
  const opacity = Math.min(scrollTop / 100, 1)
  const backgroundColor = `rgba(255, 255, 255, ${0.5 + opacity * 0.5})`

  const handleClick = () => {
    onClick?.()
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSearch?.()
  }

  const containerStyle: CSSProperties = {
    position: fixed ? 'fixed' : 'static',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor,
    backdropFilter: 'blur(8px)',
    transition: 'background-color 0.3s ease',
  }

  return (
    <div style={containerStyle} className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.searchBox} onClick={handleClick}>
          <div className={styles.locationInfo}>
            📍
            <span className={styles.location}>{location}</span>
          </div>

          <div className={styles.placeholder}>
            <span>位置/民宿/编号</span>
          </div>

          <div className={styles.searchIcon} onClick={handleSearchClick}>
            🔍
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SearchBar)
