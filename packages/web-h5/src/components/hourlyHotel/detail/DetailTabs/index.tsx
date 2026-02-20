import React from 'react'
import styles from './index.module.scss'

export type TabKey = 'rooms' | 'facilities' | 'reviews' | 'policies' | 'nearby'

interface DetailTabsProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab, onChange }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'rooms', label: '房型' },
    { key: 'facilities', label: '设施' },
    { key: 'reviews', label: '评价' },
    { key: 'policies', label: '政策' },
    { key: 'nearby', label: '周边' },
  ]

  return (
    <div className={styles.stickyContainer}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetailTabs