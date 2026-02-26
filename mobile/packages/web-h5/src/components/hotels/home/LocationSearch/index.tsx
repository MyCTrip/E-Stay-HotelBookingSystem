/**
 * 位置搜索组件 - 景点/地标/房源搜索，只提供内容
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

interface LocationSearchProps {
  onSelect: (location: string) => void
  onClose: () => void
}

const SEARCH_CATEGORIES = [
  { icon: '🏞️', label: '景点' },
  { icon: '🏛️', label: '地标' },
  { icon: '🏠', label: '房源' },
  { icon: '🏨', label: '酒店' },
]

const LOCATION_SUGGESTIONS = [
  '西湖公园',
  '西街/开元寺',
  '万达（浦西店）',
  '泉州古城',
  '西湖公园',
  '丰泽区',
  '蜂埠村',
]

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect, onClose }) => {
  const [searchText, setSearchText] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setSearchText(text)

    if (text.trim()) {
      const results = LOCATION_SUGGESTIONS.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleLocationSelect = (location: string) => {
    setSearchHistory([location, ...searchHistory.filter((h) => h !== location)])
    onSelect(location)
    setSearchText('')
    setSearchResults([])
    onClose()
  }

  const handleClearHistory = () => {
    setSearchHistory([])
  }

  return (
    <>
      {/* 搜索框 */}
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
          placeholder="搜索泉州的景点、地标、房源"
          value={searchText}
          onChange={handleInputChange}
          autoFocus
        />
        {searchText && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearchText('')
              setSearchResults([])
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 当没有输入时显示分类 */}
      {!searchText && (
        <div className={styles.categoriesSection}>
          <div className={styles.categoriesGrid}>
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={styles.categoryItem}
                onClick={() => handleLocationSelect(cat.label)}
              >
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <div className={styles.categoryLabel}>{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果或搜索历史 */}
      <div className={styles.contentContainer}>
        {searchText ? (
          // 搜索结果
          searchResults.length > 0 ? (
            <div className={styles.resultsSection}>
              {searchResults.map((result) => (
                <button
                  key={result}
                  className={styles.resultItem}
                  onClick={() => handleLocationSelect(result)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    className={styles.resultIcon}
                  >
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="10" r="3" fill="currentColor" />
                  </svg>
                  <span>{result}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>未找到相关位置</div>
          )
        ) : (
          // 搜索历史
          searchHistory.length > 0 && (
            <div className={styles.historySection}>
              <div className={styles.historyHeader}>
                <span className={styles.historyTitle}>搜索历史</span>
                <button className={styles.clearHistoryBtn} onClick={handleClearHistory}>
                  清空
                </button>
              </div>
              <div className={styles.historyList}>
                {searchHistory.map((history) => (
                  <button
                    key={history}
                    className={styles.historyItem}
                    onClick={() => handleLocationSelect(history)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      className={styles.historyIcon}
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <polyline points="12 6 12 12 16 14" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                    <span>{history}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </>
  )
}

export default LocationSearch
