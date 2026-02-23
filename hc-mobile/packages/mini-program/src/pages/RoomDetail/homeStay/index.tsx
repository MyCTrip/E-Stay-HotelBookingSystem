import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 房间详情页 - 民宿类型
 */
export default function RoomDetailHomeStayPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">民宿房间详情</Text>
      </View>
      <View className="content">
        <Text className="description">这是民宿类型的房间详情页</Text>
      </View>
    </View>
  )
}
