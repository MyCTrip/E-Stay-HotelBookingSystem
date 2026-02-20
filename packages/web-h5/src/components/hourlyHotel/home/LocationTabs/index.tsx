/**
 * 地点分类tabs组件 - Web H5版本
 * 国内 / 海外 / 周租·旅居
 */

import React, { useState } from 'react'
import styles from './index.module.scss'

type TabType = 'domestic' | 'overseas' | 'weekly'

interface LocationTabsProps {
  activeTab?: TabType
  onChange?: (tab: TabType) => void
}

interface Tab {
  id: TabType
  label: string
}

const TABS: Tab[] = [
  { id: 'domestic', label: '国内' },
  { id: 'overseas', label: '海外' },
  { id: 'weekly', label: '周租·旅居' },
]

const LocationTabs: React.FC<LocationTabsProps> = ({
  activeTab = 'domestic',
  onChange,
}) => {
  const [active, setActive] = useState<TabType>(activeTab)

  const handleTabClick = (tab: TabType) => {
    setActive(tab)
    onChange?.(tab)
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabsWrapper}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className={styles.label}>{tab.label}</span>
            {active === tab.id && <div className={styles.underline} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(LocationTabs)
