/**
 * 费用须知区 - 显示押金、加人、其他费用信息
 */

import React, { useState } from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import { TipIcon } from '../../icons'
import styles from './index.module.scss'

interface FeeNoticeSectionProps {
  deposit: number
  standardGuests: number
  joinNumber: number
  joinPrice: number
  otherDescription?: string
  showOther?: boolean
  roomName?: string
}

/**
 * FeeNoticeSection 内容组件
 */
const FeeNoticeSectionContent: React.FC<FeeNoticeSectionProps> = ({
  deposit,
  standardGuests,
  joinNumber,
  joinPrice,
  otherDescription = '',
  showOther = false,
}) => {
  return (
    <div className={styles.feeNoticeList}>
      {/* 押金行 */}
      <div className={styles.feeRow}>
        <div className={styles.feeTitle}>押金</div>
        <div className={styles.feeContent}>
          ¥{deposit}，下单时支付，离店后原路退还，无纠纷不扣押
        </div>
      </div>

      {/* 加人行 */}
      <div className={styles.feeRow}>
        <div className={styles.feeTitle}>加人</div>
        <div className={styles.feeContent}>
          标准入住{standardGuests}人，
          {joinNumber === 0 ? '不可加人' : `可加${joinNumber}人，¥${joinPrice}/人/晚`}
        </div>
      </div>

      {/* 其他行 - 条件显示 */}
      {showOther && (
        <>
          <div className={styles.feeRow}>
            <div className={styles.feeTitle}>其他</div>
            <div className={styles.feeContent}>请仔细阅读房东其他要求</div>
          </div>

          {/* 其他说明文本区域 - 只读，行溢出处理 */}
          <div className={styles.otherDescriptionContainer}>
            <div
              className={styles.otherDescriptionText}
            >
              {otherDescription}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const FeeNoticeSection: React.FC<FeeNoticeSectionProps> = ({ roomName = '', ...props }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 创建虚拟room对象用于显示费用信息
  const feeNoticeRoom = {
    id: 'fee-notice',
    name: '费用须知',
    area: '',
    beds: '',
    guests: '',
    image: '',
    price: 0,
    priceNote: '',
    benefits: [],
    packageCount: 0,
  }

  const handleOpenAllFeeNotice = () => {
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <PropertyCardContainer
        headerConfig={{
          show: true,
          title: {
            text: '费用须知',
            show: true,
          },
          textButton: {
            text: '全部须知',
            show: true,
            onClick: handleOpenAllFeeNotice,
          },
          tipTag: {
            show: true,
            icon: TipIcon,
            text: '请仔细阅读费用相关说明',
          },
        }}
      >
        <FeeNoticeSectionContent {...props} />
      </PropertyCardContainer>

      {/* 费用详情抽屉 - 使用RoomDetailDrawer展示 */}
      <RoomDetailDrawer
        room={isDrawerOpen ? feeNoticeRoom : null}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        scrollToFeeNotice={true}
        actualRoomName={roomName}
      />
    </>
  )
}

export default FeeNoticeSection
export type { FeeNoticeSectionProps }
