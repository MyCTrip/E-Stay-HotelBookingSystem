/**
 * 房型详情 - 费用须知信息
 */

import React from 'react'
import PropertyCardContainer from '../../PropertyCardContainer'
import { TipIcon } from '../../../icons'
import styles from './index.module.scss'

interface RoomDrawerFeeNoticeProps {
  room?: any
  deposit?: number
  standardGuests?: number
  joinNumber?: number
  joinPrice?: number
  otherDescription?: string
  showOther?: boolean
}

const RoomDrawerFeeNotice: React.FC<RoomDrawerFeeNoticeProps> = ({
  room,
  deposit = 500,
  standardGuests = 2,
  joinNumber = 2,
  joinPrice = 100,
  otherDescription = '',
  showOther = false,
}) => {
  return (
    <PropertyCardContainer
      headerConfig={{
        show: true,
        title: {
          text: '费用须知',
          show: true,
        },
        tipTag: {
          show: true,
          icon: TipIcon,
          text: '请仔细阅读费用相关说明',
        },
      }}
    >
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

            {/* 其他说明文本区域 - 显示全部文本 */}
            <div className={styles.otherDescriptionContainer}>
              <div className={styles.otherDescriptionTextFull}>
                {otherDescription}
              </div>
            </div>
          </>
        )}
      </div>
    </PropertyCardContainer>
  )
}

export default RoomDrawerFeeNotice
