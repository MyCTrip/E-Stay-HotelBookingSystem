import React, { useMemo } from 'react'
import type { HotelRoomSKUModel, PolicyModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomDrawerPolicyProps {
  roomName: string
  roomStatus: HotelRoomSKUModel['status']
  roomId: string
  policies?: PolicyModel[]
  cancellationRule?: string
}

const normalizePolicyText = (policy?: PolicyModel): string => {
  if (!policy) {
    return ''
  }

  if (policy.summary?.trim()) {
    return policy.summary.trim()
  }

  return policy.content.replace(/<[^>]*>/g, '').trim()
}

const findPolicyByType = (policies: PolicyModel[], keyword: string): PolicyModel | undefined =>
  policies.find((policy) => policy.policyType.toLowerCase().includes(keyword.toLowerCase()))

const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps> = ({
  roomName,
  roomStatus,
  roomId,
  policies = [],
  cancellationRule,
}) => {
  const roomStatusText = roomStatus === 'sold_out' ? '满房' : '可订'

  const cancellationPolicyText = useMemo(() => {
    const fromPolicy = normalizePolicyText(findPolicyByType(policies, 'cancellation'))
    return fromPolicy || (cancellationRule ?? '').trim()
  }, [cancellationRule, policies])

  const depositText = normalizePolicyText(findPolicyByType(policies, 'deposit'))
  const hostRequirementText = normalizePolicyText(findPolicyByType(policies, 'host'))
  const paymentText = normalizePolicyText(findPolicyByType(policies, 'payment'))
  const noticeText = normalizePolicyText(findPolicyByType(policies, 'notice'))

  return (
    <div className={styles.policySection}>
      <h3 className={styles.sectionTitle}>预订政策须知</h3>

      {cancellationPolicyText ? (
        <div className={styles.cancellationPolicyCard}>
          <div className={styles.policyHeader}>
            <span className={styles.policyIcon}>✓</span>
            <span className={styles.policyLabel}>退订与改期</span>
          </div>
          <p className={styles.policyText}>{cancellationPolicyText}</p>
        </div>
      ) : null}

      <div className={styles.policyContent}>
        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>🏷️</span>
            <span className={styles.stepTitle}>房型</span>
          </div>
          <p className={styles.policyDescription}>{roomName || null}</p>
        </div>

        <div className={styles.policyItem}>
          <div className={styles.policyItemHeader}>
            <span className={styles.stepIcon}>📌</span>
            <span className={styles.stepTitle}>状态</span>
          </div>
          <p className={styles.policyDescription}>{roomStatusText}</p>
        </div>

        {depositText ? (
          <div className={styles.policyItem}>
            <div className={styles.policyItemHeader}>
              <span className={styles.stepIcon}>💰</span>
              <span className={styles.stepTitle}>押金与担保</span>
            </div>
            <p className={styles.policyDescription}>{depositText}</p>
          </div>
        ) : null}

        {hostRequirementText ? (
          <div className={styles.policyItem}>
            <div className={styles.policyItemHeader}>
              <span className={styles.stepIcon}>👤</span>
              <span className={styles.stepTitle}>入住要求</span>
            </div>
            <p className={styles.policyDescription}>{hostRequirementText}</p>
          </div>
        ) : null}

        {roomId || cancellationPolicyText || paymentText ? (
          <div className={styles.policyBox}>
            <h4 className={styles.boxTitle}>预订关键信息</h4>
            <div className={styles.timeRange}>
              {roomId ? (
                <div className={styles.timeItem}>
                  <span className={styles.timeLabel}>房型ID</span>
                  <span className={styles.timeValue}>{roomId}</span>
                </div>
              ) : null}
              {cancellationPolicyText ? (
                <div className={styles.timeItem}>
                  <span className={styles.timeLabel}>退订政策</span>
                  <span className={styles.timeValue}>{cancellationPolicyText}</span>
                </div>
              ) : null}
            </div>

            {paymentText ? (
              <div className={styles.paymentInfo}>
                <span className={styles.paymentDate}>{paymentText}</span>
                <span className={styles.paymentLabel}>{null}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {noticeText ? (
          <div className={styles.noticeBox}>
            <span className={styles.noticeIcon}>ℹ️</span>
            <div className={styles.noticeContent}>
              <p className={styles.noticeTitle}>温馨提示</p>
              <p className={styles.noticeText}>{noticeText}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RoomDrawerPolicy
