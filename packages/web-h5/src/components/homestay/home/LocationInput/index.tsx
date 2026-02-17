/**
 * 地点输入组件 - Web H5版本
 */

import React, { useState, useRef } from 'react'
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

const CITIES = ['上海', '北京', '广州', '深圳', '杭州', '南京', '武汉', '成都', '重庆', '西安']

const LocationInput: React.FC<LocationInputProps> = ({
  value = '',
  city = '上海',
  placeholder = '位置/民宿名/编号',
  onLocationSelect,
  onCityChange,
  onNearbyClick,
  onChange,
  loading = false,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [currentCity, setCurrentCity] = useState(city)
  const [isLocating, setIsLocating] = useState(loading)
  const [showCityMenu, setShowCityMenu] = useState(false)
  const [cityMenuStyle, setCityMenuStyle] = useState<React.CSSProperties>({})
  const refreshIconRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)

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
    if (selectRef.current && !showCityMenu) {
      const rect = selectRef.current.getBoundingClientRect()
      setCityMenuStyle({
        position: 'absolute',
        top: `${rect.bottom}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 1000,
      })
    }
    setShowCityMenu(!showCityMenu)
  }

  const handleCitySelect = (selectedCity: string) => {
    setCurrentCity(selectedCity)
    onCityChange?.(selectedCity)
    setShowCityMenu(false)
  }

  const handleNearby = async () => {
    setIsLocating(true)
    if (refreshIconRef.current) {
      refreshIconRef.current.style.animation = 'spin 0.6s linear'
    }

    try {
      onNearbyClick?.()
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
          ref={selectRef}
          className={styles.citySelect}
          onClick={handleCityClick}
        >
          {currentCity} ▼
        </div>

        <div className={styles.inputWrapper}>
          <div className={styles.prefixIcon}>📍</div>

          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
          />

          {inputValue && (
            <div className={styles.clearIcon} onClick={handleClear}>
              ✕
            </div>
          )}
        </div>

        <div
          ref={refreshIconRef}
          className={styles.nearbyButton}
          onClick={handleNearby}
          title="我的附近"
        >
          🔄
          <span className={styles.label}>附近</span>
        </div>
      </div>

      {showCityMenu && (
        <div style={cityMenuStyle} className={styles.cityMenu}>
          {CITIES.map((c) => (
            <div
              key={c}
              className={`${styles.cityMenuItem} ${c === currentCity ? styles.active : ''}`}
              onClick={() => handleCitySelect(c)}
            >
              {c}
            </div>
          ))}
        </div>
      )}

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
