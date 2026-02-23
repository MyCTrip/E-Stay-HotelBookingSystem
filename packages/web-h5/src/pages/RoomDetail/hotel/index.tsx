import { useState } from 'react'
import styles from './index.module.css'

/**
 * 房间详情页 - 酒店类型
 */
export default function RoomDetailHotelPage() {
  return (
    <div className={styles.container}>
      <div className="header">
        <h1>酒店房间详情</h1>
      </div>
      <div className="content">
        <p>这是酒店类型的房间详情页</p>
      </div>
    </div>
  )
}
