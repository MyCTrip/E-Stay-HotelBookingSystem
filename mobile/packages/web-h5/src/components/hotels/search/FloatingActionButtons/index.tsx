/**
 * 悬浮操作按钮 - 回到顶部、地图切换
 */

import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'

interface FloatingActionButtonsProps {
  scrollTop: number
  containerHeight: number
  containerScrollHeight: number
  onScrollToTop: () => void
  onToggleMap?: () => void
  showMapButton?: boolean
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  scrollTop,
  containerHeight,
  containerScrollHeight,
  onScrollToTop,
  onToggleMap,
  showMapButton = false,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // 滚动超过2屏时显示回到顶部按钮
  useEffect(() => {
    const twoScreenHeight = containerHeight * 2
    setShowScrollTop(scrollTop > twoScreenHeight)
  }, [scrollTop, containerHeight])

  if (!showScrollTop && !showMapButton) return null

  return (
    <div className={styles.floatingContainer}>
      {/* 地图切换按钮 */}
      {showMapButton && (
        <button className={styles.floatingBtn} onClick={onToggleMap} title="切换地图">
          🗺️
        </button>
      )}

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button className={styles.floatingBtn} onClick={onScrollToTop} title="回到顶部">
          ↑
        </button>
      )}
    </div>
  )
}

export default FloatingActionButtons
