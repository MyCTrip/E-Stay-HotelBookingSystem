import React from 'react'
import type { HotelRoomSKUModel } from '@estay/shared'
import DownArrowIcon from '../../../icons/DownArrowIcon'
import UpArrowIcon from '../../../icons/UpArrowIcon'
import { AreaIcon, BedIcon, UserIcon } from '../../icons'
import styles from './index.module.scss'

export interface RoomCardViewModel {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  price: number
  priceNote: string
  benefits: string[]
  packageCount: number
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
  hasPackageDetail?: boolean
  skus: HotelRoomSKUModel[]
}

interface RoomCardProps {
  room: RoomCardViewModel
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails?: (room: RoomCardViewModel) => void
  onOpenDetail?: (room: RoomCardViewModel) => void
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
  const showBookBtn = room.packageCount === 1
  const singleSku = room.skus[0]

  const handleCardClick = () => {
    onToggleExpand()
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {!isExpanded ? (
        <div className={styles.collapsedContent}>
          <div className={styles.imageArea}>
            <img src={room.image} alt={room.name} className={styles.thumbnail} />
          </div>

          <div className={styles.infoArea}>
            <div className={styles.nameRow}>
              <h4 className={styles.roomName}>{room.name}</h4>
              <button
                className={styles.expandToggleBtn}
                title={isExpanded ? '收起' : '展开'}
              >
                <DownArrowIcon width={12} height={12} color="#B1B1B1" />
              </button>
            </div>

            <div className={styles.basicInfo}>
              <span className={styles.param}>
                <AreaIcon width={14} height={14} color="#B1B1B1" /> {room.area}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <BedIcon width={14} height={14} color="#B1B1B1" /> {room.beds}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <UserIcon width={14} height={14} color="#B1B1B1" /> {room.guests}
              </span>
            </div>

            <div className={styles.benefits}>
              {room.showBreakfastTag && (
                <span className={`${styles.benefitTag} ${room.breakfastCount === 0 ? styles.breakfastNo : styles.breakfastYes}`}>
                  {room.breakfastCount === 0 ? '无早餐' : `${room.breakfastCount}份早餐`}
                </span>
              )}
              {room.showCancelTag && (
                <span className={`${styles.benefitTag} ${styles.cancelTag}`}>
                  30分钟免费取消
                </span>
              )}
            </div>

            <div className={styles.packageCountTag}>
              {room.packageCount}个套餐可选
            </div>

            <div className={styles.footerRow}>
              {showLabel && (
                <div className={styles.instantLabel}>立即确认</div>
              )}
              <div className={styles.priceBlock}>
                <span className={styles.price}>¥{room.price}</span>
                <span className={styles.priceNote}>{room.priceNote}</span>
              </div>
              {showBookBtn && (
                <button
                  className={styles.bookBtn}
                  disabled={singleSku?.status === 'sold_out'}
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails?.(room)
                  }}
                >
                  {singleSku?.status === 'sold_out' ? '已售罄' : '预订'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.expandedContent}>
          <div className={styles.expandedNameRow}>
            <h4 className={styles.expandedRoomName}>{room.name}</h4>
            <button
              className={styles.expandToggleBtn}
              title="收起"
            >
              <UpArrowIcon width={12} height={12} color="#B1B1B1" />
            </button>
          </div>

          <div className={styles.carousel}>
            <img src={room.image} alt={room.name} className={styles.expandedImage} />
            <span className={styles.imageCount}>1/5</span>
          </div>

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

          <div className={styles.packageList} onClick={(e) => e.stopPropagation()}>
            <h4 className={styles.packageTitle}>{room.packageCount}个套餐可选</h4>
            {room.skus.map((sku, index) => (
              <div
                key={sku.roomId}
                className={styles.packageItem}
                onClick={() => onOpenDetail?.(room)}
              >
                <div className={styles.packageLeft}>
                  {room.hasPackageDetail && (
                    <span className={styles.hasPackageTag}>有套餐</span>
                  )}
                  <div className={styles.packageService}>
                    {sku.cancellationRule}
                  </div>

                  <div className={styles.packageBenefits}>
                    {room.showBreakfastTag && (
                      <span className={`${styles.pkgBenefitTag} ${room.breakfastCount === 0 ? styles.breakfastNo : styles.breakfastYes}`}>
                        {room.breakfastCount === 0 ? '无早餐' : `${room.breakfastCount}份早餐`}
                      </span>
                    )}
                    {room.showCancelTag && (
                      <span className={`${styles.pkgBenefitTag} ${styles.cancelTag}`}>
                        30分钟免费取消
                      </span>
                    )}
                  </div>

                  <div className={styles.confirmTag}>
                    {index === 0 ? '立即确认' : `${(index + 1) * 30}分钟确认`}
                  </div>
                </div>

                <div className={styles.packageRight}>
                  <div className={styles.priceInfo}>
                    <span className={styles.originalPrice}>¥{sku.priceInfo.nightlyPrice + 80}</span>
                    <span className={styles.currentPrice}>¥{sku.priceInfo.nightlyPrice}</span>
                  </div>

                  <button
                    className={styles.selectBtn}
                    disabled={sku.status === 'sold_out'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenDetail?.(room)
                    }}
                  >
                    {sku.status === 'sold_out' ? '已售罄' : '预订'}
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
