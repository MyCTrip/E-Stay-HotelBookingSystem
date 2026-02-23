import React from 'react'
import type { HotelDomainModel } from '@estay/shared'
import styles from './index.module.scss'

interface ReviewSectionProps {
  rating: HotelDomainModel['rating'] & { reviewCount?: number }
}

interface ScoreRow {
  score: 5 | 4 | 3 | 2 | 1
  count: number
  width: string
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

const buildDistribution = (score: number, reviewCount: number): ScoreRow[] => {
  const levels: Array<5 | 4 | 3 | 2 | 1> = [5, 4, 3, 2, 1]
  const safeCount = Math.max(0, reviewCount)

  if (safeCount === 0) {
    return levels.map((level) => ({
      score: level,
      count: 0,
      width: '0%',
    }))
  }

  const weights = levels.map((level) => Math.max(0.1, 1.8 - Math.abs(level - score)))
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0)
  const rawCounts = weights.map((weight) => Math.round((weight / weightSum) * safeCount))

  const total = rawCounts.reduce((sum, item) => sum + item, 0)
  rawCounts[0] = Math.max(0, rawCounts[0] + (safeCount - total))

  return levels.map((level, index) => ({
    score: level,
    count: rawCounts[index],
    width: `${Math.round((rawCounts[index] / safeCount) * 100)}%`,
  }))
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ rating }) => {
  const score = clamp(rating.score, 0, 5)
  const reviewCount = Math.max(0, rating.reviewCount ?? rating.count)
  const roundedScore = Math.max(1, Math.round(score))
  const starsText = `${'★'.repeat(roundedScore)}${'☆'.repeat(5 - roundedScore)}`
  const scoreRows = buildDistribution(score, reviewCount)

  const reviews = [
    {
      id: '1',
      author: '住客A',
      rating: Math.max(1, Math.round(score)),
      date: '2024-02-10',
      content: '整体入住体验不错，位置方便，房间整洁。',
      images: [],
    },
    {
      id: '2',
      author: '住客B',
      rating: Math.max(1, Math.min(5, Math.round(score - 0.5))),
      date: '2024-02-08',
      content: '服务响应及时，设施齐全，性价比可以。',
      images: [],
    },
  ]

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>用户评价</h2>

      <div className={styles.scoreOverview}>
        <div className={styles.scoreMain}>
          <div className={styles.number}>{score.toFixed(1)}</div>
          <div className={styles.stars}>{starsText}</div>
          <div className={styles.count}>{reviewCount}条评价</div>
        </div>

        <div className={styles.scoreDistribution}>
          {scoreRows.map((row) => (
            <div key={row.score} className={styles.scoreRow}>
              <span className={styles.label}>{row.score}分</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: row.width }} />
              </div>
              <span className={styles.count}>{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tags}>
        {['位置便利', '设施完善', '服务专业', '卫生整洁', '性价比高'].map((tag) => (
          <button key={tag} className={styles.tag}>
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.header}>
              <div>
                <div className={styles.author}>{review.author}</div>
                <div className={styles.rating}>★{review.rating}</div>
              </div>
              <div className={styles.date}>{review.date}</div>
            </div>
            <p className={styles.content}>{review.content}</p>
          </div>
        ))}
      </div>

      <button className={styles.viewAll}>查看全部{reviewCount}条评价</button>
    </div>
  )
}

export default ReviewSection
