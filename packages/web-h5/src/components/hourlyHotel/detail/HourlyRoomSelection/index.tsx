/**
 * 钟点房房型选择区 - 核心转化模块
 */
import React, { useState } from 'react'
import RoomCard from '../RoomCard'
// 🌟 删除了 HourlyTimePicker 和 dayjs 的引入
import styles from './index.module.scss'

import { HourlyRoomDetail } from '@estay/shared'

interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  price: number
  priceNote: string
  benefits: string[]
  packageCount: number
}

interface HourlyRoomSelectionProps {
  data: any
  onOpenDetail?: (room: HourlyRoomDetail) => void
  // 💡 预留：如果你想让房型卡片上的文字跟着上面选的时间变化，可以把 duration 传进来
  // selectedDuration?: number 
}

const mockHourlyRooms: Room[] = [
  {
    id: 'h1',
    name: '高级大床房',
    area: '25㎡',
    beds: '1张1.8m大床',
    guests: '2人',
    image: 'https://picsum.photos/100/100?random=hourly1',
    price: 90,
    priceNote: '3小时',
    benefits: ['有窗', '免费WiFi', '秒确认'],
    packageCount: 1,
  },
  {
    id: 'h2',
    name: '精选双床房',
    area: '30㎡',
    beds: '2张1.2m单人床',
    guests: '2人',
    image: 'https://picsum.photos/100/100?random=hourly2',
    price: 120,
    priceNote: '4小时',
    benefits: ['有窗', '免费WiFi'],
    packageCount: 1,
  },
]

const HourlyRoomSelection: React.FC<HourlyRoomSelectionProps> = ({ data, onOpenDetail }) => {
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)

  // 🌟 删除了 selectedDate, selectedTime, selectedDuration 和 handleTimeChange

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId)
  }

  const handleViewDetails = (room: Room) => {
    if (onOpenDetail) {
      const detailData: HourlyRoomDetail = {
        _id: room.id,
        hotelId: data?._id || 'temp_hotel_id',
        baseInfo: {
          type: room.name,
          price: room.price,
          images: [room.image],
          maxOccupancy: parseInt(room.guests) || 2,
          facilities: room.benefits.map(b => ({ name: b })) as any,
          windowAvailable: room.benefits.includes('有窗'),
        },
        durationOptions: [parseInt(room.priceNote) || 3],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      onOpenDetail(detailData)
    }
  }

  return (
    <div className={styles.roomSelection}>

      {/* 🌟 删除了这里的 <HourlyTimePicker />，只保留头部的标题 */}

      <div className={styles.header}>
        <h2 className={styles.title}>选择房型</h2>
        <p className={styles.subtitle}>共 {mockHourlyRooms.length} 个房型符合条件</p>
      </div>

      <div className={styles.roomList}>
        {mockHourlyRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isExpanded={expandedRoomId === room.id}
            onToggleExpand={() => handleToggleExpand(room.id)}
            onViewDetails={() => handleViewDetails(room)}
          />
        ))}
      </div>
    </div>
  )
}

export default HourlyRoomSelection