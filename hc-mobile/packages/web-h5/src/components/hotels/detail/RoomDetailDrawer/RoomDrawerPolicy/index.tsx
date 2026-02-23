import React from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomDrawerPolicyProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
}

const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps> = ({ spu, sku }) => {
  const roomStatusText = sku.status === 'sold_out' ? '满房' : '可订'
  const cancellationRule = sku.cancellationRule.trim()

  return (
    <div className={styles.policySection}>
      <h3 className={styles.sectionTitle}>预订须知</h3>

      <div className={styles.cancellationPolicyCard}>
        <div className={styles.policyHeader}>
          <span className={styles.policyIcon}>✓</span>
          <span className={styles.policyLabel}>退订政策</span>
        </div>
        <p className={styles.policyText}>{cancellationRule || null}</p>
      </div>

      <div className={styles.policyContent}>
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>📌</span>
            <span className={styles.stepTitle}>房型</span>
          </div>
          <p className={styles.policyDescription}>{spu.spuName || null}</p>
        </div>

        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>✓</span>
            <span className={styles.stepTitle}>状态</span>
          </div>
          <p className={styles.policyDescription}>{roomStatusText}</p>
        </div>

        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>📋</span>
            <span className={styles.stepTitle}>押金说明</span>
          </div>
          <p className={styles.policyDescription}>{null}</p>
        </div>

        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>🔁</span>
            <span className={styles.stepTitle}>房东特殊要求</span>
          </div>
          <p className={styles.policyDescription}>{null}</p>
        </div>

        <div className={styles.policyBox}>
          <h4 className={styles.boxTitle}>支付信息</h4>
          <div className={styles.timeRange}>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>套餐ID</span>
              <span className={styles.timeValue}>{sku.roomId || null}</span>
            </div>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>退订规则</span>
              <span className={styles.timeValue}>{cancellationRule || null}</span>
            </div>
          </div>

          <div className={styles.paymentInfo}>
            <span className={styles.paymentDate}>{null}</span>
            <span className={styles.paymentLabel}>{null}</span>
          </div>
        </div>

        <div className={styles.noticeBox}>
          <span className={styles.noticeIcon}>📌</span>
          <div className={styles.noticeContent}>
            <p className={styles.noticeTitle}>说明</p>
            <p className={styles.noticeText}>{null}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPolicy
