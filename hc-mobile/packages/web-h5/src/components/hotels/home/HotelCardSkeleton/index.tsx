import React from 'react'
import styles from './index.module.scss'

interface HotelCardSkeletonProps {
  count?: number
}

const HotelCardSkeleton: React.FC<HotelCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={styles.skeletonImage}>
            <div className={styles.shimmer} />
          </div>

          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonLine} style={{ width: '60%', height: 12 }}>
              <div className={styles.shimmer} />
            </div>

            <div
              className={styles.skeletonLine}
              style={{ width: '100%', height: 16, marginTop: 8 }}
            >
              <div className={styles.shimmer} />
            </div>
            <div className={styles.skeletonLine} style={{ width: '80%', height: 16, marginTop: 4 }}>
              <div className={styles.shimmer} />
            </div>

            <div className={styles.skeletonLine} style={{ width: '40%', height: 14, marginTop: 8 }}>
              <div className={styles.shimmer} />
            </div>

            <div className={styles.skeletonLine} style={{ width: '50%', height: 12, marginTop: 6 }}>
              <div className={styles.shimmer} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default HotelCardSkeleton
