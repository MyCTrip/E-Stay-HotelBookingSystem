/**
 * 用户评价区
 */

import React from 'react'
import styles from './ReviewSection.module.scss'

interface ReviewSectionProps {
  hostelId: string
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ hostelId }) => {
  const reviews = [
    {
      id: '1',
      author: '李女士',
      rating: 5,
      date: '2024-02-10',
      content: '房间很宽敞，设施完整，位置很好，离地铁很近。房东也很热心。',
      images: [],
    },
    {
      id: '2',
      author: '王先生',
      rating: 4,
      date: '2024-02-08',
      content: '整体不错，就是隔音效果一般。',
      images: [],
    },
  ]

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>用户评价</h2>

      {/* 评分概览 */}
      <div className={styles.scoreOverview}>
        <div className={styles.scoreMain}>
          <div className={styles.number}>4.9</div>
          <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
          <div className={styles.count}>90条评价</div>
        </div>

        {/* 评分分布 */}
        <div className={styles.scoreDistribution}>
          {[5, 4, 3, 2, 1].map((score) => (
            <div key={score} className={styles.scoreRow}>
              <span className={styles.label}>{score}分</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${(6 - score) * 20}%` }} />
              </div>
              <span className={styles.count}>{(6 - score) * 15}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 标签云 */}
      <div className={styles.tags}>
        {['位置方便', '设施完整', '干净舒适', '房东热心', '性价比高'].map((tag) => (
          <button key={tag} className={styles.tag}>
            {tag}
          </button>
        ))}
      </div>

      {/* 评价列表 */}
      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.header}>
              <div>
                <div className={styles.author}>{review.author}</div>
                <div className={styles.rating}>⭐ {review.rating}</div>
              </div>
              <div className={styles.date}>{review.date}</div>
            </div>
            <p className={styles.content}>{review.content}</p>
          </div>
        ))}
      </div>

      <button className={styles.viewAll}>查看全部90条评价</button>
    </div>
  )
}

export default ReviewSection
