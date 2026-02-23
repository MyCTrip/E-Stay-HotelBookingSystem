import React from 'react'
import type { HotelSurroundingModel } from '@estay/shared'
import styles from './index.module.scss'

interface NearbyRecommendationsProps {
  address?: string | null
  distanceText?: string
  surroundings: HotelSurroundingModel[]
}

interface SurroundingItemViewModel {
  name: string
  distanceText: string
  icon: string
}

const getIconByType = (type: string): string => {
  if (['metro', 'transport'].includes(type)) {
    return '🚇'
  }
  if (type === 'attraction') {
    return '🏞️'
  }
  return '🍽️'
}

const toViewModel = (item: HotelSurroundingModel): SurroundingItemViewModel => ({
  name: item.surName,
  distanceText: item.distanceText || '',
  icon: getIconByType(item.surType),
})

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  address = null,
  distanceText = '',
  surroundings,
}) => {
  const transportations = surroundings
    .filter((item) => ['metro', 'transport'].includes(item.surType))
    .map(toViewModel)

  const attractions = surroundings
    .filter((item) => item.surType === 'attraction')
    .map(toViewModel)

  const restaurants = surroundings
    .filter((item) => !['metro', 'transport', 'attraction'].includes(item.surType))
    .map(toViewModel)

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>位置周边</h2>
        <a href="#" className={styles.mapLink}>
          地图/周边 →
        </a>
      </div>

      <div className={styles.addressBlock}>
        <div className={styles.addressItem}>
          <span className={styles.label}>完整地址</span>
          <span className={styles.address}>{address || null}</span>
        </div>
        <p className={styles.detailAddress}>{distanceText || null}</p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>小区名称</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>所属商圈</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>建筑年代</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>小区类型</span>
            <span className={styles.value}>{null}</span>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>🗺 地图加载中...</div>
        </div>
      </div>

      <div className={styles.transportSection}>
        <h3 className={styles.sectionTitle}>交通</h3>
        <div className={styles.itemList}>
          {transportations.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线距离 {item.distanceText || null}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{null}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.attractionsSection}>
        <h3 className={styles.sectionTitle}>景点</h3>
        <div className={styles.itemList}>
          {attractions.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {item.distanceText || null}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{null}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foodSection}>
        <h3 className={styles.sectionTitle}>逛吃</h3>
        <div className={styles.itemList}>
          {restaurants.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {item.distanceText || null}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{null}</span>
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
