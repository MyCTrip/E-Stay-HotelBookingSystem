/**
 * 设施与服务信息
 */

import React from 'react'
import styles from './index.module.scss'

interface Room {
  id: string
  [key: string]: any
}

interface RoomDrawerFacilitiesProps {
  room: Room
}

// 分类设施数据
const facilitiesData = [
  {
    category: '服务和便利',
    icon: '🛎️',
    items: [
      { name: '门房/传达', icon: '🚪' },
      { name: '电梯', icon: '🛗' },
      { name: '行李寄存', icon: '💼' },
    ],
  },
  {
    category: '房间与服务',
    icon: '🛏️',
    items: [
      { name: '提供早餐', icon: '🥐' },
      { name: '咖啡机/茶套装', icon: '☕' },
      { name: '吹风机', icon: '💨' },
    ],
  },
  {
    category: '厨房与餐饮',
    icon: '🍳',
    items: [
      { name: '厨房', icon: '🍳' },
      { name: '洗碗机', icon: '🍽️' },
      { name: '微波炉', icon: '📻' },
    ],
  },
  {
    category: '安全',
    icon: '🔒',
    items: [
      { name: '灭火器', icon: '🧯' },
      { name: '警报器', icon: '🔔' },
      { name: '一氧化碳报警器', icon: '⚠️' },
    ],
  },
  {
    category: '其他',
    icon: '✨',
    items: [
      { name: '烟雾报警器', icon: '💨' },
      { name: '无线网', icon: '📶' },
      { name: '电视', icon: '📺' },
    ],
  },
]

const RoomDrawerFacilities: React.FC<RoomDrawerFacilitiesProps> = ({ room }) => {
  return (
    <div className={styles.facilitiesSection}>
      <h3 className={styles.sectionTitle}>设施与服务</h3>

      <div className={styles.facilitiesList}>
        {facilitiesData.map((group, groupIdx) => (
          <div key={groupIdx} className={styles.facilityGroup}>
            <h4 className={styles.groupTitle}>
              <span className={styles.groupIcon}>{group.icon}</span>
              {group.category}
            </h4>

            <div className={styles.itemsGrid}>
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className={styles.facilityItem}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemName}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomDrawerFacilities
