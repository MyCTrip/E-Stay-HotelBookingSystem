import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { useQuery } from '@tanstack/react-query'
import { useHotelStore } from '@estay/shared'
import MainLayout from '../../layouts/MainLayout'
import styles from './index.module.scss'

/**
 * 房型详情页面
 * 业务逻辑与web-h5完全相同
 */
export default function RoomDetailPage() {
  const [roomId, setRoomId] = useState('')
  const hotelStore = useHotelStore()

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const id = instance?.router?.params?.id as string
    setRoomId(id)
  }, [])

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      try {
        await hotelStore.getState().fetchRoomDetail(roomId)
        return hotelStore.getState().currentRoom
      } catch (err) {
        console.error('Failed to fetch room:', err)
        return null
      }
    },
    enabled: !!roomId,
  })

  if (isLoading) {
    return (
      <MainLayout>
        <View className={styles.loading}>加载中...</View>
      </MainLayout>
    )
  }

  if (!room) {
    return (
      <MainLayout>
        <View className={styles.error}>房间不存在或加载失败</View>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <View className={styles.container}>
        <View className={styles.gallery}>
          <Image
            src={room.baseInfo?.images?.[0] || 'https://via.placeholder.com/800x400'}
            className={styles.mainImage}
            mode="aspectFill"
          />
        </View>

        <View className={styles.info}>
          <View className={styles.header}>
            <View>
              <Text className={styles.h1}>{room.baseInfo?.type}</Text>
              <Text className={styles.price}>¥{room.baseInfo?.price}/晚</Text>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.h2}>客容量</Text>
            <Text>最多可容纳 {room.baseInfo?.maxOccupancy} 位客人</Text>
          </View>

          {room.headInfo && (
            <View className={styles.section}>
              <Text className={styles.h2}>房间设施</Text>
              <View className={styles.features}>
                <View className={styles.feature}>
                  <Text className={styles.featureLabel}>📐 房间大小</Text>
                  <Text className={styles.featureValue}>{room.headInfo.size}</Text>
                </View>
                {room.headInfo.floor && (
                  <View className={styles.feature}>
                    <Text className={styles.featureLabel}>📍 所在楼层</Text>
                    <Text className={styles.featureValue}>{room.headInfo.floor}</Text>
                  </View>
                )}
                <View className={styles.feature}>
                  <Text className={styles.featureLabel}>
                    {room.headInfo.wifi ? '📡' : '❌'} WiFi
                  </Text>
                  <Text className={styles.featureValue}>{room.headInfo.wifi ? '有' : '无'}</Text>
                </View>
                <View className={styles.feature}>
                  <Text className={styles.featureLabel}>
                    {room.headInfo.windowAvailable ? '🪟' : '❌'} 窗户
                  </Text>
                  <Text className={styles.featureValue}>
                    {room.headInfo.windowAvailable ? '有' : '无'}
                  </Text>
                </View>
                <View className={styles.feature}>
                  <Text className={styles.featureLabel}>🚭 吸烟</Text>
                  <Text className={styles.featureValue}>
                    {room.headInfo.smokingAllowed ? '允许' : '不允许'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {room.bedInfo && room.bedInfo.length > 0 && (
            <View className={styles.section}>
              <Text className={styles.h2}>床位信息</Text>
              {room.bedInfo.map((bed: any, idx: number) => (
                <View key={idx} className={styles.bedItem}>
                  <Text className={styles.bedType}>{bed.bedType}</Text>
                  <Text>
                    数量: {bed.bedNumber} | 尺寸: {bed.bedSize}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {room.breakfastInfo && (
            <View className={styles.section}>
              <Text className={styles.h2}>早餐</Text>
              <Text>{room.breakfastInfo.breakfastType}</Text>
            </View>
          )}

          <Button className={styles.bookButton}>立即预订</Button>
        </View>
      </View>
    </MainLayout>
  )
}
