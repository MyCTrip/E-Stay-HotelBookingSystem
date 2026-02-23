import React, { useEffect, useRef, useState } from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import RoomDrawerBanner from './RoomDrawerBanner'
import RoomDrawerBasicInfo from './RoomDrawerBasicInfo'
import RoomDrawerFacilities from './RoomDrawerFacilities'
import RoomDrawerPolicy from './RoomDrawerPolicy'
import RoomDrawerPrice from './RoomDrawerPrice'
import RoomPackageDetail from './RoomPackageDetail'
import styles from '../../../../pages/RoomDetail/homeStay/index.module.css'

interface RoomDetailDrawerProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
  isOpen: boolean
  onClose: () => void
  onBook?: (roomId: string) => void
  scrollToFacilities?: boolean
  facilitiesExpanded?: boolean
}

const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({
  spu,
  sku,
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

  const hasPackageDetail = true

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimatingIn(true), 10)

      if (!hasPackageDetail) {
        setActiveTab('room')
      }

      if (scrollToFacilities && facilitiesRef.current && drawerContentRef.current) {
        setTimeout(() => {
          const facilitiesTop = facilitiesRef.current?.offsetTop || 0
          if (drawerContentRef.current) {
            drawerContentRef.current.scrollTop = facilitiesTop
          }
        }, 150)
      }
    } else {
      setIsAnimatingIn(false)
    }
  }, [hasPackageDetail, isOpen, scrollToFacilities])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose()
    }
  }

  const handleBook = () => {
    onBook?.(sku.roomId)
    onClose()
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen && isAnimatingIn ? styles.active : ''}`}
        onClick={handleBackdropClick}
      />

      <div
        className={`${styles.drawer} ${isOpen && isAnimatingIn ? styles.open : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        {hasPackageDetail && (
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'room' ? styles.active : ''}`}
              onClick={() => setActiveTab('room')}
            >
              房型详情
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'package' ? styles.active : ''}`}
              onClick={() => setActiveTab('package')}
            >
              套餐详情
            </button>
          </div>
        )}

        <div className={styles.drawerContent} ref={drawerContentRef}>
          {(activeTab === 'room' || !hasPackageDetail) && (
            <>
              <RoomDrawerBanner spu={spu} sku={sku} showTabHeader={hasPackageDetail} />

              <RoomDrawerBasicInfo spu={spu} sku={sku} />

              <RoomDrawerFacilities
                ref={facilitiesRef}
                spu={spu}
                expandedInitially={facilitiesExpanded}
              />

              <RoomDrawerPolicy spu={spu} sku={sku} />

              <RoomDrawerPrice spu={spu} sku={sku} />

              <div className={styles.drawerSpacer} />
            </>
          )}

          {hasPackageDetail && activeTab === 'package' && <RoomPackageDetail spu={spu} sku={sku} />}
        </div>

        <div className={styles.drawerFooter}>
          <button
            className={styles.bookButton}
            disabled={sku.status === 'sold_out'}
            onClick={handleBook}
          >
            {sku.status === 'sold_out' ? '满房' : '预订'}
          </button>
        </div>
      </div>
    </>
  )
}

export default RoomDetailDrawer
