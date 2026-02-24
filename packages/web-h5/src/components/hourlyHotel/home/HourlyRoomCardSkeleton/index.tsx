import React from 'react'
import styles from './index.module.scss'

interface HourlyRoomCardSkeletonProps {
    count?: number // 需要渲染的骨架屏数量
}

const HourlyRoomCardSkeleton: React.FC<HourlyRoomCardSkeletonProps> = ({ count = 6 }) => {
    // 根据 count 生成一个循环数组，默认为 6 个，刚好填满 2 列或 3 列的网格
    const skeletons = Array.from({ length: count }, (_, index) => index)

    return (
        <>
            {skeletons.map((item) => (
                <div key={item} className={styles.cardSkeleton}>
                    {/* 上方：大图占位 */}
                    <div className={styles.imageSkeleton}></div>

                    {/* 下方：信息占位 */}
                    <div className={styles.infoSkeleton}>
                        {/* 地址行占位 */}
                        <div className={styles.locationSkeleton}></div>

                        {/* 标题占位 */}
                        <div className={styles.titleSkeleton}></div>

                        {/* 标签占位 */}
                        <div className={styles.tagsRow}>
                            <div className={styles.tagSkeleton}></div>
                            <div className={styles.tagSkeleton}></div>
                            <div className={styles.tagSkeletonLg}></div>
                        </div>

                        {/* 底部价格占位 */}
                        <div className={styles.footerSkeleton}>
                            <div className={styles.priceSkeleton}></div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default React.memo(HourlyRoomCardSkeleton)