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
  const originalPrice = Math.ceil(roomPrice * 1.5)
  const reviewCount = Math.floor(Math.random() * 5000) + 100
  const discountAmount = Math.floor(Math.random() * 100) + 20
  const tags = ['含双早', '免费取消', '热门']
  const features = ['无忧保障', '实拍看房', '免费取消', '近地铁']

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
        >
          ♡
        </button>

        {/* 图片数量标识 */}
        <div className={styles.photoCount}>
          📷 {data.images?.length || 1}
        </div>
      </div>

      {/* 右侧信息区 - PC端右侧，移动端下方 */}
      <div className={styles.infoSection}>
        {/* 名称 */}
        <h3 className={styles.name}>{data.baseInfo.nameCn}</h3>

        {/* 评分 & 位置 */}
        <div className={styles.ratingRow}>
          <span className={styles.rating}>⭐ {data.baseInfo.star}</span>
          <span className={styles.ratingText}>超棒</span>
          <span className={styles.location}>
            {data.baseInfo.city} · 距您 3.2km
          </span>
        </div>

        {/* 核心标签 */}
        <div className={styles.tags}>
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* 优惠提示 */}
        <div className={styles.discount}>
          🔥 今日特价，比原价低 ¥{discountAmount}
        </div>

        {/* 功能特性 - 仅移动端显示 */}
        <div className={styles.features}>
          {features.slice(0, 4).map((feature, index) => (
            <span key={index} className={styles.feature}>
              {feature}
            </span>
          ))}
        </div>

        {/* 房间配置 - 仅移动端显示 */}
        <div className={styles.roomInfo}>
          1居1床2人 · 整套40㎡ · 近{data.baseInfo.city}路步行街
        </div>

        {/* 价格区 */}
        <div className={styles.priceSection}>
          <span className={styles.price}>¥{roomPrice}</span>
          <span className={styles.unit}>/晚起</span>
          <span className={styles.sold}>已售 {reviewCount}</span>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard
