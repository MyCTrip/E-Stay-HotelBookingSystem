import React from 'react'
import type { HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

interface NearbyRecommendationsProps {
  baseInfo: Pick<HotelEntityBaseInfoModel, 'address' | 'surroundings'>
  distanceText?: string
}

interface SurroundingItemViewModel {
  name: string
  distanceText: string
  icon: string
}

const getIconByType = (type: string): string => {
  if (type === 'metro') {
    return '🚇'
  }
  if (type === 'attraction') {
    return '🏞️'
  }
  return '🏬'
}

const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`
}

const toViewModel = (item: NonNullable<HotelEntityBaseInfoModel['surroundings']>[number]): SurroundingItemViewModel => ({
  name: item.surName,
  distanceText: formatDistance(item.distance),
  icon: getIconByType(item.surType),
})

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  baseInfo,
  distanceText = '',
}) => {
  const surroundings = baseInfo.surroundings ?? []

  const transportations = surroundings
    .filter((item) => item.surType === 'metro')
    .map(toViewModel)

  const attractions = surroundings
    .filter((item) => item.surType === 'attraction')
    .map(toViewModel)

  const businesses = surroundings
    .filter((item) => item.surType === 'business')
    .map(toViewModel)

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Location</h2>
        <a href="#" className={styles.mapLink}>
          Map / Nearby →
        </a>
      </div>

      <div className={styles.addressBlock}>
        <div className={styles.addressItem}>
          <span className={styles.label}>Address</span>
          <span className={styles.address}>{baseInfo.address || null}</span>
        </div>
        <p className={styles.detailAddress}>{distanceText || null}</p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Community</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Business area</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Building age</span>
            <span className={styles.value}>{null}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Property type</span>
            <span className={styles.value}>{null}</span>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>🗺 Loading map...</div>
        </div>
      </div>

      <div className={styles.transportSection}>
        <h3 className={styles.sectionTitle}>Transport</h3>
        <div className={styles.itemList}>
          {transportations.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>Straight line {item.distanceText || null}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{null}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.attractionsSection}>
        <h3 className={styles.sectionTitle}>Attractions</h3>
        <div className={styles.itemList}>
          {attractions.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>Straight line {item.distanceText || null}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{null}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foodSection}>
        <h3 className={styles.sectionTitle}>Business</h3>
        <div className={styles.itemList}>
          {businesses.map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>Straight line {item.distanceText || null}</span>
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
