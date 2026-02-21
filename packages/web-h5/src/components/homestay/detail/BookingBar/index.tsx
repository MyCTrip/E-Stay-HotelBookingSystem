/**
 * 底部固定预订栏
 * 左侧：房东头像按钮 + 时间选择 | 右侧：预订按钮
 */

import React, { useState, useRef } from 'react'
import styles from './index.module.scss'
import SlideDrawer from '../../../homestay/shared/SlideDrawer'
import DateRangeCalendar from '../../home/DateRangeCalendar'

interface BookingBarProps {
  data?: { host?: { avatar?: string; name?: string } }
  onBook?: () => void
  onContactHost?: () => void
  onDateChange?: (checkIn: string, checkOut: string) => void
}

const BookingBar: React.FC<BookingBarProps> = ({ data, onBook, onContactHost, onDateChange }) => {
  // 获取房东信息
  const hostAvatar = data?.host?.avatar || 'https://picsum.photos/40/40?random=host'
  const hostName = data?.host?.name || '房东'

  // 日期状态
  const [checkInDate, setCheckInDate] = useState('02-22')
  const [checkOutDate, setCheckOutDate] = useState('02-23')
  const [showCalendar, setShowCalendar] = useState(false)
  const dateAreaRef = useRef<HTMLDivElement>(null)

  const handleContactHost = () => {
    onContactHost?.()
  }

  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    const checkInStr = `${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`
    const checkOutStr = `${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`
    setCheckInDate(checkInStr)
    setCheckOutDate(checkOutStr)
    onDateChange?.(checkInStr, checkOutStr)
    setShowCalendar(false)
  }

  const handleOpenCalendar = () => {
    setShowCalendar(true)
  }

  return (
    <>
      <div className={styles.bookingBar}>
        {/* 左侧：房东头像按钮 */}
        <button 
          className={styles.hostButton} 
          onClick={handleContactHost}
          title={`联系房东 - ${hostName}`}
        >
          <img src={hostAvatar} alt={hostName} className={styles.hostAvatar} />
          <span className={styles.tooltip}>聊天</span>
        </button>

        {/* 中间：时间选择区 */}
        <div className={styles.dateArea} ref={dateAreaRef} onClick={handleOpenCalendar}>
          {/* 入住日期 */}
          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>入住</label>
            <div className={styles.dateInput}>{checkInDate}</div>
          </div>

          {/* 分隔符 */}
          <div className={styles.separator}>-</div>

          {/* 离住日期 */}
          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>离住</label>
            <div className={styles.dateInput}>{checkOutDate}</div>
          </div>
        </div>

        {/* 右侧：预订按钮 */}
        <button className={styles.bookBtn} onClick={onBook}>
          立即预订
        </button>
      </div>

      {/* 日期选择Drawer */}
      <SlideDrawer
        visible={showCalendar}
        direction="down"
        source="screen"
        position="top"
        elementRef={dateAreaRef}
        onClose={() => setShowCalendar(false)}
        onToggle={(isOpen) => isOpen && setShowCalendar(true)}
        showBackButton={false}
        showHeader={false}
      >
        <DateRangeCalendar
          onSelect={handleDateChange}
          onClose={() => setShowCalendar(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default BookingBar
