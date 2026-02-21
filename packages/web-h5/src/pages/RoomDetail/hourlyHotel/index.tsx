import { useState } from 'react'
import styles from './index.module.css'

/**
 * 房间详情页 - 钟点房类型
 */
export default function RoomDetailHourlyHotelPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>钟点房房间详情</h1>
      </div>
      <div className="content">
        <p>这是钟点房类型的房间详情页</p>
      </div>
    </div>
  )
}
