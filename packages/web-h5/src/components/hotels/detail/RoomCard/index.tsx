import React from 'react'
import type { HotelRoomSKUModel, HotelRoomSPUModel, PolicyModel, RoomEntityModel } from '@estay/shared'
import DownArrowIcon from '../../../icons/DownArrowIcon'
import UpArrowIcon from '../../../icons/UpArrowIcon'
import { AreaIcon, BedIcon, UserIcon } from '../../icons'
import styles from './index.module.scss'

interface RoomCardProps {
  spu: HotelRoomSPUModel
  room?: RoomEntityModel | null
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails?: (spu: HotelRoomSPUModel, sku: HotelRoomSKUModel | null) => void
  onOpenDetail?: (spu: HotelRoomSPUModel, sku: HotelRoomSKUModel) => void
  showLabel?: boolean
}

const CURRENCY_SYMBOL = '\u00A5'

const mapBedText = (bedInfo: HotelRoomSPUModel['bedInfo']): string => {
  if (bedInfo.length === 0) {
    return '--'
  }

  return bedInfo
    .map((bed) => `${bed.bedNumber}${bed.bedType}${bed.bedSize ? ` ${bed.bedSize}` : ''}`)
    .join(' | ')
}

const resolveSkuStatus = (status: string): HotelRoomSKUModel['status'] =>
  status === 'available' || status === 'approved' ? 'available' : 'sold_out'

const getPolicySummary = (policy: PolicyModel): string => {
  if (policy.summary?.trim()) {
    return policy.summary.trim()
  }

  return policy.content.replace(/<[^>]*>/g, '').trim()
}

const getCancellationRule = (policies: PolicyModel[]): string => {
  const cancellationPolicy = policies.find((policy) =>
    policy.policyType.toLowerCase().includes('cancellation')
  )

  if (!cancellationPolicy) {
    return ''
  }

  return getPolicySummary(cancellationPolicy)
}

