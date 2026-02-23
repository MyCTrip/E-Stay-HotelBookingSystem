import React from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import { AreaIcon, BedIcon, BreakfastIcon, HouseIcon, UserIcon } from '../../../icons'
import styles from './index.module.scss'

interface RoomDrawerBasicInfoProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ spu, sku }) => {
  const bedCount = spu.bedInfo.reduce((sum, item) => sum + item.bedNumber, 0)
  const showBreakfastInfo = false
  const bedRows = spu.bedInfo.map((item, index) => ({
    room: `卧室${index + 1}`,
    bed: item.bedType,
    size: item.bedSize,
    qty: `${item.bedNumber}`,
  }))

  return (
    <div className={styles.basicInfo}>
      <div className={styles.titleSection}>
        <h2 className={styles.roomName}>{spu.spuName}</h2>
        {showBreakfastInfo ? (
          <div className={styles.Breakfast}>
            <div className={styles.BreakfastIcon}>
              <BreakfastIcon width={20} height={20} color="#333333" />
            </div>
            {null}
          </div>
        ) : null}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <AreaIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{spu.headInfo.size || null}</span>
            <span className={styles.statLabel}>面积</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <HouseIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{spu.headInfo.floor || null}</span>
            <span className={styles.statLabel}>楼层</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <BedIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{bedCount > 0 ? bedCount : null}</span>
            <span className={styles.statLabel}>床位</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <UserIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{null}</span>
            <span className={styles.statLabel}>{sku.status === 'sold_out' ? '满房' : '可订'}</span>
          </div>
        </div>
      </div>

      <div className={styles.bedSection}>
        <div className={styles.bedTable}>
          <div className={styles.bedTableHeader}>
            <span className={styles.col1}>卧室</span>
            <span className={styles.col2}>床型</span>
            <span className={styles.col3}>尺寸</span>
            <span className={styles.col4}>数量</span>
          </div>

          <div className={styles.bedTableBody}>
            {bedRows.map((item, idx) => (
              <div key={idx} className={styles.bedTableRow}>
                <span className={styles.col1}>{item.room}</span>
                <span className={styles.col2}>{item.bed || null}</span>
                <span className={styles.col3}>{item.size || null}</span>
                <span className={styles.col4}>{item.qty || null}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerBasicInfo
