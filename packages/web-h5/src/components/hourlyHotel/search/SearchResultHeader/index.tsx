/**
 * 搜索结果页 - 顶部返回栏 + 搜索条件修改栏 (多业务线通用版)
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './index.module.scss'

// 1. 扩展 Filter 接口，兼容所有业务线 (酒店/民宿/钟点房)
export interface SearchFilters {
  city?: string
  date?: string // 兼容部分钟点房用 date 传参
  checkInDate?: string
  checkOutDate?: string
  roomCount?: number
  guestCount?: number
  duration?: number // 钟点房特有：时长
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

  // 2. 智能格式化函数
  const formatCondition = () => {
    const city = filters.city || '城市'
    // 兼容取值：优先拿 checkInDate，如果没有就拿 date
    const targetCheckIn = filters.checkInDate || filters.date
    const checkIn = targetCheckIn ? dayjs(targetCheckIn).format('M.DD') : ''

    // 【钟点房模式】如果没有退房日期，说明是单日预订 (如钟点房)
    if (!filters.checkOutDate) {
      // 可选：如果想显示时长可以加上 `· ${filters.duration}小时`
      return `${city} | ${checkIn}`
    }

    // 【普通酒店/民宿模式】有退房日期
    const checkOut = dayjs(filters.checkOutDate).format('M.DD')
    const roomsText = filters.roomCount ? `${filters.roomCount}间` : ''
    const guestsText = filters.guestCount ? `${filters.guestCount}人` : ''

    // 如果没有房间和人数信息，就不显示中间的 "・"
    const suffix = (roomsText || guestsText) ? `・${roomsText}${guestsText}` : ''

    return `${city} | ${checkIn}-${checkOut}${suffix}`
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