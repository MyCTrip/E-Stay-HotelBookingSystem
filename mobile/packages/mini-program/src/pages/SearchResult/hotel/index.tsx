import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 搜索结果页 - 酒店类型
 */
export default function SearchResultHotelPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">酒店搜索结果</Text>
      </View>
      <View className="content">
        <Text className="description">这是酒店类型的搜索结果页</Text>
      </View>
    </View>
  )
}
