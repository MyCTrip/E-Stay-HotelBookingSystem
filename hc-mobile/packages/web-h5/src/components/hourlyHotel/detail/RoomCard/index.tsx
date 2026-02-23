/**
 * 单个房型卡片 - 符合行业规范
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

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
}

interface RoomCardProps {
  room: Room
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails?: (room: Room) => void
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isExpanded,
  onToggleExpand,
  onViewDetails,
}) => {
  const [isCollected, setIsCollected] = useState(false)

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCollected(!isCollected)
  }

  return (
    <div className={styles.card}>
      {/* 标题行 */}
      <div className={styles.titleRow} onClick={onToggleExpand}>
        <h3 className={styles.name}>{room.name}</h3>
        <div className={styles.rightActions}>
          <button
            className={`${styles.collectBtn} ${isCollected ? styles.collected : ''}`}
            onClick={handleCollect}
            title={isCollected ? '已收藏' : '收藏'}
          >
            {isCollected ? '♥' : '♡'}
          </button>
          <button className={styles.toggleBtn}>
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {!isExpanded ? (
        /* 收起态 - 基础信息 */
        <div className={styles.collapsedContent}>
          <div className={styles.imageArea}>
            <img src={room.image} alt={room.name} className={styles.thumbnail} />
          </div>

          <div className={styles.infoArea}>
            {/* 核心参数 - 规范式展示 */}
            <div className={styles.basicInfo}>
              <span className={styles.param}>
                <span className={styles.icon}>📐</span> {room.area}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <span className={styles.icon}>🛏️</span> {room.beds}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <span className={styles.icon}>👥</span> {room.guests}
              </span>
            </div>

            {/* 权益标签 */}
            <div className={styles.benefits}>
              {room.benefits.map((benefit, idx) => (
                <span key={idx} className={styles.benefitTag}>
                  {benefit}
                </span>
              ))}
            </div>

            {/* 价格和按钮 */}
            <div className={styles.footerRow}>
              <div className={styles.priceBlock}>
                <span className={styles.price}>¥{room.price}</span>
                <span className={styles.priceNote}>{room.priceNote}</span>
              </div>
              <button 
                className={styles.bookBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails?.(room)
                }}
              >
                详情
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 展开态 - 详细信息 */
        <div className={styles.expandedContent}>
          {/* 房型多图轮播 */}
          <div className={styles.carousel}>
            <img src={room.image} alt={room.name} className={styles.expandedImage} />
            <span className={styles.imageCount}>1/5</span>
          </div>

          {/* 详细参数 */}
          <div className={styles.detailParams}>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>面积</span>
              <span className={styles.paramValue}>{room.area}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>床型</span>
              <span className={styles.paramValue}>{room.beds}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>人数</span>
              <span className={styles.paramValue}>{room.guests}</span>
            </div>
          </div>

          {/* 价格套餐列表 */}
          <div className={styles.packageList}>
            <h4 className={styles.packageTitle}>
              {room.packageCount}个套餐可选
            </h4>
            {[1, 2, 3].map((pkg) => (
              <div key={pkg} className={styles.packageItem}>
                <div className={styles.pkgHeader}>
                  <span className={styles.pkgName}>套餐{pkg}</span>
                  <span className={styles.pkgPrice}>¥{room.price + pkg * 50}</span>
                </div>
                <div className={styles.pkgDetails}>
                  <span>可订</span>
                  <span>•</span>
                  <span>随时取消</span>
                </div>
                <button
                  className={styles.selectBtn}
                  onClick={() => onViewDetails?.(room)}
                >
                  查看详情
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomCard
