/**
 * 钟点房房型选择区 - 核心转化模块
 */
import React, { useState } from 'react'
import RoomCard from '../RoomCard'
import styles from './index.module.scss'

// 🌟 1. 引入共享类型
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
  // 🌟 2. 接收外部传入的打开抽屉方法
  onOpenDetail?: (room: HourlyRoomDetail) => void
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
    packageCount: 2,
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
  {
    id: 'h3',
    name: '商务大床房',
    area: '35㎡',
    beds: '1张1.8m大床',
    guests: '2人',
    image: 'https://picsum.photos/100/100?random=hourly3',
    price: 150,
    priceNote: '4小时',
    benefits: ['高楼层', '免费WiFi', '免费停车'],
    packageCount: 1,
  },
]

const HourlyRoomSelection: React.FC<HourlyRoomSelectionProps> = ({ data, onOpenDetail }) => {
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState('02月20日 (今天)')
  const [selectedTime, setSelectedTime] = useState('14:00')
  const [selectedDuration, setSelectedDuration] = useState('3小时')

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId)
  }

  // 🌟 3. 处理点击详情，将本地 Room 结构转为标准的 HourlyRoomDetail 传给父组件
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
          // 临时将字符串转为对象，兼容 facility 类型
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
      <div className={styles.timeSelectorCard}>
        <div className={styles.timeBlock}>
          <span className={styles.label}>入住日期</span>
          <span className={styles.value}>{selectedDate}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.timeBlock}>
          <span className={styles.label}>预计到店</span>
          <span className={styles.value}>{selectedTime}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.timeBlock}>
          <span className={styles.label}>入住时长</span>
          <span className={styles.value}>{selectedDuration}</span>
        </div>
        <span className={styles.arrowIcon}>&gt;</span>
      </div>

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
            // 修改这里：调用转换函数
            onViewDetails={() => handleViewDetails(room)}
          />
        ))}
      </div>

      {/* 🌟 4. 彻底删除这里的 RoomDetailDrawer，因为已经在 HotelDetail 页面统一渲染了！ */}
    </div>
  )
}

export default HourlyRoomSelection