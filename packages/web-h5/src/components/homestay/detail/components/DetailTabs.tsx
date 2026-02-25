/**
 * 吸顶导航Tab栏
 */

import React from 'react'
import styles from './DetailTabs.module.scss'

export type TabKey = 'rooms' | 'facilities' | 'reviews' | 'policies' | 'nearby'

interface Tab {
  key: TabKey
  label: string
}

const tabs: Tab[] = [
  { key: 'rooms', label: '房型' },
  { key: 'facilities', label: '设施' },
  { key: 'reviews', label: '评价' },
  { key: 'policies', label: '政策' },
  { key: 'nearby', label: '周边' },
]

interface DetailTabsProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onChange(tab.key)}
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
