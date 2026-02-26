/**
 * 钟点房 - 底部固定预订栏
 */

import React from 'react'
import styles from './index.module.scss'

interface HourlyBookingBarProps {
  data: any
  onBook?: () => void
}

const HourlyBookingBar: React.FC<HourlyBookingBarProps> = ({ data, onBook }) => {
  // 获取钟点房特有的价格和起步时长信息
  // 注意：这里优先取外层的 price 和 duration，因为钟点房数据结构通常把最便宜的价格放外层
  const price = data?.price || 90
  const duration = data?.duration || 3

  return (
    <div className={styles.bookingBar}>
      {/* 左侧价格区 */}
      <div className={styles.priceArea}>
        <span className={styles.currency}>¥</span>
        <span className={styles.price}>{price}</span>
        {/* 替换民宿的 "/晚" 为 "起/x小时" */}
        <span className={styles.unit}>起/{duration}小时</span>
      </div>

      {/* 右侧预订按钮 */}
      <button className={styles.bookBtn} onClick={onBook}>
        选择房型
      </button>
    </div>
  )
}

export default HourlyBookingBar