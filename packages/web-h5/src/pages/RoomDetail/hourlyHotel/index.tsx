import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import RoomDrawerBanner from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBanner'
import RoomDrawerBasicInfo from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBasicInfo'
import RoomDrawerFacilities from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerFacilities'
import RoomDrawerPolicy from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerPolicy'

// 引入真实的共享类型（请根据你的实际路径调整，这里假设可以使用 monorepo 的包名）
import { HourlyRoomDetail } from '@estay/shared'

interface HourlyRoomDetailDrawerProps {
  room: HourlyRoomDetail | null
  // 钟点房特有的上下文参数，通常由外层的详情页获取并传入
  selectedDuration?: number
  availableTime?: string

  isOpen: boolean
  onClose: () => void
  onBook?: (roomId: string) => void
}

const HourlyRoomDetailDrawer: React.FC<HourlyRoomDetailDrawerProps> = ({
  room,
  selectedDuration = 3, // 默认 fallback
  availableTime = '08:00-20:00', // 默认 fallback
  isOpen,
  onClose,
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
      <div className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`} onClick={handleBackdropClick} />
      <div className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>

        <div className={styles.drawerContent}>
          {/* 注意：Banner 和 Facilities 也要同步把 props 改为 HourlyRoomDetail */}
          <RoomDrawerBanner room={room} />

          {/* 将时长和时段作为额外 props 传入 */}
          <RoomDrawerBasicInfo
            room={room}
            duration={selectedDuration}
            availableTime={availableTime}
          />

          <RoomDrawerFacilities room={room} />

          <RoomDrawerPolicy
            room={room}
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