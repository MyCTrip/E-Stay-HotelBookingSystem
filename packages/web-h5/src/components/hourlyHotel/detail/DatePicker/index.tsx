/**
 * 日期选择器 - 房型选择上方
 * 显示入住/离店时间和日期选择
 */

import React, { useState } from 'react'
import styles from './index.module.scss'
import SlideDrawer from '../../shared/SlideDrawer'
import DateRangeCalendar from '../../home/DateRangeCalendar'

interface DatePickerProps {
  onDateChange?: (checkIn: string, checkOut: string) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const afterTomorrow = new Date(tomorrow)
  afterTomorrow.setDate(afterTomorrow.getDate() + 2)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const [checkIn, setCheckIn] = useState<Date>(tomorrow)
  const [checkOut, setCheckOut] = useState<Date>(afterTomorrow)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const handleDateChange = (newCheckIn: Date, newCheckOut: Date) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    setDrawerVisible(false)
    onDateChange?.(formatDate(newCheckIn), formatDate(newCheckOut))
  }

  const formatDateDisplay = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[date.getDay()]
    return `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日 ${weekDay}`
  }

  const calculateNights = () => {
    const diffTime = checkOut.getTime() - checkIn.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  return (
    <>
      {/* 日期条形展示 */}
      <div className={styles.datePicker} onClick={() => setDrawerVisible(true)}>
        <div className={styles.dateBar}>
          {/* 入住日期 */}
          <div className={styles.dateSection}>
            <span className={styles.dateText}>{formatDateDisplay(checkIn)}</span>
            <span className={styles.label}>入住</span>
          </div>

          {/* 分隔符 */}
          <span className={styles.divider}>|</span>

          {/* 晚数统计 */}
          <div className={styles.nightsSection}>
            <span className={styles.nightsText}>共{calculateNights()}晚</span>
          </div>

          {/* 分隔符 */}
          <span className={styles.divider}>|</span>

          {/* 离开日期 */}
          <div className={styles.dateSection}>
            <span className={styles.dateText}>{formatDateDisplay(checkOut)}</span>
            <span className={styles.label}>离开</span>
          </div>
        </div>
      </div>

      {/* 侧滑抽屉 - 从顶部下滑 */}
      <SlideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        direction="down"
        source="screen"
        screenEdge="top"
        maxHeight="80vh"
        showHeader={true}
        title="选择日期"
        closeModes={['clickOutside', 'backButton']}
      >
        <DateRangeCalendar
          visible={drawerVisible}
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={handleDateChange}
          onClose={() => setDrawerVisible(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default DatePicker