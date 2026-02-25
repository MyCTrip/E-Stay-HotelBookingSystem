import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import type { FacilityModel } from '@estay/shared'
import { CheckIcon, CrossIcon } from '../../../icons/FacilityIcons'
import styles from './index.module.scss'

interface RoomDrawerFacilitiesProps {
  facilities?: FacilityModel[]
  expandedInitially?: boolean
  onClose?: () => void
}

interface DisplayFacilityItem {
  id: string
  name: string
  available: boolean
}

interface DisplayFacilityCategory {
  id: string
  name: string
  facilities: DisplayFacilityItem[]
}

const normalizeText = (value: string): string => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const mapFacilitiesToCategories = (facilities: FacilityModel[]): DisplayFacilityCategory[] =>
  facilities
    .filter((facility) => facility.visible !== false)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
    .map((facility, index) => {
      const items = (facility.items ?? [])
        .filter((item) => item.name.trim().length > 0)
        .map((item, itemIndex) => ({
          id: `${facility.category}-${index}-${itemIndex}`,
          name: item.name,
          available: item.available !== false,
        }))

      if (items.length === 0) {
        const fallbackName = facility.summary?.trim() || normalizeText(facility.content)
        if (fallbackName) {
          items.push({
            id: `${facility.category}-${index}-fallback`,
            name: fallbackName,
            available: true,
          })
        }
      }

      return {
        id: `${facility.category}-${index}`,
        name: facility.category,
        facilities: items,
      }
    })
    .filter((category) => category.facilities.length > 0)

const RoomDrawerFacilities = forwardRef<HTMLDivElement, RoomDrawerFacilitiesProps>(
  ({ facilities, expandedInitially = false, onClose }, ref) => {
    void onClose

    const [isExpanded, setIsExpanded] = useState(expandedInitially)

    useEffect(() => {
      setIsExpanded(expandedInitially)
    }, [expandedInitially])

    const categories = useMemo(() => mapFacilitiesToCategories(facilities ?? []), [facilities])

    if (categories.length === 0) {
      return null
    }

    const visibleCategories = isExpanded ? categories : categories.slice(0, 3)

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
            {isExpanded ? '收起部分设施' : '展开全部设施'} <span className={styles.arrow}>▼</span>
          </button>
        </div>
      </div>
    )
  }
)

RoomDrawerFacilities.displayName = 'RoomDrawerFacilities'

export default RoomDrawerFacilities
