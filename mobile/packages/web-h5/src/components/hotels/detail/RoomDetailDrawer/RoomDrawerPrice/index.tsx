import React from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomDrawerPriceProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
}

const CURRENCY_SYMBOL = '\u00A5'

const RoomDrawerPrice: React.FC<RoomDrawerPriceProps> = ({ spu, sku }) => {
  const nightlyPrice = sku.priceInfo.nightlyPrice
  const soldOutHint = sku.status === 'sold_out' ? '当前套餐已满房' : '当前套餐可预订'

  return (
    <div className={styles.priceSection}>
      <h3 className={styles.sectionTitle}>价格与优惠</h3>

      <div className={styles.socialProofCard}>
        <span className={styles.proofIcon}>🔥</span>
        <p className={styles.proofText}>
          <strong>{spu.spuName}</strong>
        </p>
      </div>

      <div className={styles.priceContent}>
        <div className={styles.priceCard}>
          <div className={styles.priceRow}>
            <span className={styles.label}>房费</span>
            <span className={styles.value}>
              {CURRENCY_SYMBOL}
              {nightlyPrice}
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>优惠</span>
            <span className={`${styles.value} ${styles.discount}`}>{null}</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>运费直减</span>
            <span className={`${styles.value} ${styles.discount}`}>{null}</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>活动优惠</span>
            <span className={`${styles.value} ${styles.discount}`}>{null}</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>旅游券包</span>
            <span className={`${styles.value} ${styles.discount}`}>{null}</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.label}>提券取奖</span>
            <span className={`${styles.value} ${styles.discount}`}>{null}</span>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.priceRow} ${styles.finalPrice}`}>
            <span className={styles.label}>优惠后</span>
            <span className={styles.value}>
              {CURRENCY_SYMBOL}
              {nightlyPrice}
            </span>
          </div>

          <div className={styles.priceHint}>{soldOutHint}</div>
        </div>

        <div className={styles.discountList}>
          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>🎁</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>{null}</p>
              <p className={styles.discountDesc}>{null}</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>⭐</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>{null}</p>
              <p className={styles.discountDesc}>{null}</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>🎫</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>{null}</p>
              <p className={styles.discountDesc}>{null}</p>
            </div>
          </div>

          <div className={styles.discountItem}>
            <span className={styles.discountIcon}>💳</span>
            <div className={styles.discountInfo}>
              <p className={styles.discountName}>{null}</p>
              <p className={styles.discountDesc}>{null}</p>
            </div>
          </div>
        </div>

        <div className={styles.tipBox}>
          <span className={styles.tipIcon}>ℹ️</span>
          <p className={styles.tipText}>{null}</p>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPrice
