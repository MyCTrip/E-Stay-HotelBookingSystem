/**
 * 日期选择器 - 房型选择上方
 * 显示入住/离店时间和日期选择
 */

import React, { useState } from 'react'
import styles from './DatePicker.module.scss'

interface DatePickerProps {
  onDateChange?: (checkIn: string, checkOut: string) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const afterTomorrow = new Date(tomorrow)
  afterTomorrow.setDate(afterTomorrow.getDate() + 1)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow))
  const [checkOut, setCheckOut] = useState(formatDate(afterTomorrow))

  const handleDateChange = (type: 'checkIn' | 'checkOut', value: string) => {
    if (type === 'checkIn') {
      setCheckIn(value)
    } else {
      setCheckOut(value)
    }
    onDateChange?.(checkIn, checkOut)
  }

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[date.getDay()]
    return `${month}月${day}日 (周${weekDay})`
  }

  const calculateNights = () => {
    const checkInDate = new Date(checkIn + 'T00:00:00')
    const checkOutDate = new Date(checkOut + 'T00:00:00')
    const diffTime = checkOutDate.getTime() - checkInDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  return (
    <div className={styles.datePicker}>
      <div className={styles.timeRow}>
        {/* 入住时间 */}
        <div className={styles.timeBlock}>
          <label className={styles.label}>入住</label>
          <div className={styles.timeInfo}>
            <span className={styles.time}>15:00</span>
            <span className={styles.date}>后进房</span>
          </div>
        </div>

        {/* 分隔符 */}
        <div className={styles.separator} />

        {/* 离店时间 */}
        <div className={styles.timeBlock}>
          <label className={styles.label}>离店</label>
          <div className={styles.timeInfo}>
            <span className={styles.time}>12:00</span>
            <span className={styles.date}>前退房</span>
          </div>
        </div>

        {/* 晚数信息 */}
        <div className={styles.nights}>
          <span className={styles.count}>{calculateNights()}</span>
          <span className={styles.unit}>晚</span>
        </div>
      </div>

      {/* 日期选择行 */}
      <div className={styles.dateRow}>
        <div className={styles.dateBlock}>
          <label className={styles.label}>入住日期</label>
          <input
            type="date"
            className={styles.dateInput}
            value={checkIn}
            onChange={(e) => handleDateChange('checkIn', e.target.value)}
          />
          <span className={styles.dateText}>{formatDateDisplay(checkIn)}</span>
        </div>

        <span className={styles.rangeSeparator}>〜</span>

        <div className={styles.dateBlock}>
          <label className={styles.label}>离店日期</label>
          <input
            type="date"
            className={styles.dateInput}
            value={checkOut}
            onChange={(e) => handleDateChange('checkOut', e.target.value)}
          />
          <span className={styles.dateText}>{formatDateDisplay(checkOut)}</span>
        </div>
      </div>

      {/* 变更日期按钮 */}
      <button className={styles.changeBtn}>修改日期</button>
    </div>
  )
}

export default DatePicker
