import { useState } from 'react'
import styles from './index.module.css'

/**
 * 搜索结果页 - 民宿类型
 */
export default function SearchResultHomeStayPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>民宿搜索结果</h1>
      </div>
      <div className="content">
        <p>这是民宿类型的搜索结果页</p>
      </div>
    </div>
  )
}