/**
 * Price + hotel filters content
 */

import React, { useMemo, useState } from 'react'
import styles from './index.module.scss'

export type BreakfastIncluded = 'any' | 'included' | 'not_included'

export interface HotelFilterSelections {
  stars: string[]
  bedTypes: string[]
  breakfastIncluded: BreakfastIncluded
  brands: string[]
}

interface PriceGuestFilterProps {
  minPrice?: number
  maxPrice?: number
  hotelFilters?: HotelFilterSelections
  onPriceChange?: (minPrice: number, maxPrice: number) => void
  onHotelFiltersChange?: (filters: HotelFilterSelections) => void
  onConfirm?: () => void
}

interface PriceRange {
  label: string
  min: number
  max: number
}

const DEFAULT_FILTERS: HotelFilterSelections = {
  stars: [],
  bedTypes: [],
  breakfastIncluded: 'any',
  brands: [],
}

const STAR_OPTIONS = ['3 Star', '4 Star', '5 Star']
const BED_TYPE_OPTIONS = ['King Bed', 'Twin Bed', 'Family Bed']
const BREAKFAST_OPTIONS: Array<{ label: string; value: BreakfastIncluded }> = [
  { label: 'Any', value: 'any' },
  { label: 'Breakfast Included', value: 'included' },
  { label: 'No Breakfast', value: 'not_included' },
]
const BRAND_OPTIONS = ['International Chain', 'Domestic Chain', 'Boutique Brand']

const priceRanges: PriceRange[] = [
  { label: '¥0-200', min: 0, max: 200 },
  { label: '¥200-400', min: 200, max: 400 },
  { label: '¥400-600', min: 400, max: 600 },
  { label: '¥600-1000', min: 600, max: 1000 },
  { label: '¥1000+', min: 1000, max: 10000 },
]

const toggleMultiValue = (values: string[], option: string): string[] =>
  values.includes(option) ? values.filter((item) => item !== option) : [...values, option]

const PriceGuestFilter: React.FC<PriceGuestFilterProps> = ({
  minPrice = 0,
  maxPrice = 10000,
  hotelFilters = DEFAULT_FILTERS,
  onPriceChange,
  onHotelFiltersChange,
  onConfirm,
}) => {
  const [tempMinPrice, setTempMinPrice] = useState(minPrice)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)
  const [tempFilters, setTempFilters] = useState<HotelFilterSelections>(hotelFilters)

  const MIN_RANGE = 0
  const MAX_RANGE = 10000

  const displayPrice = useMemo(
    () => `Price Range ¥${tempMinPrice}-${tempMaxPrice === MAX_RANGE ? 'No Limit' : tempMaxPrice}`,
    [tempMaxPrice, tempMinPrice]
  )

  const emitFilters = (next: HotelFilterSelections) => {
    setTempFilters(next)
    onHotelFiltersChange?.(next)
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (Number.isFinite(value) && value <= tempMaxPrice) {
      setTempMinPrice(value)
      onPriceChange?.(value, tempMaxPrice)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (Number.isFinite(value) && value >= tempMinPrice) {
      setTempMaxPrice(value)
      onPriceChange?.(tempMinPrice, value)
    }
  }

  const handleReset = () => {
    setTempMinPrice(MIN_RANGE)
    setTempMaxPrice(MAX_RANGE)
    setTempFilters(DEFAULT_FILTERS)
    onPriceChange?.(MIN_RANGE, MAX_RANGE)
    onHotelFiltersChange?.(DEFAULT_FILTERS)
  }

  const isRangeSelected = (min: number, max: number) => tempMinPrice === min && tempMaxPrice === max

  return (
    <div className={styles.priceGuestFilter}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Price</h3>

          <div className={styles.priceRangeInfo}>
            <span className={styles.rangeLabel}>{displayPrice}</span>
          </div>

          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack}>
              <div
                className={styles.sliderFill}
                style={{
                  left: `${(tempMinPrice / MAX_RANGE) * 100}%`,
                  right: `${100 - (tempMaxPrice / MAX_RANGE) * 100}%`,
                }}
              />
            </div>
            <input
              type="range"
              min={MIN_RANGE}
              max={MAX_RANGE}
              value={tempMinPrice}
              onChange={handleMinChange}
              className={`${styles.slider} ${styles.sliderMin}`}
            />
            <input
              type="range"
              min={MIN_RANGE}
              max={MAX_RANGE}
              value={tempMaxPrice}
              onChange={handleMaxChange}
              className={`${styles.slider} ${styles.sliderMax}`}
            />
          </div>

          <div className={styles.priceRanges}>
            {priceRanges.map((range) => (
              <button
                key={range.label}
                className={`${styles.priceBtn} ${isRangeSelected(range.min, range.max) ? styles.active : ''}`}
                onClick={() => {
                  setTempMinPrice(range.min)
                  setTempMaxPrice(range.max)
                  onPriceChange?.(range.min, range.max)
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Hotel Filters</h3>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>Star</div>
            <div className={styles.guestOptions}>
              {STAR_OPTIONS.map((star) => (
                <button
                  key={star}
                  className={`${styles.optionBtn} ${tempFilters.stars.includes(star) ? styles.active : ''}`}
                  onClick={() => {
                    const next = { ...tempFilters, stars: toggleMultiValue(tempFilters.stars, star) }
                    emitFilters(next)
                  }}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>BedType</div>
            <div className={styles.guestOptions}>
              {BED_TYPE_OPTIONS.map((bedType) => (
                <button
                  key={bedType}
                  className={`${styles.optionBtn} ${tempFilters.bedTypes.includes(bedType) ? styles.active : ''}`}
                  onClick={() => {
                    const next = {
                      ...tempFilters,
                      bedTypes: toggleMultiValue(tempFilters.bedTypes, bedType),
                    }
                    emitFilters(next)
                  }}
                >
                  {bedType}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>BreakfastIncluded</div>
            <div className={styles.guestOptions}>
              {BREAKFAST_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionBtn} ${tempFilters.breakfastIncluded === option.value ? styles.active : ''}`}
                  onClick={() => {
                    const next = { ...tempFilters, breakfastIncluded: option.value }
                    emitFilters(next)
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>Brand</div>
            <div className={styles.guestOptions}>
              {BRAND_OPTIONS.map((brand) => (
                <button
                  key={brand}
                  className={`${styles.optionBtn} ${tempFilters.brands.includes(brand) ? styles.active : ''}`}
                  onClick={() => {
                    const next = { ...tempFilters, brands: toggleMultiValue(tempFilters.brands, brand) }
                    emitFilters(next)
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset
        </button>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default PriceGuestFilter
