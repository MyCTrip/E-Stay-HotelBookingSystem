import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import styles from './index.module.scss'

// --- 🌟 新增：显式定义选项的 TypeScript 类型，解决 never[] 报错 ---
interface DateOption {
  value: string
  label: string
  dayOfWeek: string
}

interface TimeOption {
  value: string
  disabled: boolean
}

interface HourlyTimePickerProps {
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  duration: number // 小时
  onChange: (date: string, startTime: string, duration: number) => void
}

const HourlyTimePicker: React.FC<HourlyTimePickerProps> = ({
  date,
  startTime,
  duration,
  onChange,
}) => {
  const [visible, setVisible] = useState(false)

  // 内部状态（用于弹窗内临时选择，点确定才提交）
  const [tempDate, setTempDate] = useState(date)
  const [tempDuration, setTempDuration] = useState(duration)
  const [tempStartTime, setTempStartTime] = useState(startTime)

  // 每次打开弹窗时，重置为外部传入的值
  useEffect(() => {
    if (visible) {
      setTempDate(date)
      setTempDuration(duration)
      setTempStartTime(startTime)
    }
  }, [visible, date, duration, startTime])

  // 生成未来 30 天的可选日期
  const dateOptions = useMemo(() => {
    const options: DateOption[] = [] // 🌟 修复点：指定数组类型
    const today = dayjs().startOf('day')
    for (let i = 0; i < 30; i++) {
      const current = today.add(i, 'day')
      let label = current.format('MM.DD')
      if (i === 0) label = '今天'
      if (i === 1) label = '明天'
      if (i === 2) label = '后天'

      options.push({
        value: current.format('YYYY-MM-DD'),
        label,
        dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][current.day()]
      })
    }
    return options
  }, [])

  // 生成钟点房可用时间段 (例如 08:00 - 22:00)
  const timeOptions = useMemo(() => {
    const options: TimeOption[] = [] // 🌟 修复点：指定数组类型
    const isToday = tempDate === dayjs().format('YYYY-MM-DD')
    const currentHour = dayjs().hour()

    for (let i = 8; i <= 22; i++) {
      const timeStr = `${i.toString().padStart(2, '0')}:00`
      // 如果是今天，且该小时已经过去，则禁用
      const disabled = isToday && i <= currentHour
      options.push({ value: timeStr, disabled })
    }
    return options
  }, [tempDate])

  // 处理确定按钮
  const handleConfirm = () => {
    // 校验：如果当前选中的时间被禁用了，自动选第一个可用的时间
    let finalTime = tempStartTime
    const selectedTimeOption = timeOptions.find(t => t.value === tempStartTime)
    if (!selectedTimeOption || selectedTimeOption.disabled) {
      const firstAvailable = timeOptions.find(t => !t.disabled)
      finalTime = firstAvailable ? firstAvailable.value : '08:00'
    }

    onChange(tempDate, finalTime, tempDuration)
    setVisible(false)
  }

  // 格式化外部显示的日期
  const displayDateStr = () => {
    const isToday = date === dayjs().format('YYYY-MM-DD')
    const isTomorrow = date === dayjs().add(1, 'day').format('YYYY-MM-DD')
    let prefix = ''
    if (isToday) prefix = '今天 '
    else if (isTomorrow) prefix = '明天 '
    return `${prefix}${dayjs(date).format('MM月DD日')}`
  }

  return (
    <>
      {/* 外部触发条 */}
      <div className={styles.pickerBar} onClick={() => setVisible(true)}>
        <div className={styles.infoBlock}>
          <div className={styles.label}>入住日期</div>
          <div className={styles.value}>{displayDateStr()}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.infoBlock}>
          <div className={styles.label}>预计到店</div>
          <div className={styles.value}>{startTime}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.infoBlock}>
          <div className={styles.label}>入住时长</div>
          <div className={styles.value}>{duration}小时</div>
        </div>
        <div className={styles.arrow}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#999">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>

      {/* 底部选择弹窗 */}
      {visible && (
        <div className={styles.popupOverlay} onClick={() => setVisible(false)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3>选择入住信息</h3>
              <span className={styles.closeBtn} onClick={() => setVisible(false)}>✕</span>
            </div>

            <div className={styles.popupBody}>
              {/* 1. 日期选择 (横向滑动) */}
              <div className={styles.section}>
                <h4>入驻日期</h4>
                <div className={styles.scrollRow}>
                  {dateOptions.map(opt => (
                    <div
                      key={opt.value}
                      className={`${styles.dateItem} ${tempDate === opt.value ? styles.active : ''}`}
                      onClick={() => setTempDate(opt.value)}
                    >
                      <span className={styles.dateLabel}>{opt.label}</span>
                      <span className={styles.dayOfWeek}>{opt.dayOfWeek}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 时长选择 */}
              <div className={styles.section}>
                <h4>入住时长</h4>
                <div className={styles.pillGroup}>
                  {[3, 4, 5, 6].map(hours => (
                    <div
                      key={hours}
                      className={`${styles.pill} ${tempDuration === hours ? styles.active : ''}`}
                      onClick={() => setTempDuration(hours)}
                    >
                      {hours}小时
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 到店时间选择 */}
              <div className={styles.section}>
                <h4>预计到店时间 <span className={styles.subTitle}>(为您保留至该时间后1小时)</span></h4>
                <div className={styles.timeGrid}>
                  {timeOptions.map(opt => (
                    <div
                      key={opt.value}
                      className={`
                        ${styles.timeItem} 
                        ${tempStartTime === opt.value ? styles.active : ''} 
                        ${opt.disabled ? styles.disabled : ''}
                      `}
                      onClick={() => {
                        if (!opt.disabled) setTempStartTime(opt.value)
                      }}
                    >
                      {opt.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.popupFooter}>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HourlyTimePicker