import { useState } from 'react'
import styles from './index.module.css'

/**
 * 搜索结果页 - 钟点房类型
 */
export default function SearchResultHourlyHotelPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>钟点房搜索结果</h1>
      </div>
      <div className="content">
        <p>这是钟点房类型的搜索结果页</p>
      </div>
    </div>
  )
}
