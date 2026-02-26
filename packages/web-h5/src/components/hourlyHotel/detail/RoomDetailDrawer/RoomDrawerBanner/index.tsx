/**
 * 房型图片轮播区 - 携程风格重构
 */
import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import { HourlyRoomDetail } from '@estay/shared'

interface RoomDrawerBannerProps {
  room: HourlyRoomDetail
}

const RoomDrawerBanner: React.FC<RoomDrawerBannerProps> = ({ room }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // 🌟 修改：从 baseInfo 中安全获取图片数组
  const images = room.baseInfo?.images || ['https://th.bing.com/th/id/OIP.Akykor3nSsgINL-1Hi5vDAHaEJ?w=305&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3']

  const calculateOffset = (index: number) => -index * 100

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startOffsetRef.current = offset
    setIsDragging(true)
  }

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startXRef.current
    const percentage = (diff / window.innerWidth) * 100
    setOffset(startOffsetRef.current + percentage)
  }

  // 触摸结束
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

  return (
    <div className={styles.banner}>
      <div
        className={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className={styles.imageTrack}
          style={{
            transform: `translateX(${offset}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {images.map((image, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <img
                src={image}
                alt={`Room ${idx + 1}`}
                className={styles.image}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* 🌟 携程风格：右下角数字计数 */}
        <div className={styles.imageCounter}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerBanner