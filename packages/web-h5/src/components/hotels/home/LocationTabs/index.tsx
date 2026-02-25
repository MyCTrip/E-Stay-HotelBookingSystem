import React, { useEffect, useState } from 'react'
import type { HotelMarket } from '@estay/shared'
import styles from './index.module.scss'

interface LocationTabsProps {
  activeTab?: HotelMarket
  onChange?: (tab: HotelMarket) => void
}

interface Tab {
  id: HotelMarket
  label: string
}

const TABS: Tab[] = [
  { id: 'domestic', label: 'Domestic' },
  { id: 'international', label: 'International / HK, Macau, Taiwan' },
]

const LocationTabs: React.FC<LocationTabsProps> = ({ activeTab = 'domestic', onChange }) => {
  const [active, setActive] = useState<HotelMarket>(activeTab)

  useEffect(() => {
    setActive(activeTab)
  }, [activeTab])

  const handleTabClick = (tab: HotelMarket) => {
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
            {active === tab.id ? <div className={styles.underline} /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(LocationTabs)
