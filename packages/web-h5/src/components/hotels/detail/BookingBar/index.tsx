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

const CURRENCY_SYMBOL = '\u00A5'

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

  const { searchParams, setSearchParams, roomSPUList, currentSelectedRoomId, currentHotelDetail } =
    useHotelStore()

  const safeDetail = currentHotelDetail as any
  const resolvedHotelId = hotelId || safeDetail?.id || safeDetail?._id || ''

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

    return calculateNightlyPrice(selectedSku, searchParams.checkInDate, searchParams.checkOutDate)
  }, [searchParams.checkInDate, searchParams.checkOutDate, selectedSku])

  const hotelLogo = currentHotelDetail?.baseInfo.images[0] || ''
  const hotelName =
    safeDetail?.baseInfo?.nameCn ||
    safeDetail?.baseInfo?.nameEn ||
    safeDetail?.baseInfo?.name ||
    '\u9152\u5e97'

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

  return (
    <>
      <div className={styles.bookingBar}>
        <button className={styles.hostButton} onClick={() => undefined} title={hotelName}>
          <img src={hotelLogo} alt={hotelName} className={styles.hostAvatar} />
          <span className={styles.tooltip}>{hotelName}</span>
        </button>

        <div className={styles.dateArea} ref={dateAreaRef} onClick={() => setShowCalendar(true)}>
          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>{'\u5165\u4f4f'}</label>
            <div className={styles.dateInput}>{toMMDD(searchParams.checkInDate)}</div>
          </div>

          <div className={styles.separator}>-</div>

          <div className={styles.dateItem}>
            <label className={styles.dateLabel}>{'\u79bb\u5e97'}</label>
            <div className={styles.dateInput}>{toMMDD(searchParams.checkOutDate)}</div>
          </div>
        </div>

        <button
          className={styles.bookBtn}
          disabled={selectedSku?.status === 'sold_out'}
          onClick={() => onBook?.(selectedSku)}
        >
          {selectedSku?.status === 'sold_out'
            ? '\u6ee1\u623f'
            : totalPrice > 0
              ? `${CURRENCY_SYMBOL}${totalPrice} \u7acb\u5373\u9884\u8ba2`
              : '\u7acb\u5373\u9884\u8ba2'}
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
