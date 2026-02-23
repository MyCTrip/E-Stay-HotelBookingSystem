import React from 'react'
import type { HotelPolicyModel } from '@estay/shared'
import { TipIcon, CheckIcon, CrossIcon } from '../../icons'
import styles from './index.module.scss'

interface CancellationPolicyRow {
  timeRange: string
  cancellationFee: string
}

interface PolicySectionProps {
  policies?: HotelPolicyModel | null
  checkInTime?: string
  checkOutTime?: string
  amenities?: {
    baby?: boolean
    children?: boolean
    elderly?: boolean
    overseas?: boolean
    hongKongMacaoTaiwan?: boolean
    pets?: boolean
  }
}

const parseCancellationRows = (text: string): CancellationPolicyRow[] => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  return lines.map((line) => {
    const [timeRange, cancellationFee] = line.split('|')
    if (cancellationFee === undefined) {
      return {
        timeRange: '',
        cancellationFee: line,
      }
    }

    return {
      timeRange: timeRange.trim(),
      cancellationFee: cancellationFee.trim(),
    }
  })
}

const PolicySection: React.FC<PolicySectionProps> = ({
  policies,
  checkInTime = '14:00',
  checkOutTime = '12:00',
  amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
  },
}) => {
  const cancellationPolicyText = policies?.cancellationPolicy ?? ''
  const checkInPolicyText = policies?.checkInTime ?? `${checkInTime}-24:00入住`
  const checkOutPolicyText = policies?.checkOutTime ?? `${checkOutTime}前退房`

  const cancellationPolicies = parseCancellationRows(cancellationPolicyText)

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
        <span className={styles.tipText}>以下规则由酒店制定，请仔细阅读并遵守</span>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionRow}>
          <h3 className={styles.sectionTitle}>入离</h3>
          <div className={styles.checkInOut}>
            <div className={styles.item}>
              <span className={styles.label}>入住</span>
              <span className={styles.value}>{checkInPolicyText || null}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>退房</span>
              <span className={styles.value}>{checkOutPolicyText || null}</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>退订</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.highlight}>{cancellationPolicies[0]?.cancellationFee || null}</div>
            <p className={styles.description}>{cancellationPolicyText || null}</p>
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
                          <div>{policy.timeRange || null}</div>
                        </>
                      )}
                      {idx > 0 && <div>{policy.timeRange || null}</div>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.feeCell}>{policy.cancellationFee || null}</div>
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
