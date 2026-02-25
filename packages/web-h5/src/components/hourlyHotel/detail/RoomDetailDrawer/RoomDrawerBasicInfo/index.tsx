/**
 * 房型详情弹窗 - 基础信息组件 (携程风格网格)
 */
import React from 'react'
import styles from './index.module.scss'
import { HourlyRoomDetail } from '@estay/shared'

interface RoomDrawerBasicInfoProps {
  room: HourlyRoomDetail | null // 🌟 1. 建议类型加上 null，因为初始状态可能是空
  duration: number
  availableTime: string
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ room, duration, availableTime }) => {
  // 🌟 2. 核心修复：增加判空拦截。如果 room 或 baseInfo 不存在，直接不渲染任何内容
  if (!room || !room.baseInfo) {
    return null
  }

  const base = room.baseInfo

  // 使用类型断言访问扩展字段
  const extendedBase = base as any;

  return (
    <div className={styles.container}>
      {/* 房型标题 */}
      <h2 className={styles.title}>{base.type}</h2>

      {/* 可住时段提示 */}
      <div className={styles.timeInfo}>
        <span className={styles.timeLabel}>🕒 可住时段: {availableTime}，连住{duration}小时</span>
        <span className={styles.detailLink}>详情 ∨</span>
      </div>

      {/* 五列核心设施网格 */}
      <div className={styles.facilityGrid}>
        <div className={styles.gridItem}>
          <span className={styles.icon}>📐</span>
          <span className={styles.label}>{extendedBase.area || '25-30'}m²</span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.icon}>🏢</span>
          <span className={styles.label}>{extendedBase.floor || '2-5'}层</span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.icon}>📶</span>
          <span className={styles.label}>
            Wi-Fi <span className={styles.highlight}>免费</span>
          </span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.icon}>🪟</span>
          <span className={styles.label}>{base.windowAvailable ? '有窗' : '无窗'}</span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.icon}>🚭</span>
          <span className={styles.label}>禁烟</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* 床型信息行 */}
      <div className={styles.bedInfoRow}>
        <span className={styles.bedIcon}>🛏️</span>
        <div className={styles.bedContent}>
          <div className={styles.bedTitle}>{extendedBase.bedType || '1张大床1.8米'}</div>
          <div className={styles.bedSub}>成人加床: 该房型不可加床</div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerBasicInfo