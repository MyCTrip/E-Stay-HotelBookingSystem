/**
 * 底部固定预订栏
 */

import React from 'react'
import styles from './BookingBar.module.scss'

interface BookingBarProps {
  data: any
  onBook?: () => void
}

const BookingBar: React.FC<BookingBarProps> = ({ data, onBook }) => {
  // 获取价格信息
  const price = data?.baseInfo?.price || 1280

  return (
    <div className={styles.bookingBar}>
      {/* 左侧价格区 */}
      <div className={styles.priceArea}>
        <span className={styles.currency}>¥</span>
        <span className={styles.price}>{price}</span>
        <span className={styles.unit}>/晚</span>
        <div className={styles.avgHint}>平均价</div>
      </div>

      {/* 右侧预订按钮 */}
      <button className={styles.bookBtn} onClick={onBook}>
        立即预订
      </button>
    </div>
  )
}

export default BookingBar
