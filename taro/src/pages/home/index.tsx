import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker, Input, Button } from '@tarojs/components'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createPersistentSearchStore } from '../../../../shared/dist'
import { taroStorage } from '../../config'
import './index.css'

// 定义全局环境变量，防止Zustand环境检查错误
if (typeof (global as any).development === 'undefined') {
  (global as any).development = process.env.NODE_ENV === 'development'
}
if (typeof (global as any).production === 'undefined') {
  (global as any).production = process.env.NODE_ENV === 'production'
}

/**
 * 首页 - 酒店搜索入口
 */
const HomeContent: React.FC = () => {
  const [cities, setCities] = useState<string[]>(['北京', '上海', '广州', '深圳'])
  const [selectedCityIndex, setSelectedCityIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(false)

  // 使用共享的搜索stores
  const useSearchStore = createPersistentSearchStore(taroStorage)
  const searchState = useSearchStore()

  // 暂时注释掉API调用，使用本地城市数据
  // const useCities = createUseCities(api)
  // const { data: citiesData, isLoading: citiesLoading } = useCities()

  // useEffect(() => {
  //   if (citiesData) {
  //     setCities(citiesData)
  //     const savedCity = searchState.city
  //     const cityIndex = citiesData.indexOf(savedCity)
  //     setSelectedCityIndex(cityIndex !== -1 ? cityIndex : 0)
  //   }
  // }, [citiesData, searchState.city])

  // 恢复搜索条件
  useEffect(() => {
    if (searchState) {
      setCheckIn(searchState.checkIn || '')
      setCheckOut(searchState.checkOut || '')
    }
  }, [])

  const handleCityChange = (e: any) => {
    const index = parseInt(e.detail.value, 10)
    setSelectedCityIndex(index)
    searchState.setCity(cities[index])
  }

  const handleSearch = () => {
    if (!cities[selectedCityIndex]) {
      Taro.showToast({
        title: '请选择城市',
        icon: 'none',
      })
      return
    }

    if (!checkIn || !checkOut) {
      Taro.showToast({
        title: '请选择入住和离店日期',
        icon: 'none',
      })
      return
    }

    // 保存搜索条件
    searchState.setCheckIn(checkIn)
    searchState.setCheckOut(checkOut)

    setLoading(true)

    // 延迟导航，让状态保存完成
    setTimeout(() => {
      Taro.navigateTo({
        url: `/pages/hotelList/index?city=${cities[selectedCityIndex]}&checkIn=${checkIn}&checkOut=${checkOut}`,
      })
      setLoading(false)
    }, 100)
  }

  // 暂时移除加载检查，直接显示表单
  // if (citiesLoading) {
  //   return (
  //     <View className="home-container">
  //       <Text>加载城市中...</Text>
  //     </View>
  //   )
  // }

  return (
    <View className="home-container">
      {/* 大 Banner */}
      <View className="banner">
        <View className="banner-content">
          <Text className="banner-title">找到你的理想酒店</Text>
          <Text className="banner-subtitle">全国 1000+ 酒店，随时预订</Text>
        </View>
      </View>

      {/* 搜索卡片 */}
      <View className="search-card">
        <View className="search-title">搜索酒店</View>

        {/* 城市选择 */}
        <View className="form-group">
          <Text className="label">目的地</Text>
          <Picker
            mode="selector"
            range={cities}
            onChange={handleCityChange}
            value={selectedCityIndex}
          >
            <View className="picker-value">
              {cities[selectedCityIndex] || '选择城市'}
            </View>
          </Picker>
        </View>

        {/* 入住日期 */}
        <View className="form-group">
          <Text className="label">入住</Text>
          <Input
            type="text"
            placeholder="YYYY-MM-DD"
            value={checkIn}
            onInput={(e) => setCheckIn(e.detail.value)}
            className="input"
          />
        </View>

        {/* 离店日期 */}
        <View className="form-group">
          <Text className="label">离店</Text>
          <Input
            type="text"
            placeholder="YYYY-MM-DD"
            value={checkOut}
            onInput={(e) => setCheckOut(e.detail.value)}
            className="input"
          />
        </View>

        {/* 搜索按钮 */}
        <Button
          className="search-button"
          onClick={handleSearch}
          loading={loading}
        >
          查询
        </Button>
      </View>

      {/* 热门标签 */}
      <View className="tags-card">
        <Text className="tags-title">热门标签</Text>
        <View className="tags-container">
          {['亲子', '豪华', '免费停车', '近地铁', '商务'].map((tag) => (
            <View key={tag} className="tag-button">
              <Text>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// 创建查询客户端并导出页面
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})

const Home: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HomeContent />
  </QueryClientProvider>
)

export default Home
