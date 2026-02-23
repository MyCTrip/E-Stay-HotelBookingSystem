import React, { forwardRef, useEffect, useState } from 'react'
import type { HotelRoomSPUModel } from '@estay/shared'
import { CheckIcon, CrossIcon } from '../../../icons/FacilityIcons'
import { FACILITY_CATEGORIES } from '../../../../../constants/facilities'
import styles from './index.module.scss'

interface RoomDrawerFacilitiesProps {
  spu: HotelRoomSPUModel
  expandedInitially?: boolean
  onClose?: () => void
}

const RoomDrawerFacilities = forwardRef<HTMLDivElement, RoomDrawerFacilitiesProps>(
  ({ spu, expandedInitially = false, onClose }, ref) => {
    void spu
    void onClose

    const [isExpanded, setIsExpanded] = useState(expandedInitially)

    useEffect(() => {
      setIsExpanded(expandedInitially)
    }, [expandedInitially])

    const visibleCategories = isExpanded
      ? FACILITY_CATEGORIES
      : FACILITY_CATEGORIES.filter((c) => ['basic', 'bathroom', 'kitchen'].includes(c.id))

    return (
      <div className={styles.facilitiesContainer} ref={ref}>
        <h3 className={styles.title}>设施/服务</h3>

        <div className={styles.facilitiesList}>
          {visibleCategories.map((category) => (
            <div key={category.id} className={styles.categoryBlock}>
              <div className={styles.categoryName}>{category.name}</div>

              <div className={styles.itemsGrid}>
                {category.facilities.map((facility) => (
                  <div key={facility.id} className={styles.facilityItem}>
                    {facility.available ? (
                      <CheckIcon width={18} height={18} color="#43ae4a" />
                    ) : (
                      <CrossIcon width={18} height={18} color="#d3d3d3" />
                    )}
                    <span className={styles.itemName}>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.expandFooter}>
          <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '收起全部设施' : '展开全部设施'} <span className={styles.arrow}>▾</span>
          </button>
        </div>
      </div>
    )
  }
)

RoomDrawerFacilities.displayName = 'RoomDrawerFacilities'

export default RoomDrawerFacilities
