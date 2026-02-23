/**
 * 搜索结果单列卡片 - 响应式布局
 * PC端（>768px）: 左图右文水平布局
 * 移动端（≤768px）: 纵向竖卡片布局
 */

import React, { useState } from 'react'
import type { HomeStay } from '@estay/shared'
import { HeartIcon } from '../../../icons/HeartIcon'
import styles from './index.module.scss'
import { StarIcon, PositionIcon } from '../../icons'

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
          <HeartIcon
            size={28}
            fillColor={favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(68, 70, 72, 0.3)'}
            strokeColor={favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
            strokeWidth={2}
          />
        </button>

        {/* 评分和位置标签 - 左下角 */}
        <div className={styles.ratingBadge}>
          <StarIcon width={12} height={12} color='#eec50f'></StarIcon>
          <span className={styles.ratingBadgeText}>
             {data.baseInfo.star}
          </span>
          <PositionIcon width={10} height={10} color='#8da5cd'/>
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
