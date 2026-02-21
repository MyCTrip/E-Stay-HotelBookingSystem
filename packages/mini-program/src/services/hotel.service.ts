import type { HotelSearchForm, HotelSuggestionItem, PriceRange } from '../business/hotel/types'
import { MOCK_HOTEL_DB } from './hotel.constants'

export interface SearchResultQuery {
  type: 'domestic' | 'international'
  city: string
  checkIn: string
  checkOut: string
  keywords: string
  tags: string
}

export const searchHotelsByKeyword = (keyword: string): HotelSuggestionItem[] => {
  const normalizedKeyword = keyword.trim()
  if (!normalizedKeyword) {
    return []
  }

  return MOCK_HOTEL_DB.filter((hotel) =>
    hotel.name.includes(normalizedKeyword) ||
    hotel.address.includes(normalizedKeyword) ||
    hotel.area.includes(normalizedKeyword),
  ).sort((a, b) => a.distance - b.distance)
}

export const buildPriceStarDisplay = (priceRange: PriceRange, selectedStars: string[]): string => {
  let text = ''

  if (priceRange.min || priceRange.max) {
    text += `¥${priceRange.min || 0}-${priceRange.max || '不限'}`
  }

  if (selectedStars.length > 0) {
    text += text ? ' | ' : ''
    text += `${selectedStars.length}个星级`
  }

  return text || '价格/星级'
}

export const buildSearchResultQuery = (
  activeTab: number,
  formData: HotelSearchForm,
  selectedQuickTags: string[],
): SearchResultQuery => {
  return {
    type: activeTab === 0 ? 'domestic' : 'international',
    city: formData.city,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    keywords: formData.keywords,
    tags: selectedQuickTags.join(','),
  }
}

