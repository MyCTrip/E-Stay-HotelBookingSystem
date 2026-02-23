/**
 * 位置筛选组件 - 内容only
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

interface LocationFilterProps {
  selectedLocation?: string
  onLocationChange?: (location: string) => void
}

const categories = [
  { label: '热门推荐', icon: '★' },
  { label: '观光景点', icon: '🏛️' },
  { label: '商圈', icon: '🛍️' },
  { label: '行政区', icon: '🗺️' },
  { label: '机场/车站', icon: '✈️' },
  { label: '高校', icon: '🎓' },
  { label: '医院', icon: '🏥' },
]

const locations = {
  热门推荐: [
    { name: '西湖公园', count: '历史搜过' },
    { name: '泉州欧乐堡度假区', count: '1.5%用户选择' },
    { name: '泉州西街', count: '27.6%用户选择' },
  ],
  观光景点: [{ name: '西街/开元寺', count: '13.2%用户选择' }],
  商圈: [{ name: '南昌街', count: '5.2%用户选择' }],
  行政区: [{ name: '洛阳区', count: '8.9%用户选择' }],
  '机场/车站': [{ name: '首都国际机场', count: '2.1%用户选择' }],
  高校: [{ name: '清华大学', count: '1.2%用户选择' }],
  医院: [{ name: '协和医院', count: '0.8%用户选择' }],
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation = '',
  onLocationChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('热门推荐')
  const [searchText, setSearchText] = useState('')

  const currentLocations = locations[activeCategory as keyof typeof locations] || []

  const handleLocationSelect = (location: string) => {
    onLocationChange?.(location)
  }

  return (
    <div className={styles.locationFilter}>
      {/* 搜索框 */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="输入位置、地点、地址"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 分类导航 */}
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

      {/* 位置列表 */}
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

      {/* 清空按钮 */}
      <div className={styles.footer}>
        <button className={styles.clearBtn} onClick={() => handleLocationSelect('')}>
          清空
        </button>
      </div>
    </div>
  )
}

export default LocationFilter
