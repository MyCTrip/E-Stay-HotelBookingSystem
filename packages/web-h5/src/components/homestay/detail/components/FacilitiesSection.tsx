/**
 * 设施区模块
 */

import React from 'react'
import type { HomeStay } from '@estay/shared'
import styles from './FacilitiesSection.module.scss'

interface FacilitiesSectionProps {
  data: HomeStay
}

const facilities = [
  { name: '停车位', icon: '🅿️' },
  { name: '冷藏空调', icon: '❄️' },
  { name: '电梯', icon: '🛗' },
  { name: '卧室', icon: '🛏️' },
  { name: '厨房', icon: '🍳' },
  { name: '冰箱', icon: '❄️' },
  { name: '洗衣机', icon: '🧺' },
  { name: '行李寄存', icon: '🧳' },
  { name: '大客厅', icon: '🛋️' },
  { name: '热水', icon: '🚿' },
  { name: '麻将机', icon: '🎰' },
  { name: '一次性毛巾', icon: '🧴' },
]

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ data }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>设施&服务</h2>
      <p className={styles.total}>共47项设施</p>

      <div className={styles.grid}>
        {facilities.map((fac, idx) => (
          <div key={idx} className={styles.item}>
            <span className={styles.icon}>{fac.icon}</span>
            <span className={styles.name}>{fac.name}</span>
          </div>
        ))}
      </div>

      <button className={styles.viewAll}>查看全部47项设施</button>
    </div>
  )
}

export default FacilitiesSection
