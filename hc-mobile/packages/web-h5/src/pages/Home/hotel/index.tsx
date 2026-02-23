import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUICK_FILTER_TAGS, type HotelMarket, useAppStore, useHotelStore } from '@estay/shared'
import BannerCarousel from '../../../components/hotels/home/BannerCarousel'
import DateTimeRangeSelector from '../../../components/hotels/home/DateTimeRangeSelector'
import HotelCard from '../../../components/hotels/home/HotelCard'
import HotelCardSkeleton from '../../../components/hotels/home/HotelCardSkeleton'
import KeywordSearchModal from '../../../components/hotels/home/KeywordSearchModal'
import LocationInput from '../../../components/hotels/home/LocationInput'
import PriceSelector from '../../../components/hotels/home/PriceSelector'
import QuickFilters from '../../../components/hotels/home/QuickFilters'
import RecommendTypes from '../../../components/hotels/home/RecommendTypes'
import RoomTypeSelector from '../../../components/hotels/home/RoomTypeSelector'
import SearchButton from '../../../components/hotels/home/SearchButton'
import styles from '../homeStay/index.module.scss'
import tabStyles from './index.module.scss'

const DAY_IN_MS = 24 * 60 * 60 * 1000
const DEFAULT_LIMIT = 10
const DOMESTIC_DEFAULT_CITY = 'Beijing'
const INTERNATIONAL_DEFAULT_CITY = 'Singapore'
const HOT_KEYWORDS: string[] = [
  '近地铁',
  '汉庭酒店',
  '含双早',
  '可免费取消',
  '商务出行',
  '五星酒店',
]

const toDate = (value: string): Date => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date()
  }
  return parsed
}

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const ensureCheckoutDate = (checkIn: Date, checkOut: Date): Date =>
  checkOut.getTime() > checkIn.getTime() ? checkOut : new Date(checkIn.getTime() + DAY_IN_MS)

