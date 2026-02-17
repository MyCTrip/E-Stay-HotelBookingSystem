/**
 * 详情页顶部操作栏 - 固定吸顶
 * 初始透明，滚动超过图片区时变为不透明白色
 */

import React, { forwardRef } from 'react'
import styles from './DetailHeader.module.scss'

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

    // 图标颜色：opacity小时为白色，大时为深灰
    const iconColor = opacity > 0.5 ? '#333' : '#fff'
    const bgOpacity = Math.min(opacity, 1)

    return (
      <div
        ref={ref}
        className={styles.header}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          borderBottomColor: `rgba(240, 240, 240, ${bgOpacity})`,
        }}
      >
        {/* 左侧返回按钮 */}
        <button
          className={styles.iconBtn}
          onClick={() => window.history.back()}
          title="返回"
        >
          <span style={{ color: iconColor }}>‹</span>
        </button>

        {/* 右侧操作按钮组 */}
        <div className={styles.actionGroup}>
          {/* 客服 */}
          <button className={styles.iconBtn} title="客服">
            <span style={{ color: iconColor }}>💬</span>
          </button>

          {/* 分享 */}
          <button className={styles.iconBtn} onClick={onShare} title="分享">
            <span style={{ color: iconColor }}>⤴</span>
          </button>

          {/* 收藏 */}
          <button
            className={`${styles.iconBtn} ${isCollected ? styles.collected : ''}`}
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
