import React, { useState , useMemo } from 'react'
import type { HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

// 假设这些图标已经定义在组件库中，或者直接使用 Emoji 替代
const PositionIcon = () => <span>📍</span>
const TipIcon = () => <span>ℹ️</span>

interface NearbyRecommendationsProps {
  baseInfo: Pick<HotelEntityBaseInfoModel, 'address' | 'surroundings'>
  distanceText?: string
}

type TabType = 'transport' | 'attraction' | 'food' | 'shopping'

const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m`
  return `${(distanceMeters / 1000).toFixed(1)}km`
}

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  baseInfo,
  distanceText = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('transport')
  const [showCopyToast, setShowCopyToast] = useState(false)

  const surroundings = baseInfo.surroundings ?? []

  // 1. 数据分类处理
  const getTabData = () => {
    switch (activeTab) {
      case 'transport':
        return surroundings.filter(item => item.surType === 'metro')
      case 'attraction':
        return surroundings.filter(item => item.surType === 'attraction')
      case 'food':
        // 假设酒店数据中 business 包含美食，或者过滤特定的美食类型
        return surroundings.filter(item => item.surType === 'business') 
      // case 'shopping':
      //   return surroundings.filter(item => item.surType === 'shopping')
      default:
        return []
    }
  }

  // 2. 复制功能
  const handleCopyAddress = () => {
    if (!baseInfo.address) return
    navigator.clipboard.writeText(baseInfo.address).then(() => {
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 2000)
    })
  }

  const currentItems = useMemo(() => {
    const mapping: Record<TabType, string> = {
      transport: 'metro',
      attraction: 'attraction',
      food: 'business', // 假设 business 包含美食
      shopping: 'shopping',
    }
    return surroundings.filter((item) => item.surType === mapping[activeTab])
  }, [surroundings, activeTab])

  return (
    <div className={styles.section}>
      {/* 标题 */}
      <div className={styles.header}>
        <h2 className={styles.title}>位置周边</h2>
        <span className={styles.moreInfo}>更多周边信息 &gt;</span>
      </div>

      {/* 地址信息区块 */}
      <div className={styles.addressBlock}>
        <div className={styles.addressItem}>
          <span className={styles.label}>完整地址</span>
          <div className={styles.addressWithCopy}>
            <span className={styles.address}>
              <PositionIcon />
              {baseInfo.address || '暂无地址'}
            </span>
            <button className={styles.copyBtn} onClick={handleCopyAddress}>复制</button>
          </div>
        </div>

        {/* 详情网格卡片 */}
        <div className={styles.detailCard}>
          <h4 className={styles.cardTitle}>酒店相关信息</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>前台电话:</span>
              <span className={styles.value}>8622999</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>所属商圈:</span>
              <span className={styles.value}>南山区</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>建筑年代:</span>
              <span className={styles.value}>2025</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>酒店类型:</span>
              <span className={styles.value}>舒适</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 切换区域 */}
      <div className={styles.tabSection}>
        <div className={styles.tabButtons}>
          {[
            { id: 'transport', label: '交通' },
            { id: 'attraction', label: '景点' },
            { id: 'food', label: '美食' },
            { id: 'shopping', label: '购物' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {getTabData().length > 0 ? (
            getTabData().map((item, idx) => (
              <div key={idx} className={styles.contentItem}>
                <span className={styles.itemName}>{item.surName}</span>
                <span className={styles.itemDistance}>
                  直线距离 {formatDistance(item.distance)}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.empty}>暂无相关信息</div>
          )}
        </div>
      </div>

      {/* 底部 Tip */}
      <div className={styles.tipSection}>
        <TipIcon />
        <span className={styles.tipText}>内容仅供参考，具体以实际情况为准</span>
      </div>

      {/* 复制成功Toast */}
      {showCopyToast && <div className={styles.copyToast}>复制成功</div>}
    </div>
  )
}

export default NearbyRecommendations