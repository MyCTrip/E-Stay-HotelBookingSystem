import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHotelStore } from '@estay/shared'
import styles from './index.module.css'

export default function RoomDetailHotelPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { currentRoom, searchParams, fetchRoomDetail } = useHotelStore()

  useEffect(() => {
    if (!id) {
      return
    }
    void fetchRoomDetail(id)
  }, [fetchRoomDetail, id])

  const totalPrice = useMemo(() => {
    if (!currentRoom) {
      return 0
    }
    // 计算晚数
    const checkIn = new Date(searchParams.checkInDate)
    const checkOut = new Date(searchParams.checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const nightlyPrice = (currentRoom as any).price?.currentPrice || (currentRoom as any).price?.originPrice || 0
    return nightlyPrice * nights
  }, [currentRoom, searchParams.checkInDate, searchParams.checkOutDate])

  if (!currentRoom) {
    return <div className={styles.container}>加载房型详情中...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>房型详情</h1>
        <p>房型ID：{(currentRoom as any)._id || (currentRoom as any).roomId || '未知'}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>房间信息</h2>
          <div className={styles.roomInfo}>
            <div className={styles.infoItem}>
              <label>房型名称</label>
              <span>{(currentRoom as any).basicInfo?.name || '未知房型'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>每晚价格</label>
              <span>¥{(currentRoom as any).price?.currentPrice || (currentRoom as any).price?.originPrice || '0'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>原价</label>
              <span>¥{(currentRoom as any).price?.originPrice || '0'}</span>
            </div>
            {(currentRoom as any).headInfo && (
              <div className={styles.infoItem}>
                <label>房间大小</label>
                <span>{(currentRoom as any).headInfo.size || '未知'}m²</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.price}>总价：¥{totalPrice}</div>
          <button
            className={styles.button}
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  )
}
