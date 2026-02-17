/**
 * 房型选择区 - 核心转化模块
 */

import React, { useState } from 'react'
import DatePicker from './DatePicker'
import RoomCard from './RoomCard'
import RoomDetailDrawer from './RoomDetailDrawer'
import styles from './RoomSelection.module.scss'

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

interface RoomSelectionProps {
  data: any
}

// 模拟房型数据
const mockRooms = [
  {
    id: '1',
    name: '市景五室二厅套房',
    area: '190㎡',
    beds: '5床 | 1.8m大床',
    guests: '12人',
    image: 'https://picsum.photos/100/100?random=room1',
    price: 1280,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车', '房间内免费WiFi'],
    packageCount: 3,
  },
  {
    id: '2',
    name: '惠选经典三室一厅套房',
    area: '95㎡',
    beds: '3床 | 1.8m大床',
    guests: '6人',
    image: 'https://picsum.photos/100/100?random=room2',
    price: 840,
    priceNote: '含税',
    benefits: ['免费WiFi', '免费停车'],
    packageCount: 2,
  },
  {
    id: '3',
    name: '温馨二室二厅套房',
    area: '95㎡',
    beds: '2床 | 1.8m大床',
    guests: '4人',
    image: 'https://picsum.photos/100/100?random=room3',
    price: 1189,
    priceNote: '含税',
    benefits: ['免费WiFi'],
    packageCount: 1,
  },
]

const RoomSelection: React.FC<RoomSelectionProps> = ({ data }) => {
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId)
  }

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedRoom(null), 300) // 等待动画完成后清除数据
  }

  const handleBooking = (roomId: string) => {
    console.log('预订房型:', roomId)
    // 这里可以添加预订逻辑
  }

  return (
    <div className={styles.roomSelection}>
      {/* 日期选择器 */}
      <DatePicker />

      <div className={styles.header}>
        <h2 className={styles.title}>选择房型</h2>
        <p className={styles.subtitle}>共{mockRooms.length}个房型</p>
      </div>

      <div className={styles.roomList}>
        {mockRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isExpanded={expandedRoomId === room.id}
            onToggleExpand={() => handleToggleExpand(room.id)}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* 房型详情抽屉 */}
      <RoomDetailDrawer
        room={selectedRoom}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onBook={handleBooking}
      />
    </div>
  )
}

export default RoomSelection
