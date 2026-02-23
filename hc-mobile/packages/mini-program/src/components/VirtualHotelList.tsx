import React, { useCallback } from 'react';
import { ScrollView, View, Text } from '@tarojs/components';
// 假设 HotelCard 与该组件在同级目录，或调整为实际路径
import HotelCard from './HotelCard';
// 类型从你之前定义的 @estay/shared 或对应位置导入
import type { Hotel } from '@estay/shared';
import './VirtualHotelList.scss';

export interface VirtualHotelListProps {
  hotels: Hotel[];
  hasMore: boolean;
  moreLoading: boolean;
  onLoadMore: () => void;
  onHotelClick: (id: string) => void;
}

const VirtualHotelList: React.FC<VirtualHotelListProps> = ({
  hotels,
  hasMore,
  moreLoading,
  onLoadMore,
  onHotelClick,
}) => {
  // 核心逻辑：利用闭包状态防抖，严格防止在加载中或无数据时重复触发网络请求
  const handleScrollToLower = useCallback(() => {
    if (hasMore && !moreLoading) {
      onLoadMore();
    }
  }, [hasMore, moreLoading, onLoadMore]);

  return (
    <ScrollView
      className="virtual-hotel-list"
      scrollY
      lowerThreshold={50}
      onScrollToLower={handleScrollToLower}
    >
      {/* 酒店卡片渲染区 */}
      <View className="virtual-hotel-list__container">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel._id}
            hotel={hotel}
            onClick={onHotelClick}
          />
        ))}
      </View>

      {/* 底部 Loading / 到底提示状态区 */}
      <View className="virtual-hotel-list__footer">
        {moreLoading && (
          <Text className="virtual-hotel-list__status-text">
            正在加载更多酒店...
          </Text>
        )}
        {!hasMore && hotels.length > 0 && (
          <Text className="virtual-hotel-list__status-text">
            已经到底啦
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// 严格遵守规范：使用 memo 避免父组件其他无关状态变更导致整个长列表重渲染
export default React.memo(VirtualHotelList);
