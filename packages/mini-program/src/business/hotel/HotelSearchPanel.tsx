import type { FC } from 'react'
import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import SearchCard from '../../components/SearchCard'
import SearchModal from '../../components/SearchModal'
import FilterPopup from '../../components/FilterPopup'
import { useDateRange } from '../../hooks/useDateRange'
import { useHotelSearch } from '../../hooks/useHotelSearch'
import { useLocation } from '../../hooks/useLocation'
import { DOMESTIC_CITIES, HOT_SEARCH_TAGS, INSPIRATION_ITEMS, INTERNATIONAL_CITIES, PRICE_OPTIONS, QUICK_TAG_OPTIONS, STAR_OPTIONS } from '../../services/hotel.constants'
import { buildPriceStarDisplay, buildSearchResultQuery } from '../../services/hotel.service'
import type { HotelSearchForm, PriceRange } from './types'
import styles from './HotelSearchPanel.module.scss'

interface HotelSearchPanelProps {
  activeTab: number
  onActiveTabChange: (tab: number) => void
}

const HotelSearchPanel: FC<HotelSearchPanelProps> = ({ activeTab, onActiveTabChange }) => {
  const { checkIn, checkOut, setCheckIn, setCheckOut, dateInfo } = useDateRange()
  const { loading, locate } = useLocation()
  const { keyword, history, suggestions, setKeyword, submitKeyword, clearHistory } = useHotelSearch()

  const [city, setCity] = useState<string>(DOMESTIC_CITIES[0].key)
  const [cityName, setCityName] = useState<string>(DOMESTIC_CITIES[0].label)
  const [priceStarDisplay, setPriceStarDisplay] = useState<string>('价格/星级')
  const [keywords, setKeywords] = useState<string>('')
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [selectedStars, setSelectedStars] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' })
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const currentCities = activeTab === 0 ? DOMESTIC_CITIES : INTERNATIONAL_CITIES
  const cityLabels = useMemo<string[]>(() => currentCities.map((item) => item.label), [currentCities])

  const formData: HotelSearchForm = { city, cityName, checkIn, checkOut, priceStarDisplay, keywords }

  const handleTabChange = (tab: number): void => {
    onActiveTabChange(tab)
    const targetCities = tab === 0 ? DOMESTIC_CITIES : INTERNATIONAL_CITIES
    setCity(targetCities[0].key)
    setCityName(targetCities[0].label)
  }

  const handleCityChange = (index: number): void => {
    const target = currentCities[index]
    if (!target) return
    setCity(target.key)
    setCityName(target.label)
  }

  const handleLocationClick = async (): Promise<void> => {
    Taro.showLoading({ title: '定位中...' })
    const result = await locate()
    Taro.hideLoading()

    if (!result) {
      Taro.showToast({ title: '定位失败，请检查权限或网络', icon: 'none' })
      return
    }

    const targetTab = result.nation === '中国' ? 0 : 1
    onActiveTabChange(targetTab)
    setCity('Current')
    setCityName(result.city.replace('市', ''))
    Taro.showToast({ title: `已定位到 ${result.city}`, icon: 'success' })
  }

  const handleSearchSubmit = (value: string): void => {
    const submitted = submitKeyword(value)
    if (!submitted) return
    setKeywords(submitted)
    setShowSearch(false)
  }

  const handleSearch = (): void => {
    const query = buildSearchResultQuery(activeTab, formData, selectedQuickTags)
    const params = new URLSearchParams(query)
    Taro.navigateTo({ url: `/pages/SearchResult/hotel/index?${params.toString()}` })
  }

  return (
    <View className={styles.wrapper}>
      <SearchCard
        activeTab={activeTab}
        cityName={cityName}
        cityLabels={cityLabels}
        checkInDate={dateInfo.checkInDate}
        checkInWeek={dateInfo.checkInWeek}
        checkOutDate={dateInfo.checkOutDate}
        checkOutWeek={dateInfo.checkOutWeek}
        checkInRaw={checkIn}
        checkOutRaw={checkOut}
        nights={dateInfo.nights}
        priceStarDisplay={priceStarDisplay}
        keywords={keywords}
        quickTags={QUICK_TAG_OPTIONS}
        selectedQuickTags={selectedQuickTags}
        loadingLocation={loading}
        onTabChange={handleTabChange}
        onCityChange={handleCityChange}
        onLocationClick={handleLocationClick}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        onOpenFilter={() => setShowFilter(true)}
        onOpenSearch={() => { setKeyword(keywords); setShowSearch(true) }}
        onToggleQuickTag={(tag) => setSelectedQuickTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
        onSubmit={handleSearch}
      />

      <SearchModal
        visible={showSearch}
        keyword={keyword}
        suggestions={suggestions}
        historyTags={history}
        hotTags={HOT_SEARCH_TAGS}
        inspirationItems={INSPIRATION_ITEMS}
        onClose={() => setShowSearch(false)}
        onKeywordChange={setKeyword}
        onSubmit={handleSearchSubmit}
        onClearHistory={clearHistory}
      />

      <FilterPopup
        visible={showFilter}
        priceRange={priceRange}
        selectedStars={selectedStars}
        priceOptions={PRICE_OPTIONS}
        starOptions={STAR_OPTIONS}
        onClose={() => setShowFilter(false)}
        onPriceChange={setPriceRange}
        onSelectPrice={(min, max) => setPriceRange({ min, max })}
        onToggleStar={(value) => setSelectedStars((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))}
        onReset={() => { setSelectedStars([]); setPriceRange({ min: '', max: '' }) }}
        onConfirm={() => { setPriceStarDisplay(buildPriceStarDisplay(priceRange, selectedStars)); setShowFilter(false) }}
      />
    </View>
  )
}

export default HotelSearchPanel

