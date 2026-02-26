import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import styles from './index.module.css'

/**
 * 搜索结果页面
 */
export default function SearchResultPage() {
  const [searchParams] = useSearchParams()
  const hotelStore = useHotelStore()
  const propertyType = (hotelStore.searchParams as any)?.propertyType

  const city = searchParams.get('city') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''

  // 从 store 获取酒店数据
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels', { city, checkIn, checkOut, propertyType }],
    queryFn: async () => {
      try {
        // 第一步：先把 URL 上提取到的搜索条件，同步存入 Store
        hotelStore.setSearchParams({ 
          city, 
          checkInDate: checkIn, 
          checkOutDate: checkOut 
        });

        // 第二步：触发网络请求。不需要再传参，它会自动去读取上面刚设置好的条件！
        await hotelStore.fetchHotels();
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>搜索结果</h1>
        <p>
          {city} · {checkIn} 至 {checkOut}
        </p>
      </div>

      {hotels.length === 0 ? (
        <div className={styles.empty}>
          <p>未找到酒店，请尝试调整搜索条件</p>
        </div>
      ) : (
        <div className={styles.hotelList}>
          {hotels.map((hotel: any) => {
            // 破案探照灯：直接把组件拿到的单条酒店数据打印出来！
            console.log("【当前渲染的酒店数据】:", hotel);

            return (
              <Link key={hotel.id || hotel._id} to={`/hotel/${hotel._id}`} className={styles.hotelCard}>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
