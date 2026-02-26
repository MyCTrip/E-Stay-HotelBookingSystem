/**
 * 底部固定预订栏
 * 左侧：房东头像按钮 + 时间选择 | 右侧：预订按钮
 */

import React, { useState, useRef } from 'react'
import styles from './index.module.scss'
import SlideDrawer from '../../../homestay/shared/SlideDrawer'
import DateRangeCalendar from '../../home/DateRangeCalendar'

interface BookingBarProps {
  data?: any
  checkIn?: string  // 初始入住日期，格式 MM-DD
  checkOut?: string  // 初始离住日期，格式 MM-DD
  onBook?: () => void
  onContactHost?: () => void
  onDateChange?: (checkIn: string, checkOut: string) => void
  onSave?: () => void
  onCancel?: () => void
  isEditing?: boolean
}

const BookingBar: React.FC<BookingBarProps> = ({ 
  data, 
  checkIn,
  checkOut,
  onBook, 
  onContactHost, 
  onDateChange,
  onSave,
  onCancel,
  isEditing = false 
}) => {
  // 获取房东信息和价格 - 不使用默认值，直接使用 data 属性
  const hostAvatar = data?.host?.avatar
  const hostName = data?.host?.name
  const price = data?.price

  // 日期格式化辅助函数 - 将 YYYY-MM-DD 或其他格式转换为 MM-DD
  const formatToMMDD = (dateStr?: string): string => {
    if (!dateStr) return ''
    // 如果是 YYYY-MM-DD 格式，提取 MM-DD
    if (dateStr.includes('-') && dateStr.length === 10) {
      const parts = dateStr.split('-')
      return `${parts[1]}-${parts[2]}`
    }
    // 如果已经是 MM-DD 格式或其他格式，直接返回
    return dateStr
  }

  // 日期状态 - 使用 Props 提供的初始值，并格式化为 MM-DD
  const [checkInDate, setCheckInDate] = useState(formatToMMDD(checkIn))
  const [checkOutDate, setCheckOutDate] = useState(formatToMMDD(checkOut))
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

  const handleSave = () => {
    onSave?.()
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <>
      <div className={styles.bookingBar}>
        {/* 左侧：房东头像按钮（编辑模式隐藏） */}
        {!isEditing && hostAvatar && hostName && (
          <button
            className={styles.hostButton}
            onClick={handleContactHost}
            title={`联系房东 - ${hostName}`}
          >
            <img src={hostAvatar} alt={hostName} className={styles.hostAvatar} />
            <span className={styles.tooltip}>聊天</span>
          </button>
        )}

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
          <div className={styles.priceAndBooking}>
            {typeof price === 'number' && price > 0 && (
              <div className={styles.priceInfo}>
                <span className={styles.priceLabel}>¥</span>
                <span className={styles.priceValue}>{price}</span>
                <span className={styles.priceUnit}>/晚</span>
              </div>
            )}
            <button className={styles.bookBtn} onClick={onBook} title="立即预订">
              立即预订
            </button>
          </div>
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
        <DateRangeCalendar onSelect={handleDateChange} onClose={() => setShowCalendar(false)} />
      </SlideDrawer>
    </>
  )
}

export default BookingBar
