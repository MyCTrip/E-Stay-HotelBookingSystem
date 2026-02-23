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

  const primaryImage = data.baseInfo.images?.[0] ?? null
  const roomPrice = Math.max(0, startingPrice)
  const originalPrice = roomPrice > 0 ? Math.ceil(roomPrice * 1.2) : 0
  const discount =
    originalPrice > roomPrice ? Math.round(((originalPrice - roomPrice) / originalPrice) * 100) : 0
  const reviewCount = Math.max(0, data.rating.count)

  const handleCardClick = () => {
    onClick?.(data.id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextFavorited = !favorited
    setFavorited(nextFavorited)
    onFavorite?.(data.id, nextFavorited)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={styles.waterlineCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={data.baseInfo.name}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}

        <button
          className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? '取消收藏' : '收藏'}
        >
          ♥
        </button>

        {(discount > 0 || data.rating.score >= 4.8) && <div className={styles.hotBadge}>网红热酒店</div>}
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.locationRow}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.locationText}>
            {data.market === 'domestic' ? '国内' : '国际'} · {data.baseInfo.address.substring(0, 15)}
          </span>
        </div>

        <h3 className={styles.title}>{data.baseInfo.name}</h3>

        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>¥{roomPrice}</span>
            {originalPrice > roomPrice && <span className={styles.originalPrice}>¥{originalPrice}</span>}
          </div>
        </div>

        <div className={styles.ratingRow}>
          {showStar && data.baseInfo.star > 0 && (
            <span className={styles.rating}>★{data.baseInfo.star}</span>
          )}
          <span className={styles.reviewCount}>{reviewCount}+ 人评价</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HotelCard)
