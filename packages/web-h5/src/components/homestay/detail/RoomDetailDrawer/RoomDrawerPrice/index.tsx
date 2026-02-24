/**
 * 价格与优惠信息 - 符合行业规范
 * 展示房费、优惠、最终价格等信息
 */

import React, { useState } from 'react'
import DownArrowIcon from '../../../../icons/DownArrowIcon'
import UpArrowIcon from '../../../../icons/UpArrowIcon'
import styles from './index.module.scss'

interface Discount {
  name: string              // 折扣类型名称，如'钻石贵宾'
  description: string       // 折扣说明
  amount: number           // 折扣金额
}

interface Room {
  id: string
  price: number
  discounts?: Discount[]   // 折扣项数组
}


interface RoomDrawerPriceProps {
  room: Room
  checkIn?: string         // ISO格式日期 '2025-02-25'
  checkOut?: string        // ISO格式日期 '2025-02-27'
}

/**
 * 格式化日期为中文显示
 * @param dateStr ISO 格式的日期字符串
 * @returns 格式化的日期字符串，如 '2月25日'
 */
const formatDateCh = (dateStr: string): string => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

/**
 * 计算日期范围内的所有日期
 * @param checkInStr 检入日期
 * @param checkOutStr 检出日期
 * @returns 日期数组
 */
const getDateRange = (checkInStr: string, checkOutStr: string): string[] => {
  const dates: string[] = []
  const current = new Date(checkInStr)
  const checkOut = new Date(checkOutStr)
  
  while (current < checkOut) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

/**
 * 计算晚数
 */
const calculateNights = (checkInStr: string, checkOutStr: string): number => {
  const checkIn = new Date(checkInStr)
  const checkOut = new Date(checkOutStr)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

const RoomDrawerPrice: React.FC<RoomDrawerPriceProps> = ({ 
  room, 
  checkIn,
  checkOut,
}) => {
  // 生成默认日期：明天到后天
  const getDefaultDates = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const afterTomorrow = new Date(tomorrow)
    afterTomorrow.setDate(afterTomorrow.getDate() + 2)
    return {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: afterTomorrow.toISOString().split('T')[0],
    }
  }

  const defaultDates = getDefaultDates()
  const finalCheckIn = checkIn || defaultDates.checkIn
  const finalCheckOut = checkOut || defaultDates.checkOut

  // 状态：房费卡片第三行的展开收起
  const [isRoomFeesExpanded, setIsRoomFeesExpanded] = useState(false)

  // 计算晚数
  const nights = calculateNights(finalCheckIn, finalCheckOut)

  // 基础房费
  const basePrice = room.price || 0

  // 折扣信息
  const discounts = room.discounts || []
  
  // 每晚总折扣
  const dailyDiscount = discounts.reduce((sum, d) => sum + d.amount, 0)
  
  // 总折扣
  const totalDiscount = dailyDiscount * nights

  // 折扣后每晚价格
  const finalDailyPrice = basePrice - dailyDiscount

  // 折扣后总价
  const finalTotalPrice = finalDailyPrice * nights

  // 获取日期范围
  const dateRange = getDateRange(finalCheckIn, finalCheckOut)

  return (
    <div className={styles.priceSection}>
      {/* ===== 1. 时间和晚数信息条 ===== */}
      <div className={styles.timeInfo}>
        <span>{formatDateCh(finalCheckIn)}</span>
        <span className={styles.separator}>-</span>
        <span>{formatDateCh(finalCheckOut)}</span>
        <span className={styles.separator}>|</span>
        <span>共{nights}晚</span>
      </div>

      {/* ===== 2. 房费卡片 ===== */}
      <div className={styles.card}>
        {/* 第1行：房费标题和每晚价格 */}
        <div className={styles.row}>
          <div className={styles.label}>房费</div>
          <div className={styles.value}><span>每间每晚</span> <span className={styles.price}>¥{basePrice}</span></div>
        </div>

        {/* 第2行：晚数总价 + 展开/收起icon */}
        <div className={styles.row}>
          <div className={styles.label}></div>
          <div className={styles.valueRow}>
            <div className={styles.value}>
              <span>{nights}晚</span> <span className={styles.price}>¥{basePrice * nights}</span>
            </div>
            {/* 仅当晚数>3时显示展开/收起按钮 */}
            {nights > 3 && (
              <button 
                className={styles.toggleBtn}
                onClick={() => setIsRoomFeesExpanded(!isRoomFeesExpanded)}
              >
                {isRoomFeesExpanded ? (
                  <UpArrowIcon width={12} height={12} color="#B1B1B1" />
                ) : (
                  <DownArrowIcon width={12} height={12} color="#B1B1B1" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* 第3行+：日期详情 */}
        {/* 当晚数 <= 3 时：直接显示所有日期详情（无需展开/收起功能） */}
        {nights <= 3 && (
          <div className={styles.datesDetail}>
            {dateRange.map((date, index) => (
              <div key={index} className={styles.row}>
                <div className={styles.label}>{formatDateCh(date)}</div>
                <div className={styles.value}>¥{basePrice}</div>
              </div>
            ))}
          </div>
        )}

        {/* 当晚数 > 3 时：显示展开/收起的日期详情（默认收起） */}
        {nights > 3 && (
          <div className={`${styles.datesDetail} ${isRoomFeesExpanded ? styles.expanded : styles.collapsed}`}>
            {dateRange.map((date, index) => (
              <div key={index} className={styles.row}>
                <div className={styles.label}>{formatDateCh(date)}</div>
                <div className={styles.value}>¥{basePrice}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== 3. 优惠卡片 ===== */}
      {discounts.length > 0 && (
        <div className={styles.card}>
          {/* 第1行：优惠标题和每晚折扣 */}
          <div className={styles.row}>
            <div className={styles.label}>优惠</div>
            <div className={styles.value}>
              <span>每间每晚</span> <span className={styles.discount}>-¥{dailyDiscount}</span>
            </div>
          </div>

          {/* 第2行：晚数总折扣 */}
          <div className={styles.row}>
            <div className={styles.label}></div>
            <div className={styles.value}>
              <span>{nights}晚</span> <span className={styles.discount}>-¥{totalDiscount}</span>
            </div>
          </div>

          {/* 第3行+：各类折扣项详情 */}
          {discounts.map((discount, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.labelWithDesc}>
                <div className={styles.title}>{discount.name}</div>
                <div className={styles.desc}>{discount.description}</div>
              </div>
              <div className={styles.discount}>-¥{discount.amount}</div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 4. 优惠后价格区域 ===== */}
      <div className={styles.card} style={{backgroundColor:'white'}}>
        {/* 第1行：优惠后每晚价格 */}
        <div className={styles.row} style={{marginBottom:"-10px"}}>
          <div className={styles.label} style={{fontSize:'20px'}}>优惠后</div>
          <div className={styles.value}>
            <span>每间每晚</span> <span className={styles.finalPrice}>¥{finalDailyPrice}</span>
          </div>
        </div>

        {/* 第2行：优惠后总价 */}
        <div className={styles.row}>
          <div className={styles.label}></div>
          <div className={styles.value} style={{fontWeight:"600"}}>
            <span style={{color:"#ff6e16"}}>{nights}晚</span> <span className={styles.finalPrice} style={{color:'#ff6e16',fontSize:"24px"}}>¥{finalTotalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPrice
