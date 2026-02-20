import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 房间详情页 - 钟点房类型
 */
export default function RoomDetailHourlyHotelPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">钟点房房间详情</Text>
      </View>
      <View className="content">
        <Text className="description">这是钟点房类型的房间详情页</Text>
      </View>
    </View>
  )
}
