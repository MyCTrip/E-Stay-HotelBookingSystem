/**
 * 搜索结果单列卡片 - 响应式布局
 * PC端（>768px）: 左图右文水平布局
 * 移动端（≤768px）: 纵向竖卡片布局
 */

import React, { useState } from 'react'
import type { HomeStay } from '@estay/shared'
import styles from './index.module.scss'

interface SearchResultCardProps {
  data: HomeStay
  onClick?: (id: string) => void
  onFavorite?: (id: string, favorited: boolean) => void
  isFavorited?: boolean
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  data,
  onClick,
  onFavorite,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  const primaryImage = data.images?.[0] || null
  const roomPrice = data.rooms?.[0]?.baseInfo?.price || 358
  const tags = ['含双早', '免费取消', '热门']

  const handleCardClick = () => {
    onClick?.(data._id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorited(!favorited)
    onFavorite?.(data._id, !favorited)
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* 主图区 - PC端左侧，移动端上方 */}
      <div className={styles.imageSection}>
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={data.baseInfo.nameCn}
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

        {/* 评分和位置标签 - 左下角 */}
        <div className={styles.ratingBadge}>
          <span className={styles.ratingBadgeText}>⭐ {data.baseInfo.star}</span>
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
          <span className={styles.location}>{data.baseInfo.city} · 距您 3.2km</span>
        </div>

        {/* 图片数量标识 - 右下角 */}
        <div className={styles.photoCount}>📷 {data.images?.length || 1}</div>
      </div>

      {/* 右侧信息区 - PC端右侧，移动端下方 */}
      <div className={styles.infoSection}>
        {/* 名称 */}
        <h3 className={styles.name}>{data.baseInfo.nameCn}</h3>

        {/* 核心标签 */}
        <div className={styles.tags}>
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* 房间配置 - 仅移动端显示 */}
        <div className={styles.roomInfo}>1居1床2人 · 整套40㎡ · 近{data.baseInfo.city}路步行街</div>

        {/* 价格区 */}
        <div className={styles.priceSection}>
          <span className={styles.price}>¥{roomPrice}</span>
          <span className={styles.unit}>/晚起</span>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard
