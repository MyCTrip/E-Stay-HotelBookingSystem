import React from 'react'
import type { HourlyRoom } from '../../types'
import styles from './index.module.scss'

interface MapViewProps {
  data: HourlyRoom[]
  filters?: {
    city?: string
    checkInDate?: string
    checkOutDate?: string
    date?: string
  }
  onMarkerClick?: (id: string) => void
}

const MapView: React.FC<MapViewProps> = ({ data = [], filters, onMarkerClick }) => {
  const city = filters?.city || 'Shanghai'

  return (
    <div className={styles.mapViewContainer}>
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.iconWrapper}>🗺️</div>
          <h2 className={styles.title}>Map View</h2>
          <p className={styles.description}>
            {city} · {data.length} results
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
          <p className={styles.hint}>Map integration is under development.</p>
        </div>

        <div className={styles.infoPanelWrapper}>
          <div className={styles.infoPanel}>
            <div className={styles.stat}>
              <span className={styles.number}>{data.length}</span>
              <span className={styles.label}>Rooms</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.number}>{city}</span>
              <span className={styles.label}>City</span>
            </div>
            {filters?.checkInDate && (
              <div className={styles.stat}>
                <span className={styles.date}>{filters.checkInDate}</span>
                <span className={styles.label}>Check-in</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => onMarkerClick?.(data[0]._id)}
            style={{ border: 'none', background: 'transparent', color: '#1677ff', cursor: 'pointer' }}
          >
            Open first room
          </button>
        </div>
      )}
    </div>
  )
}

export default MapView
