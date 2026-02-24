import React from 'react'
import type { HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

interface HotelInfoProps {
  baseInfo: Pick<HotelEntityBaseInfoModel, 'nameCn' | 'nameEn' | 'star' | 'address' | 'description'>
  reviewCount?: number | null
}

const MAX_STAR_COUNT = 5

const sanitizeScore = (star: number): number => {
  if (!Number.isFinite(star)) {
    return 0
  }

  return Math.max(0, Math.min(MAX_STAR_COUNT, star))
}

const HotelInfo: React.FC<HotelInfoProps> = ({ baseInfo, reviewCount = null }) => {
  const score = sanitizeScore(baseInfo.star)
  const fullStarCount = Math.floor(score)
  const emptyStarCount = MAX_STAR_COUNT - fullStarCount
  const showReviewCount = typeof reviewCount === 'number' && reviewCount > 0

  return (
    <section className={styles.infoCard}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.nameCn}>{baseInfo.nameCn}</h1>
          {baseInfo.nameEn ? <p className={styles.nameEn}>{baseInfo.nameEn}</p> : null}

          <div className={styles.starRow}>
            <span className={styles.starIcons}>
              {'\u2605'.repeat(fullStarCount)}
              <span className={styles.starEmpty}>{'\u2606'.repeat(emptyStarCount)}</span>
            </span>
            <span className={styles.starText}>{`${score.toFixed(1)}\u661f\u7ea7`}</span>
          </div>
        </div>

        <div className={styles.ratingCard}>
          <div className={styles.ratingScore}>{score.toFixed(1)}</div>
          <div className={styles.ratingLabel}>{'\u8d85\u68d2'}</div>
          {showReviewCount ? (
            <div className={styles.reviewCount}>{`${reviewCount}\u6761\u70b9\u8bc4`}</div>
          ) : null}
        </div>
      </div>

      <div className={styles.addressRow}>
        <div className={styles.addressMain}>
          <span className={styles.locationIcon} aria-hidden>
            <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
              <path d="M512 64c-176.72 0-320 143.28-320 320 0 71.04 25.6 145.92 76.8 224.64C337.28 714.24 512 896 512 896s174.72-181.76 243.2-287.36C806.4 529.92 832 455.04 832 384c0-176.72-143.28-320-320-320z m0 448a128 128 0 1 1 0-256 128 128 0 0 1 0 256z" />
            </svg>
          </span>
          <span className={styles.addressText}>{baseInfo.address}</span>
        </div>

        <button type="button" className={styles.mapBtn}>
          {'\u5730\u56fe/\u5bfc\u822a >'}
        </button>
      </div>
    </section>
  )
}

export default HotelInfo
