import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '@estay/shared';
// 确认这个引入路径能正确指向咱们之前写的虚拟滚动组件
// import { VirtualHotelList } from '@estay/shared/src/components/VirtualHotelList';

export default function HotelSearchResultPage() {
  const navigate = useNavigate();

  // 1. 订阅 Store 中的数据和状态
  const hotels = useHotelStore(state => state.hotels);
  const pagination = useHotelStore(state => state.hotelsPagination);
  const ui = useHotelStore(state => state.ui);
  const fetchMoreHotels = useHotelStore(state => state.fetchMoreHotels);

  // 2. 详情跳转逻辑
  const handleHotelClick = (id: string) => {
    navigate(`/hotel/${id}`);
  };

  // 3. 优雅的状态分发渲染
  if (ui.listLoading) {
    return (
      <div style={{ padding: '50px 0', textAlign: 'center', color: '#666' }}>
        酒店数据全速加载中... 🚀
      </div>
    );
  }

  if (ui.error) {
    return (
      <div style={{ padding: '50px 0', textAlign: 'center', color: '#e74c3c' }}>
        加载失败: {ui.error}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div style={{ padding: '50px 0', textAlign: 'center', color: '#999' }}>
        没有找到符合条件的酒店，换个城市试试吧~
      </div>
    );
  }

  // 4. 🚀 渲染我们在第一步写好的高性能虚拟滚动列表
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <VirtualHotelList 
        hotels={hotels}
        hasMore={pagination.hasMore}
        moreLoading={ui.moreLoading}
        onLoadMore={fetchMoreHotels}
        onHotelClick={handleHotelClick}
      />
    </div>
  );
}