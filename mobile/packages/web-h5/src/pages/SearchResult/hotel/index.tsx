import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore, useHotelStore, type HotelMarket, dateToString } from '@estay/shared'
import SearchResultList, { type SearchFilters } from '../../../components/hotels/search/SearchResultList'
import styles from './index.module.css'

/* =========================================
   工具函数：解析 URL 参数
========================================= */
const parsePositiveNumber = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const parseNonNegativeNumber = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const parseMarket = (value: string | null): HotelMarket | null =>
  value === 'domestic' || value === 'international' ? value : null

const parseStars = (value: string | null): number[] | undefined => {
  if (!value) return undefined
  const stars = value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0)
  return stars.length > 0 ? stars : undefined
}

/* =========================================
   主页面组件
========================================= */
export default function SearchResultHotelPage() {
  const [urlParams] = useSearchParams()
  const initializedRef = useRef(false)
  
  // 从 Store 获取状态和方法
  const { currentHotelMarket, setMarket } = useAppStore()
  const {
    searchParams,
    hotelList,
    loading,      // 主查询加载状态
    hasMore,      // 是否还有更多数据
    setSearchParams,
    fetchHotels,
    fetchMoreHotels, // 异步加载下一页的方法
  } = useHotelStore()

  // 🌟 1. 新增：加载更多状态管理
  const [loadingMore, setLoadingMore] = useState(false)

  // 本地筛选状态（用于 UI 展示）
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.city,
    checkInDate: dateToString(searchParams.checkInDate),
    checkOutDate: dateToString(searchParams.checkOutDate),
    roomCount: 1,
    guestCount: 2,
    priceMin: searchParams.minPrice,
    priceMax: searchParams.maxPrice,
    stars: searchParams.stars,
    facilities: [],
  })

  /* 初始化：将 URL 参数同步到 Store 和本地 State */
  useEffect(() => {
    if (initializedRef.current) return

    const marketFromUrl = parseMarket(urlParams.get('market'))
    const city = urlParams.get('city') ?? searchParams.city
    const keyword = urlParams.get('keyword') ?? searchParams.keyword ?? ''
    const checkInDate = urlParams.get('checkInDate') ?? dateToString(searchParams.checkInDate)
    const checkOutDate = urlParams.get('checkOutDate') ?? dateToString(searchParams.checkOutDate)
    const page = parsePositiveNumber(urlParams.get('page'), 1)
    const limit = parsePositiveNumber(urlParams.get('limit'), searchParams.limit)
    const minPrice = parseNonNegativeNumber(urlParams.get('minPrice'), searchParams.minPrice ?? 0)
    const maxPrice = parseNonNegativeNumber(urlParams.get('maxPrice'), searchParams.maxPrice ?? 10000)
    const stars = parseStars(urlParams.get('stars')) ?? searchParams.stars
    const resolvedMarket = marketFromUrl ?? currentHotelMarket

    if (resolvedMarket !== currentHotelMarket) {
      setMarket(resolvedMarket)
    }

    setFilters((previous) => ({
      ...previous,
      city,
      checkInDate: checkInDate as string | undefined,
      checkOutDate: checkOutDate as string | undefined,
      priceMin: minPrice,
      maxPrice: maxPrice,
      stars,
    }))

    setSearchParams({
      city,
      keyword,
      checkInDate,
      checkOutDate,
      market: resolvedMarket,
      page,
      limit,
      minPrice,
      maxPrice,
      stars,
    })

    initializedRef.current = true
  }, [currentHotelMarket, searchParams, setMarket, setSearchParams, urlParams])

  /* 监听 searchParams 变化，触发主查询 */
  useEffect(() => {
    if (!initializedRef.current) return
    void fetchHotels()
  }, [
    fetchHotels,
    searchParams.city,
    searchParams.checkInDate,
    searchParams.checkOutDate,
    searchParams.market,
    searchParams.page,
    searchParams.limit,
    searchParams.keyword,
    searchParams.minPrice,
    searchParams.maxPrice,
    searchParams.stars,
  ])

  /* 🌟 2. 无限滚动触发逻辑 */
  const handleLoadMore = async () => {
    // 防抖：正在加载中、没有更多数据、或者全局 Loading 时不触发
    if (loading || loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      // 调用 Store 封装好的追加数据逻辑
      await fetchMoreHotels()
    } catch (error) {
      console.error('Failed to load more hotels:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  /* 🌟 筛选条件改变逻辑：需重置页码为 1 */
  const handleFiltersChange = (nextFilters: SearchFilters) => {
    setFilters(nextFilters)

    setSearchParams({
      city: nextFilters.city ?? searchParams.city,
      checkInDate: nextFilters.checkInDate ? dateToString(new Date(nextFilters.checkInDate)) || searchParams.checkInDate : searchParams.checkInDate,
      checkOutDate: nextFilters.checkOutDate ? dateToString(new Date(nextFilters.checkOutDate)) || searchParams.checkOutDate : searchParams.checkOutDate,
      minPrice: nextFilters.priceMin,
      maxPrice: nextFilters.priceMax,
      stars: nextFilters.stars,
      page: 1, // 重置分页
    })
  }

  const listFilters = useMemo<SearchFilters>(
    () => ({
      ...filters,
      city: filters.city ?? searchParams.city,
      checkInDate: filters.checkInDate ?? dateToString(searchParams.checkInDate),
      checkOutDate: filters.checkOutDate ?? dateToString(searchParams.checkOutDate),
      priceMin: filters.priceMin ?? searchParams.minPrice,
      priceMax: filters.priceMax ?? searchParams.maxPrice,
      stars: filters.stars ?? searchParams.stars,
    }),
    [filters, searchParams]
  )

  return (
    <div className={styles.container}>
      <SearchResultList
        data={hotelList}           // 当前已累加的酒店列表
        loading={loading}          // 全局首屏加载状态
        hasMore={hasMore}          // 是否还有更多数据
        filters={listFilters}
        onFiltersChange={handleFiltersChange}
        
        // 3. 将无限滚动状态和回调传递给子组件
        loadingMore={loadingMore}  // 追加加载状态
        onLoadMore={handleLoadMore} // 触底回调函数
      />
    </div>
  )
}