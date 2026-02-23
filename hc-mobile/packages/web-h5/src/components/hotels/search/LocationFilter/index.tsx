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
  { label: 'Business District', icon: '🏙️' },
  { label: 'Near Metro', icon: '🚇' },
  { label: 'Airport/Station', icon: '✈️' },
  { label: 'Popular Landmarks', icon: '📍' },
]

const locations: Record<string, LocationItem[]> = {
  'Business District': [
    { name: 'CBD Area', count: 'Popular for business trips' },
    { name: 'City Center', count: 'Many 4/5 star hotels' },
  ],
  'Near Metro': [
    { name: 'Metro Line 1', count: 'Easy city access' },
    { name: 'Metro Line 2', count: 'Airport connection' },
  ],
  'Airport/Station': [
    { name: 'International Airport', count: 'Great for transfers' },
    { name: 'High-speed Railway Station', count: 'Fast commute area' },
  ],
  'Popular Landmarks': [
    { name: 'Convention Center', count: 'Event-friendly hotels' },
    { name: 'Old Town Landmark', count: 'Tourism hot area' },
  ],
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation = '',
  onLocationChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Business District')
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
          placeholder="Search district / landmark / metro"
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
          Clear
        </button>
      </div>
    </div>
  )
}

export default LocationFilter
