/**
 * 预订须知区
 */

import React, { useState } from 'react'
import { useHomestayStore } from '@estay/shared'
import PropertyCardContainer from '../PropertyCardContainer'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import { TipIcon, CheckIcon, CrossIcon } from '../../icons'
import styles from './index.module.scss'

interface CancellationPolicy {
  timeRange: string
  cancellationFee: string
}

interface PolicySectionProps {
  policies?: any  // 中间件数据
  checkInDate?: string  // 搜索参数：检入日期
  checkOutDate?: string  // 搜索参数：检出日期
  // 抽屉用中间件数据
  facilitiesData?: any[]
  feeInfoData?: any
}

/**
 * PolicySection 内容组件
 */
const PolicySectionContent: React.FC<Omit<PolicySectionProps, 'room'>> = ({
  policies: middlewarePolicies,
  checkInDate: propsCheckInDate,
  checkOutDate,
}) => {
  // 从 store 获取 detailContext 中的日期（优先级高于 Props）
  const { detailContext } = useHomestayStore()
  const storeCheckInDate = detailContext?.checkInDate
  
  // 优先使用 store 中的日期，再用 Props，最后用默认值
  let checkInDate = storeCheckInDate || propsCheckInDate
  
  // 如果还是没有，使用默认值（MM-DD 格式的今天）
  if (!checkInDate) {
    const now = new Date()
    checkInDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  // 日期时间计算辅助函数 - 从指定日期和时间加上小时数
  const addHoursToDateTime = (mmdd: string, timeStr: string, hoursToAdd: number): { date: string; time: string } => {
    if (!mmdd || !timeStr) return { date: '', time: '' }
    
    // 解析 MM-DD 格式
    const [month, day] = mmdd.split('-').map(Number)
    // 解析 HH:MM 格式
    const [hour, min] = timeStr.split(':').map(Number)
    
    const now = new Date()
    // 创建日期对象（使用当前年份作为基准）
    let date = new Date(now.getFullYear(), month - 1, day, hour, min)
    
    // 添加小时
    date.setHours(date.getHours() + hoursToAdd)
    
    // 返回格式化后的日期和时间
    const resultMonth = String(date.getMonth() + 1).padStart(2, '0')
    const resultDay = String(date.getDate()).padStart(2, '0')
    const resultHour = String(date.getHours()).padStart(2, '0')
    const resultMin = String(date.getMinutes()).padStart(2, '0')
    
    return {
      date: `${resultMonth}月${resultDay}日`,
      time: `${resultHour}:${resultMin}`,
    }
  }

  // 解析日期时间，生成表格数据
  const generateCancellationPolicies = () => {
    const checkInSpan = middlewarePolicies?.checkInSpan?.[0]
    const checkoutTime = middlewarePolicies?.checkoutTime
    const deadlineTime = middlewarePolicies?.deadlineTime

    if (!checkInSpan || !checkoutTime || !deadlineTime || !checkInDate) {
      return []
    }

    // 获取入住时间范围的开始时间作为 cancellationHour
    const cancellationHour = checkInSpan.early // 如 '14:00'

    // 计算各个时间点（第一个时间点，加0小时）
    const firstTimepoint = addHoursToDateTime(checkInDate, cancellationHour, 0)
    // 计算第二个时间点，加上deadlineTime小时
    const secondTimepoint = addHoursToDateTime(checkInDate, cancellationHour, deadlineTime)

    return [
      {
        timeRange: `${firstTimepoint.date} ${firstTimepoint.time}前`,
        cancellationFee: '免费取消',
      },
      {
        timeRange: `${firstTimepoint.date} ${firstTimepoint.time}后\n${secondTimepoint.date} ${secondTimepoint.time}前`,
        cancellationFee: '取消扣首晚房费的\n100%',
      },
      {
        timeRange: `${secondTimepoint.date} ${secondTimepoint.time}后`,
        cancellationFee: '取消扣全款',
      },
    ]
  }

  const cancellationPolicies = generateCancellationPolicies()
  const amenities = middlewarePolicies?.amenities
  const amenityItems = [
    { label: '接待婴儿', enabled: amenities?.baby },
    { label: '接待儿童', enabled: amenities?.children },
    { label: '接待老人', enabled: amenities?.elderly },
    { label: '接待海外', enabled: amenities?.overseas },
    { label: '接待港澳台', enabled: amenities?.hongKongMacaoTaiwan },
    { label: '带宠物', enabled: amenities?.pets },
  ]

  return (
    <>
      {/* Content */}
      <div className={styles.content}>
        {/* 入离 */}
        <div className={styles.sectionRow}>
          <h3 className={styles.sectionTitle}>入离</h3>
          <div className={styles.checkInOut}>
            <div className={styles.item}>
              <span className={styles.label}>入住</span>
              <span className={styles.value}>{middlewarePolicies?.checkInSpan?.[0]?.early}-{middlewarePolicies?.checkInSpan?.[0]?.later}入住</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>退房</span>
              <span className={styles.value}>{middlewarePolicies?.checkoutTime}前退房</span>
            </div>
          </div>
        </div>

        {/* 退订 */}
        <div className={styles.sectionRow}>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>退订</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.highlight}>{middlewarePolicies?.cancelMinute}分钟内免费取消</div>
            <p className={styles.description}>
              订单确认{middlewarePolicies?.cancelMinute}
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
                      {policy.timeRange.split('\n').map((line, i) => <div key={i}>{line}</div>)}
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
    </>
  )
}

const PolicySection: React.FC<PolicySectionProps> = ({
  facilitiesData,
  feeInfoData,
  policies,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 创建虚拟room对象用于显示政策信息
  const policyRoom = {
    id: 'policy',
    name: '预订须知',
    area: '',
    beds: '',
    guests: '',
    image: '',
    priceList: [],
    priceNote: '',
    benefits: [],
    packageCount: 0,
  }

  const handleOpenAllPolicies = () => {
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
            text: '预订须知',
            show: true,
          },
          textButton: {
            text: '全部须知',
            show: true,
            onClick: handleOpenAllPolicies,
          },
          tipTag: {
            show: true,
            icon: TipIcon,
            text: '以下规则由房东制定，请仔细读并遵守',
          },
        }}
      >
        <PolicySectionContent
          policies={policies}
        />
      </PropertyCardContainer>

      {/* 政策详情抽屉 - 使用RoomDetailDrawer展示 */}
      <RoomDetailDrawer
        room={isDrawerOpen ? policyRoom : null}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        scrollToPolicy={true}
        facilitiesData={facilitiesData}
        feeInfoData={feeInfoData}
      />
    </>
  )
}

export { PolicySection }
export type { PolicySectionProps }
export default PolicySection
