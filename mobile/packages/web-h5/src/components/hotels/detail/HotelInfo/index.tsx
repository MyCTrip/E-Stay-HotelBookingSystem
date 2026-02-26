import React from 'react'
import type { HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

interface HotelInfoProps {
  baseInfo: Pick<
    HotelEntityBaseInfoModel,
    'nameCn' | 'nameEn' | 'star' | 'address' | 'description'
  >
  reviewCount?: number | null
}

const MAX_STAR_COUNT = 5

const sanitizeScore = (star: number): number => {
  if (!Number.isFinite(star)) return 0
  return Math.max(0, Math.min(MAX_STAR_COUNT, star))
}

const HotelInfo: React.FC<HotelInfoProps> = ({
  baseInfo,
  reviewCount = null,
}) => {
  const score = sanitizeScore(baseInfo.star)
  const showReviewCount =
    typeof reviewCount === 'number' && reviewCount > 0

  // 派生展示数据（不改接口）
  const features = [
    { icon: '🅿️', text: '免费停车' },
    { icon: '🧺', text: '洗衣房' },
    { icon: '📶', text: '免费WiFi' },
    { icon: '💧', text: '24小时热水' },
  ]

  return (
    <div className={styles.overviewContainer}>
      {/* 1️⃣ 标题 + 标签 */}
      <div className={styles.headerTitle}>
        <h2>{baseInfo.nameCn}</h2>
        <div className={styles.tags}>
          <span className={styles.tagGold}>优享会</span>
          <span className={styles.tagGrey}>高品质推荐</span>
        </div>
      </div>

      {/* 2️⃣ 横向滚动设施 */}
      <div className={styles.featureScroll}>
        {features.map((item, index) => (
          <div key={index} className={styles.featureItem}>
            <div className={styles.iconBox}>{item.icon}</div>
            <span>{item.text}</span>
          </div>
        ))}

        <div className={styles.policyEntry}>
          设施政策 &gt;
        </div>
      </div>

      {/* 3️⃣ 评分卡 + 地图卡 */}
      <div className={styles.cardsRow}>
        {/* 评分卡 */}
        <div className={styles.reviewCard}>
          <div className={styles.scoreRow}>
            <span className={styles.score}>
              {score.toFixed(1)}
            </span>
            <span className={styles.desc}>超棒</span>
            {showReviewCount && (
              <span className={styles.count}>
                {reviewCount}条 &gt;
              </span>
            )}
          </div>
          <p className={styles.quote}>
            {baseInfo.description || '高品质舒适体验'}
          </p>
        </div>

        {/* 地图卡 */}
        <div className={styles.mapCard}>
          <div className={styles.locationText}>
            <strong>{baseInfo.address}</strong>
            <p>查看地图与导航</p>
          </div>
          <div className={styles.mapIcon}>
            <span>📍 地图</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelInfo