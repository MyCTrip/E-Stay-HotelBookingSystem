import React, { useMemo, useState } from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import { useHotelStore } from '@estay/shared'
import RoomCard, { type RoomCardViewModel } from '../RoomCard'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import styles from './index.module.scss'

interface LegacyRoomViewModel extends Omit<RoomCardViewModel, 'skus'> {
  skus?: HotelRoomSKUModel[]
}

interface RoomSelectionProps {
  hotelId?: string
  data?: { _id?: string } | null
  rooms?: LegacyRoomViewModel[]
  displayCount?: number
}

const mapBedText = (spu: HotelRoomSPUModel): string => {
  if (spu.bedInfo.length === 0) {
    return '--'
  }

  return spu.bedInfo
    .map((bed) => `${bed.bedNumber}${bed.bedType}`)
    .join(' | ')
}

const mapGuestText = (spu: HotelRoomSPUModel): string => {
  const bedCount = spu.bedInfo.reduce((total, bed) => total + Math.max(1, bed.bedNumber), 0)
  return bedCount > 0 ? `${bedCount * 2}人` : '--'
}

const mapSPUToRoomCard = (spu: HotelRoomSPUModel, index: number): RoomCardViewModel => ({
  id: spu.skus[0]?.roomId ?? `${spu.spuName}-${index}`,
  name: spu.spuName,
  area: spu.headInfo.size || '--',
  beds: mapBedText(spu),
  guests: mapGuestText(spu),
  image: spu.images[0] || 'https://picsum.photos/240/320?random=room',
  price: spu.startingPrice,
  priceNote: '起',
  benefits: ['免费WiFi'],
  packageCount: spu.skus.length,
  showBreakfastTag: false,
  breakfastCount: 0,
  showCancelTag: true,
  hasPackageDetail: true,
  skus: spu.skus,
})

const normalizeLegacyRoom = (room: LegacyRoomViewModel, index: number): RoomCardViewModel => {
  const packageCount = room.packageCount > 0 ? room.packageCount : 1

  const skus = room.skus && room.skus.length > 0
    ? room.skus
    : Array.from({ length: packageCount }).map((_, skuIndex) => ({
        roomId: `${room.id}-sku-${skuIndex}`,
        priceInfo: {
          nightlyPrice: room.price,
        },
        status: 'available' as const,
        cancellationRule: 'Please follow hotel cancellation policy',
      }))

  return {
    ...room,
    id: room.id || `legacy-room-${index}`,
    skus,
    packageCount: skus.length,
  }
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ hotelId, rooms, displayCount }) => {
  const { roomSPUList, setCurrentSelectedRoomId } = useHotelStore()
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomCardViewModel | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const roomsFromStore = useMemo<RoomCardViewModel[]>(() => {
    if (!hotelId) {
      return []
    }

    const spus = roomSPUList[hotelId] || []
    return spus.map((spu, index) => mapSPUToRoomCard(spu, index))
  }, [hotelId, roomSPUList])

  const roomsToDisplay = useMemo<RoomCardViewModel[]>(() => {
    if (rooms && rooms.length > 0) {
      return rooms.map((room, index) => normalizeLegacyRoom(room, index))
    }
    return roomsFromStore
  }, [rooms, roomsFromStore])

  const itemsToShow =
    displayCount !== undefined ? roomsToDisplay.slice(0, displayCount) : roomsToDisplay

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId)
  }

  const handleViewDetails = (room: RoomCardViewModel) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedRoom(null), 300)
  }

  const handleBooking = (roomId: string) => {
    setCurrentSelectedRoomId(roomId)
  }

  return (
    <div className={styles.roomSelection}>
      <div className={styles.roomList}>
        {itemsToShow.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isExpanded={expandedRoomId === room.id}
            onToggleExpand={() => handleToggleExpand(room.id)}
            onViewDetails={handleViewDetails}
            onOpenDetail={handleViewDetails}
          />
        ))}
      </div>

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
