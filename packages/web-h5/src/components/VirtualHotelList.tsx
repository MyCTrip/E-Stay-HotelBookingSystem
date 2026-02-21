import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Hotel } from '@estay/shared/src/types/models';
import { HotelCard } from './HotelCard';

interface VirtualHotelListProps {
  hotels: Hotel[];
  hasMore: boolean;
  moreLoading: boolean;
  onLoadMore: () => void;
  onHotelClick: (id: string) => void;
  // 可以传入预估高度，TanStack Virtual 甚至支持动态高度（高度不固定的卡片它也能算）
  estimateHeight?: number; 
}

export const VirtualHotelList: React.FC<VirtualHotelListProps> = ({
  hotels,
  hasMore,
  moreLoading,
  onLoadMore,
  onHotelClick,
  estimateHeight = 140, // 根据你的 HotelCard 实际高度调整预估值
}) => {
  // 1. 滚动容器的 ref
  const parentRef = useRef<HTMLDivElement>(null);

  // 2. 初始化核心 Hook (无头虚拟化器)
  const virtualizer = useVirtualizer({
    count: hotels.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateHeight,
    overscan: 5, // 提前渲染 5 个，防止用户猛滑时出现白屏
  });

  // 获取当前视口内需要渲染的虚拟项
  const virtualItems = virtualizer.getVirtualItems();

  // 3. 🚀 极其优雅的无缝加载逻辑 (替代原本依赖 index 判断的笨办法)
  useEffect(() => {
    // 拿到当前渲染列表的最后一项
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    // 如果最后一项的索引等于数据总长度 - 1，且还有更多数据，且没有在加载中
    if (
      lastItem.index === hotels.length - 1 &&
      hasMore &&
      !moreLoading
    ) {
      onLoadMore();
    }
  }, [virtualItems, hotels.length, hasMore, moreLoading, onLoadMore]);

  return (
    <div
      ref={parentRef}
      style={{
        // 外部滚动容器必须有高度和 overflow
        height: 'calc(100vh - 100px)', // 减去你的 Header 等导航高度
        overflowY: 'auto',
        width: '100%',
        backgroundColor: '#f5f7fa',
      }}
    >
      {/* 内部撑开总高度的容器 */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* 只渲染当前视口内的卡片 */}
        {virtualItems.map((virtualRow) => {
          const hotel = hotels[virtualRow.index];
          if (!hotel) return null;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                // 🚀 TanStack 精准的位移计算
                transform: `translateY(${virtualRow.start}px)`, 
                padding: '8px 16px',
                boxSizing: 'border-box',
              }}
            >
              <HotelCard hotel={hotel} onClick={onHotelClick} />
            </div>
          );
        })}
      </div>

      {/* 底部交互状态 (追加在滚动容器最下方) */}
      <div style={{ padding: '16px 0', textAlign: 'center' }}>
        {moreLoading && (
          <span style={{ color: '#999', fontSize: '13px' }}>
            拼命加载更多酒店中... 🏨
          </span>
        )}
        {!hasMore && hotels.length > 0 && (
          <span style={{ color: '#ccc', fontSize: '12px' }}>
            —— 已经到底啦，看看别的城市吧 ——
          </span>
        )}
      </div>
    </div>
  );
};