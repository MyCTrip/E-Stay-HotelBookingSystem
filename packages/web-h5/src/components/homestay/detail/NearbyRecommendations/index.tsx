/**
 * 位置周边区域
 * 展示地址、地图和周边景点交通
 */

import React, { useState } from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import styles from './index.module.scss'
import { PositionIcon, TipIcon } from '../../icons'

interface NearbyRecommendationsProps {
  location?: string
}

/**
 * NearbyRecommendations 内容组件
 */
const NearbyRecommendationsContent: React.FC<NearbyRecommendationsProps> = ({
  location = '上海市黄浦区中福城三期北楼',
}) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'attraction' | 'food' | 'shopping'>('transport')
  const [showCopyToast, setShowCopyToast] = useState(false)

  const locationData = {
    fullAddress: '上海市黄浦区中福城三期北楼-正门',
    detailAddress: '上海黄浦区中福城三期北楼-正门(广西北路汉口路...',
    community: '中福城',
    belongsTo: '人民广场地区',
    buildAge: '2002-2005年',
    buildType: '住宅',
  }

  const transportations = [
    {
      name: '人民广场地铁站',
      distance: { value: 235, unit: 'm' },
    },
    {
      name: '南京东路地铁站',
      distance: { value: 697, unit: 'm' },
    },
    {
      name: '上海火车站',
      distance: { value: 2.7, unit: 'km' },
    },
    {
      name: '上海虹桥国际机场',
      distance: { value: 14, unit: 'km' },
    },
  ]

  const attractions = [
    {
      name: '东方明珠',
      distance: { value: 1.5, unit: 'km' },
    },
    {
      name: '外滩',
      distance: { value: 2.2, unit: 'km' },
    },
  ]

  const restaurants = [
    {
      name: '上海波特曼丽思卡尔顿',
      distance: { value: 2.6, unit: 'km' },
    },
    {
      name: '上海浦福土广场',
      distance: { value: 190, unit: 'm' },
    },
  ]

  const shopping = [
    {
      name: '南京路步行街',
      distance: { value: 1.2, unit: 'km' },
    },
    {
      name: '豫园商城',
      distance: { value: 890, unit: 'm' },
    },
  ]

  const formatDistance = (dist: { value: number; unit: string }) => {
    return `${dist.value}${dist.unit}`
  }

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
              <span className={styles.value}>{locationData.community}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>所属商圈:</span>
              <span className={styles.value}>{locationData.belongsTo}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>建筑年代:</span>
              <span className={styles.value}>{locationData.buildAge}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>小区类型:</span>
              <span className={styles.value}>{locationData.buildType}</span>
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
          {getTabData().map((item, idx) => (
            <div key={idx} className={styles.contentItem}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemDistance}>直线距离 {formatDistance(item.distance)}</span>
            </div>
          ))}
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
  location = '上海市黄浦区中福城三期北楼',
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
      <NearbyRecommendationsContent location={location} />
    </PropertyCardContainer>
  )
}

export default NearbyRecommendations
