import React from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomPackageDetailProps {
  spu: HotelRoomSPUModel
  sku: HotelRoomSKUModel
}

const RoomPackageDetail: React.FC<RoomPackageDetailProps> = ({ spu, sku }) => {
  const bedSummary = spu.bedInfo
    .map((item) => `${item.bedNumber}${item.bedType}${item.bedSize ? `(${item.bedSize})` : ''}`)
    .join(' / ')

  const packageData = {
    title: spu.spuName,
    details: [
      {
        label: '套餐ID',
        value: sku.roomId,
      },
      {
        label: '价格',
        value: `¥${sku.priceInfo.nightlyPrice}`,
      },
      {
        label: '套餐状态',
        value: sku.status === 'sold_out' ? '满房' : '可订',
      },
      {
        label: '退订政策',
        value: sku.cancellationRule,
      },
      {
        label: '床型信息',
        value: bedSummary || '',
      },
    ],
  }

  return (
    <div className={styles.packageDetail}>
      <div className={styles.packageTitle}>{packageData.title}</div>

      <div className={styles.serviceCard}>
        <div className={styles.serviceHeader}>
          <span className={styles.tag}>住</span>
          <span className={styles.serviceLabel}>入住服务信息</span>
        </div>
      </div>

      <div className={styles.serviceCard}>
        <div className={styles.serviceHeader}>
          <span className={styles.tag}>享</span>
          <span className={styles.serviceLabel}>套餐权益信息</span>
        </div>
      </div>

      <div className={styles.infoTable}>
        {packageData.details.map((item, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.cellLabel}>{item.label}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.cellValue}>{item.value || null}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.spacer} />
    </div>
  )
}

export default RoomPackageDetail
