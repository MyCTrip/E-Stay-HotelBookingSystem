/**
 * 房型基础信息和床型信息
 */

import React from 'react'
import { HouseIcon, UserIcon, AreaIcon, BedIcon, BreakfastIcon } from '../../../icons'
import styles from './index.module.scss'

interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  benefits: string[]
  [key: string]: any
}

interface RoomDrawerBasicInfoProps {
  room: Room
  actualRoomName?: string
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ room, actualRoomName }) => {
  const displayRoomName = actualRoomName || room.name
  return (
    <div className={styles.basicInfo}>
      {/* 房型标题 */}
      <div className={styles.titleSection}>
        <h2 className={styles.roomName}>{displayRoomName}</h2>
        <div className={styles.Breakfast}>
          <div className={styles.BreakfastIcon}>
            <BreakfastIcon width={20} height={20} color="#333333" />
          </div>
          无早餐
        </div>
      </div>

      {/* 基本参数 - 横排展示 */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <AreaIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>公寓•{room.area}</span>
            <span className={styles.statLabel}>整套房屋</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <HouseIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>3卧1厅2卫1厨</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <BedIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>5床</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <UserIcon width={20} height={20} color="#333333" />
          </span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{room.guests}</span>
          </div>
        </div>
      </div>

      {/* 床型详情表格 */}
      <div className={styles.bedSection}>
        <div className={styles.bedTable}>
          <div className={styles.bedTableHeader}>
            <span className={styles.col1}>卧室</span>
            <span className={styles.col2}>床型</span>
            <span className={styles.col3}>尺寸</span>
            <span className={styles.col4}>数量</span>
          </div>

          <div className={styles.bedTableBody}>
            {[
              { room: '卧室1', bed: '大床', size: '1.8m', qty: '1张' },
              { room: '卧室2', bed: '大床', size: '1.5m', qty: '2张' },
              { room: '卧室3', bed: '大床', size: '1.5m', qty: '1张' },
            ].map((item, idx) => (
              <div key={idx} className={styles.bedTableRow}>
                <span className={styles.col1}>{item.room}</span>
                <span className={styles.col2}>{item.bed}</span>
                <span className={styles.col3}>{item.size}</span>
                <span className={styles.col4}>{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerBasicInfo
