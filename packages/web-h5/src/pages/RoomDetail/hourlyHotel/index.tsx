import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.css'
import RoomDrawerBanner from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBanner'
import RoomDrawerBasicInfo from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerBasicInfo'
import RoomDrawerFacilities from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerFacilities'
import RoomDrawerPolicy from '../../../components/hourlyHotel/detail/RoomDetailDrawer/RoomDrawerPolicy'

export default function RoomDetailHourlyPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()

  // 模拟数据
  const room = {
    id: 'room-001',
    name: '商务大床房',
    area: '35㎡',
    beds: '1张大床',
    guests: '2人',
    image: '',
    price: 288,
    priceNote: '3小时起住',
    benefits: ['免费取消', '秒确认'],
    packageCount: 1,
  }

  const selectedDuration = 3
  const availableTime = '08:00-20:00'

  const handleBook = () => {
    console.log('Booking room:', id)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack}>← 返回</button>
        <h1>房型详情</h1>
      </div>

      <div className={styles.content}>
        <RoomDrawerBanner room={room} />
        
        <RoomDrawerBasicInfo
          room={room}
          duration={selectedDuration}
          availableTime={availableTime}
        />
        
        <RoomDrawerFacilities room={room} />
        
        <RoomDrawerPolicy
          room={room}
          customPolicy={{
            checkInTime: `请在 ${availableTime} 期间办理入住`,
            duration: `本房型限入住 ${selectedDuration} 小时`,
            overtime: '超时将按小时收取额外费用'
          }}
        />
      </div>

      <div className={styles.footer}>
        <button className={styles.bookButton} onClick={handleBook}>
          <span style={{ fontSize: '20px', marginRight: '4px' }}>¥{room.price}</span>
          <span style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.9 }}>/ {selectedDuration}小时</span>
          <span style={{ marginLeft: '12px' }}>立即预订</span>
        </button>
      </div>
    </div>
  )
}