import React, { useState, useMemo } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createUseHotelList } from '../../../../shared/dist'
import { formatPrice, formatRating } from '../../../../shared/dist'
import { api } from '../../config'
import './index.css'

// 定义全局环境变量，防止Zustand环境检查错误
if (typeof (global as any).development === 'undefined') {
  (global as any).development = process.env.NODE_ENV === 'development'
}
if (typeof (global as any).production === 'undefined') {
  (global as any).production = process.env.NODE_ENV === 'production'
}

/**
 * 酒店列表页面
 */
const HotelListContent: React.FC = () => {
  const router = useRouter()
  const { city, checkIn, checkOut } = router.params

  const [sortBy, setSortBy] = useState<'default' | 'price' | 'rating'>('default')
  const [page, setPage] = useState(1)

  // 使用工厂函数创建 hook
  const useHotelList = createUseHotelList(api)
  const { data, isLoading, error } = useHotelList(
    {
      city: city as string,
      page,
      limit: 20,
    }
  )

  const hotels = useMemo(() => {
    if (!data?.data) return []

    const hotelsList = [...data.data]

    // 根据排序条件排序
    if (sortBy === 'price') {
      hotelsList.sort(
        (a, b) =>
          (a.baseInfo?.price || 0) - (b.baseInfo?.price || 0)
      )
    } else if (sortBy === 'rating') {
      hotelsList.sort(
        (a, b) =>
          (b.baseInfo?.star || 0) - (a.baseInfo?.star || 0)
      )
    }

    return hotelsList
  }, [data, sortBy])

  const handleHotelClick = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/hotelDetail/index?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`,
    })
  }

  if (error) {
    return (
      <View className="list-container">
        <Text className="error-text">加载失败，请重试</Text>
      </View>
    )
  }

  return (
    <View className="list-container">
      {/* 排序工具栏 */}
      <View className="sort-toolbar">
        <View
          className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
          onClick={() => setSortBy('default')}
        >
          默认
        </View>
        <View
          className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
          onClick={() => setSortBy('price')}
        >
          价格
        </View>
        <View
          className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
          onClick={() => setSortBy('rating')}
        >
          评分
        </View>
      </View>

      {/* 酒店列表 */}
      <ScrollView scrollY className="hotels-scroll">
        {isLoading && hotels.length === 0 ? (
          <View className="loading">加载中...</View>
        ) : hotels.length === 0 ? (
          <View className="empty">暂无酒店</View>
        ) : (
          <View className="hotels-list">
            {hotels.map((hotel) => (
              <View
                key={hotel._id}
                className="hotel-card"
                onClick={() => handleHotelClick(hotel._id)}
              >
                {/* 酒店图片 */}
                {hotel.baseInfo?.images?.[0] && (
                  <Image
                    src={hotel.baseInfo.images[0]}
                    mode="aspectFill"
                    className="hotel-image"
                  />
                )}

                {/* 酒店信息 */}
                <View className="hotel-info">
                  <Text className="hotel-name">
                    {hotel.baseInfo?.nameCn}
                  </Text>

                  <View className="hotel-meta">
                    <Text className="hotel-rating">
                      ★ {formatRating(hotel.baseInfo?.star || 0)}
                    </Text>
                    <Text className="hotel-location">
                      {hotel.baseInfo?.city}
                    </Text>
                  </View>

                  <Text className="hotel-address">
                    {hotel.baseInfo?.address}
                  </Text>

                  <View className="hotel-footer">
                    <Text className="hotel-price">
                      {formatPrice((hotel as any).baseInfo?.price || 0)}
                    </Text>
                    <Text className="night-text">起/晚</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 翻页 */}
      {data?.meta && (
        <View className="pagination">
          {page > 1 && (
            <View className="page-btn" onClick={() => setPage(page - 1)}>
              上一页
            </View>
          )}
          <Text className="page-info">
            {page} / {Math.ceil((data.meta.total || 0) / (data.meta.limit || 1))}
          </Text>
          {page * (data.meta.limit || 1) < (data.meta.total || 0) && (
            <View className="page-btn" onClick={() => setPage(page + 1)}>
              下一页
            </View>
          )}
        </View>
      )}
    </View>
  )
}

// 创建查询客户端并导出页面
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})

const HotelList: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HotelListContent />
  </QueryClientProvider>
)

export default HotelList
