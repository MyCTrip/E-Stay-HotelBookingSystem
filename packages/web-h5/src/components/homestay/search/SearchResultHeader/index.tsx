/**
 * 搜索结果页 - 顶部返回栏
 * 只显示左侧返回按钮和中间的城市民宿 title
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

interface SearchResultHeaderProps {
  city?: string
}

const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({ city = '城市' }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.headerWrapper}>
      {/* 顶部返回栏 */}
      <div className={styles.header}>
        {/* 返回按钮 */}
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

        {/* 中间标题 */}
        <h1 className={styles.title}>{city}民宿</h1>

        {/* 右边占位 */}
        <div className={styles.placeholder}></div>
      </div>
    </div>
  )
}

export default SearchResultHeader
