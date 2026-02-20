/**
 * 详情页顶部操作栏 - 固定吸顶
 * 初始透明，滚动超过图片区时变为不透明白色
 */

import React, { forwardRef } from 'react'
import styles from './index.module.scss'

interface DetailHeaderProps {
  data: any
  opacity: number
  onCollectionChange?: () => void
  onShare?: () => void
}

const DetailHeader = forwardRef<HTMLDivElement, DetailHeaderProps>(
  ({ data, opacity, onCollectionChange, onShare }, ref) => {
    const [isCollected, setIsCollected] = React.useState(false)

    const handleCollect = () => {
      setIsCollected(!isCollected)
      onCollectionChange?.()
    }

    // 判断是否已经滚动到了白色背景区域
    const isLightMode = opacity > 0.5
    // 图标颜色：透明时为白色，白底时为深灰
    const iconColor = isLightMode ? '#333333' : '#ffffff'
    const bgOpacity = Math.min(opacity, 1)

    // 动态按钮类名（滑动变白后去掉黑底）
    const btnClassName = `${styles.iconBtn} ${isLightMode ? styles.light : ''}`

    return (
      <div
        ref={ref}
        className={styles.header}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          borderBottomColor: `rgba(240, 240, 240, ${bgOpacity})`,
        }}
      >
        {/* 左侧返回按钮 - 使用标准 SVG 箭头 */}
        <button
          className={btnClassName}
          onClick={() => window.history.back()}
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* 右侧操作按钮组 */}
        <div className={styles.actionGroup}>
          {/* 客服 */}
          <button className={btnClassName} title="客服">
            <span style={{ color: iconColor }}>💬</span>
          </button>

          {/* 分享 */}
          <button className={btnClassName} onClick={onShare} title="分享">
            <span style={{ color: iconColor }}>⤴</span>
          </button>

          {/* 收藏 (爱心) */}
          <button
            className={`${btnClassName} ${isCollected ? styles.collected : ''}`}
            onClick={handleCollect}
            title={isCollected ? '已收藏' : '收藏'}
          >
            <span style={{ color: isCollected ? '#FF6B6B' : iconColor }}>
              {isCollected ? '♥' : '♡'}
            </span>
          </button>
        </div>
      </div>
    )
  }
)

DetailHeader.displayName = 'DetailHeader'

export default DetailHeader