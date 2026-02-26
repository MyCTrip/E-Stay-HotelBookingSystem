import React, { useEffect, useMemo, useState } from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel, PolicyModel, RoomEntityModel } from '@estay/shared'
import { useHotelStore } from '@estay/shared'
import RoomCard from '../RoomCard'
import RoomDetailDrawer from '../RoomDetailDrawer'
import styles from './index.module.scss'

interface RoomSelectionProps {
  hotelId?: string
  data?: { _id?: string } | null
  rooms?: HotelRoomSPUModel[] | RoomEntityModel[]
  displayCount?: number
}

const getSpuKey = (spu: HotelRoomSPUModel, index: number): string =>
  `${spu.spuName}-${spu.skus[0]?.roomId ?? index}`

const isRoomEntityModel = (room: HotelRoomSPUModel | RoomEntityModel): room is RoomEntityModel =>
  'baseInfo' in room && 'headInfo' in room && 'bedInfo' in room

const resolveSkuStatus = (status?: string): HotelRoomSKUModel['status'] =>
  status === 'available' || status === 'approved' ? 'available' : 'sold_out'

const findCancellationRule = (policies?: PolicyModel[]): string => {
  if (!policies || !Array.isArray(policies) || policies.length === 0) {
    return ''
  }

  const cancellationPolicy = policies.find((policy) =>
    policy.policyType.toLowerCase().includes('cancellation')
  )

  if (cancellationPolicy?.summary?.trim()) {
    return cancellationPolicy.summary.trim()
  }

  if (cancellationPolicy?.content?.trim()) {
    return cancellationPolicy.content.replace(/<[^>]*>/g, '').trim()
  }

  return ''
}

const normalizeRoomEntities = (rooms: RoomEntityModel[]): {
  spus: HotelRoomSPUModel[]
  roomById: Map<string, RoomEntityModel>
} => {
  const spuMap = new Map<string, HotelRoomSPUModel>()
  const roomById = new Map<string, RoomEntityModel>()

  rooms.forEach((room, index) => {
    const roomId = room._id ?? `${room.baseInfo.type}-${index}`
    roomById.set(roomId, room)

    const sku: HotelRoomSKUModel = {
      roomId,
      priceInfo: {
        nightlyPrice: room.baseInfo.price,
      },
      status: resolveSkuStatus(room.baseInfo.status),
      cancellationRule: findCancellationRule(room.baseInfo.policies),
    }

    const existingSpu = spuMap.get(room.baseInfo.type)
    if (existingSpu) {
      existingSpu.skus.push(sku)
      existingSpu.startingPrice = Math.min(existingSpu.startingPrice, room.baseInfo.price)
      if (existingSpu.images.length === 0 && room.baseInfo.images.length > 0) {
        existingSpu.images = room.baseInfo.images
      }
      return
    }

    spuMap.set(room.baseInfo.type, {
      spuName: room.baseInfo.type,
      images: room.baseInfo.images,
      headInfo: {
        size: room.headInfo.size,
        floor: room.headInfo.floor,
        wifi: room.headInfo.wifi,
        windowAvailable: room.headInfo.windowAvailable,
        smokingAllowed: room.headInfo.smokingAllowed,
      },
      bedInfo: room.bedInfo,
      startingPrice: room.baseInfo.price,
      skus: [sku],
    })
  })

  const spus = Array.from(spuMap.values()).map((spu) => ({
    ...spu,
    skus: [...spu.skus].sort((left, right) => left.priceInfo.nightlyPrice - right.priceInfo.nightlyPrice),
    startingPrice: Math.min(...spu.skus.map((sku) => sku.priceInfo.nightlyPrice)),
  }))

  return { spus, roomById }
}

const normalizeRooms = (
  rooms?: HotelRoomSPUModel[] | RoomEntityModel[]
): { spus: HotelRoomSPUModel[]; roomById: Map<string, RoomEntityModel> } => {
  if (!rooms || rooms.length === 0) {
    return { spus: [], roomById: new Map<string, RoomEntityModel>() }
  }

  if (isRoomEntityModel(rooms[0])) {
    return normalizeRoomEntities(rooms as RoomEntityModel[])
  }

  return { spus: rooms as HotelRoomSPUModel[], roomById: new Map<string, RoomEntityModel>() }
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ hotelId, data, rooms, displayCount }) => {
  const { roomSPUList, fetchRoomSPUListByHotel, setCurrentSelectedRoomId } = useHotelStore()
  const resolvedHotelId = hotelId || data?._id || ''

  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedSpu, setSelectedSpu] = useState<HotelRoomSPUModel | null>(null)
  const [selectedSku, setSelectedSku] = useState<HotelRoomSKUModel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomEntityModel | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const normalizedRoomData = useMemo(() => normalizeRooms(rooms), [rooms])

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
      return normalizedRoomData.spus
    }

    if (!resolvedHotelId) {
      return []
    }

    return roomSPUList[resolvedHotelId] || []
  }, [normalizedRoomData.spus, resolvedHotelId, roomSPUList, rooms])

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
    setSelectedRoom(normalizedRoomData.roomById.get(resolvedSku.roomId) ?? null)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => {
      setSelectedSpu(null)
      setSelectedSku(null)
      setSelectedRoom(null)
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
              room={normalizedRoomData.roomById.get(spu.skus[0]?.roomId ?? '') ?? null}
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
          room={selectedRoom}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onBook={handleBooking}
        />
      )}
    </div>
  )
}

export default RoomSelection
