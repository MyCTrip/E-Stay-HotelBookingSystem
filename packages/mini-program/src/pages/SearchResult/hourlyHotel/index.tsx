import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 搜索结果页 - 钟点房类型
 */
export default function SearchResultHourlyHotelPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">钟点房搜索结果</Text>
      </View>
      <View className="content">
        <Text className="description">这是钟点房类型的搜索结果页</Text>
      </View>
    </View>
  )
}
