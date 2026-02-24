import React, { useEffect, useState } from 'react'
import type { HourlyFacilityItem, HourlyRoom } from '../../types'
import styles from './index.module.scss'

interface HourlyRoomCardProps {
  data: HourlyRoom
  onClick?: () => void
  showStar?: boolean
  onFavorite?: (id: string, favorited: boolean) => void
  isFavorited?: boolean
}

const getFacilityText = (facility: HourlyFacilityItem | string | undefined): string => {
  if (!facility) {
    return 'Complete facilities'
  }

  if (typeof facility === 'string') {
    return facility
  }

  return facility.content || facility.name || 'Complete facilities'
}

const HourlyRoomCard: React.FC<HourlyRoomCardProps> = ({
  data,
  onClick,
  showStar = true,
  onFavorite,
  isFavorited = false,
}) => {
  const [favorited, setFavorited] = useState(isFavorited)

  useEffect(() => {
    setFavorited(isFavorited)
  }, [isFavorited])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !favorited
    setFavorited(next)
    onFavorite?.(data._id, next)
  }

  const coverImage = data.images?.[0] || data.baseInfo.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
  const tags: string[] = []
  const firstFacility = data.baseInfo.facilities?.[0]
  const firstPolicy = data.baseInfo.policies?.[0]

  if (firstFacility) {
    tags.push(getFacilityText(firstFacility))
  }

  if (firstPolicy?.content) {
    tags.push(firstPolicy.content)
  }

  const startingDuration = data.durationOptions?.[0] ?? 3
  const roomPrice = data.baseInfo.price ?? startingDuration * 30

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={coverImage} alt={data.baseInfo.nameCn || 'Hourly Room'} className={styles.coverImg} />
        <div className={styles.imageBadge}>Instant</div>

        <div
          className={`${styles.heartIcon} ${favorited ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
        >
          <svg viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.locationRow}>
          <svg className={styles.pinIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className={styles.address}>{data.baseInfo.city || 'City'} · {data.baseInfo.address || 'Address'}</span>
        </div>

        <h3 className={styles.title}>{data.baseInfo.nameCn || data.baseInfo.type || 'Hourly Room'}</h3>

        <div className={styles.tagsRow}>
          <span className={styles.timeSlotBadge}>08:00-20:00</span>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.priceRow}>
          <div className={styles.priceContainer}>
            <span className={styles.currency}>¥</span>
            <span className={styles.price}>{roomPrice}</span>
            <span className={styles.unit}>from {startingDuration}h</span>
          </div>

          <div className={styles.scoreRow}>
            {showStar && <span className={styles.score}>{data.baseInfo.star?.toFixed(1) || '4.8'}</span>}
            <span className={styles.commentText}>from</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HourlyRoomCard)
