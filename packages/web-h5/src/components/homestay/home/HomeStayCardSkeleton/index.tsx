/**
 * 民宿卡片骨架屏 - 加载中显示，提升用户体验
 */

import React from 'react'
import styles from './index.module.scss'

interface HomeStayCardSkeletonProps {
  count?: number
}

const HomeStayCardSkeleton: React.FC<HomeStayCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          {/* 图片骨架 */}
          <div className={styles.skeletonImage}>
            <div className={styles.shimmer} />
          </div>

          {/* 信息骨架 */}
          <div className={styles.skeletonInfo}>
            {/* 位置骨架 */}
            <div className={styles.skeletonLine} style={{ width: '60%', height: 12 }} >
              <div className={styles.shimmer} />
            </div>

            {/* 标题骨架 */}
            <div className={styles.skeletonLine} style={{ width: '100%', height: 16, marginTop: 8 }}>
              <div className={styles.shimmer} />
            </div>
            <div className={styles.skeletonLine} style={{ width: '80%', height: 16, marginTop: 4 }}>
              <div className={styles.shimmer} />
            </div>

            {/* 价格骨架 */}
            <div className={styles.skeletonLine} style={{ width: '40%', height: 14, marginTop: 8 }}>
              <div className={styles.shimmer} />
            </div>

            {/* 评价骨架 */}
            <div className={styles.skeletonLine} style={{ width: '50%', height: 12, marginTop: 6 }}>
              <div className={styles.shimmer} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default HomeStayCardSkeleton
