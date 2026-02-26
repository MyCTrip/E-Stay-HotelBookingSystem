import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 酒店详情页 - 钟点房类型
 */
export default function HotelDetailHourlyHotelPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">钟点房详情</Text>
      </View>
      <View className="content">
        <Text className="description">这是钟点房类型的酒店详情页</Text>
      </View>
    </View>
  )
}
