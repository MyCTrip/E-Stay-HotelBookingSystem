/**
 * Hotel location filter content
 */

import React, { useMemo, useState } from 'react'
import styles from './index.module.scss'

interface LocationFilterProps {
  selectedLocation?: string
  onLocationChange?: (location: string) => void
}

interface CategoryItem {
  label: string
  icon: string
}

interface LocationItem {
  name: string
  count: string
}

const categories: CategoryItem[] = [
  { label: '商圈', icon: '🏙️' },
  { label: '地铁周边', icon: '🚇' },
  { label: '机场/车站', icon: '✈️' },
  { label: '热门地标', icon: '📍' },
]

const locations: Record<string, LocationItem[]> = {
  '商圈': [
    { name: 'CBD区域', count: '商务出行热门' },
    { name: '市中心', count: '4/5星酒店较多' },
  ],
  '地铁周边': [
    { name: '地铁1号线', count: '出行便捷' },
    { name: '地铁2号线', count: '机场连接方便' },
  ],
  '机场/车站': [
    { name: '国际机场', count: '中转住宿便利' },
    { name: '高铁站', count: '通勤效率高' },
  ],
  '热门地标': [
    { name: '会展中心', count: '会展活动住宿方便' },
    { name: '古城地标', count: '旅游热门区域' },
  ],
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation = '',
  onLocationChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('商圈')
  const [searchText, setSearchText] = useState('')

  const currentLocations = useMemo(() => {
    const list = locations[activeCategory] || []
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) {
      return list
    }

    return list.filter((loc) => loc.name.toLowerCase().includes(keyword))
  }, [activeCategory, searchText])

  const handleLocationSelect = (location: string) => {
    onLocationChange?.(location)
  }

  return (
    <div className={styles.locationFilter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="搜索商圈/地标/地铁"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoryNav}>
        <ul className={styles.categoryList}>
          {categories.map((cat) => (
            <li key={cat.label} className={styles.categoryItem}>
              <button
                className={`${styles.categoryBtn} ${activeCategory === cat.label ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.label)}
              >
                <span className={styles.icon}>{cat.icon}</span>
                <span className={styles.name}>{cat.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.locationList}>
        {currentLocations.map((loc) => (
          <div
            key={loc.name}
            className={`${styles.locationItem} ${selectedLocation === loc.name ? styles.selected : ''}`}
            onClick={() => handleLocationSelect(loc.name)}
          >
            <div className={styles.locationName}>{loc.name}</div>
            <div className={styles.locationCount}>{loc.count}</div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.clearBtn} onClick={() => handleLocationSelect('')}>
          清空
        </button>
      </div>
    </div>
  )
}

export default LocationFilter
