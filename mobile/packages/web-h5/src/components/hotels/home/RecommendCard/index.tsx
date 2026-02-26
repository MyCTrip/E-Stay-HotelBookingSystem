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
import type { HomeStayHotel } from '@estay/shared'
import { LocationIcon } from './icons'
import styles from './index.module.scss'

interface RecommendCardProps {
  homestay: HomeStayHotel
  /** 可选的最低价（单位元/晚），优先使用。当后端已计算好起始价时可传入 */
  minPrice?: number
  onClick?: (homestay: HomeStayHotel) => void
}

const RecommendCard: React.FC<RecommendCardProps> = ({ homestay, minPrice, onClick }) => {
  const navigate = useNavigate()

  // 计算最低房价：优先使用传入的 minPrice 或模型中的 startingPrice，
  // 否则再从 rooms 数据中推导，最后才用默认值。
  const computedMinPrice = useMemo(() => {
    if (typeof minPrice === 'number' && minPrice >= 0) {
      return minPrice
    }

    if (typeof (homestay as any).startingPrice === 'number' && (homestay as any).startingPrice >= 0) {
      return (homestay as any).startingPrice
    }

    if (Array.isArray(homestay.rooms) && homestay.rooms.length > 0) {
      const prices = homestay.rooms
        .map((room: any) => {
          const price = room.price?.currentPrice || room.price?.originPrice
          return typeof price === 'number' ? price : 0
        })
        .filter(p => p > 0)
      return prices.length > 0 ? Math.min(...prices) : 299
    }

    return 299 // 默认价格
  }, [homestay.rooms, homestay, minPrice])

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
          alt={homestay.baseInfo?.name}
          className={styles.image}
        />
      </div>

      {/* 内容区 */}
      <div className={styles.content}>
        {/* 标题 */}
        <h3 className={styles.title}>{homestay.baseInfo?.name}</h3>

        {/* 地址 */}
        <div className={styles.location}>
          <LocationIcon />
          <span className={styles.locationText}>{homestay.baseInfo?.address}</span>
        </div>

        {/* 标签 */}
        {homestay.facilities && homestay.facilities.length > 0 && (
          <div className={styles.tags}>
            {homestay.facilities.slice(0, 2).map((facility: any, index: number) => {
              let facilityName = '设施'
              if (typeof facility === 'string') {
                facilityName = facility
              } else if (facility && typeof facility === 'object') {
                facilityName = facility.category || facility.summary || '设施'
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
            <span className={styles.price}>{computedMinPrice}</span>
            <span className={styles.priceUnit}>/晚</span>
          </div>
        </div>
      </div>

      {/* 点击热区 */}
      <button
        className={styles.clickZone}
        onClick={handleClick}
        aria-label={`查看 ${homestay.baseInfo?.name} 详情`}
      />
    </div>
  )
}

export default React.memo(RecommendCard)
