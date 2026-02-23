import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 搜索结果页 - 民宿类型
 */
export default function SearchResultHomeStayPage() {
  return (
    <View className="container">
      <View className="header">
        <Text className="title">民宿搜索结果</Text>
      </View>
      <View className="content">
        <Text className="description">这是民宿类型的搜索结果页</Text>
      </View>
    </View>
  )
}
