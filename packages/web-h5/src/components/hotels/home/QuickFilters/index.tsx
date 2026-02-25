import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'

interface QuickFiltersProps {
  tags: any[]
  selectedTags: string[]
  onTagSelect: (id: string, selected: boolean) => void
  maxSelect?: number
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  tags,
  selectedTags,
  onTagSelect,
  maxSelect,
}) => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ startX: number; startScrollLeft: number }>({
    startX: 0,
    startScrollLeft: 0,
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const selectedSet = useMemo(() => new Set(selectedTags), [selectedTags])

  const handleTagClick = (tagId: string) => {
    const isCurrentlySelected = selectedSet.has(tagId)

    if (!isCurrentlySelected && maxSelect && selectedSet.size >= maxSelect) {
      return
    }

    onTagSelect(tagId, !isCurrentlySelected)
  }

  const handleScroll = () => {
    if (scrollWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollWrapperRef.current
      const progress =
        scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0
      setScrollProgress(progress)
    }
  }

  const handleSliderTrackMouseDown = (e: React.MouseEvent) => {
    if (!scrollWrapperRef.current) return

    dragStartRef.current = {
      startX: e.clientX,
      startScrollLeft: scrollWrapperRef.current.scrollLeft,
    }
    setIsDraggingSlider(true)
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider || !sliderTrackRef.current || !scrollWrapperRef.current) return

      const trackRect = sliderTrackRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragStartRef.current.startX
      const scrollDistance =
        (deltaX / trackRect.width) *
        (scrollWrapperRef.current.scrollWidth - scrollWrapperRef.current.clientWidth)

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
      <div ref={scrollWrapperRef} className={styles.scrollWrapper} onScroll={handleScroll}>
        {tags.map((tag) => {
          const tagId = String(tag.id)
          const isSelected = selectedSet.has(tagId)
          return (
            <div
              key={tagId}
              className={`${styles.tag} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleTagClick(tagId)}
            >
              <span className={styles.label}>{String(tag.label ?? '')}</span>
            </div>
          )
        })}
      </div>

      <div
        ref={sliderTrackRef}
        className={styles.sliderTrack}
        onMouseDown={handleSliderTrackMouseDown}
      >
        <div
          className={styles.sliderThumb}
          style={{
            width: `${Math.max(20, (100 / Math.max(tags.length, 1)) * 3)}%`,
            left: `${scrollProgress}%`,
          }}
        />
      </div>
    </div>
  )
}

export default React.memo(QuickFilters)
