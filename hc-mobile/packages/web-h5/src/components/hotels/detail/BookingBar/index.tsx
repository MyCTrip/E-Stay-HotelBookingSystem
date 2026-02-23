import React, { useMemo, useRef, useState } from 'react'
import { calculateNightlyPrice, useHotelStore } from '@estay/shared'
import type { HotelRoomSKUModel } from '@estay/shared'
import styles from './index.module.scss'
import SlideDrawer from '../../../homestay/shared/SlideDrawer'
import DateRangeCalendar from '../../home/DateRangeCalendar'

interface BookingBarProps {
  hotelId?: string
  onBook?: (sku: HotelRoomSKUModel | null) => void
  onDateChange?: (checkIn: string, checkOut: string) => void
}

const parseDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

const toYYYYMMDD = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`

const toMMDD = (value: string): string => {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) {
    return '-- --'
  }

  return `${month}-${day}`
}

const BookingBar: React.FC<BookingBarProps> = ({ hotelId, onBook, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const dateAreaRef = useRef<HTMLDivElement>(null)

  const {
    searchParams,
    setSearchParams,
    roomSPUList,
    currentSelectedRoomId,
    currentHotelDetail,
  } = useHotelStore()

  const resolvedHotelId = hotelId || currentHotelDetail?.id || ''

  const selectedSku = useMemo(() => {
    if (!resolvedHotelId) {
      return null
    }

    const skus = (roomSPUList[resolvedHotelId] || []).flatMap((spu) => spu.skus)

    return (
      skus.find((sku) => sku.roomId === currentSelectedRoomId) ??
      skus.find((sku) => sku.status === 'available') ??
      skus[0] ??
      null
    )
  }, [currentSelectedRoomId, resolvedHotelId, roomSPUList])

  const totalPrice = useMemo(() => {
    if (!selectedSku) {
      return 0
    }

    return calculateNightlyPrice(
      selectedSku,
      searchParams.checkInDate,
      searchParams.checkOutDate
    )
  }, [searchParams.checkInDate, searchParams.checkOutDate, selectedSku])

  const hotelLogo = currentHotelDetail?.baseInfo.images[0] || ''
  const hotelName = currentHotelDetail?.baseInfo.name || '酒店'

  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    const checkInDate = toYYYYMMDD(checkIn)
    const checkOutDate = toYYYYMMDD(checkOut)

    setSearchParams({
      checkInDate,
      checkOutDate,
      page: 1,
    })
    onDateChange?.(checkInDate, checkOutDate)
    setShowCalendar(false)
  }

  const handleOpenCalendar = () => {
    setShowCalendar(true)
  }

  return (
    <>
      <div className={styles.bookingBar}>
        <button className={styles.hostButton} onClick={() => undefined} title={hotelName}>
          <img src={hotelLogo} alt={hotelName} className={styles.hostAvatar} />
          <span className={styles.tooltip}>{null}</span>
        </button>

        <div className={styles.dateArea} ref={dateAreaRef} onClick={handleOpenCalendar}>
          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>入住</label>
            <div className={styles.dateInput}>{toMMDD(searchParams.checkInDate)}</div>
          </div>

          <div className={styles.separator}>-</div>

          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>离住</label>
            <div className={styles.dateInput}>{toMMDD(searchParams.checkOutDate)}</div>
          </div>
        </div>

        <button
          className={styles.bookBtn}
          disabled={selectedSku?.status === 'sold_out'}
          onClick={() => onBook?.(selectedSku)}
        >
          {selectedSku?.status === 'sold_out'
            ? '满房'
            : totalPrice > 0
              ? `¥${totalPrice} 立即预订`
              : '立即预订'}
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
          checkIn={parseDate(searchParams.checkInDate)}
          checkOut={parseDate(searchParams.checkOutDate)}
          onSelect={handleDateChange}
          onClose={() => setShowCalendar(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default BookingBar
