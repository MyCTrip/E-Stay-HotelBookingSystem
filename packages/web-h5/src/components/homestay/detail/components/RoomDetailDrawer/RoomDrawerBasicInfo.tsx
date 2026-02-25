/**
 * 房型基础信息和床型信息
 */

import React from 'react'
import styles from './RoomDrawerBasicInfo.module.scss'

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
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ room }) => {
  return (
    <div className={styles.basicInfo}>
      {/* 房型标题 */}
      <div className={styles.titleSection}>
        <h2 className={styles.roomName}>{room.name}</h2>
        <div className={styles.noBreakfast}>无早餐</div>
      </div>

      {/* 基本参数 - 横排展示 */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📏</span>
          <span className={styles.statLabel}>公寓</span>
          <span className={styles.statValue}>{room.area}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>🛏️</span>
          <span className={styles.statLabel}>房间数</span>
          <span className={styles.statValue}>3间</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>👥</span>
          <span className={styles.statLabel}>最多入住</span>
          <span className={styles.statValue}>{room.guests}</span>
        </div>
      </div>

      {/* 床型详情表格 */}
      <div className={styles.bedSection}>
        <h3 className={styles.sectionTitle}>床型详情</h3>
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

      {/* 权益标签 */}
      {room.benefits && room.benefits.length > 0 && (
        <div className={styles.benefitsSection}>
          <h3 className={styles.sectionTitle}>房型权益</h3>
          <div className={styles.benefitsList}>
            {room.benefits.map((benefit, idx) => (
              <span key={idx} className={styles.benefitTag}>
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomDrawerBasicInfo
