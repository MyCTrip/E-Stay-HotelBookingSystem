import React from 'react'
import type { HotelSurroundingModel } from '@estay/shared'
import styles from './index.module.scss'

interface NearbyRecommendationsProps {
  location?: string
  surroundings?: HotelSurroundingModel[]
}

interface NearbyItem {
  name: string
  distanceText: string
  type: string
  icon: string
}

const mapSurroundingToItem = (item: HotelSurroundingModel): NearbyItem => ({
  name: item.surName,
  distanceText: item.distanceText || '--',
  type: item.surType,
  icon: '📍',
})

const isType = (value: string, keywords: string[]): boolean =>
  keywords.some((keyword) => value.includes(keyword))

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({
  location = '上海市黄浦区中福城三期北楼',
  surroundings = [],
}) => {
  const locationData = {
    fullAddress: location,
    detailAddress: location,
    community: '周边',
    belongsTo: '位置周边',
    buildAge: '--',
    buildType: '--',
  }

  const mappedItems = surroundings.map(mapSurroundingToItem)

  const transportations = mappedItems.filter((item) =>
    isType(item.type, ['交通', '地铁', '站'])
  )
  const attractions = mappedItems.filter((item) =>
    isType(item.type, ['景点', '玩乐', '旅游'])
  )
  const restaurants = mappedItems.filter((item) =>
    isType(item.type, ['美食', '餐厅', '小吃'])
  )

  const fallbackItems = mappedItems.filter(
    (item) => !transportations.includes(item) && !attractions.includes(item) && !restaurants.includes(item)
  )

  const finalTransportations = transportations.length > 0 ? transportations : fallbackItems
  const finalAttractions = attractions.length > 0 ? attractions : []
  const finalRestaurants = restaurants.length > 0 ? restaurants : []

  const formatDistance = (distanceText: string) => distanceText

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
          <span className={styles.address}>{locationData.fullAddress}</span>
        </div>
        <p className={styles.detailAddress}>{locationData.detailAddress}</p>

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

        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>🗺 地图加载中...</div>
        </div>
      </div>

      <div className={styles.transportSection}>
        <h3 className={styles.sectionTitle}>交通</h3>
        <div className={styles.itemList}>
          {finalTransportations.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线距离 {formatDistance(item.distanceText)}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.attractionsSection}>
        <h3 className={styles.sectionTitle}>景点</h3>
        <div className={styles.itemList}>
          {finalAttractions.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {formatDistance(item.distanceText)}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foodSection}>
        <h3 className={styles.sectionTitle}>逛吃</h3>
        <div className={styles.itemList}>
          {finalRestaurants.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className={styles.listItem}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div className={styles.meta}>
                  <span className={styles.distance}>直线 {formatDistance(item.distanceText)}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.rating}>{item.type}</span>
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
