/**
 * 钟点房房型详情抽屉组件 - 用于HotelDetail页面显示房型详情
 */
import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import RoomDrawerBanner from '../../hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBanner'
import RoomDrawerBasicInfo from '../../hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBasicInfo'
import RoomDrawerFacilities from '../../hourlyHotel/detail/RoomDetailDrawer/RoomDrawerFacilities'
import RoomDrawerPolicy from '../../hourlyHotel/detail/RoomDetailDrawer/RoomDrawerPolicy'
import { HourlyRoomDetail } from '@estay/shared'

interface HourlyRoomDetailDrawerProps {
  room: HourlyRoomDetail | null
  isOpen: boolean
  onClose: () => void
  selectedDuration?: number
  availableTime?: string
  onBook?: (roomId: string) => void
}

const HourlyRoomDetailDrawer: React.FC<HourlyRoomDetailDrawerProps> = ({
  room,
  isOpen,
  onClose,
  selectedDuration = 3,
  availableTime = '08:00-20:00',
  onBook,
}) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimatingIn(true))
    } else {
      setIsAnimatingIn(false)
    }
  }, [isOpen])

  if (!room) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsAnimatingIn(false)
    setTimeout(onClose, 300)
  }

  const handleBook = () => {
    onBook?.(room._id)
    handleClose()
  }

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`} 
        onClick={handleBackdropClick} 
      />
      <div 
        className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>

        <div className={styles.drawerContent}>
          <RoomDrawerBanner room={room as any} />

          <RoomDrawerBasicInfo
            room={room as any}
            duration={selectedDuration}
            availableTime={availableTime}
          />

          <RoomDrawerFacilities room={room as any} />

          <RoomDrawerPolicy
            room={room as any}
            customPolicy={{
              checkInTime: `请在 ${availableTime} 期间办理入住`,
              duration: `本房型限入住 ${selectedDuration} 小时`,
              overtime: '超时将按小时收取额外费用'
            }}
          />
          <div className={styles.drawerSpacer} />
        </div>

        <div className={styles.drawerFooter}>
          <button className={styles.bookButton} onClick={handleBook}>
            <span style={{ fontSize: '20px', marginRight: '4px' }}>¥{room.baseInfo.price}</span>
            <span style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.9 }}>/ {selectedDuration}小时</span>
            <span style={{ marginLeft: '12px' }}>立即预订</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default HourlyRoomDetailDrawer
