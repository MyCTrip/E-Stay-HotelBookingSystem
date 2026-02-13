import { useState } from 'react'
import styles from './index.module.css'

/**
 * 酒店详情页 - 民宿类型
 */
export default function HotelDetailHomeStayPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>民宿详情</h1>
      </div>
      <div className="content">
        <p>这是民宿类型的酒店详情页</p>
      </div>
    </div>
  )
}