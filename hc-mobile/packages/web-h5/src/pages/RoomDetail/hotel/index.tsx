import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { calculateNightlyPrice, useHotelStore } from '@estay/shared'
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
    return calculateNightlyPrice(currentRoom, searchParams.checkInDate, searchParams.checkOutDate)
  }, [currentRoom, searchParams.checkInDate, searchParams.checkOutDate])

  if (!currentRoom) {
    return <div className={styles.container}>加载房型详情中...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>酒店房型详情</h1>
        <p>房型ID：{currentRoom.roomId}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>售卖信息</h2>
          <div className={styles.roomInfo}>
            <div className={styles.infoItem}>
              <label>每晚价格</label>
              <span>¥{currentRoom.priceInfo.nightlyPrice}</span>
            </div>
            <div className={styles.infoItem}>
              <label>可订状态</label>
              <span>{currentRoom.status === 'sold_out' ? '已售罄' : '可预订'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>取消规则</label>
              <span>{currentRoom.cancellationRule || '以酒店规则为准'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>库存状态</label>
              <span>{currentRoom.status === 'sold_out' ? '已售罄' : '可预订'}</span>
            </div>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.price}>总价：¥{totalPrice}</div>
          <button
            className={styles.button}
            disabled={currentRoom.status === 'sold_out'}
            onClick={() => navigate(-1)}
          >
            {currentRoom.status === 'sold_out' ? '当前房型已售罄' : '立即预订'}
          </button>
        </div>
      </div>
    </div>
  )
}
