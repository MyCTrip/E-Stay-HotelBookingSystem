/**
 * 酒店政策区
 */

import React, { useState } from 'react'
import styles from './PolicySection.module.scss'

interface PolicySectionProps {
  data: any
}

const policies = [
  { title: '入住/退房规则', content: '入住时间：15:00以后\n退房时间：12:00前' },
  { title: '取消政策', content: '提前7天预订可获得最佳价格\n提前24小时可免费取消' },
  { title: '儿童政策', content: '12岁以下儿童需额外支付¥100/晚\n可免费提供婴儿床' },
]

const PolicySection: React.FC<PolicySectionProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>预订须知</h2>

      <div className={styles.policyList}>
        {policies.map((policy, idx) => (
          <div key={idx} className={styles.policyItem}>
            <div
              className={styles.header}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span className={styles.title2}>{policy.title}</span>
              <span className={styles.icon}>{expanded === idx ? '▲' : '▼'}</span>
            </div>
            {expanded === idx && (
              <div className={styles.content}>
                {policy.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PolicySection
