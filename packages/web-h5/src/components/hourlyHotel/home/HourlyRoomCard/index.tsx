import React, { useState } from 'react' // 🌟 引入 useState
import type { HourlyRoom } from '@estay/shared'
import styles from './index.module.scss'

interface HourlyRoomCardProps {
    data: HourlyRoom
    onClick?: () => void
    showStar?: boolean
    // 🌟 新增：外部传入的收藏事件和初始状态
    onFavorite?: (id: string, favorited: boolean) => void
    isFavorited?: boolean
}

const HourlyRoomCard: React.FC<HourlyRoomCardProps> = ({
    data,
    onClick,
    showStar = true,
    onFavorite,
    isFavorited = false,
}) => {
    const { baseInfo, images, durationOptions } = data

    // 🌟 新增：内部维护收藏状态
    const [favorited, setFavorited] = useState(isFavorited)

    // 🌟 新增：处理爱心点击事件
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation() // 阻止事件冒泡，防止触发外层卡片的 onClick 跳转
        setFavorited(!favorited)
        onFavorite?.(data._id, !favorited)
    }

    const coverImage = images && images.length > 0
        ? images[0]
        : 'https://via.placeholder.com/400x300?text=暂无图片'

    const tags: string[] = []
    if (baseInfo.facilities?.length > 0) {
        tags.push(baseInfo.facilities[0].content || '设施齐全')
    }
    if (baseInfo.policies?.length > 0) {
        tags.push(baseInfo.policies[0].content || '优质服务')
    }

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img src={coverImage} alt={baseInfo.nameCn} className={styles.coverImg} />
                <div className={styles.imageBadge}>秒确认</div>

                {/* 🌟 修改：绑定点击事件，并根据 favorited 状态动态改变图标样式 */}
                <div
                    className={`${styles.heartIcon} ${favorited ? styles.favorited : ''}`}
                    onClick={handleFavoriteClick}
                >
                    <svg
                        viewBox="0 0 24 24"
                        // 如果收藏了就填满颜色，没收藏就是空心
                        fill={favorited ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.locationRow}>
                    <svg className={styles.pinIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className={styles.address}>{baseInfo.city} · {baseInfo.address}</span>
                </div>

                <h3 className={styles.title}>{baseInfo.nameCn}</h3>

                <div className={styles.tagsRow}>
                    <span className={styles.timeSlotBadge}>08:00-20:00</span>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>

                <div className={styles.priceRow}>
                    <div className={styles.priceContainer}>
                        <span className={styles.currency}>¥</span>
                        <span className={styles.price}>
                            {durationOptions?.[0] ? durationOptions[0] * 30 : 99}
                        </span>
                        <span className={styles.unit}>起/{durationOptions?.[0] || 3}小时</span>
                    </div>

                    <div className={styles.scoreRow}>
                        {showStar && (
                            <span className={styles.score}>{baseInfo.star?.toFixed(1) || '4.8'}</span>
                        )}
                        <span className={styles.commentText}>赞</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(HourlyRoomCard)