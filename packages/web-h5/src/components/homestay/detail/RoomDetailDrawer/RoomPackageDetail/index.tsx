/**
 * 套餐详情组件
 */

import React from 'react'
import styles from './index.module.scss'

interface Room {
  id: string
  name: string
  [key: string]: any
}

interface RoomPackageDetailProps {
  room: Room
  selectedPackageId?: number
}

const RoomPackageDetail: React.FC<RoomPackageDetailProps> = ({ room, selectedPackageId }) => {
  // 从 room.packageDetails 中获取选中的套餐详情
  // 如果没有 selectedPackageId，则获取第一个有 showPackageDetail=true 的套餐
  const packageDetails = (room as any)?.packageDetails
  
  let packageData = packageDetails?.[selectedPackageId || 1]
  
  // 如果没有找到，尝试获取第一个存在的套餐详情
  if (!packageData && packageDetails) {
    const firstKey = Object.keys(packageDetails)[0]
    packageData = packageDetails[Number(firstKey)]
  }

  // 如果还是没有数据，使用默认数据
  if (!packageData) {
    packageData = {
      title: '暂无套餐详情',
      checkInService: '',
      enjoyService: '',
      details: [],
    }
  }

  return (
    <div className={styles.packageDetail}>
      {/* 套餐标题 */}
      <div className={styles.packageTitle}>{packageData.title}</div>

      {/* 入住服务信息 */}
      {packageData.checkInService && (
        <div className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <span className={styles.tag}>住</span>
            <span className={styles.serviceLabel}>入住服务信息</span>
          </div>
          <div className={styles.serviceContent}>{packageData.checkInService}</div>
        </div>
      )}

      {/* 享受服务信息 */}
      {packageData.enjoyService && (
        <div className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <span className={styles.tag}>享</span>
            <span className={styles.serviceLabel}>享受服务信息</span>
          </div>
          <div className={styles.serviceContent}>{packageData.enjoyService}</div>
        </div>
      )}

      {/* 信息表格 */}
      <div className={styles.infoTable}>
        {packageData.details && packageData.details.map((item: any, index: number) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.cellLabel}>{item.lable || item.label}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.cellValue}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 底部间距 */}
      <div className={styles.spacer} />
    </div>
  )
}

export default RoomPackageDetail
