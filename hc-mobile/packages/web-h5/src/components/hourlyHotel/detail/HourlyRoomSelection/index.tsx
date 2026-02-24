import React, { useState } from 'react'
import type { HourlyRoomDetail } from '../../types'
import RoomCard from '../RoomCard'
import styles from './index.module.scss'

interface RoomViewModel {
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
  data?: { _id?: string }
  onOpenDetail?: (room: HourlyRoomDetail) => void
}

const mockHourlyRooms: RoomViewModel[] = [
  {
    id: 'h1',
    name: 'Superior King Room',
    area: '25sqm',
    beds: '1 x 1.8m King Bed',
    guests: '2 Guests',
    image: 'https://picsum.photos/100/100?random=hourly1',
    price: 90,
    priceNote: '3 hours',
    benefits: ['Window', 'Free WiFi', 'Instant confirmation'],
    packageCount: 2,
  },
  {
    id: 'h2',
    name: 'Twin Room',
    area: '30sqm',
    beds: '2 x 1.2m Single Bed',
    guests: '2 Guests',
    image: 'https://picsum.photos/100/100?random=hourly2',
    price: 120,
    priceNote: '4 hours',
    benefits: ['Window', 'Free WiFi'],
    packageCount: 1,
  },
  {
    id: 'h3',
    name: 'Business King Room',
    area: '35sqm',
    beds: '1 x 1.8m King Bed',
    guests: '2 Guests',
    image: 'https://picsum.photos/100/100?random=hourly3',
    price: 150,
    priceNote: '4 hours',
    benefits: ['High floor', 'Free WiFi', 'Free parking'],
    packageCount: 1,
  },
]

const getDurationFromPriceNote = (priceNote: string): number => {
  const matched = priceNote.match(/\d+/)
  if (!matched) {
    return 3
  }

  const parsed = Number(matched[0])
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3
}

const HourlyRoomSelection: React.FC<HourlyRoomSelectionProps> = ({ data, onOpenDetail }) => {
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedDate] = useState('Today')
  const [selectedTime] = useState('14:00')
  const [selectedDuration] = useState('3 hours')

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId((current) => (current === roomId ? null : roomId))
  }

  const handleViewDetails = (room: RoomViewModel) => {
    if (!onOpenDetail) {
      return
    }

    const duration = getDurationFromPriceNote(room.priceNote)

    const detailData: HourlyRoomDetail = {
      _id: room.id,
      hotelId: data?._id ?? 'temp_hotel_id',
      baseInfo: {
        type: room.name,
        price: room.price,
        images: [room.image],
        maxOccupancy: 2,
        facilities: room.benefits.map((name) => ({ name })),
        windowAvailable: room.benefits.includes('Window'),
      },
      durationOptions: [duration],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onOpenDetail(detailData)
  }

  return (
    <div className={styles.roomSelection}>
      <div className={styles.timeSelectorCard}>
        <div className={styles.timeBlock}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{selectedDate}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.timeBlock}>
          <span className={styles.label}>Arrival</span>
          <span className={styles.value}>{selectedTime}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.timeBlock}>
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>{selectedDuration}</span>
        </div>
        <span className={styles.arrowIcon}>&gt;</span>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Select Room Type</h2>
        <p className={styles.subtitle}>{mockHourlyRooms.length} room types available</p>
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
