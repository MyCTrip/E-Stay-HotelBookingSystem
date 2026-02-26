/**
 * 沉浸式图片轮播区 - 支持平滑拖动交互
 */

import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'

interface ImageCarouselProps {
  images: string[]
  onFullscreen?: () => void
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // 计算正常位置
  const calculateOffset = (index: number) => -index * 100

  // 鼠标/触摸开始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return
    setIsDragging(true)
    startXRef.current = e.clientX
    startOffsetRef.current = offset
  }

  // 鼠标/触摸移动和释放
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current
      const percentage = (diff / window.innerWidth) * 100
      setOffset(startOffsetRef.current + percentage)
    }

    const handleMouseUp = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current

      // 分晓逻辑：拖动超过50px就切换
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1
        const newIndex = Math.max(0, Math.min(currentIndex - direction, images.length - 1))
        setCurrentIndex(newIndex)
        setOffset(calculateOffset(newIndex))
      } else {
        // 拖动不足，会弹回原位置
        setOffset(calculateOffset(currentIndex))
      }
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, currentIndex, images.length])

  // 触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startOffsetRef.current = offset
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startXRef.current
    const percentage = (diff / window.innerWidth) * 100
    setOffset(startOffsetRef.current + percentage)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startXRef.current

    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1
      const newIndex = Math.max(0, Math.min(currentIndex - direction, images.length - 1))
      setCurrentIndex(newIndex)
      setOffset(calculateOffset(newIndex))
    } else {
      setOffset(calculateOffset(currentIndex))
    }
    setIsDragging(false)
  }

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setOffset(calculateOffset(newIndex))
  }

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setOffset(calculateOffset(newIndex))
  }

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carousel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 图片轨道 */}
        <div
          ref={trackRef}
          className={styles.imageTrack}
          style={{
            transform: `translateX(${offset}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {images.map((image, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <img
                src={image}
                alt={`Slide ${idx + 1}`}
                className={styles.image}
                onClick={onFullscreen}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* 渐变遮罩 */}
        <div className={styles.imageContainer} />

        {/* 导航箭头 */}
        <button className={`${styles.arrow} ${styles.prev}`} onClick={handlePrev}>
          ‹
        </button>
        <button className={`${styles.arrow} ${styles.next}`} onClick={handleNext}>
          ›
        </button>

        {/* 图片计数器 */}
        <div className={styles.counter}>
          <span>{currentIndex + 1}</span>/<span>{images.length}</span>
        </div>

        {/* VR入口 */}
        <button className={styles.vrButton} title="VR全景">
          VR
        </button>
      </div>
    </div>
  )
}

export default ImageCarousel
