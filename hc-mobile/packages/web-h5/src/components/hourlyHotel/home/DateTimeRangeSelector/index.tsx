/**
 * 日期范围选择组件 - Web H5版本
 */

import React, { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import DateRangeCalendar from '../DateRangeCalendar'
import styles from './index.module.scss'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface DateTimeRangeSelectorProps {
  checkIn?: Date
  checkOut?: Date
  onDateChange?: (checkIn: Date, checkOut: Date) => void
}

const DateTimeRangeSelector: React.FC<DateTimeRangeSelectorProps> = ({
  checkIn,
  checkOut,
  onDateChange,
}) => {
  const [tempCheckIn, setTempCheckIn] = useState<Date>(
    checkIn || dayjs().toDate()
  )
  const [tempCheckOut, setTempCheckOut] = useState<Date>(
    checkOut || dayjs().add(1, 'day').toDate()
  )
  const [showCalendar, setShowCalendar] = useState(false)

  const nights = dayjs(tempCheckOut).diff(dayjs(tempCheckIn), 'day')

  const formatDateLabel = (date: Date): string => {
    const d = dayjs(date)
    const today = dayjs()
    const tomorrow = today.add(1, 'day')
    const dayAfterTomorrow = today.add(2, 'day')

    if (d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
      return `${d.format('M月D日')} 今天`
    }
    if (d.format('YYYY-MM-DD') === tomorrow.format('YYYY-MM-DD')) {
      return `${d.format('M月D日')} 明天`
    }
    if (d.format('YYYY-MM-DD') === dayAfterTomorrow.format('YYYY-MM-DD')) {
      return `${d.format('M月D日')} 后天`
    }
    return d.format('M月D日')
  }

  const handleDateRangeSelect = (newCheckIn: Date, newCheckOut: Date) => {
    setTempCheckIn(newCheckIn)
    setTempCheckOut(newCheckOut)
    onDateChange?.(newCheckIn, newCheckOut)
    setShowCalendar(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 入住日期 */}
        <div
          className={styles.dateSection}
          onClick={() => setShowCalendar(true)}
        >
          <div className={styles.dateValue}>
            {formatDateLabel(tempCheckIn)}
          </div>
          <div className={styles.dateLabel}>入住</div>
        </div>

        {/* 分割线 */}
        <div className={styles.divider} />

        {/* 离住日期 */}
        <div
          className={styles.dateSection}
          onClick={() => setShowCalendar(true)}
        >
          <div className={styles.dateValue}>
            {formatDateLabel(tempCheckOut)}
          </div>
          <div className={styles.dateLabel}>离住</div>
        </div>

        {/* 右侧信息 */}
        <div className={styles.rightSection}>
          <div className={styles.nightsInfo}>
            <span className={styles.nightsLabel}>共{nights}晚</span>
          </div>
        </div>
      </div>

      {/* 日期范围日历 */}
      <DateRangeCalendar
        visible={showCalendar}
        checkIn={tempCheckIn}
        checkOut={tempCheckOut}
        onSelect={handleDateRangeSelect}
        onClose={() => setShowCalendar(false)}
      />
    </div>
  )
}

export default React.memo(DateTimeRangeSelector)
