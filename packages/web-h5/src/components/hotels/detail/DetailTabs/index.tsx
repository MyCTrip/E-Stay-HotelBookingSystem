import React from 'react'
import type { DetailTabKey } from '../../../../layouts/DetailLayout'
import styles from './index.module.scss'

type VisibleTabKey = Exclude<DetailTabKey, 'host'>

interface Tab {
  key: VisibleTabKey
  label: string
}

const tabs: Tab[] = [
  { key: 'overview', label: '概览' },
  { key: 'rooms', label: '房源' },
  { key: 'reviews', label: '点评' },
  { key: 'facilities', label: '设施' },
  { key: 'policies', label: '须知' },
  { key: 'knowledge', label: '周边' },
  { key: 'nearby', label: '附近' },
]

interface DetailTabsProps {
  activeTab?: DetailTabKey
  onChange?: (tab: DetailTabKey) => void
}

const noopOnChange = (_tab: DetailTabKey) => {}

const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab = 'overview', onChange = noopOnChange }) => {
  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onChange?.(tab.key)}
          >
            <span className={styles.label}>{tab.label}</span>
            {activeTab === tab.key && <div className={styles.underline} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DetailTabs
