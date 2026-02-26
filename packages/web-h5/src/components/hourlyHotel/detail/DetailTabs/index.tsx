/**
 * 吸顶导航Tab栏
 */

import React from 'react'
import styles from './index.module.scss'

export type TabKey = 'overview' | 'rooms' | 'reviews' | 'facilities' | 'policies' | 'knowledge' | 'nearby' | 'host'

interface Tab {
  key: TabKey
  label: string
}

const tabs: Tab[] = [
  // { key: 'overview', label: '概览' },
  { key: 'rooms', label: '房源' },
  { key: 'reviews', label: '点评' },
  { key: 'facilities', label: '设施' },
  { key: 'nearby', label: '周边' },
  { key: 'policies', label: '政策' },
]

interface DetailTabsProps {
  activeTab?: TabKey
  onChange?: (tab: TabKey) => void
}

const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab = 'overview', onChange = () => { } }) => {
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
