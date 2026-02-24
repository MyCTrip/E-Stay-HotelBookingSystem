import React, { useEffect, useRef, useState } from 'react'
import type { HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

interface ImageCarouselProps {
  baseInfo: Pick<HotelEntityBaseInfoModel, 'images'>
  onFullscreen?: () => void
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ baseInfo, onFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const images = baseInfo.images.length > 0 ? baseInfo.images : ['']

  const calculateOffset = (index: number) => -index * 100

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return
    setIsDragging(true)
    startXRef.current = e.clientX
    startOffsetRef.current = offset
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current
      const percentage = (diff / window.innerWidth) * 100
      setOffset(startOffsetRef.current + percentage)
    }

    const handleMouseUp = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current

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

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, currentIndex, images.length])

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

        <div className={styles.imageContainer} />

        <button className={`${styles.arrow} ${styles.prev}`} onClick={handlePrev}>
          ‹
        </button>
        <button className={`${styles.arrow} ${styles.next}`} onClick={handleNext}>
          ›
        </button>

        <div className={styles.counter}>
          <span>{currentIndex + 1}</span>/<span>{images.length}</span>
        </div>

        <button className={styles.vrButton} title="VR">
          VR
        </button>
      </div>
    </div>
  )
}

export default ImageCarousel
