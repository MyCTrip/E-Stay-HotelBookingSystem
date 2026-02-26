/**
 * 底部滑入容器组件 - 高度自适应
 * 从网页窗口底部滑入，最高占 70% 屏幕高度，顶部圆角
 */

import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface BottomDrawerProps {
  visible: boolean
  title?: string
  maxHeight?: string | number // 默认 70vh，接受 px 或 vh
  onClose: () => void
  showBackButton?: boolean
  showHeader?: boolean
  children: ReactNode
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  visible,
  title,
  maxHeight = '70vh',
  onClose,
  showBackButton = true,
  showHeader = true,
  children,
}) => {
  const drawerStyle = {
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
  }

  return createPortal(
    <>
      {/* 遮罩层 */}
      {visible && <div className={styles.overlay} onClick={onClose}></div>}

      {/* 抽屉 */}
      <div className={`${styles.drawer} ${visible ? styles.active : ''}`} style={drawerStyle}>
        {/* 头部 */}
        {showHeader && (
          <div className={styles.header}>
            {showBackButton && (
              <button className={styles.backBtn} onClick={onClose}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className={styles.title}>{title || ''}</h2>
            <div className={styles.placeholder}></div>
          </div>
        )}

        {/* 内容区 */}
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    document.body
  )
}

export default BottomDrawer
