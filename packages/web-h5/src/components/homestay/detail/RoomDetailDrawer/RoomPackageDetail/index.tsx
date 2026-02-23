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
}

const RoomPackageDetail: React.FC<RoomPackageDetailProps> = ({ room }) => {
  const packageData = {
    title: '上海迪士尼乐园专车接送服务 1份',
    checkInService: '酒店接待及入住协助，专业行李员服务',
    enjoyService: '免费WiFi、行政酒廊使用权、每日早餐券',
    details: [
      {
        label: '使用人数',
        value: '每份选用4名成人，2名儿童，身高1.3米(含)以上，或者年年龄6周岁(含)以上儿童计入成人数',
      },
      {
        label: '预约规则',
        value: '需提前1天预约',
      },
      {
        label: '联系电话',
        value: '+86-13482031211',
      },
      {
        label: '接待时间',
        value: '06:00-09:00,20:30-23:00',
      },
      {
        label: '规则说明',
        value: '请提前联系本酒店预约的时间',
      },
    ],
  }

  return (
    <div className={styles.packageDetail}>
      {/* 套餐标题 */}
      <div className={styles.packageTitle}>{packageData.title}</div>

      {/* 入住服务信息 */}
      <div className={styles.serviceCard}>
        <div className={styles.serviceHeader}>
          <span className={styles.tag}>住</span>
          <span className={styles.serviceLabel}>入住服务信息</span>
        </div>
      </div>

      {/* 享受服务信息 */}
      <div className={styles.serviceCard}>
        <div className={styles.serviceHeader}>
          <span className={styles.tag}>享</span>
          <span className={styles.serviceLabel}>享受服务信息</span>
        </div>
      </div>

      {/* 信息表格 */}
      <div className={styles.infoTable}>
        {packageData.details.map((item, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.cellLabel}>{item.label}</span>
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
