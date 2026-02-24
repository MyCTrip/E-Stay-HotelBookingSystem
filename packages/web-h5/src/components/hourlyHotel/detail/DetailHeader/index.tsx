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
  onBack?: () => void // 🌟 1. 新增：声明可以接收 onBack 属性
}

const DetailHeader = forwardRef<HTMLDivElement, DetailHeaderProps>(
  // 🌟 2. 新增：从参数中解构出 onBack
  ({ data, opacity, onCollectionChange, onShare, onBack }, ref) => {
    const [isCollected, ReactSetIsCollected] = React.useState(false)

    const handleCollect = () => {
      ReactSetIsCollected(!isCollected)
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
          // 🌟 3. 修改：优先使用外部传入的 onBack，如果没有再用兜底的 history.back()
          onClick={onBack || (() => window.history.back())}
          title="返回"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* 右侧操作按钮组 */}
        <div className={styles.actionGroup}>

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

          {/* 分享 */}
          <button className={btnClassName} onClick={onShare} title="分享">
            <span style={{ color: iconColor }}>⤴</span>
          </button>
        </div>
      </div>
    )
  }
)

DetailHeader.displayName = 'DetailHeader'

export default DetailHeader