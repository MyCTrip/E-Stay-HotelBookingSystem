/**
 * 位置周边区域
 * 展示地址、地图和周边景点交通
 */

import React, { useState } from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import styles from './index.module.scss'
import { PositionIcon, TipIcon } from '../../icons'

interface NearbyRecommendationsProps {
  surroundings?: any[]  // 中间件数据
  baseInfo?: any  // 中间件基础信息
}

/**
 * NearbyRecommendations 内容组件
 */
const NearbyRecommendationsContent: React.FC<NearbyRecommendationsProps> = ({
  surroundings: middlewareSurroundings,
  baseInfo: middlewareBaseInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'attraction' | 'food' | 'shopping'>('transport')
  const [showCopyToast, setShowCopyToast] = useState(false)

  const locationData  = {
    fullAddress: middlewareBaseInfo?.fullAddress,
    detailAddress: middlewareBaseInfo?.fullAddress ? (middlewareBaseInfo.fullAddress.substring(0, 30) + '...') : '',
    community: middlewareBaseInfo?.community,
    belongsTo: middlewareBaseInfo?.community?.belongTo,
    buildAge: middlewareBaseInfo?.community?.buildAge,
    buildType: middlewareBaseInfo?.community?.buildType,
  }

  // 安全处理 surroundings 数组
  const surroundingsArray = Array.isArray(middlewareSurroundings) ? middlewareSurroundings : []
  const transportations = surroundingsArray.find((item: any) => item.type === 'transportations')?.content || []
  const attractions = surroundingsArray.find((item: any) => item.type === 'attractions')?.content || []
  const restaurants = surroundingsArray.find((item: any) => item.type === 'restaurants')?.content || []
  const shopping = surroundingsArray.find((item: any) => item.type === 'shopping')?.content || []

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(locationData.fullAddress).then(() => {
      setShowCopyToast(true)
      setTimeout(() => {
        setShowCopyToast(false)
      }, 2400)
    })
  }

  const getTabData = () => {
    switch (activeTab) {
      case 'transport':
        return transportations
      case 'attraction':
        return attractions
      case 'food':
        return restaurants
      case 'shopping':
        return shopping
      default:
        return []
    }
  }

  return (
    <div className={styles.section}>
      {/* 地址信息 */}
      <div className={styles.addressBlock}>
        <div className={styles.addressItem}>
          <span className={styles.label}>完整地址</span>
          <div className={styles.addressWithCopy}>
            <span className={styles.address}>
              <PositionIcon width={14} height={14} color="#8da5cd" />
              {locationData.fullAddress}
            </span>
            <button className={styles.copyBtn} onClick={handleCopyAddress}>
              复制
            </button>
          </div>
        </div>

        {/* 地址详情卡片 */}
        <div className={styles.detailCard}>
          <h4 className={styles.cardTitle}>房源所在小区</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>小区名称:</span>
              <span className={styles.value}>{locationData.community?.name || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>所属商圈:</span>
              <span className={styles.value}>{locationData.belongsTo || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>建筑年代:</span>
              <span className={styles.value}>{locationData.buildAge || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>小区类型:</span>
              <span className={styles.value}>{locationData.buildType || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页切换Section */}
      <div className={styles.tabSection}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'transport' ? styles.active : ''}`}
            onClick={() => setActiveTab('transport')}
          >
            交通
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'attraction' ? styles.active : ''}`}
            onClick={() => setActiveTab('attraction')}
          >
            景点
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'food' ? styles.active : ''}`}
            onClick={() => setActiveTab('food')}
          >
            美食
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'shopping' ? styles.active : ''}`}
            onClick={() => setActiveTab('shopping')}
          >
            购物
          </button>
        </div>

        <div className={styles.tabContent}>
          {getTabData().map((item, idx) => {
            // 安全检查：确保 item 和必要字段存在
            if (!item || !item.name) return null
            const distance = item.distance || { value: '?', unit: '' }
            return (
              <div key={idx} className={styles.contentItem}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemDistance}>直线距离 {distance.value}{distance.unit}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部Tip */}
      <div className={styles.tipSection}>
        <TipIcon width={14} height={14} color='#999'/>
        <span className={styles.tipText}>数据仅供参考，具体以实际情况为准</span>
      </div>

      {/* 复制成功Toast */}
      {showCopyToast && (
        <div className={styles.copyToast}>
          复制成功
        </div>
      )}
    </div>
  )
}

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  surroundings,
  baseInfo,
}) => {
  const handleViewMap = () => {
    // 处理地图/周边点击
    console.log('打开地图')
  }

  return (
    <PropertyCardContainer
      headerConfig={{
        show: true,
        title: {
          text: '位置周边',
          show: true,
        },
        textButton: {
          text: '更多周边信息',
          show: true,
          onClick: handleViewMap,
        },
      }}
    >
      <NearbyRecommendationsContent surroundings={surroundings} baseInfo={baseInfo} />
    </PropertyCardContainer>
  )
}

export default NearbyRecommendations
