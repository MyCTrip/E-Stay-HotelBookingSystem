/**
 * 政策与预订须知信息 - 符合行业规范
 */

import React from 'react'
import styles from './index.module.scss'

interface Room {
  id: string
  [key: string]: any
}

interface RoomDrawerPolicyProps {
  room: Room
  customPolicy?: {
    checkInTime?: string
    duration?: string
    overtime?: string
  }
}

const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps> = ({ room }) => {
  return (
    <div className={styles.policySection}>
      <h3 className={styles.sectionTitle}>预订须知</h3>

      {/* 取消政策突出展示 - 重要信息 */}
      <div className={styles.cancellationPolicyCard}>
        <div className={styles.policyHeader}>
          <span className={styles.policyIcon}>✓</span>
          <span className={styles.policyLabel}>免费取消政策</span>
        </div>
        <p className={styles.policyText}>
          入住前 30 天内取消可获得全额退款。入住前 7 天内取消，退款 50%。
        </p>
      </div>

      <div className={styles.policyContent}>
        {/* 押金 */}
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>💰</span>
            <span className={styles.stepTitle}>押金</span>
          </div>
          <p className={styles.policyDescription}>¥500，下单签订后，需后两周送达。无损归还。</p>
        </div>

        {/* 加入 */}
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>✅</span>
            <span className={styles.stepTitle}>加入</span>
          </div>
          <p className={styles.policyDescription}>标准入住8人、3间2人、¥50/人/晚</p>
        </div>

        {/* 确认 */}
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>📋</span>
            <span className={styles.stepTitle}>确认</span>
          </div>
          <p className={styles.policyDescription}>立即确认，无需等待确认</p>
        </div>

        {/* 退订 */}
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>🔄</span>
            <span className={styles.stepTitle}>退订</span>
          </div>
          <p className={styles.policyDescription}>30分钟内免费取消。订单排期灵活，无隐藏费用。</p>
        </div>

        {/* 支付时间范围 */}
        <div className={styles.policyBox}>
          <h4 className={styles.boxTitle}>支付信息</h4>
          <div className={styles.timeRange}>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>需提前支付时间段:</span>
              <span className={styles.timeValue}>最晚入住前50分钟内</span>
            </div>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>选择日期支付:</span>
              <span className={styles.timeValue}>全额预冷页面</span>
            </div>
          </div>

          <div className={styles.paymentInfo}>
            <span className={styles.paymentDate}>02月16日22:24元</span>
            <span className={styles.paymentLabel}>应请日圣款</span>
          </div>
        </div>

        {/* 说明 */}
        <div className={styles.noticeBox}>
          <span className={styles.noticeIcon}>📌</span>
          <div className={styles.noticeContent}>
            <p className={styles.noticeTitle}>发票说明</p>
            <p className={styles.noticeText}>发票由商家房源页面处理，售价公司提供</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPolicy
