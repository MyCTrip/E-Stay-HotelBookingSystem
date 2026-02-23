/**
 * 预订须知区
 */

import React from 'react'
import { TipIcon, CheckIcon, CrossIcon } from '../../../icons'
import styles from './index.module.scss'

interface CancellationPolicy {
  timeRange: string
  cancellationFee: string
}

interface RoomDrawerPolicyProps {
  room?: any
  data?: any
  cancelMinutes?: number
  checkInDate?: string // 格式: "YYYY-MM-DD"
  checkInTime?: string // 格式: "HH:mm"
  checkOutTime?: string
  deadlineTime?: number // 超过入住时间多少小时后扣全款，单位: 小时，默认24
  amenities?: {
    baby?: boolean
    children?: boolean
    elderly?: boolean
    overseas?: boolean
    hongKongMacaoTaiwan?: boolean
    pets?: boolean
  }
}

const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps> = ({
  room,
  data,
  cancelMinutes = 30,
  checkInDate = '2026-02-21',
  checkInTime = '14:00',
  checkOutTime = '12:00',
  deadlineTime = 24, // 默认24小时
  amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
  },
}) => {
  // 解析日期时间，生成表格数据
  const generateCancellationPolicies = () => {
    // 解析checkInDate (YYYY-MM-DD)
    const [year, month, day] = checkInDate.split('-')
    const checkInDateStr = `${month}月${day}日`

    // 计算deadline时间：checkInTime + deadlineTime小时
    const [checkInHour, checkInMin] = checkInTime.split(':').map(Number)
    const deadlineHour = (checkInHour + deadlineTime) % 24
    const addDays = Math.floor((checkInHour + deadlineTime) / 24)

    // 计算deadline日期
    const checkInDateObj = new Date(Number(year), Number(month) - 1, Number(day))
    const deadlineDateObj = new Date(
      checkInDateObj.getFullYear(),
      checkInDateObj.getMonth(),
      checkInDateObj.getDate() + addDays
    )
    const deadlineMonth = String(deadlineDateObj.getMonth() + 1).padStart(2, '0')
    const deadlineDay = String(deadlineDateObj.getDate()).padStart(2, '0')
    const deadlineDateStr = `${deadlineMonth}月${deadlineDay}日`
    const deadlineTimeStr = `${String(deadlineHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`

    return [
      {
        // 第一行：当前阶段 + 入住日期 + 入住时间前
        firstRow: true,
        timeRange: `${checkInDateStr} ${checkInTime}前`,
        cancellationFee: '免费取消',
      },
      {
        // 第二行：两行文本
        secondRow: true,
        timeRange: `${checkInDateStr} ${checkInTime}后\n${deadlineDateStr} ${deadlineTimeStr}前`,
        cancellationFee: '取消扣首晚房费的\n100%',
      },
      {
        // 第三行：取消全款时间后
        thirdRow: true,
        timeRange: `${deadlineDateStr} ${deadlineTimeStr}后`,
        cancellationFee: '取消扣全款',
      },
    ]
  }

  const cancellationPolicies = generateCancellationPolicies()
  const amenityItems = [
    { label: '接待婴儿', enabled: amenities.baby },
    { label: '接待儿童', enabled: amenities.children },
    { label: '接待老人', enabled: amenities.elderly },
    { label: '接待海外', enabled: amenities.overseas },
    { label: '接待港澳台', enabled: amenities.hongKongMacaoTaiwan },
    { label: '带宠物', enabled: amenities.pets },
  ]

  return (
    <div className={styles.section}>
      {/* Content */}
      <div className={styles.content}>
        {/* 入离 */}
        <div className={styles.sectionRow}>
          <h3 className={styles.sectionTitle}>入离</h3>
          <div className={styles.checkInOut}>
            <div className={styles.item}>
              <span className={styles.label}>入住</span>
              <span className={styles.value}>{checkInTime}-24:00入住</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>退房</span>
              <span className={styles.value}>{checkOutTime}前退房</span>
            </div>
          </div>
        </div>

        {/* 退订 */}
        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>退订</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.highlight}>{cancelMinutes}分钟内免费取消</div>
            <p className={styles.description}>
              订单确认{cancelMinutes}
              分钟后，取消订单将扣除全部房费（订单需等商家确认生效，订单确认结果以公众号、短信或app通知为准，如订单不确认将全额退款至你的付款账号）
            </p>
          </div>
        </div>

        {/* 退订表格 */}
        <div className={styles.tableSection}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>退订时间</th>
                <th>退订费用</th>
              </tr>
            </thead>
            <tbody>
              {cancellationPolicies.map((policy, idx) => (
                <tr key={idx}>
                  <td>
                    <div className={styles.timeCell}>
                      {idx === 0 && (
                        <>
                          <span className={styles.tag}>当前阶段</span>
                          <div>{policy.timeRange}</div>
                        </>
                      )}
                      {idx === 1 &&
                        policy.timeRange.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                      {idx === 2 && <div>{policy.timeRange}</div>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.feeCell}>{policy.cancellationFee}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 要求 */}
        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>要求</h3>
          </div>
          <div className={styles.amenitiesGrid}>
            {amenityItems.map((item, idx) => (
              <div key={idx} className={styles.amenityItem}>
                {item.enabled ? (
                  <CheckIcon width={20} height={20} />
                ) : (
                  <CrossIcon width={20} height={20} />
                )}
                <span className={styles.amenityLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RoomDrawerPolicy }
export type { RoomDrawerPolicyProps }
export default RoomDrawerPolicy
