import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// 移除多余的 useQuery，让 Zustand 全权接管状态调度
import { useHotelStore } from '@estay/shared'
import MainLayout from '../../layouts/MainLayout'
import { navigate } from '../../router'
import styles from './index.module.scss'

/**
 * 搜索结果页面 (小程序端)
 */
export default function SearchResultPage() {
  // 1. 🚀 按需解构：直接获取状态和方法，彻底告别 getState() 和类型未知报错！
  const hotels = useHotelStore(state => state.hotels)
  const ui = useHotelStore(state => state.ui)
  const fetchHotels = useHotelStore(state => state.fetchHotels)
  const setStoreParams = useHotelStore(state => state.setSearchParams)

  const [localParams, setLocalParams] = useState<any>(null)

  useEffect(() => {
    // 2. 读取小程序本地缓存的搜索参数
    const params = Taro.getStorageSync('lastSearchQuery') || {}
    setLocalParams(params)
    
    if (params.city) {
      // 将缓存参数同步到全局 Store
      setStoreParams({
        city: params.city,
        checkInDate: params.checkIn,
        checkOutDate: params.checkOut,
        page: 1
      })
      // 发起数据请求
      fetchHotels({ 
        city: params.city, 
        checkInDate: params.checkIn, 
        checkOutDate: params.checkOut,
        page: 1 
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const city = localParams?.city || ''
  const city = localParams?.city || '北京'
  const checkIn = localParams?.checkIn || ''
  const checkOut = localParams?.checkOut || ''

  // 如果没有城市参数，提示输入
  if (!city) {
    return (
      <MainLayout>
        <View className={styles.container}>
          <View className={styles.empty}>
            <Text>请输入搜索条件</Text>
          </View>
        </View>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>搜索结果</Text>
          <Text className={styles.subtitle}>
            {city} {checkIn && checkOut ? `· ${checkIn} 至 ${checkOut}` : ''}
          </Text>
        </View>

        {/* 3. 🚀 结合 loading 状态，让界面更优雅 */}
        {ui.listLoading ? (
           <View className={styles.empty}>
             <Text>酒店数据全速加载中... 🚀</Text>
           </View>
        ) : hotels.length === 0 ? (
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
                    className={styles.img}
                    mode="aspectFill"
                    lazyLoad // 顺手加上小程序原生懒加载
                  />
                </View>
                <View className={styles.content}>
                  <Text className={styles.hotelName}>{hotel.baseInfo?.nameCn}</Text>
                  
                  <View className={styles.rating}>
                    <Text className={styles.stars}>{'⭐'.repeat(hotel.baseInfo?.star || 3)}</Text>
                    <Text className={styles.star}>{hotel.baseInfo?.star} 星</Text>
                  </View>
                  
                  <Text className={styles.address}>{hotel.baseInfo?.address}</Text>
                  <Text className={styles.description}>{hotel.baseInfo?.description}</Text>
                  <View className={styles.footer}>
                    <Text className={styles.price}>¥{hotel.baseInfo?.price || '0'}/晚</Text>
                    <Text className={styles.cta}>查看详情 →</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </MainLayout>
  )
}