import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom' // 🌟 引入 createPortal
import styles from './index.module.css'
// 引入房型特有的子组件
import RoomDrawerBanner from '../RoomDetailDrawer/RoomDrawerBanner'
import RoomDrawerBasicInfo from '../RoomDetailDrawer/RoomDrawerBasicInfo'
// 复用已有的酒店详情组件
import FacilitiesSection from '../FacilitiesSection'
import PolicySection from '../PolicySection'
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

  const handleClose = () => {
    setIsAnimatingIn(false)
    // 等待 300ms 动画结束后再彻底卸载组件/重置状态
    setTimeout(onClose, 300)
  }

  // 🌟 使用 createPortal 将弹窗直接挂载到 <body>
  return createPortal(
    <>
      <div
        className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`}
        onClick={handleClose}
      />
      <div className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`}>
        {/* 图片上的关闭按钮 */}
        <button className={styles.topCloseBtn} onClick={handleClose}>✕</button>

        <div className={styles.drawerContent}>
          {/* 1. 房型图片轮播 */}
          <RoomDrawerBanner room={room} />

          <div className={styles.mainWrapper}>
            {/* 2. 房型基础信息网格 (携程风格：面积、楼层、窗户等) */}
            <RoomDrawerBasicInfo
              room={room}
              duration={selectedDuration}
              availableTime={availableTime}
            />

            {/* 3. 复用设施组件：展示该房型的设施 */}
            <div className={styles.reusedSection}>
              <FacilitiesSection data={room} />
            </div>

            {/* 4. 复用政策组件：展示订房必读等 */}
            <div className={styles.reusedSection}>
              <PolicySection data={room} />
            </div>

            <div className={styles.drawerSpacer} />
          </div>
        </div>

        {/* 5. 底部价格预订条 */}
        <div className={styles.drawerFooter}>
          <div className={styles.priceArea}>
            <span className={styles.currency}>¥</span>
            <span className={styles.priceText}>{room.baseInfo?.price}</span>
            <span className={styles.durationUnit}>/ {selectedDuration}小时</span>
          </div>
          <button className={styles.bookButton} onClick={() => onBook?.(room._id)}>
            立即预订
          </button>
        </div>
      </div>
    </>,
    document.body // 👈 这里是 createPortal 的第二个参数
  )
}

export default HourlyRoomDetailDrawer