export default function HomeHotelPage() {
  const navigate = useNavigate()
  const { currentHotelMarket, setMarket } = useAppStore()
  const { searchParams, hotelList, roomSPUList, loading, setSearchParams, fetchHotels } = useHotelStore()

  const [city, setCity] = useState(searchParams.city)
  const [keyword, setKeyword] = useState(searchParams.keyword ?? '')
  const [checkIn, setCheckIn] = useState(toDate(searchParams.checkInDate))
  const [checkOut, setCheckOut] = useState(toDate(searchParams.checkOutDate))
  const [guests, setGuests] = useState(2)
  const [beds, setBeds] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [minPrice, setMinPrice] = useState(searchParams.minPrice ?? 0)
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice ?? 10000)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showKeywordModal, setShowKeywordModal] = useState(false)
  const [keywordDraft, setKeywordDraft] = useState(searchParams.keyword ?? '')
  const [keywordHistory, setKeywordHistory] = useState<string[]>([])

  useEffect(() => {
    setSearchParams({
      market: currentHotelMarket,
      page: 1,
    })
  }, [currentHotelMarket, setSearchParams])

  useEffect(() => {
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

  const handleMarketChange = (market: HotelMarket) => {
    const defaultCity = market === 'domestic' ? DOMESTIC_DEFAULT_CITY : INTERNATIONAL_DEFAULT_CITY
    setMarket(market)
    setCity(defaultCity)
    setSearchParams({
      market,
      city: defaultCity,
      page: 1,
    })
  }

  const handleSearch = () => {
    const normalizedCity = city.trim()
    if (!normalizedCity) {
      return
    }
    const normalizedKeyword = keyword.trim()

    const normalizedCheckOut = ensureCheckoutDate(checkIn, checkOut)

    setSearchParams({
      city: normalizedCity,
      checkInDate: formatDate(checkIn),
      checkOutDate: formatDate(normalizedCheckOut),
      market: currentHotelMarket,
      page: 1,
      limit: DEFAULT_LIMIT,
      keyword: normalizedKeyword,
      minPrice,
      maxPrice,
    })

    const urlParams = new URLSearchParams({
      city: normalizedCity,
      checkInDate: formatDate(checkIn),
      checkOutDate: formatDate(normalizedCheckOut),
      market: currentHotelMarket,
      page: '1',
      limit: String(DEFAULT_LIMIT),
      keyword: normalizedKeyword,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
    })

    navigate(`/search/hotel?${urlParams.toString()}`)
  }

  const handleKeywordSubmit = (nextKeyword: string) => {
    const normalizedKeyword = nextKeyword.trim()
    if (!normalizedKeyword) {
      return
    }

    setKeyword(normalizedKeyword)
    setKeywordDraft(normalizedKeyword)
    setKeywordHistory((previous) => {
      const deduped = [normalizedKeyword, ...previous.filter((item) => item !== normalizedKeyword)]
      return deduped.slice(0, 8)
    })
    setShowKeywordModal(false)
  }

  const handleDateChange = (nextCheckIn: Date, nextCheckOut: Date) => {
    setCheckIn(nextCheckIn)
    setCheckOut(ensureCheckoutDate(nextCheckIn, nextCheckOut))
  }

  const handleRoomTypeChange = (nextGuests: number, nextBeds: number, nextRooms: number) => {
    setGuests(nextGuests)
    setBeds(nextBeds)
    setRooms(nextRooms)
  }

  const handleTagSelect = (id: string, selected: boolean) => {
    setSelectedTags((prev) => {
      if (selected) {
        return prev.includes(id) ? prev : [...prev, id]
      }
      return prev.filter((tagId) => tagId !== id)
    })
  }

  const cards = useMemo(
    () =>
      hotelList.map((hotel) => ({
        hotel,
        startingPrice: roomSPUList[hotel.id]?.[0]?.startingPrice ?? 0,
      })),
    [hotelList, roomSPUList]
  )

  return (
    <div className={styles.container}>
      <BannerCarousel
        autoPlay={true}
        interval={3500}
        onBannerClick={(item) => {
          if (item.link) {
            navigate(item.link)
          }
        }}
      />

      <div className={styles.compactSearchSection}>
        <div className={styles.searchCard}>
          <div className={tabStyles.marketTabs}>
            <button
              type="button"
              className={`${tabStyles.marketTab} ${
                currentHotelMarket === 'domestic' ? tabStyles.active : ''
              }`}
              onClick={() => handleMarketChange('domestic')}
            >
              国内
            </button>
            <button
              type="button"
              className={`${tabStyles.marketTab} ${
                currentHotelMarket === 'international' ? tabStyles.active : ''
              }`}
              onClick={() => handleMarketChange('international')}
            >
              国际/中国港澳台
            </button>
          </div>

          <div className={styles.cardItem}>
            <LocationInput
              city={city}
              onCityChange={setCity}
              keyword={keyword}
              onKeywordChange={setKeyword}
              market={currentHotelMarket}
            />
          </div>

          <div className={styles.cardItem}>
            <button
              type="button"
              className={tabStyles.keywordTrigger}
              onClick={() => {
                setKeywordDraft(keyword)
                setShowKeywordModal(true)
              }}
            >
              <span className={tabStyles.keywordLabel}>关键字</span>
              <span className={keyword ? tabStyles.keywordValue : tabStyles.keywordPlaceholder}>
                {keyword || '关键字/位置/品牌'}
              </span>
            </button>
          </div>

          <div className={styles.cardItem}>
            <DateTimeRangeSelector checkIn={checkIn} checkOut={checkOut} onDateChange={handleDateChange} />
          </div>

          <div className={styles.dualRowContainer}>
            <div className={styles.cardItem}>
              <RoomTypeSelector rooms={rooms} beds={beds} guests={guests} onChange={handleRoomTypeChange} />
            </div>

            <div className={styles.cardItem}>
              <PriceSelector
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(nextMin, nextMax) => {
                  setMinPrice(nextMin)
                  setMaxPrice(nextMax)
                }}
              />
            </div>
          </div>

          <div className={styles.cardItem}>
            <QuickFilters
              tags={QUICK_FILTER_TAGS}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>

          <div className={styles.cardItem}>
            <SearchButton loading={loading} onClick={handleSearch} label="Start Search" />
          </div>
        </div>
      </div>

      <RecommendTypes />

      <div className={styles.listSection}>
        <div className={styles.cardGrid}>
          {loading && cards.length === 0 ? (
            <HotelCardSkeleton count={6} />
          ) : cards.length > 0 ? (
            cards.map(({ hotel, startingPrice }) => (
              <div key={hotel.id} className={styles.cardWrapper}>
                <HotelCard
                  data={hotel}
                  startingPrice={startingPrice}
                  showStar
                  onClick={(id) => navigate(`/hotel/${id}/hotel`)}
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No hotels found</p>
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className={styles.bottomSpacer} />

      <KeywordSearchModal
        visible={showKeywordModal}
        keyword={keywordDraft}
        historyKeywords={keywordHistory}
        hotKeywords={HOT_KEYWORDS}
        onClose={() => {
          setKeywordDraft(keyword)
          setShowKeywordModal(false)
        }}
        onKeywordChange={setKeywordDraft}
        onSubmit={handleKeywordSubmit}
        onClearHistory={() => setKeywordHistory([])}
      />
    </div>
  )
}
