import React, { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useHotelStore } from '@estay/shared'
import styles from './index.module.css'

/**
 * 搜索结果父页面 (只负责提取 URL 参数和提供页面骨架)
 */
export default function SearchResultPage() {
  const [urlParams] = useSearchParams()

  const setSearchParams = useHotelStore(state => state.setSearchParams)
  const fetchHotels = useHotelStore(state => state.fetchHotels)

  const city = urlParams.get('city') || ''
  const checkIn = urlParams.get('checkIn') || ''
  const checkOut = urlParams.get('checkOut') || ''

  useEffect(() => {
    if (!city) return;

    // 1. 同步 URL 参数到全局 Store
    setSearchParams({
      city,
      checkInDate: checkIn || undefined,
      checkOutDate: checkOut || undefined,
      page: 1, 
    });

    // 2. 触发获取酒店列表数据
    fetchHotels({ city, checkInDate: checkIn, checkOutDate: checkOut, page: 1 });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, checkIn, checkOut]);

  if (!city) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>请输入搜索条件</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部搜索状态信息 */}
      <div className={styles.header} style={{ flexShrink: 0, padding: '16px', background: '#fff' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>搜索结果</h1>
        <p style={{ color: '#666', margin: 0 }}>
          {city} {checkIn && checkOut ? `· ${checkIn} 至 ${checkOut}` : ''}
        </p>
      </div>

      {/* 🚀 核心：把剩下的空间全部交给子路由 (也就是咱们的 hotel-list) */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Outlet />
      </div>
    </div>
  )
}