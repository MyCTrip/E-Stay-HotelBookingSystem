/**
 * Search result page header
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

interface SearchResultHeaderProps {
  city?: string
  marketLabel?: string
  resultCount?: number
  loading?: boolean
  hasMore?: boolean
}

const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({
  city = '城市',
  marketLabel = '酒店',
  resultCount = 0,
  loading = false,
  hasMore = false,
}) => {
  const navigate = useNavigate()

  const hintText = loading ? '...' : hasMore ? `${resultCount}+` : String(resultCount)

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} title="返回">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className={styles.title}>{`${city} ${marketLabel}`}</h1>

        <div className={styles.placeholder}>{hintText}</div>
      </div>
    </div>
  )
}

export default SearchResultHeader
