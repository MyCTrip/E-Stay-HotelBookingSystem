import React, { useEffect, useMemo, useState } from 'react'
import type { HotelMarket } from '@estay/shared'
import styles from './index.module.scss'

interface CitySearchProps {
  market: HotelMarket
  currentCity?: string
  onSelect: (city: string) => void
  onClose: () => void
}

const DOMESTIC_HOT_CITIES = ['北京', '上海', '广州', '深圳', '成都', '重庆', '香港', '澳门']
const INTERNATIONAL_HOT_CITIES = [
  '东京',
  '新加坡',
  '曼谷',
  '首尔',
  '吉隆坡',
  '伦敦',
  '巴黎',
  '纽约',
]
const DOMESTIC_ALL_CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '成都',
  '重庆',
  '杭州',
  '南京',
  '武汉',
  '西安',
  '苏州',
  '天津',
  '长沙',
  '青岛',
  '厦门',
  '宁波',
  '香港',
  '澳门',
  '台北',
]

const INTERNATIONAL_ALL_CITIES = [
  '东京',
  '大阪',
  '京都',
  '新加坡',
  '曼谷',
  '普吉岛',
  '首尔',
  '济州岛',
  '吉隆坡',
  '巴黎',
  '伦敦',
  '迪拜',
  '悉尼',
  '纽约',
  '洛杉矶',
]

const getCityPinyin: Record<string, string> = {
  北京: 'beijing',
  上海: 'shanghai',
  广州: 'guangzhou',
  深圳: 'shenzhen',
  成都: 'chengdu',
  重庆: 'chongqing',
  杭州: 'hangzhou',
  南京: 'nanjing',
  武汉: 'wuhan',
  西安: 'xian',
  苏州: 'suzhou',
  天津: 'tianjin',
  长沙: 'changsha',
  青岛: 'qingdao',
  厦门: 'xiamen',
  宁波: 'ningbo',
  香港: 'hongkong',
  澳门: 'aomen',
  台北: 'taibei',
  东京: 'dongjing',
  大阪: 'daban',
  京都: 'jingdu',
  新加坡: 'xinjiapo',
  曼谷: 'mangu',
  普吉岛: 'pujidao',
  首尔: 'shouer',
  济州岛: 'jizhoudao',
  吉隆坡: 'jilongpo',
  巴黎: 'bali',
  伦敦: 'lundun',
  迪拜: 'dibai',
  悉尼: 'xini',
  纽约: 'niuyue',
  洛杉矶: 'luoshanji',
}

const getGroupKey = (city: string): string => {
  const pinyin = getCityPinyin[city]
  if (!pinyin) {
    return '#'
  }
  return pinyin[0].toUpperCase()
}

const CitySearch: React.FC<CitySearchProps> = ({
  market,
  currentCity = '北京',
  onSelect,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setSearchText('')
  }, [market])

  const allCities = market === 'international' ? INTERNATIONAL_ALL_CITIES : DOMESTIC_ALL_CITIES
  const hotCities = market === 'international' ? INTERNATIONAL_HOT_CITIES : DOMESTIC_HOT_CITIES

  const groupedCities = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    const filteredCities = query
      ? allCities.filter((city) => {
          const pinyin = getCityPinyin[city] ?? ''
          return city.includes(searchText) || pinyin.includes(query)
        })
      : allCities

    const groups: Record<string, string[]> = {}

    filteredCities.forEach((city) => {
      const groupKey = getGroupKey(city)
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(city)
    })

    return groups
  }, [allCities, searchText])

  const letters = Object.keys(groupedCities).sort()

  const handleCityClick = (city: string) => {
    onSelect(city)
    setSearchText('')
    onClose()
  }

  return (
    <>
      <div className={styles.searchBox}>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="城市/区域/位置"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          autoFocus
        />
        {searchText ? (
          <button className={styles.clearBtn} onClick={() => setSearchText('')}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      <div className={styles.tabs}>
        <div className={`${styles.tab} ${styles.active}`}>
          {market === 'international' ? '国际' : '国内(含港澳台)'}
        </div>
      </div>

      {!searchText ? (
        <div className={styles.hotCities}>
          <div className={styles.sectionTitle}>热门城市</div>
          <div className={styles.citiesList}>
            {hotCities.map((city) => (
              <button
                key={city}
                className={`${styles.cityBtn} ${city === currentCity ? styles.active : ''}`}
                onClick={() => handleCityClick(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className={styles.cityListContainer}>
        {letters.length > 0 ? (
          letters.map((letter) => (
            <div key={letter} className={styles.cityGroup}>
              <div className={styles.groupHeader}>{letter}</div>
              <div className={styles.groupCities}>
                {groupedCities[letter].map((city) => (
                  <button
                    key={city}
                    className={`${styles.cityItem} ${city === currentCity ? styles.active : ''}`}
                    onClick={() => handleCityClick(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>未找到匹配的城市</div>
        )}
      </div>
    </>
  )
}

export default CitySearch
