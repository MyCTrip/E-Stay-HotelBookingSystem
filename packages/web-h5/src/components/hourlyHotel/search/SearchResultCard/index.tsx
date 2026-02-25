import React, { useState } from 'react'
import type { HourlyRoom } from '@estay/shared' // 🌟 使用钟点房专属类型
import styles from './index.module.scss'

interface HourlySearchResultCardProps {
  data: HourlyRoom
  onClick?: (id: string) => void
  onFavorite?: (id: string, favorited: boolean) => void
  isFavorited?: boolean
}

const HourlySearchResultCard: React.FC<HourlySearchResultCardProps> = ({
  data,
  onClick,
  onFavorite,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  // 数据容错处理
  const primaryImage = data.images?.[0] || null
  // 钟点房通常取第一个房型的价格作为起步价
  const roomPrice = data.rooms?.[0]?.baseInfo?.price || 0
  // 提取前两个设施作为标签，加上"秒确认"
  const tags = ['秒确认', ...(data.baseInfo.facilities?.slice(0, 2).map(f => {
    // 尝试多个可能的属性名
    return (f as any).name || (f as any).summary || (f as any).category || '设施'
  }) || [])]

  // 动态组装钟点房信息文案
  const durationText = data.durationOptions?.length ? data.durationOptions.join('/') : '3/4'
  const unitText = `/${data.durationOptions?.[0] || 3}小时起`
  const roomInfoText = `${durationText}小时可选 · ${data.baseInfo.description || '舒适钟点房'}`

  const handleCardClick = () => onClick?.(data._id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorited(!favorited)
    onFavorite?.(data._id, !favorited)
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageSection}>
        {primaryImage && !imageError ? (
          <img src={primaryImage} alt={data.baseInfo.nameCn} className={styles.image} loading="lazy" onError={() => setImageError(true)} />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}

        {/* 右上角收藏按钮 */}
        <button className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`} onClick={handleFavoriteClick}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill={favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.8)'}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* 左下角：评分和城市 */}
        <div className={styles.ratingBadge}>
          <span className={styles.ratingBadgeText}>⭐ {data.baseInfo.star}</span>
          <span className={styles.location}>· {data.baseInfo.city}</span>
        </div>

        {/* 右下角：图片数量 */}
        <div className={styles.photoCount}>
          <span className={styles.photoIcon}>🖼️</span> {data.images?.length || 1}
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.name}>{data.baseInfo.nameCn}</h3>

        <div className={styles.tags}>
          {tags.map((tag, index) => <span key={index} className={styles.tag}>{tag}</span>)}
        </div>

        <div className={styles.roomInfo}>{roomInfoText}</div>

        <div className={styles.priceSection}>
          <span className={styles.priceSymbol}>¥</span>
          <span className={styles.price}>{roomPrice}</span>
          <span className={styles.unit}>{unitText}</span>
        </div>
      </div>
    </div>
  )
}

export default HourlySearchResultCard