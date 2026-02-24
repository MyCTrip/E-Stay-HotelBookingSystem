/**
 * 房型选择区 - 核心转化模块
 */

import React, { useState } from 'react'
import RoomCard from '../RoomCard'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import styles from './index.module.scss'

interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  priceList: Array<{
    packageId: number
    originPrice: number
    currentPrice: number
  }>
  priceNote: string
  benefits: string[]
  packageCount: number
  confirmTime: string
  // 新增属性：早餐和取消标签
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  cancelMunite?: number
  hasPackageDetail?: boolean
  // 套餐列表
  packages?: Array<{
    packageId: number
    name: string
    showPackageDetail?: boolean
    showBreakfastTag?: boolean
    breakfastCount?: number
    showCancelTag?: boolean
    cancelMunite?: number
    showComfirmTag?: boolean
    confirmTime?: number
  }>
}

interface RoomSelectionProps {
  rooms: Room[]  // 必须传入rooms数据，无默认值
  displayCount?: number
  onSelectRoom?: (room: Room) => void
  checkIn?: string    // ISO格式日期，如 '2025-02-25'
  checkOut?: string   // ISO格式日期，如 '2025-02-27'
  // 中间件数据
  facilities?: any[]
  policies?: any[]
  feeInfo?: any
}

// 已删除所有硬编码的 mockRooms 数据

const RoomSelection: React.FC<RoomSelectionProps> = ({ 
  rooms, 
  displayCount, 
  onSelectRoom,
  checkIn,
  checkOut,
  facilities,
  policies,
  feeInfo,
}) => {
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<number | undefined>(undefined)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 类型转换函数：直接使用中间件提供的房间数据，无默认值
  const convertRoom = (room: any): Room => {
    return {
      id: room._id || room.id,
      name: room.name,
      area: room.area,
      beds: room.beds,
      guests: room.guests,
      image: room.image,
      priceList: room.priceList,
      priceNote: room.priceNote,
      benefits: room.benefits,
      packageCount: room.packageCount,
      confirmTime: room.confirmTime,
      hasPackageDetail: room.hasPackageDetail,
      // 映射新增字段
      showBreakfastTag: room.showBreakfastTag,
      breakfastCount: room.breakfastCount,
      showCancelTag: room.showCancelTag,
      cancelMunite: room.cancelMunite,
      // 映射套餐数组
      packages: room.packages,
    }
  }

  // 直接使用传入的 rooms 数据，无默认值
  const convertedRooms = Array.isArray(rooms) ? rooms.map(convertRoom) : []
  // 使用传入的 displayCount，如果没有则显示全部
  const itemsToShow =
    displayCount !== undefined ? convertedRooms.slice(0, displayCount) : convertedRooms

  const handleToggleExpand = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId)
  }

  const handleViewDetails = (room: Room, packageId?: number) => {
    setSelectedRoom(room)
    setSelectedPackageId(packageId)
    setIsDrawerOpen(true)
    onSelectRoom?.(room)
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

      {/* 房型详情抽屉 */}
      <RoomDetailDrawer
        room={selectedRoom}
        selectedPackageId={selectedPackageId}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onBook={handleBooking}
        checkIn={checkIn}
        checkOut={checkOut}
        facilitiesData={facilities}
        policiesData={policies}
        feeInfoData={feeInfo}
      />
    </div>
  )
}

export default RoomSelection
