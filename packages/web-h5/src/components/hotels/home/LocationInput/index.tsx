import React, { useRef, useState } from 'react'
import type { HotelMarket } from '@estay/shared'
import SlideDrawer from '../../shared/SlideDrawer'
import CitySearch from '../CitySearch'
import LocationSearch from '../LocationSearch'
import styles from './index.module.scss'

interface LocationInputProps {
  city: string
  onCityChange: (city: string) => void
  keyword: string
  onKeywordChange: (keyword: string) => void
  market: HotelMarket
}

const LocationInput: React.FC<LocationInputProps> = ({
  city,
  onCityChange,
  keyword,
  onKeywordChange,
  market,
}) => {
  const [isLocating, setIsLocating] = useState(false)
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const refreshIconRef = useRef<HTMLDivElement>(null)

  const placeholder = '位置/酒店/关键字/品牌'

  const handleKeywordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onKeywordChange(event.target.value)
  }

  const handleClearKeyword = () => {
    onKeywordChange('')
  }

  const handleCityClick = () => {
    setShowCitySearch(true)
  }

  const handleCitySelect = (selectedCity: string) => {
    onCityChange(selectedCity)
    setShowCitySearch(false)
  }

  const handleLocationSelect = (location: string) => {
    onKeywordChange(location)
    setShowLocationSearch(false)
  }

  const handleNearby = async () => {
    setIsLocating(true)
    if (refreshIconRef.current) {
      refreshIconRef.current.style.animation = 'spin 0.6s linear'
    }

    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            console.log('Current location:', { latitude, longitude })
          },
          (error) => {
            console.error('Failed to locate:', error)
            window.alert('Unable to get your location, please check permissions.')
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        )
      } else {
        window.alert('Your browser does not support geolocation.')
      }
    } finally {
      setTimeout(() => {
        setIsLocating(false)
        if (refreshIconRef.current) {
          refreshIconRef.current.style.animation = 'none'
        }
      }, 600)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.citySelect} onClick={handleCityClick}>
          {city}
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className={styles.dropdownIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={keyword}
            onChange={handleKeywordInputChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setShowLocationSearch(true)
              }
            }}
          />

          {keyword ? (
            <button className={styles.clearIcon} onClick={handleClearKeyword}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </div>

        <div className={styles.nearbyButton} onClick={handleNearby} title="My Location">
          <div ref={refreshIconRef} className={styles.iconRotator}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              className={styles.nearbyIcon}
            >
              <circle cx="12" cy="12" r="6" strokeWidth={2} />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <line x1="12" y1="2" x2="12" y2="6" strokeWidth={2} strokeLinecap="round" />
              <line x1="12" y1="18" x2="12" y2="22" strokeWidth={2} strokeLinecap="round" />
              <line x1="2" y1="12" x2="6" y2="12" strokeWidth={2} strokeLinecap="round" />
              <line x1="18" y1="12" x2="22" y2="12" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </div>
          <span className={styles.nearbyText}>{isLocating ? 'Locating...' : 'My Location'}</span>
        </div>
      </div>

      <SlideDrawer
        visible={showCitySearch}
        title="城市搜索"
        direction="bottom"
        onClose={() => setShowCitySearch(false)}
      >
        <CitySearch
          market={market}
          currentCity={city}
          onSelect={handleCitySelect}
          onClose={() => setShowCitySearch(false)}
        />
      </SlideDrawer>

      <SlideDrawer
        visible={showLocationSearch}
        title="关键词搜索"
        direction="bottom"
        onClose={() => setShowLocationSearch(false)}
      >
        <LocationSearch
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationSearch(false)}
        />
      </SlideDrawer>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default React.memo(LocationInput)
