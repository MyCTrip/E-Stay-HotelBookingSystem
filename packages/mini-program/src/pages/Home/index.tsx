import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Picker, Button } from '@tarojs/components'
import MainLayout from '../../layouts/MainLayout'
import { navigate } from '../../router'
import styles from './index.module.scss'

/**
 * 首页
 * 业务逻辑与web-h5完全相同
 */
export default function HomePage() {
  const [formData, setFormData] = useState({
    city: 'Beijing',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
  })

  const cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Xian']
  const cityLabels = ['北京', '上海', '广州', '深圳', '成都', '西安']
  const guestOptions = Array.from({ length: 8 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }))

  const cityIndex = cities.indexOf(formData.city)

  const handleCityChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      city: cities[e.detail.value],
    }))
  }

  const handleCheckInChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      checkIn: e.detail.value,
    }))
  }

  const handleCheckOutChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      checkOut: e.detail.value,
    }))
  }

  const handleGuestsChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      guests: parseInt(e.detail.value) || 1,
    }))
  }

  const handleSearch = () => {
    // 通过storage传递参数（Taro URL参数传递有长度限制）
    Taro.setStorageSync('lastSearchQuery', formData)
    navigate.toSearchResult()
  }

  return (
    <MainLayout>
      <View className={styles.container}>
        {/* 首页横幅 */}
        <View className={styles.banner}>
          <View className={styles.bannerContent}>
            <Text className={styles.bannerTitle}>发现您的下一个住处</Text>
            <Text className={styles.bannerSubtitle}>
              在全球数百万家酒店、客民宿和其他住处中搜索
            </Text>
          </View>
        </View>

        {/* 搜索表单 */}
        <View className={styles.searchSection}>
          <View className={styles.searchForm}>
            {/* 目的地 */}
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

            {/* 入住日期 */}
            <View className={styles.formGroup}>
              <Text className={styles.label}>入住日期</Text>
              <Input
                type="text"
                placeholder="选择入住日期"
                value={formData.checkIn}
                onChange={handleCheckInChange}
                className={styles.input}
                placeholderClass={styles.placeholder}
              />
            </View>

            {/* 退房日期 */}
            <View className={styles.formGroup}>
              <Text className={styles.label}>退房日期</Text>
              <Input
                type="text"
                placeholder="选择退房日期"
                value={formData.checkOut}
                onChange={handleCheckOutChange}
                className={styles.input}
                placeholderClass={styles.placeholder}
              />
            </View>

            {/* 房客数 */}
            <View className={styles.formGroup}>
              <Text className={styles.label}>房客数</Text>
              <Picker
                mode="selector"
                range={guestOptions}
                rangeKey="label"
                value={formData.guests - 1}
                onChange={handleGuestsChange}
              >
                <View className={styles.input}>{formData.guests}人</View>
              </Picker>
            </View>

            <Button className={styles.searchButton} onClick={handleSearch}>
              搜索
            </Button>
          </View>
        </View>

        {/* 特色推荐 */}
        <View className={styles.features}>
          <Text className={styles.featuresTitle}>为什么选择 E-Stay？</Text>
          <View className={styles.featureGrid}>
            <View className={styles.featureCard}>
              <Text className={styles.icon}>💰</Text>
              <Text className={styles.featureCardTitle}>最佳价格保证</Text>
              <Text className={styles.featureCardDesc}>找不到更好的价格</Text>
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
              <Text className={styles.featureCardTitle}>酒店评论</Text>
              <Text className={styles.featureCardDesc}>真实客人的真实评价</Text>
            </View>
          </View>
        </View>
      </View>
    </MainLayout>
  )
}
