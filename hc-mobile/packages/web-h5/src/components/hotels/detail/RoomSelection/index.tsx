import React, { useEffect, useMemo, useState } from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import { useHotelStore } from '@estay/shared'
import RoomCard from '../RoomCard'
import RoomDetailDrawer from '../RoomDetailDrawer'
import styles from './index.module.scss'

interface RoomSelectionProps {
  hotelId?: string
  data?: { _id?: string } | null
  rooms?: HotelRoomSPUModel[]
  displayCount?: number
}

const getSpuKey = (spu: HotelRoomSPUModel, index: number): string =>
  `${spu.spuName}-${spu.skus[0]?.roomId ?? index}`

const RoomSelection: React.FC<RoomSelectionProps> = ({ hotelId, data, rooms, displayCount }) => {
  const { roomSPUList, fetchRoomSPUListByHotel, setCurrentSelectedRoomId } = useHotelStore()
  const resolvedHotelId = hotelId || data?._id || ''

  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedSpu, setSelectedSpu] = useState<HotelRoomSPUModel | null>(null)
  const [selectedSku, setSelectedSku] = useState<HotelRoomSKUModel | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (!resolvedHotelId || rooms) {
      return
    }

    if (!roomSPUList[resolvedHotelId]) {
      void fetchRoomSPUListByHotel(resolvedHotelId)
    }
  }, [fetchRoomSPUListByHotel, resolvedHotelId, roomSPUList, rooms])

  const spus = useMemo<HotelRoomSPUModel[]>(() => {
    if (rooms && rooms.length > 0) {
      return rooms
    }

    if (!resolvedHotelId) {
      return []
    }

    return roomSPUList[resolvedHotelId] || []
  }, [resolvedHotelId, roomSPUList, rooms])

  const itemsToShow = displayCount !== undefined ? spus.slice(0, displayCount) : spus

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId((current) => (current === roomId ? null : roomId))
  }

  const handleViewDetails = (spu: HotelRoomSPUModel, sku: HotelRoomSKUModel | null) => {
    const resolvedSku =
      sku ?? spu.skus.find((item) => item.status === 'available') ?? spu.skus[0] ?? null

    if (!resolvedSku) {
      return
    }

    setCurrentSelectedRoomId(resolvedSku.roomId)
    setSelectedSpu(spu)
    setSelectedSku(resolvedSku)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => {
      setSelectedSpu(null)
      setSelectedSku(null)
    }, 300)
  }

  const handleBooking = (roomId: string) => {
    setCurrentSelectedRoomId(roomId)
  }

  return (
    <div className={styles.roomSelection}>
      <div className={styles.roomList}>
        {itemsToShow.map((spu, index) => {
          const roomKey = getSpuKey(spu, index)

          return (
            <RoomCard
              key={roomKey}
              spu={spu}
              isExpanded={expandedRoomId === roomKey}
              onToggleExpand={() => handleToggleExpand(roomKey)}
              onViewDetails={handleViewDetails}
              onOpenDetail={handleViewDetails}
            />
          )
        })}
      </div>

      {selectedSpu && selectedSku && (
        <RoomDetailDrawer
          spu={selectedSpu}
          sku={selectedSku}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onBook={handleBooking}
        />
      )}
    </div>
  )
}

export default RoomSelection
