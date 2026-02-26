import React, { useMemo, useState } from 'react'
import type { CheckinInfoModel, PolicyModel } from '@estay/shared'
import BottomDrawer from '../../shared/BottomDrawer'
import styles from './index.module.scss'

interface PolicySectionProps {
  policies?: PolicyModel[] | null
  checkinInfo?: Pick<CheckinInfoModel, 'checkinTime' | 'checkoutTime'> | null
}

interface PolicyRow {
  id: string
  label: string
  mainText: string
  extraText?: string
  highlight: boolean
}

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, ' ')

const normalizeText = (value?: string): string => {
  if (!value) {
    return ''
  }

  return stripHtml(value)
    .replace(/\s+/g, ' ')
    .trim()
}

const mapPolicyLabel = (policyType: string): string => {
  const type = policyType.toLowerCase()

  if (type.includes('cancellation')) return '退订'
  if (type.includes('breakfast')) return '早餐'
  if (type.includes('pet')) return '宠物'
  if (type.includes('payment')) return '支付'
  if (type.includes('smoking')) return '吸烟'
  if (type.includes('child')) return '儿童'

  return '政策'
}

const isPositivePolicy = (policyType: string, text: string): boolean => {
  const source = `${policyType} ${text}`.toLowerCase()

  return (
    source.includes('cancellation') ||
    source.includes('free cancellation') ||
    source.includes('免费取消') ||
    source.includes('可免费取消')
  )
}

const buildPolicyRows = (policies: PolicyModel[] | null | undefined): PolicyRow[] => {
  if (!policies || policies.length === 0) {
    return [
      {
        id: 'default-policy',
        label: '政策',
        mainText: '具体政策以酒店前台说明为准。',
        highlight: false,
      },
    ]
  }

  return policies.map((policy, index) => {
    const summaryText = normalizeText(policy.summary)
    const contentText = normalizeText(policy.content)
    const mainText = summaryText || contentText || '具体政策以酒店前台说明为准。'
    const extraText = contentText && contentText !== mainText ? contentText : undefined

    return {
      id: `${policy.policyType}-${index}`,
      label: mapPolicyLabel(policy.policyType),
      mainText,
      extraText,
      highlight: isPositivePolicy(policy.policyType, `${mainText} ${extraText ?? ''}`),
    }
  })
}

const PolicySection: React.FC<PolicySectionProps> = ({ policies = null, checkinInfo = null }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const checkinText = `入住：${checkinInfo?.checkinTime ?? '14:00'} 以后 / 退房：${
    checkinInfo?.checkoutTime ?? '12:00'
  } 以前`

  const policyRows = useMemo(() => buildPolicyRows(policies), [policies])
  const previewRows = policyRows.slice(0, 3)

  const renderRows = (rows: PolicyRow[]) =>
    rows.map((row) => (
      <div key={row.id} className={styles.row}>
        <div className={styles.label}>{row.label}</div>
        <div className={styles.content}>
          <p className={`${styles.mainText} ${row.highlight ? styles.highlightText : ''}`}>
            {row.highlight ? <span className={styles.highlightIcon}>✓</span> : null}
            {row.mainText}
          </p>
          {row.extraText ? <p className={styles.extraText}>{row.extraText}</p> : null}
        </div>
      </div>
    ))

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>预订须知</h2>
        <button type="button" className={styles.viewAllBtn} onClick={() => setDrawerOpen(true)}>
          全部须知 &gt;
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.label}>入离</div>
          <div className={styles.content}>
            <p className={styles.mainText}>{checkinText}</p>
          </div>
        </div>

        {renderRows(previewRows)}
      </div>

      <BottomDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="全部须知"
        showBackButton={true}
        showHeader={true}
        maxHeight="78vh"
      >
        <div className={styles.drawerContent}>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.label}>入离</div>
              <div className={styles.content}>
                <p className={styles.mainText}>{checkinText}</p>
              </div>
            </div>
            {renderRows(policyRows)}
          </div>
        </div>
      </BottomDrawer>
    </section>
  )
}

export default PolicySection
