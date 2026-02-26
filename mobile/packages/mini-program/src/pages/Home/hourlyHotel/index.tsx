import { useState } from 'react'
import { View, Text, Input, Picker, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MainLayout from '../../../layouts/MainLayout'
import styles from './index.module.scss'

/**
 * 钟点房首页
 */
export default function HomeHourlyHotelPage() {
  const [formData, setFormData] = useState({
    city: 'Beijing',
    date: new Date().toISOString().split('T')[0],
    checkIn: '12:00',
    checkOut: '18:00',
    guests: 2,
  })

  const cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Xian']
  const cityLabels = ['北京', '上海', '广州', '深圳', '成都', '西安']
  const cityIndex = cities.indexOf(formData.city)

  const handleCityChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      city: cities[e.detail.value],
    }))
  }

  const handleInputChange = (e: any, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(e.detail.value) : e.detail.value,
    }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams(
      Object.entries(formData).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        },
        {} as Record<string, string>
      )
    )
    Taro.navigateTo({
      url: `/pages/SearchResult/hourlyHotel/index?${params.toString()}`,
    })
  }

  return (
    <MainLayout>
      <View className={styles.container}>
        {/* 首页横幅 */}
        <View className={styles.banner}>
          <View className={styles.bannerContent}>
            <Text className={styles.bannerTitle}>发现您的钟点房</Text>
            <Text className={styles.bannerSubtitle}>在全国多家钟点房中搜索</Text>
          </View>
        </View>

        {/* 搜索表单 */}
        <View className={styles.searchSection}>
          <View className={styles.searchForm}>
            <View className={styles.formGroup}>
              <Text className={styles.label}>目的地</Text>
              <Picker
                mode="selector"
                range={cityLabels}
                value={cityIndex}
                onChange={handleCityChange}
              >
                <View className={styles.input}>{formData.city}</View>
              </Picker>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>日期</Text>
              <Input
                type="text"
                value={formData.date}
                onInput={(e) => handleInputChange(e, 'date')}
                className={styles.input}
                placeholder="选择日期"
                placeholderClass={styles.placeholder}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>入住时间</Text>
              <Input
                type="text"
                value={formData.checkIn}
                onInput={(e) => handleInputChange(e, 'checkIn')}
                className={styles.input}
                placeholder="选择入住时间"
                placeholderClass={styles.placeholder}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>退房时间</Text>
              <Input
                type="text"
                value={formData.checkOut}
                onInput={(e) => handleInputChange(e, 'checkOut')}
                className={styles.input}
                placeholder="选择退房时间"
                placeholderClass={styles.placeholder}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>房客数</Text>
              <Input
                type="number"
                value={formData.guests}
                onInput={(e) => handleInputChange(e, 'guests')}
                className={styles.input}
                placeholder="请输入房客数"
                placeholderClass={styles.placeholder}
              />
            </View>

            <Button className={styles.searchButton} onClick={handleSearch}>
              搜索
            </Button>
          </View>
        </View>

        {/* 特色推荐 */}
        <View className={styles.features}>
          <Text className={styles.featuresTitle}>为什么选择我们的钟点房？</Text>
          <View className={styles.featureGrid}>
            <View className={styles.featureCard}>
              <Text className={styles.icon}>💰</Text>
              <Text className={styles.featureCardTitle}>灵活定价</Text>
              <Text className={styles.featureCardDesc}>按小时计费，经济实惠</Text>
            </View>
            <View className={styles.featureCard}>
              <Text className={styles.icon}>🛡️</Text>
              <Text className={styles.featureCardTitle}>安全预订</Text>
              <Text className={styles.featureCardDesc}>所有交易均受保护</Text>
            </View>
            <View className={styles.featureCard}>
              <Text className={styles.icon}>🤝</Text>
              <Text className={styles.featureCardTitle}>24/7 支持</Text>
              <Text className={styles.featureCardDesc}>随时随地获得帮助</Text>
            </View>
            <View className={styles.featureCard}>
              <Text className={styles.icon}>⭐</Text>
              <Text className={styles.featureCardTitle}>真实评价</Text>
              <Text className={styles.featureCardDesc}>真实客人的真实评价</Text>
            </View>
          </View>
        </View>
      </View>
    </MainLayout>
  )
}
