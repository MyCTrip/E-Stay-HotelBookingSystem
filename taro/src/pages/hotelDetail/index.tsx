import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createUseHotelDetail } from '../../../../shared/dist'
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
 * 酒店详情页面
 */
const HotelDetailContent: React.FC = () => {
  const router = useRouter()
  const { hotelId, checkIn, checkOut } = router.params

  // 使用工厂函数创建 hook
  const useHotelDetail = createUseHotelDetail(api)
  const { data: hotel, isLoading, error } = useHotelDetail(hotelId as string)

  if (error) {
    return (
      <View className="detail-container">
        <Text className="error-text">加载失败，请重试</Text>
      </View>
    )
  }

  return (
    <ScrollView scrollY className="detail-container">
      {isLoading ? (
        <View className="loading">加载中...</View>
      ) : hotel ? (
        <>
          {/* 酒店图片轮播 */}
          <ScrollView scrollX className="images-scroll">
            {hotel.baseInfo?.images?.map((image, index) => (
              <Image
                key={index}
                src={image}
                mode="aspectFill"
                className="detail-image"
              />
            ))}
          </ScrollView>

          {/* 基本信息 */}
          <View className="info-section">
            <View className="hotel-header">
              <View className="hotel-title">
                <Text className="name">{hotel.baseInfo?.nameCn}</Text>
                <Text className="rating">
                  ★ {formatRating(hotel.baseInfo?.star || 0)}
                </Text>
              </View>
              <Text className="address">
                {hotel.baseInfo?.address}
              </Text>
            </View>

            {/* 价格和预订 */}
            <View className="price-section">
              <View className="price-info">
                <Text className="price">
                  {formatPrice((hotel as any).baseInfo?.price || 0)}
                </Text>
                <Text className="night">起/晚</Text>
              </View>
              <Button className="book-button">预订</Button>
            </View>

            {/* 描述 */}
            {hotel.baseInfo?.description && (
              <View className="description">
                <Text className="section-title">酒店介绍</Text>
                <Text className="description-text">
                  {hotel.baseInfo.description}
                </Text>
              </View>
            )}

            {/* 设施 */}
            {hotel.baseInfo?.facilities && hotel.baseInfo.facilities.length > 0 && (
              <View className="facilities">
                <Text className="section-title">设施</Text>
                <View className="facilities-list">
                  {(hotel.baseInfo.facilities as string[]).map((facility, index) => (
                    <View key={index} className="facility-tag">
                      {facility}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 入住信息 */}
            {hotel.checkinInfo && (
              <View className="checkin-info">
                <Text className="section-title">入住信息</Text>
                <View className="info-row">
                  <Text className="label">入住时间：</Text>
                  <Text className="value">
                    {hotel.checkinInfo.checkinTime}
                  </Text>
                </View>
                <View className="info-row">
                  <Text className="label">离店时间：</Text>
                  <Text className="value">
                    {hotel.checkinInfo.checkoutTime}
                  </Text>
                </View>
              </View>
            )}

            {/* 政策 */}
            {hotel.baseInfo?.policies && hotel.baseInfo.policies.length > 0 && (
              <View className="policies">
                <Text className="section-title">政策</Text>
                {(hotel.baseInfo.policies as string[]).map((policy, index) => (
                  <View key={index} className="policy-item">
                    <Text>• {policy}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 底部按钮 */}
            <View className="bottom-actions">
              <Button className="call-button">致电咨询</Button>
              <Button className="book-button-full">立即预订</Button>
            </View>
          </View>
        </>
      ) : null}
    </ScrollView>
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

const HotelDetail: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HotelDetailContent />
  </QueryClientProvider>
)

export default HotelDetail
