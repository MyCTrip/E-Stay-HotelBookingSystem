/**
 * 民宿搜索结果页面 - Web H5版本
 * 集成 Zustand Store 获取搜索结果数据并实现无限滚动
 */

import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useHomestayStore } from '@estay/shared'
import SearchResultList from '../../../components/homestay/search/SearchResultList'
import type { HomeStaySearchParams } from '@estay/shared'
import styles from './index.module.scss'

interface SearchFilters {
  city?: string
  checkInDate?: string
  checkOutDate?: string
  roomCount?: number
  guestCount?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 获取 Store 状态和 Action
  const {
    searchParams: storeSearchParams,
    homestays,
    searchLoading,
    fetchSearchResults,
    // 假设你的 Store 提供了追加加载的 action，如果没有，建议在 Store 中增加
    // 或者在此页面手动处理数据追加
  } = useHomestayStore()

  // --- 🌟 1. 新增无限滚动相关状态 ---
  const [loadingMore, setLoadingMore] = useState(false) // 是否正在加载更多
  const [hasMore, setHasMore] = useState(true)        // 是否还有更多数据
  const [page, setPage] = useState(1)                 // 当前页码
  const PAGE_SIZE = 20                                // 每页条数

  // 本地过滤条件
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || '上海',
    checkInDate: searchParams.get('checkIn') || dayjs().format('YYYY-MM-DD'),
    checkOutDate: searchParams.get('checkOut') || dayjs().add(1, 'day').format('YYYY-MM-DD'),
    roomCount: Number(searchParams.get('rooms')) || 1,
    guestCount: Number(searchParams.get('guests')) || 1,
  })

  // 首次进入页面时获取搜索结果
  useEffect(() => {
    const handleSearch = async () => {
      try {
        setPage(1)     // 重置页码
        setHasMore(true) // 重置加载状态
        
        const params: HomeStaySearchParams = {
          city: searchParams.get('city') || '上海',
          checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : dayjs().toDate(),
          checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : dayjs().add(1, 'day').toDate(),
          guests: Number(searchParams.get('guests')) || 1,
          rooms: Number(searchParams.get('rooms')) || 1,
          beds: 0,
          keyword: '',
          selectedTags: [],
          priceMin: 0,
          priceMax: 10000,
          page: 1,
          limit: PAGE_SIZE,
        }

        await fetchSearchResults(params)
      } catch (error) {
        console.error('Failed to load search results:', error)
      }
    }

    handleSearch()
  }, [searchParams, fetchSearchResults])

  // --- 2. 处理加载更多逻辑 ---
  const handleLoadMore = useCallback(async () => {
    //防抖：正在加载中、没有更多数据则停止
    if (searchLoading || loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1

    try {
      // 记录请求前的长度
      const prevLength = homestays.length

      const params: HomeStaySearchParams = {
        city: filters.city || '上海',
        checkIn: new Date(filters.checkInDate || dayjs().toDate()),
        checkOut: new Date(filters.checkOutDate || dayjs().add(1, 'day').toDate()),
        guests: filters.guestCount || 1,
        rooms: filters.roomCount || 1,
        beds: 0,
        keyword: '',
        selectedTags: [],
        priceMin: filters.priceMin || 0,
        priceMax: filters.priceMax || 10000,
        page: nextPage,
        limit: PAGE_SIZE,
      }

      // 执行搜索 (假设 Store 内部会执行 homestays = [...old, ...new])
      await fetchSearchResults(params)
      
      // 通过 Store 中 homestays 的最新长度判断是否还有更多
      // 如果本次请求后，总长度没有增加，或者增加的量小于 PAGE_SIZE，说明没数据了
      const currentLength = useHomestayStore.getState().homestays.length
      const addedCount = currentLength - prevLength

      if (addedCount < PAGE_SIZE) {
        setHasMore(false)
      }
      
      setPage(nextPage)
    } catch (error) {
      console.error('Failed to load more results:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [page, searchLoading, loadingMore, hasMore, filters, fetchSearchResults, homestays.length])

  // 处理筛选条件变化
  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters)
    // 筛选条件变化时通常需要重置页码并重新请求
  }, [])

  // 处理修改搜索条件
  const handleModifySearch = useCallback(() => {
    navigate('/home/homeStay')
  }, [navigate])

  return (
    <div className={styles.container}>
      <SearchResultList
        data={homestays}
        loading={searchLoading}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onModifySearch={handleModifySearch}
        // --- 🌟 3. 将无限滚动属性传递给列表组件 ---
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}

export default SearchResultPage