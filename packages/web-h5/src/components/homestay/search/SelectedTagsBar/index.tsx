/**
 * 已选条件标签栏
 */

import React, { useRef, useState, useEffect } from 'react'
import styles from './index.module.scss'

interface SelectedTagsBarProps {
  tags: Array<{ key: string; label: string }>
  onTagRemove: (key: string) => void
  onResetAll: () => void
}

const SelectedTagsBar: React.FC<SelectedTagsBarProps> = ({ tags, onTagRemove, onResetAll }) => {
  const tagsListRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [thumbWidth, setThumbWidth] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)

  // 监听滚动事件并计算进度
  useEffect(() => {
    const tagsList = tagsListRef.current
    if (!tagsList) return

    const handleScroll = () => {
      const scrollLeft = tagsList.scrollLeft
      const scrollWidth = tagsList.scrollWidth
      const clientWidth = tagsList.clientWidth
      const maxScroll = scrollWidth - clientWidth

      // 检查是否可滚动
      const canScroll = scrollWidth > clientWidth
      setIsScrollable(canScroll)

      if (canScroll) {
        // 计算滑动条宽度比例（内容可见的比例）
        const thumbWidthPercent = (clientWidth / scrollWidth) * 100
        setThumbWidth(thumbWidthPercent)

        // 计算滑动条位置（0 到 1 - 滑动条宽度）
        const maxThumbPosition = 100 - thumbWidthPercent
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbPosition : 0
        setScrollProgress(progress)
      }
    }

    // 初始化时检查
    requestAnimationFrame(() => {
      handleScroll()
    })

    tagsList.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      tagsList.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [tags])

  if (tags.length === 0) return null

  return (
    <div className={styles.tagsContainer}>
      <div className={styles.tagsWrapper}>
        <div ref={tagsListRef} className={styles.tagsList}>
          {tags.map((tag) => (
            <div key={tag.key} className={styles.tag}>
              <span>{tag.label}</span>
              <button
                className={styles.removeBtn}
                onClick={() => onTagRemove(tag.key)}
                title="删除"
              >
                ×
              </button>
            </div>
          ))}

          {/* 重置按钮 */}
          <button className={styles.resetBtn} onClick={onResetAll}>
            重置
          </button>
        </div>
      </div>

      {/* 滑动条指示器 - 仅在内容可滚动时显示 */}
      {isScrollable && (
        <div className={styles.scrollIndicator}>
          <div
            className={styles.scrollThumb}
            style={{
              left: `${scrollProgress}%`,
              width: `${thumbWidth}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default SelectedTagsBar
