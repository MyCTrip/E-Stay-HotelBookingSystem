import React, { useState } from 'react'
import type { HotelDomainModel } from '@estay/shared'
import styles from './index.module.scss'

interface HotelCardProps {
  data: HotelDomainModel
  onClick?: (id: string) => void
  onFavorite?: (id: string, favorited: boolean) => void
  showStar?: boolean
  isFavorited?: boolean
  startingPrice?: number
}

const CURRENCY_SYMBOL = '\u00A5'

const HotelCard: React.FC<HotelCardProps> = ({
  data,
  onClick,
  onFavorite,
  showStar = true,
  isFavorited = false,
  startingPrice = 0,
}) => {
  const [imageError, setImageError] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  // 🌟 核心修复区：穿上“防弹衣”，无视 TS 报错，安全提取所有可能缺失的字段
  const safeData = data as any
  const baseInfo = safeData.baseInfo || {}

  // 1. 安全提取名称
  const hotelName = baseInfo.nameCn || baseInfo.nameEn || baseInfo.name || '未知酒店'
  
  // 2. 安全提取 ID (兼容真实后端的 _id 和 mock 的 id)
  const hotelId = safeData.id || safeData._id

  // 3. 安全提取评分和评论数
  const ratingScore = safeData.rating?.score ?? baseInfo.star ?? 4.8
  const reviewCount = Math.max(0, safeData.rating?.count ?? safeData.baseInfo?.rating?.count ?? 128)

  // 4. 安全提取 market
  const market = safeData.market || 'domestic'

  const primaryImage = baseInfo.images?.[0] || null
  const roomPrice = Math.max(0, startingPrice)
  const originalPrice = roomPrice > 0 ? Math.ceil(roomPrice * 1.2) : 0
  const discount =
    originalPrice > roomPrice ? Math.round(((originalPrice - roomPrice) / originalPrice) * 100) : 0

  const handleCardClick = () => {
    if (hotelId) onClick?.(hotelId)
  }

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!hotelId) return
    const nextFavorited = !favorited
    setFavorited(nextFavorited)
    onFavorite?.(hotelId, nextFavorited)
  }

  return (
    <div className={styles.waterlineCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={hotelName}
            className={styles.image}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}

        <button
          className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? '\u53d6\u6d88\u6536\u85cf' : '\u6536\u85cf'}
        >
          {'\u2665'}
        </button>

        {/* 修复：使用提取好的 ratingScore */}
        {(discount > 0 || ratingScore >= 4.8) && (
          <div className={styles.hotBadge}>{'\u7f51\u7ea2\u70ed\u95e8'}</div>
        )}
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.locationRow}>
          <span className={styles.locationIcon}>{'\ud83d\udccd'}</span>
          <span className={styles.locationText}>
            {/* 修复：使用提取好的 market */}
            {market === 'domestic' ? '\u56fd\u5185' : '\u56fd\u9645'} ·{' '}
            {(baseInfo.address || '').substring(0, 15)}
          </span>
        </div>

        <h3 className={styles.title}>{hotelName}</h3>

        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>
              {CURRENCY_SYMBOL}
              {roomPrice}
            </span>
            {originalPrice > roomPrice && (
              <span className={styles.originalPrice}>
                {CURRENCY_SYMBOL}
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        <div className={styles.ratingRow}>
          {showStar && baseInfo.star > 0 && (
            <span className={styles.rating}>
              {'\u2605 '}
              {baseInfo.star}
            </span>
          )}
          <span className={styles.reviewCount}>
            {reviewCount}
            {'+ \u6761\u70b9\u8bc4'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HotelCard)