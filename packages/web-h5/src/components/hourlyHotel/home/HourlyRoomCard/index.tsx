import React from 'react'
import type { HourlyRoom } from '@estay/shared'
import styles from './index.module.scss'

interface HourlyRoomCardProps {
    data: HourlyRoom
    onClick?: () => void
    showStar?: boolean
}

const HourlyRoomCard: React.FC<HourlyRoomCardProps> = ({ data, onClick, showStar }) => {
    const { baseInfo, images, durationOptions } = data

    // 模拟携程卡片上的补充数据（后续可替换为 data 里的真实后端字段）
    const mockReviewCount = '16607点评 · 7.9万收藏'
    const mockFeature = '24小时浦东机场免费接机，无需预约' // 对应蓝色的特色服务描述
    const mockTimeWindow = '10:00-22:00' // 入住时段
    const mockGuestReview = '连续31位住客好评'
    const mockOriginalPrice = 168
    const currentPrice = 157 // 当前价格

    return (
        <div className={styles.cardContainer} onClick={onClick}>
            {/* 左侧：酒店封面（竖版大图） */}
            <div className={styles.imageWrapper}>
                <img
                    src={images?.[0] || 'https://via.placeholder.com/160x280?text=暂无图片'}
                    alt={baseInfo.nameCn}
                    className={styles.coverImage}
                />
            </div>

            {/* 右侧：详细信息流 */}
            <div className={styles.infoWrapper}>
                <div className={styles.topSection}>
                    <h3 className={styles.title}>{baseInfo.nameCn}</h3>

                    {/* 1. 钻石/星级标识 */}
                    {showStar && (
                        <div className={styles.diamondRow}>
                            <span className={styles.diamond}>◆</span>
                            <span className={styles.diamond}>◆</span>
                            <span className={styles.diamond}>◆</span>
                            <span className={styles.diamond}>◆</span>
                        </div>
                    )}

                    {/* 2. 评分与点评收藏数 */}
                    <div className={styles.scoreRow}>
                        <span className={styles.scoreBox}>{baseInfo.star}</span>
                        <span className={styles.scoreText}>超棒</span>
                        <span className={styles.reviewCount}>{mockReviewCount}</span>
                    </div>

                    {/* 3. 地址位置 */}
                    <div className={styles.address}>{baseInfo.address}</div>

                    {/* 4. 特色服务描述 (携程的蓝色高亮文字) */}
                    <div className={styles.featureText}>{mockFeature}</div>

                    {/* 5. 标签栏 (包含入住时段) */}
                    <div className={styles.tagsRow}>
                        {/* 独立的入住时段标签：蓝色边框 */}
                        <span className={styles.timeTag}>{mockTimeWindow}</span>

                        {/* 普通设施标签：灰色底色 */}
                        {baseInfo.facilities?.slice(0, 3).map((fac: any, idx: number) => (
                            <span key={idx} className={styles.tag}>{fac.content}</span>
                        ))}
                    </div>
                </div>

                {/* 6. 底部：评价总结 & 时长价格堆叠 */}
                <div className={styles.bottomSection}>
                    <div className={styles.guestReview}>{mockGuestReview}</div>

                    <div className={styles.priceContainer}>
                        {/* 时长现在移到了价格的正上方 */}
                        <div className={styles.duration}>
                            {durationOptions && durationOptions.length > 0 ? durationOptions[0] : 4}小时
                        </div>

                        <div className={styles.priceRow}>
                            <span className={styles.originalPrice}>¥{mockOriginalPrice}</span>
                            <span className={styles.currentPrice}>
                                <span className={styles.currency}>¥</span>{currentPrice}
                            </span>
                            <span className={styles.priceSuffix}>起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HourlyRoomCard