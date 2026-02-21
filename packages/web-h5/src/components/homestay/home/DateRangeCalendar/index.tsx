/**
 * 日期范围日历组件 - 只提供日历内容
 */

import React, { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import styles from './index.module.scss'

interface DateRangeCalendarProps {
  checkIn?: Date
  checkOut?: Date
  onSelect: (checkIn: Date, checkOut: Date) => void
  onClose: () => void
}

const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
  checkIn,
  checkOut,
  onSelect,
  onClose,
}) => {
  const today = dayjs()
  const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkIn || null)
  const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOut || null)
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  // 生成日历数据
  const calendarData = useMemo(() => {
    const months: Array<{ month: string; weeks: (dayjs.Dayjs | null)[][] }> = []
    for (let i = 0; i < 6; i++) {
      const month = dayjs(currentMonth).add(i, 'month')
      const firstDay = month.startOf('month')
      const lastDay = month.endOf('month')
      const weeks: (dayjs.Dayjs | null)[][] = []
      let week: (dayjs.Dayjs | null)[] = []

      // 填充本月之前的空白
      for (let j = 0; j < firstDay.day(); j++) {
        week.push(null)
      }

      // 填充本月的日期
      let current = firstDay
      while (current.format('YYYY-MM') === month.format('YYYY-MM')) {
        week.push(current)
        if (week.length === 7) {
          weeks.push(week)
          week = []
        }
        current = current.add(1, 'day')
      }

      // 填充末尾空白
      while (week.length > 0 && week.length < 7) {
        week.push(null)
      }
      if (week.length === 7) {
        weeks.push(week)
      }

      months.push({
        month: month.format('YYYY年M月'),
        weeks,
      })
    }
    return months
  }, [currentMonth])

  const nights =
    tempCheckIn && tempCheckOut ? dayjs(tempCheckOut).diff(dayjs(tempCheckIn), 'day') : 0

  const isInRange = (date: dayjs.Dayjs) => {
    if (!tempCheckIn || !tempCheckOut) return false
    return date.isAfter(dayjs(tempCheckIn)) && date.isBefore(dayjs(tempCheckOut))
  }

  const isCheckInDate = (date: dayjs.Dayjs) => {
    return tempCheckIn && date.format('YYYY-MM-DD') === dayjs(tempCheckIn).format('YYYY-MM-DD')
  }

  const isCheckOutDate = (date: dayjs.Dayjs) => {
    return tempCheckOut && date.format('YYYY-MM-DD') === dayjs(tempCheckOut).format('YYYY-MM-DD')
  }

  const handleDateClick = (date: dayjs.Dayjs) => {
    // 不能选择过去的日期
    if (date.isBefore(today, 'day')) {
      return
    }

    if (!tempCheckIn) {
      setTempCheckIn(date.toDate())
    } else if (!tempCheckOut) {
      if (date.isAfter(dayjs(tempCheckIn), 'day')) {
        setTempCheckOut(date.toDate())
      } else {
        setTempCheckIn(date.toDate())
        setTempCheckOut(null)
      }
    } else {
      // 已选择两个日期，重新开始选择
      setTempCheckIn(date.toDate())
      setTempCheckOut(null)
    }
  }

  const handleConfirm = () => {
    if (tempCheckIn && tempCheckOut) {
      onSelect(tempCheckIn, tempCheckOut)
      setTempCheckIn(null)
      setTempCheckOut(null)
      onClose()
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* 日期信息 */}
      <div className={styles.dateInfo}>
        <div className={styles.dateInfoItem}>
          <div className={styles.dateInfoLabel}>入住日期</div>
          <div className={styles.dateInfoValue}>
            {tempCheckIn ? dayjs(tempCheckIn).format('M月D日 ddd') : '未选择'}
          </div>
        </div>
        <div className={styles.dateInfoSpacer}>
          {nights > 0 && <div className={styles.nightsCount}>共{nights}晚</div>}
        </div>
        <div className={styles.dateInfoItem}>
          <div className={styles.dateInfoLabel}>离店日期</div>
          <div className={styles.dateInfoValue}>
            {tempCheckOut ? dayjs(tempCheckOut).format('M月D日 ddd') : '未选择'}
          </div>
        </div>
      </div>

      {/* 日历 */}
      <div className={styles.calendarContainer}>
        {calendarData.map((monthData, monthIndex) => (
          <div key={monthIndex} className={styles.calendarMonth}>
            <div className={styles.monthTitle}>{monthData.month}</div>

            {/* 星期标签 */}
            <div className={styles.weekdayLabels}>
              {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                <div key={day} className={styles.weekdayLabel}>
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className={styles.daysGrid}>
              {monthData.weeks.map((week, weekIndex) =>
                week.map((date, dayIndex) => (
                  <button
                    key={`${monthIndex}-${weekIndex}-${dayIndex}`}
                    className={`${styles.dayButton} ${
                      date === null ? styles.empty : ''
                    } ${date && date.isBefore(today, 'day') ? styles.disabled : ''} ${
                      date && isCheckInDate(date) ? styles.checkIn : ''
                    } ${date && isCheckOutDate(date) ? styles.checkOut : ''} ${
                      date && isInRange(date) ? styles.inRange : ''
                    }`}
                    onClick={() => date && handleDateClick(date)}
                    disabled={!date || date.isBefore(today, 'day')}
                  >
                    {date && date.date()}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
        <div className={styles.endTip}>到底了，最长可订6个月内的房屋</div>
      </div>

      {/* 底部按钮 */}
      <div className={styles.footer}>
        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={!tempCheckIn || !tempCheckOut}
        >
          确定
        </button>
      </div>
    </div>
  )
}

export default DateRangeCalendar
