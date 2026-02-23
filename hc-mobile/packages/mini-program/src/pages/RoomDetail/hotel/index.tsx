import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 房间详情页 - 酒店类型
 */
export default function RoomDetailHotelPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">酒店房间详情</Text>
      </View>
      <View className="content">
        <Text className="description">这是酒店类型的房间详情页</Text>
      </View>
    </View>
  )
}
