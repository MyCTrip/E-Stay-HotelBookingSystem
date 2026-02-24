/**
 * 单个房型卡片 - 符合行业规范
 */

import React from 'react'
import DownArrowIcon from '../../../icons/DownArrowIcon'
import UpArrowIcon from '../../../icons/UpArrowIcon'
import { BedIcon, UserIcon } from '../../icons'
import styles from './index.module.scss'

interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  priceList: Array<{packageId:number,originPrice:number,currentPrice:number}>
  priceNote: string
  benefits: string[]
  packageCount: number
  confirmTime: string // 确认时间，单位为分钟
  // 新增属性
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  hasPackageDetail?: boolean // 是否有套餐详情
  // 套餐列表数据
  packages?: Array<{
    packageId: number
    name: string
    showPackageDetail?: boolean
    showBreakfastTag?: boolean
    breakfastCount?: number
    showCancelTag?: boolean
    cancelMunite?: number
    showComfirmTag?: boolean
    confirmTime?: number
  }>
}

interface RoomCardProps {
  room: Room
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails?: (room: Room, packageId?: number) => void
  onOpenDetail?: (room: Room, packageId?: number) => void
  showLabel?: boolean
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onOpenDetail,
  showLabel = true,
}) => {
  // 只有套餐数为 1 时才显示预订按钮
  const showBookBtn = room.packageCount === 1

  const handleCardClick = () => {
    onToggleExpand()
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {!isExpanded ? (
        /* 收起态 - 基础信息 */
        <div className={styles.collapsedContent}>
          <div className={styles.imageArea}>
            <img src={room.image} alt={room.name} className={styles.thumbnail} />
          </div>

          <div className={styles.infoArea}>
            {/* 房间名字和下拉按钮行 */}
            <div className={styles.nameRow}>
              <h4 className={styles.roomName}>{room.name}</h4>
              <button className={styles.expandToggleBtn} title={isExpanded ? '收起' : '展开'}>
                <DownArrowIcon width={12} height={12} color="#B1B1B1" />
              </button>
            </div>

            {/* 核心参数 - 规范式展示 */}
            <div className={styles.basicInfo}>
              <span className={styles.param}>
                <BedIcon width={14} height={14} color="#B1B1B1" /> {room.beds}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <UserIcon width={14} height={14} color="#B1B1B1" /> {room.guests}
              </span>
            </div>

            {/* 权益标签 - 两种特殊tag */}
            <div className={styles.benefits}>
              {/* 早餐tag */}
              {room.showBreakfastTag && (
                <span
                  className={`${styles.benefitTag} ${room.breakfastCount === 0 ? styles.breakfastNo : styles.breakfastYes}`}
                >
                  {room.breakfastCount === 0 ? '无早餐' : `${room.breakfastCount}份早餐`}
                </span>
              )}
              {/* 取消tag */}
              {room.showCancelTag && (
                <span className={`${styles.benefitTag} ${styles.cancelTag}`}>30分钟免费取消</span>
              )}
            </div>

            {/* 套餐可选tag */}
            <div className={styles.packageCountTag}>{room.packageCount}个套餐可选</div>

            {/* 底部行：确认时间标签 + 价格 + 预订按钮 */}
            <div className={styles.footerRow}>
              {showLabel && <div className={styles.instantLabel}>{room.confirmTime}内确认</div>}
              <div className={styles.priceBlock}>
                <span className={styles.price}>¥{room.priceList?.find(p => p.packageId === 1)?.currentPrice}</span>
                <span className={styles.priceNote}>{room.priceNote}</span>
              </div>
              {showBookBtn && (
                <button
                  className={styles.bookBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails?.(room, room.packages?.[0]?.packageId)
                  }}
                >
                  预订
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 展开态 - 详细信息 */
        <div className={styles.expandedContent}>
          {/* 房间名字和上拉按钮行 */}
          <div className={styles.expandedNameRow}>
            <h4 className={styles.expandedRoomName}>{room.name}</h4>
            <button className={styles.expandToggleBtn} title="收起">
              <UpArrowIcon width={12} height={12} color="#B1B1B1" />
            </button>
          </div>

          {/* 房型多图轮播 */}
          <div className={styles.carousel}>
            <img src={room.image} alt={room.name} className={styles.expandedImage} />
          </div>

          {/* 详细参数 */}
          <div className={styles.detailParams}>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>面积</span>
              <span className={styles.paramValue}>{room.area}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>床型</span>
              <span className={styles.paramValue}>{room.beds}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>人数</span>
              <span className={styles.paramValue}>{room.guests}</span>
            </div>
          </div>

          {/* 价格套餐列表 */}
          <div className={styles.packageList} onClick={(e) => e.stopPropagation()}>
            <h4 className={styles.packageTitle}>{room.packageCount}个套餐可选</h4>
            {(room.packages || []).slice(0, room.packageCount).map((pkg) => (
              <div key={pkg.packageId} className={styles.packageItem} onClick={() => onOpenDetail?.(room, pkg.packageId)}>
                {/* 左侧内容 */}
                <div className={styles.packageLeft}>
                  {/* 是否有套餐标记 */}
                  {pkg.showPackageDetail && <span className={styles.hasPackageTag}>有套餐</span>}
                  {/* 套餐名称 */}
                  <div className={styles.packageService}>{pkg.name}</div>

                  {/* 权益标签 */}
                  <div className={styles.packageBenefits}>
                    {pkg.showBreakfastTag && (
                      <span
                        className={`${styles.pkgBenefitTag} ${pkg.breakfastCount === 0 ? styles.breakfastNo : styles.breakfastYes}`}
                      >
                        {pkg.breakfastCount === 0 ? '无早餐' : `${pkg.breakfastCount}份早餐`}
                      </span>
                    )}
                    {pkg.showCancelTag && (
                      <span className={`${styles.pkgBenefitTag} ${styles.cancelTag}`}>
                        {pkg.cancelMunite}分钟免费取消
                      </span>
                    )}
                  </div>

                  {/* 确认tag */}
                  <div className={styles.confirmTag}>
                    {pkg.confirmTime === 0 ? '立即确认' : `${pkg.confirmTime}分钟确认`}
                  </div>
                </div>

                {/* 右侧内容 */}
                <div className={styles.packageRight}>
                  {/* 价格信息 */}
                  <div className={styles.priceInfo}>
                    <span className={styles.originalPrice}>¥{room.priceList?.find(p => p.packageId === pkg.packageId)?.originPrice}</span>
                    <span className={styles.currentPrice}>¥{room.priceList?.find(p => p.packageId === pkg.packageId)?.currentPrice}</span>
                  </div>

                  {/* 预订按钮 */}
                  <button
                    className={styles.selectBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenDetail?.(room, pkg.packageId)
                    }}
                  >
                    预订
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomCard
