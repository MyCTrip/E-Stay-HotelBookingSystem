export interface CityOption {
  key: string
  label: string
}

export interface BannerItem {
  id: number
  img: string
  link: string
  title: string
}

export interface QuickTagOption {
  label: string
}

export interface PriceRange {
  min: string
  max: string
}

export interface StarOption {
  value: string
  label: string
  icon: string
}

export interface PriceOption {
  label: string
  min: string
  max: string
}

export interface HotelSearchForm {
  city: string
  cityName: string
  checkIn: string
  checkOut: string
  priceStarDisplay: string
  keywords: string
}

export interface HotelSuggestionItem {
  id: number
  name: string
  city: string
  area: string
  address: string
  score: number
  price: number
  distance: number
  tags: string[]
}

export interface GridMenuItem {
  icon: string
  title: string
  url: string
}

export interface PromoInfo {
  tag: string
  title: string
  buttonText: string
}

export interface FeatureItem {
  icon: string
  title: string
  desc: string
}

export interface InspirationItem {
  title: string
  tag: string
  img: string
}

export interface LocationResult {
  city: string
  nation: string
}
