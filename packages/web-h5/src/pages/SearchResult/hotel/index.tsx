import { useState } from 'react'
import styles from './index.module.css'

/**
 * 搜索结果页 - 酒店类型
 */
export default function SearchResultHotelPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>酒店搜索结果</h1>
      </div>
      <div className="content">
        <p>这是酒店类型的搜索结果页</p>
      </div>
    </div>
  )
}
