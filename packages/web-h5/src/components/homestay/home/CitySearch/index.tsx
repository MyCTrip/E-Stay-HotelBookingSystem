/**
 * 城市搜索组件 - 城市选择抽屉
 * 从网页窗口底部滑入，占 70% 屏幕高度，顶部圆角
 */

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface CitySearchProps {
  visible: boolean
  currentCity?: string
  onSelect: (city: string) => void
  onClose: () => void
}

const HOT_CITIES = ['北京', '成都', '上海', '香港', '澳门', '重庆', '广州', '深圳']

const ALL_CITIES = [
  '北京', '成都', '上海', '香港', '澳门', '重庆', '广州', '深圳',
  '杭州', '南京', '武汉', '西安', '苏州', '天津', '长沙', '青岛',
  '厦门', '宁波', '郑州', '沈阳', '济南', '哈尔滨', '太原', '石家庄',
  '大连', '昆明', '南昌', '福州', '贵阳', '兰州', '海口', '银川',
  '呼和浩特', '拉萨', '南宁', '乌鲁木齐'
]

const getCityPinyin: { [key: string]: string } = {
  '北京': 'beijing', '成都': 'chengdu', '上海': 'shanghai', '香港': 'hongkong',
  '澳门': 'aomen', '重庆': 'chongqing', '广州': 'guangzhou', '深圳': 'shenzhen',
  '杭州': 'hangzhou', '南京': 'nanjing', '武汉': 'wuhan', '西安': 'xian',
  '苏州': 'suzhou', '天津': 'tianjin', '长沙': 'changsha', '青岛': 'qingdao',
  '厦门': 'xiamen', '宁波': 'ningbo', '郑州': 'zhengzhou', '沈阳': 'shenyang',
  '济南': 'jinan', '哈尔滨': 'haerbin', '太原': 'taiyuan', '石家庄': 'shijiazhuang',
  '大连': 'dalian', '昆明': 'kunming', '南昌': 'nanchang', '福州': 'fuzhou',
  '贵阳': 'guiyang', '兰州': 'lanzhou', '海口': 'haikou', '银川': 'yinchuan',
  '呼和浩特': 'huhehaote', '拉萨': 'lasa', '南宁': 'nanning', '乌鲁木齐': 'wulumuqi'
}

const CitySearch: React.FC<CitySearchProps> = ({
  visible,
  currentCity = '上海',
  onSelect,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('')

  // 按首字母分组
  const groupedCities = useMemo(() => {
    let filtered = ALL_CITIES
    
    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      filtered = ALL_CITIES.filter(city => {
        const pinyin = getCityPinyin[city] || ''
        return city.includes(searchText) || pinyin.includes(query)
      })
    }

    const groups: { [key: string]: string[] } = {}
    filtered.forEach(city => {
      const pinyin = getCityPinyin[city] || ''
      const firstChar = pinyin[0]?.toUpperCase() || '#'
      if (!groups[firstChar]) {
        groups[firstChar] = []
      }
      groups[firstChar].push(city)
    })

    return groups
  }, [searchText])

  const letters = Object.keys(groupedCities).sort()

  const handleCityClick = (city: string) => {
    onSelect(city)
    setSearchText('')
    onClose()
  }

  const handleClose = () => {
    setSearchText('')
    onClose()
  }

  return createPortal(
    <>
      {/* 遮罩层 */}
      {visible && (
        <div className={styles.overlay} onClick={handleClose}></div>
      )}
      
      {/* 抽屉 */}
      <div className={`${styles.drawer} ${visible ? styles.active : ''}`}>
        {/* 头部 */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className={styles.title}>城市搜索</h2>
          <div className={styles.placeholder}></div>
        </div>

        {/* 搜索框 */}
        <div className={styles.searchBox}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="城市/区域/位置"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
          />
          {searchText && (
            <button className={styles.clearBtn} onClick={() => setSearchText('')}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Tab */}
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>国内(含港澳台)</div>
        </div>

        {/* 热门城市 */}
        {!searchText && (
          <div className={styles.hotCities}>
            <div className={styles.sectionTitle}>热门城市</div>
            <div className={styles.citiesList}>
              {HOT_CITIES.map((city) => (
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
        )}

        {/* 城市列表 */}
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
      </div>
    </>,
    document.body
  )
}

export default CitySearch
