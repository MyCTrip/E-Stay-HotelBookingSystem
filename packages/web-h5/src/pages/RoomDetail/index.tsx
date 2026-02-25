import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import { AreaIcon } from '../../components/homestay/icons'
import styles from './index.module.css'

/**
 * 房型详情页面
 */
export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const hotelStore = useHotelStore()

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      try {
        await hotelStore.fetchRoomDetail(id || '')
        return hotelStore.currentRoom
      } catch (err) {
        console.error('Failed to fetch room:', err)
        return null
      }
    },
    enabled: !!id,
  })

  if (isLoading) {
    return <div className={styles.loading}>加载中...</div>
  }

  if (!room) {
    return <div className={styles.error}>房间不存在或加载失败</div>
  }

  // 为联合类型添加类型转换，以支持 Room 和 HotelRoomSKUModel
  const roomData = room as any

  return (
    <div className={styles.container}>
      {/* 图片 */}
      <section className={styles.gallery}>
        <img
          src={roomData.banner?.images?.[0]?.url || 'https://via.placeholder.com/800x400'}
          alt={roomData.basicInfo?.name}
          className={styles.mainImage}
        />
      </section>

      {/* 房间信息 */}
      <section className={styles.info}>
        <div className={styles.header}>
          <div>
            <h1>{roomData.basicInfo?.name}</h1>
            <p className={styles.price}>¥{roomData.price?.currentPrice || roomData.price?.originPrice}/晚</p>
          </div>
        </div>

        {/* 客容量 */}
        <div className={styles.section}>
          <h2>客容量</h2>
          <p>最多可容纳 {roomData.basicInfo?.guests} 位客人</p>
        </div>

        {/* 房间信息 */}
        {roomData.headInfo && (
          <div className={styles.section}>
            <h2>房间设施</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span>
                  <AreaIcon width={14} height={14} color="#333333" /> 房间大小
                </span>
                <strong>{roomData.headInfo.size}</strong>
              </div>
              {roomData.headInfo.floor && (
                <div className={styles.feature}>
                  <span>📍 所在楼层</span>
                  <strong>{roomData.headInfo.floor}</strong>
                </div>
              )}
              <div className={styles.feature}>
                <span>{roomData.headInfo.wifi ? '📡' : '❌'} WiFi</span>
                <strong>{roomData.headInfo.wifi ? '有' : '无'}</strong>
              </div>
              <div className={styles.feature}>
                <span>{roomData.headInfo.windowAvailable ? '🪟' : '❌'} 窗户</span>
                <strong>{roomData.headInfo.windowAvailable ? '有' : '无'}</strong>
              </div>
              <div className={styles.feature}>
                <span>🚭 吸烟</span>
                <strong>{roomData.headInfo.smokingAllowed ? '允许' : '不允许'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 床位信息 */}
        {roomData.bedInfo && roomData.bedInfo.length > 0 && (
          <div className={styles.section}>
            <h2>床位信息</h2>
            {roomData.bedInfo.map((bed: any, idx: number) => (
              <div key={idx} className={styles.bedItem}>
                <strong>{bed.bedType}</strong>
                <p>
                  数量: {bed.bedNumber} | 尺寸: {bed.bedSize}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 早餐信息 */}
        {roomData.breakfastInfo && (
          <div className={styles.section}>
            <h2>早餐</h2>
            <p>{roomData.breakfastInfo.breakfastType}</p>
          </div>
        )}

        <button className={styles.bookButton}>立即预订</button>
      </section>
    </div>
  )
}
