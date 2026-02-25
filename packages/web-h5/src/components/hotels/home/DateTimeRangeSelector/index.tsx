import React, { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import SlideDrawer from '../../shared/SlideDrawer'
import DateRangeCalendar from '../DateRangeCalendar'
import styles from './index.module.scss'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface DateTimeRangeSelectorProps {
  checkIn: Date
  checkOut: Date
  onDateChange: (checkIn: Date, checkOut: Date) => void
}

const DateTimeRangeSelector: React.FC<DateTimeRangeSelectorProps> = ({
  checkIn,
  checkOut,
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false)

  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')

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
    onDateChange(newCheckIn, newCheckOut)
    setShowCalendar(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.dateSection} onClick={() => setShowCalendar(true)}>
          <div className={styles.dateValue}>{formatDateLabel(checkIn)}</div>
          <div className={styles.dateLabel}>入住</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.dateSection} onClick={() => setShowCalendar(true)}>
          <div className={styles.dateValue}>{formatDateLabel(checkOut)}</div>
          <div className={styles.dateLabel}>离住</div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.nightsInfo}>
            <span className={styles.nightsLabel}>共{nights}晚</span>
          </div>
        </div>
      </div>

      <SlideDrawer
        visible={showCalendar}
        title="选择入离日期"
        direction="bottom"
        onClose={() => setShowCalendar(false)}
      >
        <DateRangeCalendar
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={handleDateRangeSelect}
          onClose={() => setShowCalendar(false)}
        />
      </SlideDrawer>
    </div>
  )
}

export default React.memo(DateTimeRangeSelector)
