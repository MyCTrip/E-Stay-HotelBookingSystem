/**
 * 民宿推荐卡片组件
 * 左图右文布局，显示民宿基本信息
 * 遵循规范：
 * - 卡片圆角8-12pt，内边距8-12pt
 * - 图片自适应高度
 * - 不显示评分
 */

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HomeStay } from '@estay/shared'
import { LocationIcon } from './icons'
import styles from './index.module.scss'

interface RecommendCardProps {
  homestay: HomeStay
  onClick?: (homestay: HomeStay) => void
}

const RecommendCard: React.FC<RecommendCardProps> = ({ homestay, onClick }) => {
  const navigate = useNavigate()

  // 计算最低房价
  const minPrice = useMemo(() => {
    if (!homestay.rooms || homestay.rooms.length === 0) {
      return 299 // 默认价格
    }
    return Math.min(...homestay.rooms.map((room) => room.baseInfo?.price || 299))
  }, [homestay.rooms])

  const handleClick = () => {
    if (onClick) {
      onClick(homestay)
    } else {
      navigate(`/hotel-detail/homestay/${homestay._id}`)
    }
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 图片区 */}
      <div className={styles.imageWrapper}>
        <img
          src={homestay.images?.[0] || 'https://via.placeholder.com/160x280'}
          alt={homestay.baseInfo?.nameCn}
          className={styles.image}
        />
      </div>

      {/* 内容区 */}
      <div className={styles.content}>
        {/* 标题 */}
        <h3 className={styles.title}>{homestay.baseInfo?.nameCn}</h3>

        {/* 地址 */}
        <div className={styles.location}>
          <LocationIcon />  
          <span className={styles.locationText}>{homestay.baseInfo?.address}</span>
        </div>

        {/* 标签 */}
        {homestay.baseInfo?.facilities && homestay.baseInfo.facilities.length > 0 && (
          <div className={styles.tags}>
            {homestay.baseInfo.facilities.slice(0, 2).map((facility, index) => {
              let facilityName = '设施'
              if (typeof facility === 'string') {
                facilityName = facility
              } else {
                const f = facility as unknown as Record<string, unknown>
                facilityName = (f.category as string) || (f.summary as string) || '设施'
              }
              return (
                <span key={index} className={styles.tag}>
                  {facilityName}
                </span>
              )
            })}
          </div>
        )}

        {/* 价格 */}
        <div className={styles.footer}>
          <div className={styles.priceInfo}>
            <span className={styles.priceSymbol}>¥</span>
            <span className={styles.price}>{minPrice}</span>
            <span className={styles.priceUnit}>/晚</span>
          </div>
        </div>
      </div>

      {/* 点击热区 */}
      <button
        className={styles.clickZone}
        onClick={handleClick}
        aria-label={`查看 ${homestay.baseInfo?.nameCn} 详情`}
      />
    </div>
  )
}

export default React.memo(RecommendCard)
