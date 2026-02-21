import { useMemo, useState } from 'react'

interface DateInfo {
  checkInDate: string
  checkInWeek: string
  checkOutDate: string
  checkOutWeek: string
  nights: number
}

interface UseDateRangeResult {
  checkIn: string
  checkOut: string
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  dateInfo: DateInfo
  startDate: string
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

const getWeekDay = (dateStr: string): string => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date().toDateString()
  const target = new Date(dateStr).toDateString()

  if (today === target) {
    return '今天'
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (tomorrow.toDateString() === target) {
    return '明天'
  }

  return days[new Date(dateStr).getDay()]
}

const getNights = (start: string, end: string): number => {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return Math.round((e - s) / 86400000)
}

const getTodayDate = (): string => new Date().toISOString().split('T')[0]

const getTomorrowDate = (): string => new Date(Date.now() + 86400000).toISOString().split('T')[0]

export const useDateRange = (): UseDateRangeResult => {
  const [checkIn, setCheckInState] = useState<string>(getTodayDate())
  const [checkOut, setCheckOutState] = useState<string>(getTomorrowDate())

  const setCheckIn = (value: string): void => {
    setCheckInState(value)
    const checkInTime = new Date(value).getTime()
    const checkOutTime = new Date(checkOut).getTime()
    if (checkInTime >= checkOutTime) {
      const nextDay = new Date(checkInTime + 86400000)
      setCheckOutState(nextDay.toISOString().split('T')[0])
    }
  }

  const setCheckOut = (value: string): void => {
    setCheckOutState(value)
  }

  const dateInfo = useMemo<DateInfo>(() => {
    return {
      checkInDate: formatDate(checkIn),
      checkInWeek: getWeekDay(checkIn),
      checkOutDate: formatDate(checkOut),
      checkOutWeek: getWeekDay(checkOut),
      nights: getNights(checkIn, checkOut),
    }
  }, [checkIn, checkOut])

  return {
    checkIn,
    checkOut,
    setCheckIn,
    setCheckOut,
    dateInfo,
    startDate: getTodayDate(),
  }
}
