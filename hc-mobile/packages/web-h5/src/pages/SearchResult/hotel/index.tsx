import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore, useHotelStore, type HotelMarket } from '@estay/shared'
import SearchResultList, { type SearchFilters } from '../../../components/hotels/search/SearchResultList'
import styles from './index.module.css'

const parsePositiveNumber = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const parseNonNegativeNumber = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const parseMarket = (value: string | null): HotelMarket | null =>
  value === 'domestic' || value === 'international' ? value : null

const parseStars = (value: string | null): number[] | undefined => {
  if (!value) {
    return undefined
  }

  const stars = value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0)

  return stars.length > 0 ? stars : undefined
}

export default function SearchResultHotelPage() {
  const [urlParams] = useSearchParams()
  const initializedRef = useRef(false)
  const { currentHotelMarket, setMarket } = useAppStore()
  const {
    searchParams,
    hotelList,
    loading,
    hasMore,
    setSearchParams,
    fetchHotels,
    fetchMoreHotels,
  } = useHotelStore()

  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.city,
    checkInDate: searchParams.checkInDate,
    checkOutDate: searchParams.checkOutDate,
    roomCount: 1,
    guestCount: 2,
    priceMin: searchParams.minPrice,
    priceMax: searchParams.maxPrice,
    stars: searchParams.stars,
    facilities: [],
  })

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    const marketFromUrl = parseMarket(urlParams.get('market'))
    const city = urlParams.get('city') ?? searchParams.city
    const keyword = urlParams.get('keyword') ?? searchParams.keyword ?? ''
    const checkInDate = urlParams.get('checkInDate') ?? searchParams.checkInDate
    const checkOutDate = urlParams.get('checkOutDate') ?? searchParams.checkOutDate
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
      checkInDate,
      checkOutDate,
      priceMin: minPrice,
      priceMax: maxPrice,
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

  useEffect(() => {
    if (!initializedRef.current) {
      return
    }

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

  const handleFiltersChange = (nextFilters: SearchFilters) => {
    setFilters(nextFilters)

    setSearchParams({
      city: nextFilters.city ?? searchParams.city,
      checkInDate: nextFilters.checkInDate ?? searchParams.checkInDate,
      checkOutDate: nextFilters.checkOutDate ?? searchParams.checkOutDate,
      minPrice: nextFilters.priceMin,
      maxPrice: nextFilters.priceMax,
      stars: nextFilters.stars,
      page: 1,
    })
  }

  const handleLoadMore = async () => {
    if (loading || !hasMore) {
      return
    }

    await fetchMoreHotels()
  }

  const listFilters = useMemo<SearchFilters>(
    () => ({
      ...filters,
      city: filters.city ?? searchParams.city,
      checkInDate: filters.checkInDate ?? searchParams.checkInDate,
      checkOutDate: filters.checkOutDate ?? searchParams.checkOutDate,
      priceMin: filters.priceMin ?? searchParams.minPrice,
      priceMax: filters.priceMax ?? searchParams.maxPrice,
      stars: filters.stars ?? searchParams.stars,
    }),
    [filters, searchParams]
  )

  return (
    <div className={styles.container}>
      <SearchResultList
        data={hotelList}
        loading={loading}
        hasMore={hasMore}
        filters={listFilters}
        onFiltersChange={handleFiltersChange}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
