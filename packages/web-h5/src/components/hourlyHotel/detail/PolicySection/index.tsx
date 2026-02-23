/**
 * 预订须知区
 */

import React from 'react'
import { TipIcon, CheckIcon, CrossIcon } from '../../icons'
import styles from './index.module.scss'

interface CancellationPolicy {
  timeRange: string
  cancellationFee: string
}

interface PolicySectionProps {
  data?: any
  cancelMinutes?: number
  checkInDate?: string // 格式: "YYYY-MM-DD"
  checkInTime?: string // 格式: "HH:mm"
  checkOutTime?: string
  deadlinetime?: number // 取消截止时间距离入住的小时数
  amenities?: {
    baby?: boolean
    children?: boolean
    elderly?: boolean
    overseas?: boolean
    hongKongMacaoTaiwan?: boolean
    pets?: boolean
  }
}

const PolicySection: React.FC<PolicySectionProps> = ({
  data,
  cancelMinutes = 30,
  checkInDate = '2026-02-21',
  checkInTime = '14:00',
  checkOutTime = '12:00',
  deadlinetime = 24, // 默认入住后24小时
  amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
  },
}) => {
  // 根据 checkInDate + checkInTime + deadlinetime 计算 cancelDeadlineTime
  const calculateCancelDeadlineTime = (): string => {
    const [year, month, day, ...rest] = checkInDate.split('-')
    const [hours, minutes] = checkInTime.split(':')
    
    // 创建入住时间的Date对象
    const checkInDateTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`)
    
    // 加上deadline小时数
    checkInDateTime.setHours(checkInDateTime.getHours() + deadlinetime)
    
    // 格式化为 "MMdd HH:mm"
    const deadlineMonth = String(checkInDateTime.getMonth() + 1).padStart(2, '0')
    const deadlineDay = String(checkInDateTime.getDate()).padStart(2, '0')
    const deadlineHours = String(checkInDateTime.getHours()).padStart(2, '0')
    const deadlineMinutes = String(checkInDateTime.getMinutes()).padStart(2, '0')
    
    return `${deadlineMonth}${deadlineDay} ${deadlineHours}:${deadlineMinutes}`
  }

  // 生成取消政策表格数据
  const generateCancellationPolicies = () => {
    const cancelDeadlineTime = calculateCancelDeadlineTime()
    
    // 解析checkInDate (YYYY-MM-DD)
    const [year, month, day] = checkInDate.split('-')
    const checkInDateStr = `${month}月${day}日`
    
    // 解析deadline时间 (MMdd HH:mm)
    const deadlineMonth = cancelDeadlineTime.substring(0, 2)
    const deadlineDay = cancelDeadlineTime.substring(2, 4)
    const deadlineTime = cancelDeadlineTime.substring(5)
    const deadlineDateStr = `${deadlineMonth}月${deadlineDay}日`
    
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
        timeRange: `${checkInDateStr} ${checkInTime}后\n${deadlineDateStr} ${deadlineTime}前`,
        cancellationFee: '取消扣首晚房费的\n100%',
      },
      {
        // 第三行：取消全款时间后
        thirdRow: true,
        timeRange: `${deadlineDateStr} ${deadlineTime}后`,
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
      {/* Header - title和按钮同一行 */}
      <div className={styles.header}>
        <h2 className={styles.title}>预订须知</h2>
        <button className={styles.allPoliciesBtn}>
          全部须知 <span className={styles.arrow}>›</span>
        </button>
      </div>

      {/* Tip区域 */}
      <div className={styles.tipContainer}>
        <TipIcon width={16} height={16} />
        <span className={styles.tipText}>以下规则由房东制定，请仔细读并遵守</span>
      </div>

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
              订单确认{cancelMinutes}分钟后，取消订单将扣除全部房费（订单需等商家确认生效，订单确认结果以公众号、短信或app通知为准，如订单不确认将全额退款至你的付款账号）
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
                      {idx === 1 && policy.timeRange.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
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

export default PolicySection
