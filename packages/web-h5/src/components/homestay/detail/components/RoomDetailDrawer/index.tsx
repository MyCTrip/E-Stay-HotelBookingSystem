/**
 * 房型详情抽屉栏 - 底部上滑展示房型完整信息
 */

import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import RoomDrawerBanner from './RoomDrawerBanner'
import RoomDrawerBasicInfo from './RoomDrawerBasicInfo'
import RoomDrawerFacilities from './RoomDrawerFacilities'
import RoomDrawerPolicy from './RoomDrawerPolicy'
import RoomDrawerPrice from './RoomDrawerPrice'

interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  price: number
  priceNote: string
  benefits: string[]
  packageCount: number
}

interface RoomDetailDrawerProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onBook?: (roomId: string) => void
}

const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({
  room,
  isOpen,
  onClose,
  onBook,
}) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 延迟一帧以触发动画
      setTimeout(() => setIsAnimatingIn(true), 10)
    } else {
      setIsAnimatingIn(false)
    }
  }, [isOpen])

  if (!room) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose()
    }
  }

  const handleBook = () => {
    onBook?.(room.id)
    onClose()
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`}
        onClick={handleBackdropClick}
      />

      {/* 抽屉容器 */}
      <div
        className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* 内容区 - 可滚动 */}
        <div className={styles.drawerContent}>
          {/* 房型图片 */}
          <RoomDrawerBanner room={room} />

          {/* 基础信息和床型 */}
          <RoomDrawerBasicInfo room={room} />

          {/* 设施服务 */}
          <RoomDrawerFacilities room={room} />

          {/* 政策信息 */}
          <RoomDrawerPolicy room={room} />

          {/* 价格与优惠 */}
          <RoomDrawerPrice room={room} />

          {/* 底部间距 */}
          <div className={styles.drawerSpacer} />
        </div>

        {/* 底部预订按钮 */}
        <div className={styles.drawerFooter}>
          <button className={styles.bookButton} onClick={handleBook}>
            ¥{room.price} 预订此房型
          </button>
        </div>
      </div>
    </>
  )
}

export default RoomDetailDrawer
