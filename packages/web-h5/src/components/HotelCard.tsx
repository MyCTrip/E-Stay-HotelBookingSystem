import React, { memo } from 'react';
import { Hotel } from '@estay/shared/src/types/models';
import styles from './HotelCard.module.css'; // 你可以使用现有的样式文件或 Tailwind

interface HotelCardProps {
  hotel: Hotel;
  onClick?: (id: string) => void;
}

const HotelCardComponent: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  const { baseInfo, displayInfo } = hotel;
  
  // 提取封面图，如果没有则用占位图
  const coverImage = baseInfo.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div 
      className={styles.cardContainer} 
      onClick={() => onClick?.(hotel._id)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {/* 🚀 图片懒加载：原生支持，性能极高 */}
        <img 
          src={coverImage} 
          alt={baseInfo.nameCn} 
          loading="lazy" 
          className={styles.coverImg}
        />
        {/* 顶部标签 */}
        {baseInfo.star >= 4 && (
          <span className={styles.starBadge}>{baseInfo.star} 星级</span>
        )}
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.title} title={baseInfo.nameCn}>
          {baseInfo.nameCn}
        </h3>
        
        <div className={styles.metaRow}>
          <span className={styles.rating}>{displayInfo?.rating || '暂无'}分</span>
          <span className={styles.reviewCount}>{displayInfo?.reviewCount || 0}条点评</span>
          <span className={styles.distance}>{displayInfo?.distanceText || baseInfo.city}</span>
        </div>

        <div className={styles.tagsRow}>
          {displayInfo?.tags?.slice(0, 3).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.pricePrefix}>¥</span>
          <span className={styles.priceValue}>{displayInfo?.lowestPrice || '--'}</span>
          <span className={styles.priceSuffix}>起</span>
        </div>
      </div>
    </div>
  );
};

// 🚀 性能优化：只有当酒店的 ID 或价格变动时才重新渲染卡片
export const HotelCard = memo(HotelCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.hotel._id === nextProps.hotel._id &&
    prevProps.hotel.displayInfo?.lowestPrice === nextProps.hotel.displayInfo?.lowestPrice
  );
});