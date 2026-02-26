/**
 * 搜索条件栏 - SearchResultHeader 下方
 * 包含：城市选择、入离时间选择、地址搜索栏
 */

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { HotelMarket } from '@estay/shared'
import SlideDrawer from '../../shared/SlideDrawer'
import CitySearch from '../../home/CitySearch'
import DateRangeCalendar from '../../home/DateRangeCalendar'
import LocationSearch from '../../home/LocationSearch'
import styles from './index.module.scss'

interface SearchBarProps {
  initialCity?: string
  initialCheckIn?: Date
  initialCheckOut?: Date
  // 🌟 核心修复 1：强行补回被队友删掉的字符串格式接口
  checkInDate?: string
  checkOutDate?: string
  initialLocation?: string
  market?: HotelMarket
  onCityChange?: (city: string) => void
  onDateChange?: (checkIn: Date, checkOut: Date) => void
  onLocationChange?: (location: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialCity = '上海',
  initialCheckIn,
  initialCheckOut,
  checkInDate,
  checkOutDate,
  initialLocation = '',
  market = 'domestic',
  onCityChange,
  onDateChange,
  onLocationChange,
}) => {
  // 智能解析初始时间
  const parsedCheckIn = checkInDate ? dayjs(checkInDate).toDate() : initialCheckIn
  const parsedCheckOut = checkOutDate ? dayjs(checkOutDate).toDate() : initialCheckOut

  const [city, setCity] = useState(initialCity)
  const [checkIn, setCheckIn] = useState<Date | undefined>(parsedCheckIn)
  const [checkOut, setCheckOut] = useState<Date | undefined>(parsedCheckOut)
  const [location, setLocation] = useState(initialLocation)

  // 🌟 核心修复 2：加上监听管线！外部参数一旦变化，内部强制刷新，完美回显！
  useEffect(() => {
    if (initialCity) setCity(initialCity)
  }, [initialCity])

  useEffect(() => {
    if (checkInDate) setCheckIn(dayjs(checkInDate).toDate())
    else if (initialCheckIn) setCheckIn(initialCheckIn)
  }, [checkInDate, initialCheckIn])

  useEffect(() => {
    if (checkOutDate) setCheckOut(dayjs(checkOutDate).toDate())
    else if (initialCheckOut) setCheckOut(initialCheckOut)
  }, [checkOutDate, initialCheckOut])

  // 弹窗状态
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [showDateRange, setShowDateRange] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    onCityChange?.(selectedCity)
    setShowCitySearch(false)
  }

  const handleDateSelect = (selectedCheckIn: Date, selectedCheckOut: Date) => {
    setCheckIn(selectedCheckIn)
    setCheckOut(selectedCheckOut)
    onDateChange?.(selectedCheckIn, selectedCheckOut)
    setShowDateRange(false)
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    onLocationChange?.(selectedLocation)
    setShowLocationSearch(false)
  }

  return (
    <>
      <div className={styles.searchBar}>
        <div className={styles.content}>
          {/* 城市选择按钮 */}
          <button className={styles.cityBtn} onClick={() => setShowCitySearch(true)}>
            <div className={styles.buttonValue}>{city}</div>
          </button>

          {/* 入离时间按钮 */}
          <button className={styles.dateBtn} onClick={() => setShowDateRange(true)}>
            <div className={styles.dateRowUp}>
              <span className={styles.dateLabel}>住</span>
              <span className={styles.dateValue}>
                {checkIn ? dayjs(checkIn).format('M/DD') : '未选择'}
              </span>
            </div>
            <div className={styles.dateRowDown}>
              <span className={styles.dateLabel}>离</span>
              <span className={styles.dateValue}>
                {checkOut ? dayjs(checkOut).format('M/DD') : '未选择'}
              </span>
            </div>
          </button>

          {/* 地址搜索栏 */}
          <button className={styles.locationBtn} onClick={() => setShowLocationSearch(true)}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              className={styles.searchIcon}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className={styles.locationInput}
              placeholder={`${city}的景点，地标，房源`}
              value={location}
              readOnly
              onClick={() => setShowLocationSearch(true)}
            />
          </button>
        </div>
      </div>

      {/* 城市搜索抽屉 */}
      <SlideDrawer
        visible={showCitySearch}
        title="城市搜索"
        direction="up"
        position="bottom"
        onClose={() => setShowCitySearch(false)}
      >
        <CitySearch
          market={market}
          currentCity={city}
          onSelect={handleCitySelect}
          onClose={() => setShowCitySearch(false)}
        />
      </SlideDrawer>

      {/* 日期范围抽屉 */}
      <SlideDrawer
        visible={showDateRange}
        title="选择入离日期"
        direction="up"
        position="bottom"
        onClose={() => setShowDateRange(false)}
      >
        <DateRangeCalendar
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={handleDateSelect}
          onClose={() => setShowDateRange(false)}
        />
      </SlideDrawer>

      {/* 位置搜索抽屉 */}
      <SlideDrawer
        visible={showLocationSearch}
        title="搜索位置"
        direction="up"
        position="bottom"
        onClose={() => setShowLocationSearch(false)}
      >
        <LocationSearch
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationSearch(false)}
        />
      </SlideDrawer>
    </>
  )
}

export default SearchBar