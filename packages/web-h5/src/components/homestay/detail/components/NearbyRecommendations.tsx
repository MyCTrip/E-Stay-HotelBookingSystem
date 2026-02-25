/**
 * 位置周边区域
 * 展示地址、地图和周边景点交通
 */

import React from 'react'
import styles from './NearbyRecommendations.module.scss'

interface NearbyRecommendationsProps {
  location?: string
}

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  location = '上海市黄浦区中福城三期北楼',
}) => {
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
      rating: 4.8,
      type: '交通',
      icon: '🚇',
    },
    {
      name: '南京东路地铁站',
      distance: { value: 697, unit: 'm' },
      rating: 4.6,
      type: '交通',
      icon: '🚇',
    },
    {
      name: '上海火车站',
      distance: { value: 2.7, unit: 'km' },
      rating: 4.5,
      type: '交通',
      icon: '🚄',
    },
    {
      name: '上海虹桥国际机场',
      distance: { value: 14, unit: 'km' },
      rating: 4.7,
      type: '交通',
      icon: '✈️',
    },
  ]

  const attractions = [
    {
      name: '东方明珠',
      distance: { value: 1.5, unit: 'km' },
      rating: 4.9,
      type: '景点',
      icon: '🏛️',
    },
    {
      name: '外滩',
      distance: { value: 2.2, unit: 'km' },
      rating: 4.8,
      type: '景点',
      icon: '🏛️',
    },
  ]

  const restaurants = [
    {
      name: '上海波特曼丽思卡尔顿',
      distance: { value: 2.6, unit: 'km' },
      rating: 4.7,
      type: '美食',
      icon: '🍽️',
    },
    {
      name: '上海浦福土广场',
      distance: { value: 190, unit: 'm' },
      rating: 4.5,
      type: '美食',
      icon: '🍽️',
    },
  ]

  const formatDistance = (dist: { value: number; unit: string }) => {
    return `${dist.value}${dist.unit}`
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>位置周边</h2>
        <a href="#" className={styles.mapLink}>地图/周边 ›</a>
      </div>

      {/* 地址信息 */}
      <div className={styles.addressBlock}>
        <div className={styles.addressItem}>
          <span className={styles.label}>完整地址</span>
          <span className={styles.address}>{locationData.fullAddress}</span>
        </div>
        <p className={styles.detailAddress}>{locationData.detailAddress}</p>

        {/* 地址详情 */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>小区名称</span>
            <span className={styles.value}>{locationData.community}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>所属商圈</span>
            <span className={styles.value}>{locationData.belongsTo}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>建筑年代</span>
            <span className={styles.value}>{locationData.buildAge}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>小区类型</span>
            <span className={styles.value}>{locationData.buildType}</span>
          </div>
        </div>

        {/* 地图占位 */}
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>📍 地图加载中...</div>
        </div>
      </div>

      {/* 交通信息 */}
      <div className={styles.transportSection}>
        <h3 className={styles.sectionTitle}>交通</h3>
        <div className={styles.itemList}>
          {transportations.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线距离 {formatDistance(item.distance)}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.rating}>⭐ {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 景点信息 */}
      <div className={styles.attractionsSection}>
        <h3 className={styles.sectionTitle}>景点</h3>
        <div className={styles.itemList}>
          {attractions.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {formatDistance(item.distance)}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.rating}>⭐ {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 美食信息 */}
      <div className={styles.foodSection}>
        <h3 className={styles.sectionTitle}>逛吃</h3>
        <div className={styles.itemList}>
          {restaurants.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {formatDistance(item.distance)}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.rating}>⭐ {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NearbyRecommendations
