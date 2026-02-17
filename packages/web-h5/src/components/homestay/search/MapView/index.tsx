/**
 * 地图视图组件 - 显示民宿在地图上的位置
 * 使用高德地图或腾讯地图API
 */

import React from 'react'
import type { HomeStay } from '@estay/shared'
import styles from './index.module.scss'

interface MapViewProps {
  data: HomeStay[]
  filters?: {
    city?: string
    checkInDate?: string
    checkOutDate?: string
  }
  onMarkerClick?: (id: string) => void
}

const MapView: React.FC<MapViewProps> = ({
  data = [],
  filters,
  onMarkerClick,
}) => {
  // 获取城市坐标（示例数据）
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    北京: { lat: 39.9042, lng: 116.4074 },
    上海: { lat: 31.2304, lng: 121.4737 },
    广州: { lat: 23.1291, lng: 113.2644 },
    深圳: { lat: 22.5431, lng: 114.0579 },
    杭州: { lat: 30.2741, lng: 120.1551 },
    成都: { lat: 30.5728, lng: 104.0668 },
    南京: { lat: 32.0603, lng: 118.7969 },
    武汉: { lat: 30.5928, lng: 114.3055 },
    西安: { lat: 34.3416, lng: 108.9398 },
    重庆: { lat: 29.4316, lng: 106.9123 },
  }

  const city = filters?.city || '上海'
  const center = cityCoordinates[city] || cityCoordinates['上海']

  return (
    <div className={styles.mapViewContainer}>
      {/* 地图容器 */}
      <div className={styles.mapContainer}>
        {/* 地图占位符 - 显示即将推出的消息 */}
        <div className={styles.mapPlaceholder}>
          <div className={styles.iconWrapper}>
            🗺️
          </div>
          <h2 className={styles.title}>地图视图</h2>
          <p className={styles.description}>
            显示 {city} 的 {data.length} 个民宿位置
          </p>
          <div className={styles.comingSoon}>即将上线</div>
          <p className={styles.hint}>
            地图功能正在开发中，敬请期待...
          </p>
        </div>

        {/* 地图信息面板 - 快速统计 */}
        <div className={styles.infoPanelWrapper}>
          <div className={styles.infoPanel}>
            <div className={styles.stat}>
              <span className={styles.number}>{data.length}</span>
              <span className={styles.label}>民宿</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.number}>{city}</span>
              <span className={styles.label}>城市</span>
            </div>
            {filters?.checkInDate && (
              <div className={styles.stat}>
                <span className={styles.date}>{filters.checkInDate}</span>
                <span className={styles.label}>入住</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 地图底部提示 */}
      <div className={styles.footer}>
        <p>💡 提示：切换回列表视图查看详细信息</p>
      </div>
    </div>
  )
}

export default MapView
