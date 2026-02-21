import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './HotelCard.scss';

// ----------------------------------
// 类型定义 (实际项目中可从 @estay/shared 导入)
// import { Hotel } from '@estay/shared';
// ----------------------------------

export interface HotelBaseInfo {
  nameCn: string;
  city: string;
  star: number;
  images: string[];
}

export interface HotelDisplayInfo {
  rating?: number;
  reviewCount?: number;
  lowestPrice?: number;
  originalPrice?: number;
  distanceText?: string;
  tags?: string[];
}

export interface Hotel {
  _id: string;
  baseInfo: HotelBaseInfo;
  displayInfo?: HotelDisplayInfo;
}

export interface HotelCardProps {
  hotel: Hotel;
  onClick: (hotelId: string) => void;
}

// ----------------------------------
// 组件实现
// ----------------------------------

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  const { _id, baseInfo, displayInfo } = hotel;
  
  // 1. 数据容错与降级处理
  const coverImage = baseInfo.images && baseInfo.images.length > 0 
    ? baseInfo.images[0] 
    : 'https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?auto=format&fit=crop&w=300&q=80';

  const displayLocation = displayInfo?.distanceText || baseInfo.city || '未知位置';
  const displayTags = displayInfo?.tags ? displayInfo.tags.slice(0, 3) : [];

  // 🚀 价格对比逻辑：优先使用真实原价，若无则在最低价基础上自动生成划线价，方便调试排版
  const displayOriginalPrice = displayInfo?.originalPrice || (displayInfo?.lowestPrice ? displayInfo.lowestPrice + 150 : null);

  // 2. 独立交互处理函数
  const handleCardClick = () => {
    onClick(_id);
  };

  return (
    <View className="hotel-card" onClick={handleCardClick}>
      
      {/* ================= 左侧：封面图 + 星级角标 ================= */}
      <View className="hotel-card__left">
        <Image 
          className="hotel-card__cover" 
          src={coverImage} 
          mode="aspectFill" 
          lazyLoad
        />
        {/* 视觉丰富：星级角标 */}
        <View className="hotel-card__star-badge">
          <Text className="hotel-card__star-text">{baseInfo.star}星级</Text>
        </View>
      </View>

      {/* ================= 右侧：详细信息 ================= */}
      <View className="hotel-card__right">
        
        {/* 标题 */}
        <View className="hotel-card__title">
          <Text className="hotel-card__title-text">{baseInfo.nameCn}</Text>
        </View>

        {/* 评分与评论数 (携程蓝底风格) */}
        <View className="hotel-card__rating-row">
          <Text className="hotel-card__rating-score">
            {displayInfo?.rating ? `${displayInfo.rating}` : '4.5'}
          </Text>
          <Text className="hotel-card__rating-desc">分 超棒</Text>
          {displayInfo?.reviewCount && (
            <Text className="hotel-card__review-count">
              {displayInfo.reviewCount}条点评
            </Text>
          )}
        </View>

        {/* 距离或城市 */}
        <View className="hotel-card__location">
          <Text className="hotel-card__location-text">{displayLocation}</Text>
        </View>

        {/* 标签列表 (严格规范的 Key) */}
        <View className="hotel-card__tags">
          {displayTags.map((tag, index) => (
            <View key={`${_id}-tag-${index}`} className="hotel-card__tag">
              <Text className="hotel-card__tag-text">{tag}</Text>
            </View>
          ))}
        </View>

        {/* 底部价格对比区域 (自动吸底靠右) */}
        <View className="hotel-card__price-wrapper">
          <View className="hotel-card__price-row">
            {/* 划线原价 */}
            {displayOriginalPrice && (
              <Text className="hotel-card__original-price">
                ¥{displayOriginalPrice}
              </Text>
            )}
            {/* 突出展示现价 */}
            <Text className="hotel-card__price-symbol">¥</Text>
            <Text className="hotel-card__price-value">
              {displayInfo?.lowestPrice ?? '--'}
            </Text>
            <Text className="hotel-card__price-suffix">起</Text>
          </View>
        </View>

      </View>
    </View>
  );
};

// ----------------------------------
// 性能优化
// ----------------------------------
const areEqual = (prevProps: Readonly<HotelCardProps>, nextProps: Readonly<HotelCardProps>) => {
  return (
    prevProps.hotel._id === nextProps.hotel._id &&
    prevProps.hotel.displayInfo?.lowestPrice === nextProps.hotel.displayInfo?.lowestPrice
  );
};

export default React.memo(HotelCard, areEqual);
