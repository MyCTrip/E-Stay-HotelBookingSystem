import React, { useEffect, useRef, useState } from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomDrawerBannerProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
  showTabHeader?: boolean
}

const RoomDrawerBanner: React.FC<RoomDrawerBannerProps> = ({ spu, sku, showTabHeader = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const images = spu.images.length > 0 ? spu.images : ['']

  const calculateOffset = (index: number) => -index * 100

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return
    }
    setIsDragging(true)
    startXRef.current = e.clientX
    startOffsetRef.current = offset
  }

  useEffect(() => {
    if (!isDragging) {
      return
    }

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
  }, [currentIndex, images.length, isDragging])

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startOffsetRef.current = offset
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) {
      return
    }
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
    <div className={styles.banner}>
      <div
        className={`${styles.imageContainer} ${showTabHeader ? styles.withTabHeader : ''}`}
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
                alt={`${spu.spuName || 'Room'}-${sku.roomId}-${idx + 1}`}
                className={styles.image}
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className={styles.imageCounter}>
          {currentIndex + 1}/{images.length}
        </div>

        {images.length > 1 && (
          <>
            <button className={styles.navPrev} onClick={handlePrev}>
              ‹
            </button>
            <button className={styles.navNext} onClick={handleNext}>
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default RoomDrawerBanner
