/**
 * 房源卡片容器 - 提供卡片样式、标签、展开按钮、Header 区域
 */

import React, { useState } from 'react'
import styles from './index.module.scss'
import UpArrowIcon from '../../../icons/UpArrowIcon'
import DownArrowIcon from '../../../icons/DownArrowIcon'
import { TipIcon } from '../../icons'

interface HeaderConfig {
  show?: boolean
  title?: {
    text: string
    show: boolean
  }
  textButton?: {
    text: string
    show: boolean
    onClick: () => void
  }
  tipTag?: {
    show: boolean
    icon: React.ComponentType<{ width: number; height: number }>
    text: string
  }
}

interface PropertyCardContainerProps {
  children: React.ReactNode
  headerConfig?: HeaderConfig
  showLabel?: boolean
  labelText?: string
  tooltipText?: string
  showExpandBtn?: boolean
  expandBtnText?: string
  isExpanded?: boolean
  onExpandToggle?: () => void
}

const PropertyCardContainer: React.FC<PropertyCardContainerProps> = ({
  children,
  headerConfig,
  showLabel = false,
  labelText = '',
  tooltipText = '',
  showExpandBtn = false,
  expandBtnText = '',
  isExpanded = false,
  onExpandToggle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className={styles.container}>
      {/* 卡片容器 */}
      <div className={styles.card}>
        {/* 头部区域 - Header */}
        {headerConfig?.show && (
          <>
            {/* Header 标题和按钮行 */}
            <div className={styles.header}>
              {/* Title */}
              {headerConfig?.title?.show && headerConfig?.title?.text && (
                <h2 className={styles.headerTitle}>{headerConfig.title.text}</h2>
              )}

              {/* TextButton */}
              {headerConfig?.textButton?.show && headerConfig?.textButton?.text && (
                <button className={styles.headerTextBtn} onClick={headerConfig.textButton.onClick}>
                  {headerConfig.textButton.text}
                  <span className={styles.headerArrow}>›</span>
                </button>
              )}
            </div>

            {/* TipTag */}
            {headerConfig?.tipTag?.show && (
              <div className={styles.tipTag}>
                <headerConfig.tipTag.icon width={12} height={12} />
                <span className={styles.tipTagText}>{headerConfig.tipTag.text}</span>
              </div>
            )}
          </>
        )}

        {/* 左上角标签 - 可选显示 */}
        {showLabel && labelText && (
          <div className={styles.labelTag}>
            <span>{labelText}</span>
            {tooltipText && (
              <div className={styles.tipWrapper}>
                <button
                  className={styles.tipBtn}
                  onClick={() => setShowTooltip(!showTooltip)}
                  title="查看提示"
                >
                  <TipIcon width={14} height={14} color="#fff" />
                </button>
                {showTooltip && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipContent}>{tooltipText}</div>
                    <div className={styles.tooltipArrow} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 卡片内容 */}
        <div className={`${styles.content} ${showLabel && labelText ? styles.withLabel : ''}`}>
          {children}
        </div>

        {/* 底部展开按钮 - 可选显示 */}
        {showExpandBtn && expandBtnText && (
          <button
            className={`${styles.expandBtn} ${isExpanded ? styles.expanded : ''}`}
            onClick={onExpandToggle}
          >
            <span className={styles.btnText}>{expandBtnText}</span>
            <span className={styles.icon}>
              {isExpanded ? (
                <UpArrowIcon width={10} height={10} color="#999"></UpArrowIcon>
              ) : (
                <DownArrowIcon width={10} height={10} color="#999"></DownArrowIcon>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default PropertyCardContainer
