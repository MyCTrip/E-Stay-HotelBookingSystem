import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import MainLayout from '../../layouts/MainLayout'
import { navigate } from '../../router'
import styles from './index.module.scss'

/**
 * 搜索结果页面
 * 业务逻辑与web-h5完全相同
 */
export default function SearchResultPage() {
  const hotelStore = useHotelStore()
  const [searchParams, setSearchParams] = useState<any>(null)

  // 从storage获取搜索参数
  useEffect(() => {
    const params = Taro.getStorageSync('lastSearchQuery')
    setSearchParams(params || {})
  }, [])

  const city = searchParams?.city || ''
  const checkIn = searchParams?.checkIn || ''
  const checkOut = searchParams?.checkOut || ''

  // 从store获取酒店数据
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels', { city, checkIn, checkOut }],
    queryFn: async () => {
      try {
        await hotelStore.getState().fetchHotels({ city, checkIn, checkOut })
        return hotelStore.getState().hotels
      } catch (err) {
        console.error('Failed to fetch hotels:', err)
        return []
      }
    },
    enabled: !!city,
  })

  return (
    <MainLayout>
      <View className={styles.container}>
        {!city ? (
          <View className={styles.empty}>
            <Text>请输入搜索条件</Text>
          </View>
        ) : (
          <>
            <View className={styles.header}>
              <Text className={styles.title}>搜索结果</Text>
              <Text className={styles.subtitle}>
                {city} · {checkIn} 至 {checkOut}
              </Text>
            </View>

            {hotels.length === 0 ? (
              <View className={styles.empty}>
                <Text>未找到酒店，请尝试调整搜索条件</Text>
              </View>
            ) : (
              <View className={styles.hotelList}>
                {hotels.map((hotel: any) => (
                  <View
                    key={hotel._id}
                    className={styles.hotelCard}
                    onClick={() => navigate.toHotelDetail(hotel._id)}
                  >
                    <View className={styles.image}>
                      <Image
                        src={hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/300x200'}
                        alt={hotel.baseInfo?.nameCn}
                        className={styles.img}
                        mode="aspectFill"
                      />
                    </View>
                    <View className={styles.content}>
                      <Text className={styles.hotelName}>{hotel.baseInfo?.nameCn}</Text>
                      <View className={styles.rating}>
                        <Text className={styles.stars}>
                          {'⭐'.repeat(hotel.baseInfo?.star || 3)}
                        </Text>
                        <Text className={styles.star}>{hotel.baseInfo?.star} 星</Text>
                      </View>
                      <Text className={styles.address}>{hotel.baseInfo?.address}</Text>
                      <Text className={styles.description}>
                        {hotel.baseInfo?.description}
                      </Text>
                      <View className={styles.footer}>
                        <Text className={styles.price}>
                          ¥{hotel.baseInfo?.price || '0'}/晚
                        </Text>
                        <Text className={styles.cta}>查看详情 →</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </MainLayout>
  )
}
  const hotelStore = useHotelStore()
  const [searchParams, setSearchParams] = useState<any>(null)

  // 从storage获取搜索参数
  useEffect(() => {
    const params = Taro.getStorageSync('lastSearchQuery')
    setSearchParams(params || {})
  }, [])

  const city = searchParams?.city || ''
  const checkIn = searchParams?.checkIn || ''
  const checkOut = searchParams?.checkOut || ''

  // 从store获取酒店数据
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels', { city, checkIn, checkOut }],
    queryFn: async () => {
      try {
        await hotelStore.getState().fetchHotels({ city, checkIn, checkOut })
        return hotelStore.getState().hotels
      } catch (err) {
        console.error('Failed to fetch hotels:', err)
        return []
      }
    },
    enabled: !!city,
  })

  if (!city) {
    return (
      <View className={styles.container}>
        <View className={styles.empty}>
          <Text>请输入搜索条件</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>搜索结果</Text>
        <Text className={styles.subtitle}>
          {city} · {checkIn} 至 {checkOut}
        </Text>
      </View>

      {hotels.length === 0 ? (
        <View className={styles.empty}>
          <Text>未找到酒店，请尝试调整搜索条件</Text>
        </View>
      ) : (
        <View className={styles.hotelList}>
          {hotels.map((hotel: any) => (
            <View
              key={hotel._id}
              className={styles.hotelCard}
              onClick={() => navigate.toHotelDetail(hotel._id)}
            >
              <View className={styles.image}>
                <Image
                  src={hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={hotel.baseInfo?.nameCn}
                  className={styles.img}
                  mode="aspectFill"
                />
              </View>
              <View className={styles.content}>
                <Text className={styles.hotelName}>{hotel.baseInfo?.nameCn}</Text>
                <View className={styles.rating}>
                  <Text className={styles.stars}>
                    {'⭐'.repeat(hotel.baseInfo?.star || 3)}
                  </Text>
                  <Text className={styles.star}>{hotel.baseInfo?.star} 星</Text>
                </View>
                <Text className={styles.address}>{hotel.baseInfo?.address}</Text>
                <Text className={styles.description}>
                  {hotel.baseInfo?.description}
                </Text>
                <View className={styles.footer}>
                  <Text className={styles.price}>
                    ¥{hotel.baseInfo?.price || '0'}/晚
                  </Text>
                  <Text className={styles.cta}>查看详情 →</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
