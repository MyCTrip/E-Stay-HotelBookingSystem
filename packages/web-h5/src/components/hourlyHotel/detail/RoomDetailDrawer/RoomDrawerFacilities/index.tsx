/**
 * 房型详情 - 设施与服务信息
 */

import React, { useState, useEffect, forwardRef } from 'react'
import { CheckIcon, CrossIcon } from '../../../icons/FacilityIcons'
import { FACILITY_CATEGORIES } from '../../../../../constants/facilities'
import styles from './index.module.scss'

interface RoomDrawerFacilitiesProps {
  room?: any
  expandedInitially?: boolean
  onClose?: () => void
}

const RoomDrawerFacilities = forwardRef<HTMLDivElement, RoomDrawerFacilitiesProps>((
  {
    expandedInitially = false,
    onClose,
  },
  ref
) => {
  const [isExpanded, setIsExpanded] = useState(expandedInitially)

  // 同步 expandedInitially 的变化
  useEffect(() => {
    setIsExpanded(expandedInitially)
  }, [expandedInitially])

  // 展开时显示所有分类，收起时只显示基础、卫浴、厨房
  const visibleCategories = isExpanded 
    ? FACILITY_CATEGORIES 
    : FACILITY_CATEGORIES.filter((c) => ['basic', 'bathroom', 'kitchen'].includes(c.id))

  return (
    <div className={styles.facilitiesContainer} ref={ref}>
      {/* Title区域 */}
      <h3 className={styles.title}>设施/服务</h3>

      {/* 设施列表 */}
      <div className={styles.facilitiesList}>
        {visibleCategories.map((category) => (
          <div key={category.id} className={styles.categoryBlock}>
            {/* 分类名 - 左侧 */}
            <div className={styles.categoryName}>{category.name}</div>

            {/* 分类设施 - 右侧，一行三个 */}
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

      {/* 展开/收起按钮 - 始终显示 */}
      <div className={styles.expandFooter}>
        <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '收起全部设施' : '展开全部设施'} <span className={styles.arrow}>›</span>
        </button>
      </div>
    </div>
  )
})

RoomDrawerFacilities.displayName = 'RoomDrawerFacilities'

export default RoomDrawerFacilities
