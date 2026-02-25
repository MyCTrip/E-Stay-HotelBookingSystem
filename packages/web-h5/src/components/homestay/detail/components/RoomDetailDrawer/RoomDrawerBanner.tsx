/**
 * 房型图片轮播区 - 抽屉顶部banner
 */

import React, { useState } from 'react'
import styles from './RoomDrawerBanner.module.scss'

interface Room {
  id: string
  name: string
  image: string
  [key: string]: any
}

interface RoomDrawerBannerProps {
  room: Room
}

const RoomDrawerBanner: React.FC<RoomDrawerBannerProps> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 模拟多张房型图片
  const images = [
    room.image,
    'https://picsum.photos/400/300?random=room_1',
    'https://picsum.photos/400/300?random=room_2',
    'https://picsum.photos/400/300?random=room_3',
    'https://picsum.photos/400/300?random=room_4',
  ]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={styles.banner}>
      {/* 图片容器 */}
      <div className={styles.imageWrapper}>
        <img
          src={images[currentImageIndex]}
          alt={room.name}
          className={styles.image}
        />

        {/* 图片计数 */}
        <div className={styles.imageCounter}>
          {currentImageIndex + 1}/{images.length}
        </div>

        {/* 前后导航按钮 */}
        {images.length > 1 && (
          <>
            <button className={styles.navPrev} onClick={handlePrevImage}>
              ‹
            </button>
            <button className={styles.navNext} onClick={handleNextImage}>
              ›
            </button>
          </>
        )}
      </div>

      {/* 图片指示器 */}
      {images.length > 1 && (
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentImageIndex ? styles.active : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomDrawerBanner
