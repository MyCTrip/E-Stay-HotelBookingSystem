import React from 'react'
import type { HotelPolicyModel } from '@estay/shared'
import { TipIcon, CheckIcon, CrossIcon } from '../../icons'
import styles from './index.module.scss'

interface PolicySectionProps {
  policies?: HotelPolicyModel
  data?: unknown
  cancelMinutes?: number
  checkInDate?: string
  checkInTime?: string
  checkOutTime?: string
  deadlinetime?: number
  amenities?: {
    baby?: boolean
    children?: boolean
    elderly?: boolean
    overseas?: boolean
    hongKongMacaoTaiwan?: boolean
    pets?: boolean
  }
}

const DEFAULT_POLICY: HotelPolicyModel = {
  checkInTime: '14:00',
  checkOutTime: '12:00',
  cancellationPolicy: 'Please follow hotel cancellation policy',
}

const PolicySection: React.FC<PolicySectionProps> = ({
  policies,
  cancelMinutes = 30,
  checkInDate = '2026-02-21',
  checkInTime,
  checkOutTime,
  deadlinetime = 24,
  amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
  },
}) => {
  const mergedPolicies = {
    ...DEFAULT_POLICY,
    ...policies,
    checkInTime: policies?.checkInTime || checkInTime || DEFAULT_POLICY.checkInTime,
    checkOutTime: policies?.checkOutTime || checkOutTime || DEFAULT_POLICY.checkOutTime,
  }

  const resolvedCheckInTime = mergedPolicies.checkInTime
  const resolvedCheckOutTime = mergedPolicies.checkOutTime || DEFAULT_POLICY.checkOutTime
  const cancellationPolicy = mergedPolicies.cancellationPolicy

  const calculateCancelDeadlineTime = (): string => {
    const [year, month, day] = checkInDate.split('-')
    const [hours, minutes] = resolvedCheckInTime.split(':')

    const checkInDateTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`)
    checkInDateTime.setHours(checkInDateTime.getHours() + deadlinetime)

    const deadlineMonth = String(checkInDateTime.getMonth() + 1).padStart(2, '0')
    const deadlineDay = String(checkInDateTime.getDate()).padStart(2, '0')
    const deadlineHours = String(checkInDateTime.getHours()).padStart(2, '0')
    const deadlineMinutes = String(checkInDateTime.getMinutes()).padStart(2, '0')

    return `${deadlineMonth}${deadlineDay} ${deadlineHours}:${deadlineMinutes}`
  }

  const generateCancellationPolicies = () => {
    const cancelDeadlineTime = calculateCancelDeadlineTime()

    const [, month, day] = checkInDate.split('-')
    const checkInDateStr = `${month}月${day}日`

    const deadlineMonth = cancelDeadlineTime.substring(0, 2)
    const deadlineDay = cancelDeadlineTime.substring(2, 4)
    const deadlineTime = cancelDeadlineTime.substring(5)
    const deadlineDateStr = `${deadlineMonth}月${deadlineDay}日`

    return [
      {
        firstRow: true,
        timeRange: `${checkInDateStr} ${resolvedCheckInTime}前`,
        cancellationFee: '免费取消',
      },
      {
        secondRow: true,
        timeRange: `${checkInDateStr} ${resolvedCheckInTime}后\n${deadlineDateStr} ${deadlineTime}前`,
        cancellationFee: cancellationPolicy,
      },
      {
        thirdRow: true,
        timeRange: `${deadlineDateStr} ${deadlineTime}后`,
        cancellationFee: '取消扣全款',
      },
    ]
  }

  const cancellationPolicies = generateCancellationPolicies()
  const amenityItems = [
    { label: '接待婴儿', enabled: amenities.baby },
    { label: '接待儿童', enabled: amenities.children },
    { label: '接待老人', enabled: amenities.elderly },
    { label: '接待海外', enabled: amenities.overseas },
    { label: '接待港澳台', enabled: amenities.hongKongMacaoTaiwan },
    { label: '带宠物', enabled: amenities.pets },
  ]

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>预订须知</h2>
        <button className={styles.allPoliciesBtn}>
          全部须知 <span className={styles.arrow}>→</span>
        </button>
      </div>

      <div className={styles.tipContainer}>
        <TipIcon width={16} height={16} />
        <span className={styles.tipText}>以下规则由房东制定，请仔细阅读并遵守</span>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionRow}>
          <h3 className={styles.sectionTitle}>入住</h3>
          <div className={styles.checkInOut}>
            <div className={styles.item}>
              <span className={styles.label}>入住</span>
              <span className={styles.value}>{resolvedCheckInTime}-24:00入住</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>退房</span>
              <span className={styles.value}>{resolvedCheckOutTime}前退房</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>退订</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.highlight}>{cancelMinutes}分钟内免费取消</div>
            <p className={styles.description}>
              {cancellationPolicy}
            </p>
          </div>
        </div>

        <div className={styles.tableSection}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>退订时间</th>
                <th>退订费用</th>
              </tr>
            </thead>
            <tbody>
              {cancellationPolicies.map((policy, idx) => (
                <tr key={idx}>
                  <td>
                    <div className={styles.timeCell}>
                      {idx === 0 && (
                        <>
                          <span className={styles.tag}>当前阶段</span>
                          <div>{policy.timeRange}</div>
                        </>
                      )}
                      {idx === 1 && policy.timeRange.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      {idx === 2 && <div>{policy.timeRange}</div>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.feeCell}>{policy.cancellationFee}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>要求</h3>
          </div>
          <div className={styles.amenitiesGrid}>
            {amenityItems.map((item, idx) => (
              <div key={idx} className={styles.amenityItem}>
                {item.enabled ? (
                  <CheckIcon width={20} height={20} />
                ) : (
                  <CrossIcon width={20} height={20} />
                )}
                <span className={styles.amenityLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicySection
