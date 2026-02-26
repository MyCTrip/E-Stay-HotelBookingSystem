/**
 * 民宿搜索结果页面 - 小程序版本
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Toast } from '@nutui/nutui-taro-react'
import dayjs from 'dayjs'
import HomeStayCard from '../../../components/homestay/home/HomeStayCard'
import type { HomeStay, HomeStaySearchParams } from '@estay/shared'
import styles from './index.module.scss'

const SearchResultPage: React.FC = () => {
  const router = useRouter()
  const query = router.params

  // 搜索条件
  const [filters, setFilters] = useState<HomeStaySearchParams>({
    city: query.city || '上海',
    checkIn: dayjs(query.checkIn).toDate(),
    checkOut: dayjs(query.checkOut).toDate(),
    guests: Number(query.guests) || 1,
    rooms: 1,
    beds: 1,
    keyword: '',
    selectedTags: [],
    priceMin: 0,
    priceMax: 5000,
  })

  // 结果状态
  const [homestays, setHomestays] = useState<HomeStay[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  })

  // UI状态
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'newest'>('newest')
  const [scrollTop, setScrollTop] = useState(0)

  // 加载搜索结果
  useEffect(() => {
    loadSearchResults()
  }, [filters])

  const loadSearchResults = async () => {
    setLoading(true)
    try {
      // TODO: 调用API获取搜索结果
      // const data = await fetchHomestays(filters)
      // setHomestays(data.homestays)
      // setPagination(data.pagination)
      setHomestays([])
      setPagination({ page: 1, limit: 20, total: 0 })
    } catch (error) {
      console.error('Failed to load search results:', error)
      Toast.fail('加载搜索结果失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载更多
  const loadMore = useCallback(async () => {
    if (pagination.page * pagination.limit >= pagination.total) {
      return
    }

    setLoading(true)
    try {
      // TODO: 调用API获取更多结果
      const nextPage = pagination.page + 1
      // const data = await fetchHomestays({ ...filters, page: nextPage })
      // setHomestays([...homestays, ...data.homestays])
      // setPagination({ ...pagination, page: nextPage })
    } catch (error) {
      console.error('Failed to load more results:', error)
      Toast.fail('加载更多结果失败')
    } finally {
      setLoading(false)
    }
  }, [pagination, filters])

  // 处理滚动到底部
  const handleScroll = (e: any) => {
    const scrollHeight = e.currentTarget.scrollHeight
    const clientHeight = e.currentTarget.clientHeight
    const scrollTop = e.detail.scrollTop

    setScrollTop(scrollTop)

    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    if (isNearBottom && !loading) {
      loadMore()
    }
  }

  // 处理排序
  const handleSort = (type: typeof sortBy) => {
    setSortBy(type)
    // TODO: 根据排序类型重新排序 homestays
  }

  // 处理卡片点击
  const handleCardClick = (id: string) => {
    router.push(`/pages/hotel-detail/homeStay/index?id=${id}`)
  }

  return (
    <View className={styles.container}>
      {/* 搜索条件栏 */}
      <View className={styles.conditionBar}>
        <View className={styles.conditionItem}>
          <View className={styles.label}>城市:</View>
          <View className={styles.value}>{filters.city}</View>
        </View>
        <View className={styles.conditionItem}>
          <View className={styles.label}>日期:</View>
          <View className={styles.value}>
            {dayjs(filters.checkIn).format('M月D日')} - {dayjs(filters.checkOut).format('M月D日')}
          </View>
        </View>
        <View className={styles.conditionItem}>
          <View className={styles.label}>人数:</View>
          <View className={styles.value}>{filters.guests}人</View>
        </View>
      </View>

      {/* 排序选项 */}
      <View className={styles.sortBar}>
        <View
          className={`${styles.sortBtn} ${sortBy === 'newest' ? styles.active : ''}`}
          onClick={() => handleSort('newest')}
        >
          最新
        </View>
        <View
          className={`${styles.sortBtn} ${sortBy === 'price' ? styles.active : ''}`}
          onClick={() => handleSort('price')}
        >
          价格
        </View>
        <View
          className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.active : ''}`}
          onClick={() => handleSort('rating')}
        >
          评分
        </View>
      </View>

      {/* 结果列表 */}
      <ScrollView scrollY className={styles.resultList} onScroll={handleScroll}>
        {loading && homestays.length === 0 ? (
          <View className={styles.loadingState}>
            <View>加载中...</View>
          </View>
        ) : homestays.length === 0 ? (
          <View className={styles.emptyState}>
            <View>☹️</View>
            <View>未找到匹配的民宿</View>
            <View className={styles.backBtn} onClick={() => router.switchTab('/pages/index/index')}>
              返回首页
            </View>
          </View>
        ) : (
          <>
            {homestays.map((homestay) => (
              <View key={homestay._id} onClick={() => handleCardClick(homestay._id)}>
                <HomeStayCard
                  data={homestay}
                  onClick={() => handleCardClick(homestay._id)}
                  variant="default"
                  showStar
                />
              </View>
            ))}
            {loading && (
              <View className={styles.loadingSpinner}>
                <View>加载更多...</View>
              </View>
            )}
            {!loading &&
              pagination.page * pagination.limit >= pagination.total &&
              homestays.length > 0 && (
                <View className={styles.endMessage}>
                  <View>已加载全部 {pagination.total} 个民宿</View>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default SearchResultPage
