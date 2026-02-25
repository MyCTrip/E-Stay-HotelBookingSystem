import React, { forwardRef } from 'react'
import styles from './index.module.scss'

interface DetailHeaderProps {
  opacity?: number
  onBack?: () => void
}

const DetailHeader = forwardRef<HTMLDivElement, DetailHeaderProps>(({ opacity = 0, onBack }, ref) => {
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
      <button className={styles.iconBtn} onClick={onBack || (() => window.history.back())} title="返回">
        <span style={{ color: iconColor }}>←</span>
      </button>

      <div className={styles.actionGroup}>
        <button className={styles.iconBtn} disabled aria-hidden title="">
          <span style={{ color: iconColor }}>{null}</span>
        </button>

        <button className={styles.iconBtn} disabled aria-hidden title="">
          <span style={{ color: iconColor }}>{null}</span>
        </button>

        <button className={styles.iconBtn} disabled aria-hidden title="">
          <span style={{ color: iconColor }}>{null}</span>
        </button>
      </div>
    </div>
  )
})

DetailHeader.displayName = 'DetailHeader'

export default DetailHeader
