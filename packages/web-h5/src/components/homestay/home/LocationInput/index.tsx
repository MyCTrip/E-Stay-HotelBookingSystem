/**
 * 地点输入组件 - Web H5版本
 */

import React, { useState, useRef } from 'react'
import CitySearch from '../CitySearch'
import LocationSearch from '../LocationSearch'
import styles from './index.module.scss'

interface LocationInputProps {
  value?: string
  city?: string
  placeholder?: string
  onLocationSelect?: (location: string) => void
  onCityChange?: (city: string) => void
  onNearbyClick?: () => void
  onChange?: (value: string) => void
  loading?: boolean
}

const LocationInput: React.FC<LocationInputProps> = ({
  value = '',
  city = '上海',
  placeholder = '位置/民宿/关键字',
  onLocationSelect,
  onCityChange,
  onNearbyClick,
  onChange,
  loading = false,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [currentCity, setCurrentCity] = useState(city)
  const [isLocating, setIsLocating] = useState(loading)
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const refreshIconRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
  }

  const handleCityClick = () => {
    setShowCitySearch(true)
  }

  const handleCitySelect = (selectedCity: string) => {
    setCurrentCity(selectedCity)
    onCityChange?.(selectedCity)
    setShowCitySearch(false)
  }

  const handleLocationSelect = (location: string) => {
    setInputValue(location)
    onChange?.(location)
    setShowLocationSearch(false)
  }

  const handleNearby = async () => {
    setIsLocating(true)
    if (refreshIconRef.current) {
      refreshIconRef.current.style.animation = 'spin 0.6s linear'
    }

    try {
      // 获取用户当前位置
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            // 调用 onNearbyClick 回调，传递坐标信息
            onNearbyClick?.()
            
            // 可选：使用高德地图或其他地理编码服务反向查询地址
            // 这里简单地显示坐标信息作为示例
            console.log('当前位置:', { latitude, longitude })
          },
          (error) => {
            console.error('定位失败:', error)
            // 处理定位错误
            alert('未能获取您的位置，请检查权限设置')
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        )
      } else {
        alert('您的浏览器不支持定位功能')
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
        <div
          className={styles.citySelect}
          onClick={handleCityClick}
        >
          {currentCity}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" className={styles.dropdownIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setShowLocationSearch(true)}
            readOnly
          />

          {inputValue && (
            <button className={styles.clearIcon} onClick={handleClear}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <div
          className={styles.nearbyButton}
          onClick={handleNearby}
          title="我的位置"
        >
          <div
            ref={refreshIconRef}
            className={styles.iconRotator}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" className={styles.nearbyIcon}>
              <circle cx="12" cy="12" r="6" strokeWidth={2} />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <line x1="12" y1="2" x2="12" y2="6" strokeWidth={2} strokeLinecap="round" />
              <line x1="12" y1="18" x2="12" y2="22" strokeWidth={2} strokeLinecap="round" />
              <line x1="2" y1="12" x2="6" y2="12" strokeWidth={2} strokeLinecap="round" />
              <line x1="18" y1="12" x2="22" y2="12" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </div>
          <span className={styles.nearbyText}>我的位置</span>
        </div>
      </div>

      {/* 城市搜索弹层 */}
      <CitySearch
        visible={showCitySearch}
        currentCity={currentCity}
        onSelect={handleCitySelect}
        onClose={() => setShowCitySearch(false)}
      />

      {/* 位置搜索弹层 */}
      <LocationSearch
        visible={showLocationSearch}
        onSelect={handleLocationSelect}
        onClose={() => setShowLocationSearch(false)}
      />

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
