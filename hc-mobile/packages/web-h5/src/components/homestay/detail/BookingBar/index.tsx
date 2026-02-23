import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { HotelRoomSKUModel } from '@estay/shared'
import { calculateNightlyPrice } from '@estay/shared'
import styles from './index.module.scss'
import SlideDrawer from '../../../homestay/shared/SlideDrawer'
import DateRangeCalendar from '../../home/DateRangeCalendar'

interface BookingBarProps {
  selectedSku?: HotelRoomSKUModel | null
  checkInDate?: string
  checkOutDate?: string
  data?: { host?: { avatar?: string; name?: string } }
  onBook?: () => void
  onContactHost?: () => void
  onDateChange?: (checkIn: string, checkOut: string) => void
}

const toMMDD = (value: string): string => {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) {
    return '-- --'
  }
  return `${month}-${day}`
}

const BookingBar: React.FC<BookingBarProps> = ({
  selectedSku,
  checkInDate = '2026-02-22',
  checkOutDate = '2026-02-23',
  onBook,
  onDateChange,
}) => {
  const [localCheckInDate, setLocalCheckInDate] = useState(toMMDD(checkInDate))
  const [localCheckOutDate, setLocalCheckOutDate] = useState(toMMDD(checkOutDate))
  const [showCalendar, setShowCalendar] = useState(false)
  const dateAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalCheckInDate(toMMDD(checkInDate))
  }, [checkInDate])

  useEffect(() => {
    setLocalCheckOutDate(toMMDD(checkOutDate))
  }, [checkOutDate])

  const totalPrice = useMemo(() => {
    if (!selectedSku) {
      return 0
    }

    return calculateNightlyPrice(selectedSku, checkInDate, checkOutDate)
  }, [selectedSku, checkInDate, checkOutDate])

  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    const checkInDateText = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`
    const checkOutDateText = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`

    setLocalCheckInDate(toMMDD(checkInDateText))
    setLocalCheckOutDate(toMMDD(checkOutDateText))
    onDateChange?.(checkInDateText, checkOutDateText)
    setShowCalendar(false)
  }

  const handleOpenCalendar = () => {
    setShowCalendar(true)
  }

  return (
    <>
      <div className={styles.bookingBar}>
        <button
          className={styles.hostButton}
          onClick={() => undefined}
          title="预订说明"
        >
          <img src="https://picsum.photos/40/40?random=host" alt="预订" className={styles.hostAvatar} />
          <span className={styles.tooltip}>说明</span>
        </button>

        <div className={styles.dateArea} ref={dateAreaRef} onClick={handleOpenCalendar}>
          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>入住</label>
            <div className={styles.dateInput}>{localCheckInDate}</div>
          </div>

          <div className={styles.separator}>-</div>

          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>离住</label>
            <div className={styles.dateInput}>{localCheckOutDate}</div>
          </div>
        </div>

        <button className={styles.bookBtn} onClick={onBook}>
          {totalPrice > 0 ? `¥${totalPrice} 立即预订` : '立即预订'}
        </button>
      </div>

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
