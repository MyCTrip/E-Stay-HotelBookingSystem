/**
 * 房型详情抽屉栏 - 底部上滑展示房型完整信息
 */

import React, { useState, useEffect, useRef } from 'react'
import styles from './index.module.css'
import RoomDrawerBanner from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBanner'
import RoomDrawerBasicInfo from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerBasicInfo'
import RoomDrawerFacilities from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerFacilities'
import RoomDrawerPolicy from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPolicy'
import RoomDrawerPrice from '../../../components/homestay/detail/RoomDetailDrawer/RoomDrawerPrice'
import RoomPackageDetail from '../../../components/homestay/detail/RoomDetailDrawer/RoomPackageDetail'

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
  hasPackageDetail?: boolean
}

interface RoomDetailDrawerProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onBook?: (roomId: string) => void
  scrollToFacilities?: boolean
  facilitiesExpanded?: boolean
}

const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({ 
  room, 
  isOpen, 
  onClose, 
  onBook,
  scrollToFacilities = false,
  facilitiesExpanded = false,
}) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'room' | 'package'>('room')
  const facilitiesRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // 延迟一帧以触发动画
      setTimeout(() => setIsAnimatingIn(true), 10)
      
      // 如果房间没有套餐详情，强制使用room tab
      if (!room?.hasPackageDetail) {
        setActiveTab('room')
      }
      
      // 如果需要定位到设施组件
      if (scrollToFacilities && facilitiesRef.current && drawerContentRef.current) {
        setTimeout(() => {
          const facilitiesTop = facilitiesRef.current?.offsetTop || 0
          if (drawerContentRef.current) {
            drawerContentRef.current.scrollTop = facilitiesTop
          }
        }, 150) // 等待动画完成后再滚动
      }
    } else {
      setIsAnimatingIn(false)
    }
  }, [isOpen, scrollToFacilities, room?.hasPackageDetail])

  if (!room) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose()
    }
  }

  const handleBook = () => {
    onBook?.(room.id)
    onClose()
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`}
        onClick={handleBackdropClick}
      />

      {/* 抽屉容器 */}
      <div
        className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Tab Header 切换 - 仅在有套餐详情时显示*/}
        {room?.hasPackageDetail && (
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'room' ? styles.active : ''}`}
              onClick={() => setActiveTab('room')}
            >
              房屋详情
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'package' ? styles.active : ''}`}
              onClick={() => setActiveTab('package')}
            >
              套餐详情
            </button>
          </div>
        )}

        {/* 内容区 - 可滚动 */}
        <div className={styles.drawerContent} ref={drawerContentRef}>
          {/* 房屋详情 内容 - 总是显示或通过tab切换 */}
          {(activeTab === 'room' || !room?.hasPackageDetail) && (
            <>
              {/* 房型图片 */}
              <RoomDrawerBanner room={room} showTabHeader={Boolean(room?.hasPackageDetail)} />

              {/* 基础信息和床型 */}
              <RoomDrawerBasicInfo room={room} />

              {/* 设施服务 */}
              <RoomDrawerFacilities 
                ref={facilitiesRef}
                room={room} 
                expandedInitially={facilitiesExpanded}
              />

              {/* 政策信息 */}
              <RoomDrawerPolicy room={room} />

              {/* 价格与优惠 */}
              <RoomDrawerPrice room={room} />

              {/* 底部间距 */}
              <div className={styles.drawerSpacer} />
            </>
          )}

          {/* 套餐详情 Tab - 仅在有套餐详情时显示 */}
          {room?.hasPackageDetail && activeTab === 'package' && (
            <RoomPackageDetail room={room} />
          )}
        </div>
      </div>
    </>
  )
}

export default RoomDetailDrawer
