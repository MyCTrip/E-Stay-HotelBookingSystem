import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import styles from './index.module.css'

/**
 * 酒店详情页面
 */
export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const hotelStore = useHotelStore()

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      try {
        await hotelStore.fetchHotelDetail(id || '')
        return hotelStore.currentHotel
      } catch (err) {
        console.error('Failed to fetch hotel:', err)
        return null
      }
    },
    enabled: !!id,
  })

  if (isLoading) {
    return <div className={styles.loading}>加载中...</div>
  }

  if (!hotel) {
    return <div className={styles.error}>酒店不存在或加载失败</div>
  }

  return (
    <div className={styles.container}>
      {/* 图片库 */}
      <section className={styles.gallery}>
        <div className={styles.mainImage}>
          <img
            src={hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/800x400'}
            alt={hotel.baseInfo?.nameCn}
          />
        </div>
        <div className={styles.thumbnails}>
          {hotel.baseInfo?.images?.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Image ${idx}`}
              className={idx === 0 ? styles.active : ''}
            />
          ))}
        </div>
      </section>

      {/* 基本信息 */}
      <section className={styles.info}>
        <div className={styles.header}>
          <div>
            <h1>{hotel.baseInfo?.nameCn}</h1>
            <div className={styles.meta}>
              <span className={styles.stars}>
                {'⭐'.repeat(hotel.baseInfo?.star || 3)}
              </span>
              <span className={styles.address}>{hotel.baseInfo?.address}</span>
            </div>
          </div>
        </div>

        <p className={styles.description}>{hotel.baseInfo?.description}</p>

        {/* 设施信息 */}
        {hotel.baseInfo?.facilities && hotel.baseInfo.facilities.length > 0 && (
          <div className={styles.section}>
            <h2>设施</h2>
            <div className={styles.facilitiesGrid}>
              {hotel.baseInfo.facilities.map((facility: any, idx: number) => (
                <div key={idx} className={styles.facility}>
                  <strong>{facility.category}</strong>
                  <div
                    dangerouslySetInnerHTML={{ __html: facility.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 政策信息 */}
        {hotel.baseInfo?.policies && hotel.baseInfo.policies.length > 0 && (
          <div className={styles.section}>
            <h2>政策</h2>
            <div className={styles.policiesGrid}>
              {hotel.baseInfo.policies.map((policy: any, idx: number) => (
                <div key={idx} className={styles.policy}>
                  <strong>{policy.policyType}</strong>
                  <div
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 入住信息 */}
        {hotel.checkinInfo && (
          <div className={styles.section}>
            <h2>入住信息</h2>
            <div className={styles.checkinInfo}>
              <p>
                <strong>入住时间：</strong> {hotel.checkinInfo.checkinTime}
              </p>
              <p>
                <strong>退房时间：</strong> {hotel.checkinInfo.checkoutTime}
              </p>
            </div>
          </div>
        )}

        <button className={styles.bookButton}>查看房间</button>
      </section>
    </div>
  )
}
