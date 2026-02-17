/**
 * 民宿卡片组件 - 瀑布流布局专用
 * 支持收藏、价格对比、用户评价等功能
 */

import React, { useState } from 'react'
import type { HomeStay } from '@estay/shared'
import styles from './index.module.scss'

interface HomeStayCardProps {
  data: HomeStay
  onClick?: (id: string) => void
  onFavorite?: (id: string, favorited: boolean) => void
  showStar?: boolean
  isFavorited?: boolean
}

const HomeStayCard: React.FC<HomeStayCardProps> = ({
  data,
  onClick,
  onFavorite,
  showStar = true,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  const primaryImage = data.images?.[0] || null
  const roomPrice = data.rooms?.[0]?.baseInfo?.price || 358 // 模拟价格
  const originalPrice = Math.ceil(roomPrice * 1.5) // 模拟原价
  const discount = Math.round(((originalPrice - roomPrice) / originalPrice) * 100)
  const reviewCount = Math.floor(Math.random() * 5000) + 500 // 模拟评论数

  const handleCardClick = () => {
    onClick?.(data._id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorited(!favorited)
    onFavorite?.(data._id, !favorited)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={styles.waterlineCard} onClick={handleCardClick}>
      {/* 图片容器 */}
      <div className={styles.imageContainer}>
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={data.baseInfo.nameCn}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}

        {/* 收藏按钮 */}
        <button
          className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? '取消收藏' : '收藏'}
        >
          ♡
        </button>

        {/* 热门标签 */}
        {discount > 0 && (
          <div className={styles.hotBadge}>网红热酒</div>
        )}
      </div>

      {/* 信息容器 */}
      <div className={styles.infoContainer}>
        {/* 位置信息 */}
        <div className={styles.locationRow}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.locationText}>
            {data.baseInfo.city} · {data.baseInfo.address.substring(0, 15)}
          </span>
        </div>

        {/* 标题 */}
        <h3 className={styles.title}>{data.baseInfo.nameCn}</h3>

        {/* 价格区域 */}
        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>¥{roomPrice}</span>
            {originalPrice > roomPrice && (
              <span className={styles.originalPrice}>¥{originalPrice}</span>
            )}
          </div>
        </div>

        {/* 评价区域 */}
        <div className={styles.ratingRow}>
          {showStar && data.baseInfo.star > 0 && (
            <span className={styles.rating}>
              ⭐ {data.baseInfo.star}
            </span>
          )}
          <span className={styles.reviewCount}>{reviewCount}+ 人赞同</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HomeStayCard)
