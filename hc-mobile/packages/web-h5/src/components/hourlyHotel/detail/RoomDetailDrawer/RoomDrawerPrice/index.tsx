/**
 * 价格与优惠信息 - 符合行业规范（含社交证明）
 */

import React from 'react'
import styles from './index.module.scss'

interface Room {
  id: string
  price: number
  [key: string]: any
}

interface RoomDrawerPriceProps {
  room: Room
}

const RoomDrawerPrice: React.FC<RoomDrawerPriceProps> = ({ room }) => {
  return (
    <div className={styles.priceSection}>
      <h3 className={styles.sectionTitle}>价格与优惠</h3>

      {/* 社交证明 - 最后预订信息 */}
      <div className={styles.socialProofCard}>
        <span className={styles.proofIcon}>🔥</span>
        <p className={styles.proofText}>
          本月<strong>45人</strong>预订了此房型
        </p>
      </div>

      <div className={styles.priceContent}>
        {/* 价格卡片 */}
        <div className={styles.priceCard}>
          <div className={styles.priceRow}>
            <span className={styles.label}>房费</span>
            <span className={styles.value}>¥{room.price}</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>优惠</span>
            <span className={`${styles.value} ${styles.discount}`}>-¥1538</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>运费直减</span>
            <span className={`${styles.value} ${styles.discount}`}>-¥279</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>合动优惠</span>
            <span className={`${styles.value} ${styles.discount}`}>-¥1116</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>旅游券套</span>
            <span className={`${styles.value} ${styles.discount}`}>-¥140</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>提券取奖</span>
            <span className={`${styles.value} ${styles.discount}`}>-¥3</span>
          </div>

          {/* 分割线 */}
          <div className={styles.divider} />

          {/* 优惠后价格 - 突出显示 */}
          <div className={`${styles.priceRow} ${styles.finalPrice}`}>
            <span className={styles.label}>优惠后</span>
            <span className={styles.value}>¥{Math.max(0, room.price - 1538)}</span>
          </div>

          {/* 价格提示 */}
          <div className={styles.priceHint}>
            相比平均价格便宜 30%，今日仅剩 3 间
          </div>
        </div>

        {/* 优惠信息展示 */}
        <div className={styles.discountList}>
          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>🎁</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>新用户立减</p>
              <p className={styles.discountDesc}>首次预订享受 ¥100 立减</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>⭐</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>会员优惠</p>
              <p className={styles.discountDesc}>会员享受 20% 折扣</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>🎫</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>旅游券</p>
              <p className={styles.discountDesc}>使用旅游券额外享受 10% 优惠</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>💳</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>指定支付</p>
              <p className={styles.discountDesc}>信用卡支付享受积分加倍</p>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className={styles.tipBox}>
          <span className={styles.tipIcon}>ℹ️</span>
          <p className={styles.tipText}>
            以上为 2 月 16 日起的价格，仅供参考。实际价格以下单时为准。此价格在 12 小时内有效。
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPrice
