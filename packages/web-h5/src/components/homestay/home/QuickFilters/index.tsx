/**
 * 快捷筛选标签组件 - Web H5版本
 */

import React, { useState, useRef, useEffect } from 'react'
import type { QuickFilterTag } from '@estay/shared'
import { QUICK_FILTER_TAGS } from '@estay/shared'
import styles from './index.module.scss'

interface QuickFiltersProps {
  tags?: QuickFilterTag[]
  selectedTags?: string[]
  onTagSelect?: (tagId: string, selected: boolean) => void
  maxSelect?: number
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  tags = QUICK_FILTER_TAGS,
  selectedTags = [],
  onTagSelect,
  maxSelect,
}) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedTags)
  )
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ startX: number; startScrollLeft: number }>({
    startX: 0,
    startScrollLeft: 0,
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)

  const handleTagClick = (tagId: string) => {
    const newSelected = new Set(selected)
    const isCurrentlySelected = newSelected.has(tagId)

    // 如果已选且达到最大数量，不允许添加
    if (!isCurrentlySelected && maxSelect && newSelected.size >= maxSelect) {
      return
    }

    if (isCurrentlySelected) {
      newSelected.delete(tagId)
    } else {
      newSelected.add(tagId)
    }

    setSelected(newSelected)
    onTagSelect?.(tagId, !isCurrentlySelected)
  }

  const handleScroll = () => {
    if (scrollWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollWrapperRef.current
      const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0
      setScrollProgress(progress)
    }
  }

  // Slider 拖动逻辑 - 鼠标按下时记录初始位置
  const handleSliderTrackMouseDown = (e: React.MouseEvent) => {
    if (!scrollWrapperRef.current) return

    dragStartRef.current = {
      startX: e.clientX,
      startScrollLeft: scrollWrapperRef.current.scrollLeft,
    }
    setIsDraggingSlider(true)
  }

  // 全局鼠标移动和松开事件
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider || !sliderTrackRef.current || !scrollWrapperRef.current) return

      const trackRect = sliderTrackRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragStartRef.current.startX

      // 计算相对于 track 宽度的移动比例，转换为 scroll 距离
      const scrollDistance =
        (deltaX / trackRect.width) * (scrollWrapperRef.current.scrollWidth - scrollWrapperRef.current.clientWidth)

      scrollWrapperRef.current.scrollLeft = Math.max(
        0,
        Math.min(
          scrollWrapperRef.current.scrollWidth - scrollWrapperRef.current.clientWidth,
          dragStartRef.current.startScrollLeft + scrollDistance
        )
      )
    }

    const handleGlobalMouseUp = () => {
      setIsDraggingSlider(false)
    }

    if (isDraggingSlider) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDraggingSlider])

  return (
    <div className={styles.container}>
      <div
        ref={scrollWrapperRef}
        className={styles.scrollWrapper}
        onScroll={handleScroll}
      >
        {tags.map((tag) => {
          const isSelected = selected.has(tag.id)
          return (
            <div
              key={tag.id}
              className={`${styles.tag} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleTagClick(tag.id)}
            >
              <span className={styles.label}>{tag.label}</span>
            </div>
          )
        })}
      </div>

      {/* 底部水平 Slider 指示条 */}
      <div
        ref={sliderTrackRef}
        className={styles.sliderTrack}
        onMouseDown={handleSliderTrackMouseDown}
      >
        <div
          className={styles.sliderThumb}
          style={{
            width: `${Math.max(20, (100 / tags.length) * 3)}%`,
            left: `${scrollProgress}%`,
          }}
        />
      </div>
    </div>
  )
}

export default React.memo(QuickFilters)
