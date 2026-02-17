/**
 * 搜索结果页 - 顶部返回栏 + 搜索条件修改栏
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './index.module.scss'

interface SearchFilters {
  city?: string
  checkInDate?: string
  checkOutDate?: string
  roomCount?: number
  guestCount?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

interface SearchResultHeaderProps {
  filters: SearchFilters
  onModifyClick?: () => void
}

const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({ filters, onModifyClick }) => {
  const navigate = useNavigate()

  const formatCondition = () => {
    const checkIn = filters.checkInDate ? dayjs(filters.checkInDate).format('M.DD') : ''
    const checkOut = filters.checkOutDate ? dayjs(filters.checkOutDate).format('M.DD') : ''
    const roomsText = filters.roomCount ? `${filters.roomCount}间` : ''
    const guestsText = filters.guestCount ? `${filters.guestCount}人` : ''

    return `${filters.city || '城市'} | ${checkIn}-${checkOut}・${roomsText}${guestsText}`
  }

  return (
    <div className={styles.headerWrapper}>
      {/* 顶部返回栏 */}
      <div className={styles.header}>
        {/* 返回按钮 */}
        <button className={styles.backBtn} onClick={() => navigate(-1)} title="返回">
          ‹
        </button>

        {/* 搜索条件区 */}
        <div className={styles.conditionArea} onClick={onModifyClick}>
          <div className={styles.conditionText}>{formatCondition()}</div>
        </div>

        {/* 修改图标 */}
        <button className={styles.modifyBtn} onClick={onModifyClick} title="修改搜索条件">
          🔍
        </button>
      </div>
    </div>
  )
}

export default SearchResultHeader
