/**
 * 搜索结果单列卡片 - 响应式布局
 */

import React, { useMemo, useState } from 'react'
import type { HotelDomainModel } from '@estay/shared'
import styles from './index.module.scss'

interface SearchResultCardProps {
  data: HotelDomainModel
  startingPrice?: number
  tags?: string[]
  onClick?: (id: string) => void
  onFavorite?: (id: string, favorited: boolean) => void
  isFavorited?: boolean
}

type SearchCardBaseInfo = HotelDomainModel['baseInfo'] & {
  nameCn?: string
  nameEn?: string
  rating?: {
    score?: number
    count?: number
  }
}

const CURRENCY_SYMBOL = '\u00A5'

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  data,
  startingPrice = 0,
  tags,
  onClick,
  onFavorite,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  const baseInfo = data.baseInfo as SearchCardBaseInfo
  // ✅ 1. 拆除旧 name 炸弹
  const hotelName = baseInfo.nameCn || baseInfo.nameEn || (baseInfo as any).name || '未知酒店'
  const primaryImage = baseInfo.images?.[0] || null
  // ✅ 2. 安全获取 rating
  const ratingScore = baseInfo.rating?.score ?? (data as any).rating?.score ?? 0
  const roomPrice = Math.max(0, startingPrice)
  
  const hotelTags = useMemo(() => {
    if (tags && tags.length > 0) {
      return tags
    }

    // ✅ 3. 安全获取 surroundings 和 policies
    const safeSurroundings = (data as any).surroundings || []
    const hasMetro = safeSurroundings.some((item: any) => (item.surType || '').toLowerCase().includes('metro'))
    
    // 兼容可能在 root 层或 baseInfo 层的 policies
    const rootPolicies = (data as any).policies || {}
    const baseInfoPolicies = (baseInfo as any).policies || []
    const hasCancellation = Boolean(rootPolicies.cancellationPolicy) || baseInfoPolicies.some((p: any) => p.policyType === 'cancellation')

    return [
      hasMetro ? '近地铁' : '交通便利',
      '含双早',
      hasCancellation ? '含取消政策' : '可灵活取消',
    ]
  }, [(data as any).policies?.cancellationPolicy, (data as any).surroundings, tags, (baseInfo as any).policies])

  const handleCardClick = () => {
    // ✅ 4. 彻底改用 _id
    onClick?.(data._id!)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextFavorited = !favorited
    setFavorited(nextFavorited)
    // ✅ 5. 彻底改用 _id
    onFavorite?.(data._id!, nextFavorited)
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* 主图区域 */}
      <div className={styles.imageSection}>
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

        {/* 收藏按钮 */}
        <button
          className={`${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          aria-label="收藏"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill={favorited ? 'rgba(255, 107, 107, 0.6)' : 'rgba(180, 183, 189, 0.6)'}
            stroke="none"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* 评分和位置标签 */}
        <div className={styles.ratingBadge}>
          <span className={styles.ratingBadgeText}>⭐ {Number(ratingScore).toFixed(1)}</span>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="#4db4ea"
          >
            <path d="M512 0C312.32 0 153.6 158.72 153.6 358.4 153.6 624.64 512 1024 512 1024s358.4-399.36 358.4-665.6C870.4 158.72 711.68 0 512 0z m0 486.4c-71.68 0-128-56.32-128-128s56.32-128 128-128 128 56.32 128 128-56.32 128-128 128z" />
          </svg>
          <span className={styles.location}>
            {baseInfo.address}
            {/* ✅ 6. 安全读取距离 */}
            {(data as any).distanceText ? ` · 距您 ${(data as any).distanceText}` : ''}
          </span>
        </div>

        {/* 图片数量标识 */}
        <div className={styles.photoCount}>📷 {baseInfo.images?.length || 1}</div>
      </div>

      {/* 信息区 */}
      <div className={styles.infoSection}>
        <h3 className={styles.name}>{hotelName}</h3>

        <div className={styles.tags}>
          {hotelTags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.roomInfo}>
          {/* ✅ 7. 安全读取 market */}
          {(data as any).market === 'domestic' ? '国内酒店' : '国际酒店'} · {baseInfo.address}
        </div>

        <div className={styles.priceSection}>
          <span className={styles.price}>
            {CURRENCY_SYMBOL}
            {roomPrice}
          </span>
          <span className={styles.unit}>/晚起</span>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard