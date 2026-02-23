import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import MainLayout from '../../layouts/MainLayout'
import styles from './index.module.scss'

/**
 * 酒店详情页面
 * 业务逻辑与web-h5完全相同
 */
export default function HotelDetailPage() {
  const [hotelId, setHotelId] = useState('')
  const hotelStore = useHotelStore()

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const id = instance?.router?.params?.id as string
    setHotelId(id)
  }, [])

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: async () => {
      try {
        await hotelStore.getState().fetchHotelDetail(hotelId)
        return hotelStore.getState().currentHotel
      } catch (err) {
        console.error('Failed to fetch hotel:', err)
        return null
      }
    },
    enabled: !!hotelId,
  })

  if (isLoading) {
    return <View className={styles.loading}>加载中...</View>
  }

  if (!hotel) {
    return <View className={styles.error}>酒店不存在或加载失败</View>
  }

  return (
    <MainLayout>
      <View className={styles.container}>
        {/* 图片库 */}
        <View className={styles.gallery}>
          <View className={styles.mainImage}>
            <Image
              src={hotel.baseInfo?.images?.[0] || 'https://via.placeholder.com/800x400'}
              mode="aspectFill"
            />
          </View>
          {hotel.baseInfo?.images && hotel.baseInfo.images.length > 0 && (
            <View className={styles.thumbnails}>
              {hotel.baseInfo.images.map((img: string, idx: number) => (
                <Image
                  key={idx}
                  src={img}
                  className={idx === 0 ? styles.active : ''}
                  mode="aspectFill"
                />
              ))}
            </View>
          )}
        </View>

        {/* 基本信息 */}
        <View className={styles.info}>
          <View className={styles.header}>
            <View>
              <Text className={styles.h1}>{hotel.baseInfo?.nameCn}</Text>
              <View className={styles.meta}>
                <Text className={styles.stars}>{'⭐'.repeat(hotel.baseInfo?.star || 3)}</Text>
                <Text className={styles.address}>{hotel.baseInfo?.address}</Text>
              </View>
            </View>
          </View>

          <Text className={styles.description}>{hotel.baseInfo?.description}</Text>

          {/* 设施信息 */}
          {hotel.baseInfo?.facilities && hotel.baseInfo.facilities.length > 0 && (
            <View className={styles.section}>
              <Text className={styles.h2}>设施</Text>
              <View className={styles.facilitiesGrid}>
                {hotel.baseInfo.facilities.map((facility: any, idx: number) => (
                  <View key={idx} className={styles.facility}>
                    <Text className={styles.facilityName}>{facility.category}</Text>
                    <Text className={styles.facilityContent}>{facility.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 政策信息 */}
          {hotel.baseInfo?.policies && hotel.baseInfo.policies.length > 0 && (
            <View className={styles.section}>
              <Text className={styles.h2}>政策</Text>
              <View className={styles.policiesGrid}>
                {hotel.baseInfo.policies.map((policy: any, idx: number) => (
                  <View key={idx} className={styles.policy}>
                    <Text className={styles.policyType}>{policy.policyType}</Text>
                    <Text className={styles.policyContent}>{policy.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 入住信息 */}
          {hotel.checkinInfo && (
            <View className={styles.section}>
              <Text className={styles.h2}>入住信息</Text>
              <View className={styles.checkinInfo}>
                <Text className={styles.infoItem}>
                  <Text className={styles.infoLabel}>入住时间：</Text>{' '}
                  {hotel.checkinInfo.checkinTime}
                </Text>
                <Text className={styles.infoItem}>
                  <Text className={styles.infoLabel}>退房时间：</Text>{' '}
                  {hotel.checkinInfo.checkoutTime}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </MainLayout>
  )
}
