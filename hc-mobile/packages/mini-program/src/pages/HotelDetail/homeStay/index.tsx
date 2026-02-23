import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 酒店详情页 - 民宿类型
 */
export default function HotelDetailHomeStayPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">民宿详情</Text>
      </View>
      <View className="content">
        <Text className="description">这是民宿类型的酒店详情页</Text>
      </View>
    </View>
  )
}
