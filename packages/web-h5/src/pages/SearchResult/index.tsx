import React, { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useHotelStore } from '@estay/shared'
import styles from './index.module.css'

/**
 * 搜索结果父页面 (只负责提取 URL 参数和提供页面骨架)
 */
export default function SearchResultPage() {
  const [searchParams] = useSearchParams()
  const hotelStore = useHotelStore()
  const propertyType = (hotelStore.searchParams as any)?.propertyType

  const setSearchParams = useHotelStore(state => state.setSearchParams)
  const fetchHotels = useHotelStore(state => state.fetchHotels)

  // 从 store 获取酒店数据
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels', { city, checkIn, checkOut, propertyType }],
    queryFn: async () => {
      try {
        await hotelStore.fetchHotels({ city, checkIn, checkOut })
        return hotelStore.hotels
      } catch (err) {
        console.error('Failed to fetch hotels:', err)
        return []
      }
    },
    enabled: !!city,
  })

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

      {hotels.length === 0 ? (
        <div className={styles.empty}>
          <p>未找到酒店，请尝试调整搜索条件</p>
        </div>
      ) : (
        <div className={styles.hotelList}>
          {hotels.map((hotel: any) => (
            <Link key={hotel._id} to={`/hotel/${hotel._id}`} className={styles.hotelCard}>
              <div className={styles.image}>
                <img
                  src={hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={hotel.baseInfo?.nameCn}
                />
              </div>
              <div className={styles.content}>
                <h3>{hotel.baseInfo?.nameCn}</h3>
                <div className={styles.rating}>
                  <span className={styles.stars}>{'⭐'.repeat(hotel.baseInfo?.star || 3)}</span>
                  <span className={styles.star}>{hotel.baseInfo?.star} 星</span>
                </div>
                <p className={styles.address}>{hotel.baseInfo?.address}</p>
                <p className={styles.description}>{hotel.baseInfo?.description}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>¥{hotel.baseInfo?.price || '0'}/晚</span>
                  <span className={styles.cta}>查看详情 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}