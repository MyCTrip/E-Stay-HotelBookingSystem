/**
 * 日期范围选择组件 - Web H5版本
 */

import React, { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { DatePicker, Popup } from '@nutui/nutui-react'
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
  const [showPicker, setShowPicker] = useState(false)
  const [pickerType, setPickerType] = useState<'checkIn' | 'checkOut'>(
    'checkIn'
  )

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

  const handleDatePick = (date: Date | string) => {
    const selectedDate = new Date(date)

    if (pickerType === 'checkIn') {
      // 如果选择的入住日期晚于离住日期，自动调整离住日期
      if (selectedDate >= tempCheckOut) {
        const newCheckOut = dayjs(selectedDate).add(1, 'day').toDate()
        setTempCheckIn(selectedDate)
        setTempCheckOut(newCheckOut)
      } else {
        setTempCheckIn(selectedDate)
      }
    } else {
      // 离住日期必须晚于入住日期
      if (selectedDate <= tempCheckIn) {
        return
      }
      setTempCheckOut(selectedDate)
    }

    setShowPicker(false)
  }

  const handleConfirm = () => {
    onDateChange?.(tempCheckIn, tempCheckOut)
    setShowPicker(false)
  }

  const handlePickerOpen = (type: 'checkIn' | 'checkOut') => {
    setPickerType(type)
    setShowPicker(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 入住日期 */}
        <div
          className={styles.dateSection}
          onClick={() => handlePickerOpen('checkIn')}
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
          onClick={() => handlePickerOpen('checkOut')}
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
            <span className={styles.icon}>📅</span>
          </div>
        </div>
      </div>

      {/* 日期选择Popup */}
      <Popup
        visible={showPicker}
        position="bottom"
        onClose={() => setShowPicker(false)}
        style={{ height: '400px' }}
      >
        <div className={styles.pickerContainer}>
          <DatePicker
            value={new Date(pickerType === 'checkIn' ? tempCheckIn : tempCheckOut)}
            startDate={dayjs().toDate()}
            endDate={dayjs().add(365, 'day').toDate()}
            type="date"
          />
          <div className={styles.pickerFooter}>
            <button
              className={styles.cancelBtn}
              onClick={() => setShowPicker(false)}
            >
              取消
            </button>
            <button className={styles.confirmBtn} onClick={handleConfirm}>
              确定
            </button>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default React.memo(DateTimeRangeSelector)
