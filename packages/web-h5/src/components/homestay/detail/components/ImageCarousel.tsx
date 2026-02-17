/**
 * 沉浸式图片轮播区
 */

import React, { useState, useRef } from 'react'
import styles from './ImageCarousel.module.scss'

interface ImageCarouselProps {
  images: string[]
  onFullscreen?: () => void
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      // 向左滑动 - 下一张
      if (diff > 0) {
        handleNext()
      } else {
        // 向右滑动 - 上一张
        handlePrev()
      }
    }
  }

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carousel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* 图片 */}
        <div className={styles.imageContainer}>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className={styles.image}
            onClick={onFullscreen}
          />
        </div>

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

        {/* VR入口 (可选) */}
        <button className={styles.vrButton} title="VR全景">
          VR
        </button>
      </div>

      {/* 图片指示器 */}
      <div className={styles.indicators}>
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.indicator} ${idx === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