const RoomCard: React.FC<RoomCardProps> = ({
  spu,
  room,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onOpenDetail,
  showLabel = true,
}) => {
  const generatedSku: HotelRoomSKUModel | null = room
    ? {
        roomId: room._id ?? '',
        priceInfo: {
          nightlyPrice: room.baseInfo.price,
        },
        status: resolveSkuStatus(room.baseInfo.status),
        cancellationRule: getCancellationRule(room.baseInfo.policies),
      }
    : null

  const roomSkus = spu.skus.length > 0 ? spu.skus : generatedSku ? [generatedSku] : []
  const packageCount = roomSkus.length
  const firstSku = roomSkus[0] ?? null
  const preferredSku = roomSkus.find((sku) => sku.status === 'available') ?? firstSku
  const isSoldOut = roomSkus.length > 0 && roomSkus.every((sku) => sku.status === 'sold_out')

  const roomName = room?.baseInfo.type ?? spu.spuName
  const roomImages = room?.baseInfo.images.length ? room.baseInfo.images : spu.images
  const roomHeadInfo = room?.headInfo ?? spu.headInfo
  const roomBedInfo = room?.bedInfo.length ? room.bedInfo : spu.bedInfo
  const displayPrice = room?.baseInfo.price ?? spu.startingPrice
  const occupancyText = room?.baseInfo.maxOccupancy ? `${room.baseInfo.maxOccupancy}人` : null

  const bedText = mapBedText(roomBedInfo)
  const breakfastCount = 0
  const showBreakfastTag = false
  const showCancelTag = roomSkus.some((sku) => sku.cancellationRule.trim().length > 0)
  const showBookBtn = packageCount === 1 && preferredSku !== null

  const handleCardClick = () => {
    onToggleExpand()
  }

  return (
    <div className={`${styles.card} ${isSoldOut ? styles.cardSoldOut : ''}`} onClick={handleCardClick}>
      {!isExpanded ? (
        <div className={styles.collapsedContent}>
          <div className={styles.imageArea}>
            <img src={roomImages[0] || ''} alt={roomName} className={styles.thumbnail} />
          </div>

          <div className={styles.infoArea}>
            <div className={styles.nameRow}>
              <h4 className={styles.roomName}>{roomName}</h4>
              <button className={styles.expandToggleBtn} title={isExpanded ? '收起' : '展开'}>
                <DownArrowIcon width={12} height={12} color="#B1B1B1" />
              </button>
            </div>

            <div className={styles.basicInfo}>
              <span className={styles.param}>
                <AreaIcon width={14} height={14} color="#B1B1B1" /> {roomHeadInfo.size || null}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <BedIcon width={14} height={14} color="#B1B1B1" /> {bedText}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.param}>
                <UserIcon width={14} height={14} color="#B1B1B1" /> {occupancyText}
              </span>
            </div>

            <div className={styles.benefits}>
              {showBreakfastTag && (
                <span
                  className={`${styles.benefitTag} ${
                    breakfastCount === 0 ? styles.breakfastNo : styles.breakfastYes
                  }`}
                >
                  {breakfastCount === 0 ? '无早餐' : `${breakfastCount}份早餐`}
                </span>
              )}
              {showCancelTag && <span className={`${styles.benefitTag} ${styles.cancelTag}`}>可退订</span>}
            </div>

            <div className={styles.packageCountTag}>{packageCount}个套餐可选</div>

            <div className={styles.footerRow}>
              {showLabel && <div className={styles.instantLabel}>立即确认</div>}
              <div className={styles.priceBlock}>
                <span className={styles.price}>
                  {CURRENCY_SYMBOL}
                  {displayPrice}
                </span>
                <span className={styles.priceNote}>起</span>
              </div>
              {showBookBtn && preferredSku && (
                <button
                  className={styles.bookBtn}
                  disabled={preferredSku.status === 'sold_out'}
                  onClick={(event) => {
                    event.stopPropagation()
                    onViewDetails?.(spu, preferredSku)
                  }}
                >
                  {preferredSku.status === 'sold_out' ? '满房' : '预订'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.expandedContent}>
          <div className={styles.expandedNameRow}>
            <h4 className={styles.expandedRoomName}>{roomName}</h4>
            <button className={styles.expandToggleBtn} title="收起">
              <UpArrowIcon width={12} height={12} color="#B1B1B1" />
            </button>
          </div>

          <div className={styles.carousel}>
            <img src={roomImages[0] || ''} alt={roomName} className={styles.expandedImage} />
            <span className={styles.imageCount}>1/{Math.max(roomImages.length, 1)}</span>
          </div>

          <div className={styles.detailParams}>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>面积</span>
              <span className={styles.paramValue}>{roomHeadInfo.size || null}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>床型</span>
              <span className={styles.paramValue}>{bedText}</span>
            </div>
            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>人数</span>
              <span className={styles.paramValue}>{occupancyText}</span>
            </div>
          </div>

          <div className={styles.packageList} onClick={(event) => event.stopPropagation()}>
            <h4 className={styles.packageTitle}>{packageCount}个套餐可选</h4>
            {roomSkus.map((sku) => (
              <div
                key={sku.roomId}
                className={`${styles.packageItem} ${sku.status === 'sold_out' ? styles.packageItemSoldOut : ''}`}
                onClick={() => onOpenDetail?.(spu, sku)}
              >
                <div className={styles.packageLeft}>
                  <span className={styles.hasPackageTag}>套餐</span>

                  <div className={styles.packageService}>{sku.cancellationRule || null}</div>

                  <div className={styles.packageBenefits}>
                    {showBreakfastTag && (
                      <span className={`${styles.pkgBenefitTag} ${styles.breakfastNo}`}>
                        {breakfastCount === 0 ? '无早餐' : `${breakfastCount}份早餐`}
                      </span>
                    )}
                    {sku.cancellationRule.trim().length > 0 && (
                      <span className={`${styles.pkgBenefitTag} ${styles.cancelTag}`}>可退订</span>
                    )}
                  </div>

                  <div className={styles.confirmTag}>{sku.status === 'sold_out' ? '满房' : '立即确认'}</div>
                </div>

                <div className={styles.packageRight}>
                  <div className={styles.priceInfo}>
                    <span className={styles.originalPrice}>{null}</span>
                    <span className={styles.currentPrice}>
                      {CURRENCY_SYMBOL}
                      {sku.priceInfo.nightlyPrice}
                    </span>
                  </div>

                  <button
                    className={styles.selectBtn}
                    disabled={sku.status === 'sold_out'}
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpenDetail?.(spu, sku)
                    }}
                  >
                    {sku.status === 'sold_out' ? '满房' : '预订'}
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
