import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom' // 🌟 1. 新增：引入 createPortal
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import styles from './index.module.scss'

dayjs.locale('zh-cn')

interface DateDurationSelectorProps {
    date?: Date
    duration?: number
    onChange?: (date: Date, duration: number) => void
    visible?: boolean
    onClose?: () => void
    isPopupOnly?: boolean
}

const DateDurationSelector: React.FC<DateDurationSelectorProps> = ({
    date,
    duration = 4,
    onChange,
    visible = false,
    onClose,
    isPopupOnly = false,
}) => {
    const [tempDate, setTempDate] = useState<Date>(date || dayjs().toDate())
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (visible || showPicker) {
            setTempDate(date || dayjs().toDate())
        }
    }, [visible, showPicker, date])

    const formatDateLabel = (d: Date): string => dayjs(d).format('M月D日')

    const getWeekdayLabel = (d: Date): string => {
        const targetDate = dayjs(d)
        const today = dayjs()
        const tomorrow = today.add(1, 'day')
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const weekday = days[targetDate.day()]

        if (targetDate.isSame(today, 'day')) return `今天`
        if (targetDate.isSame(tomorrow, 'day')) return `明天`
        return weekday
    }

    const handleClose = () => {
        setShowPicker(false)
        onClose?.()
    }

    // 选中日期后自动关闭并保存
    const handleDateSelect = (selectedDate: Date) => {
        setTempDate(selectedDate)
        onChange?.(selectedDate, duration)
        handleClose()
    }

    const isModalVisible = showPicker || visible

    // 渲染单个月份的日历网格
    const renderMonthCalendar = (monthOffset: number) => {
        const targetMonth = dayjs().add(monthOffset, 'month')
        const year = targetMonth.year()
        const month = targetMonth.month()
        const daysInMonth = targetMonth.daysInMonth()
        const firstDayOfWeek = targetMonth.startOf('month').day() // 0(日) - 6(六)

        // 填充空白天数
        const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} className={styles.dayEmpty} />
        ))

        // 填充真实天数
        const days = Array.from({ length: daysInMonth }).map((_, i) => {
            const dateNum = i + 1
            const currentDate = dayjs(new Date(year, month, dateNum))
            const isPast = currentDate.isBefore(dayjs(), 'day')
            const isSelected = currentDate.isSame(tempDate, 'day')
            const isToday = currentDate.isSame(dayjs(), 'day')

            return (
                <div
                    key={dateNum}
                    className={`${styles.dayCell} ${isPast ? styles.disabled : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => !isPast && handleDateSelect(currentDate.toDate())}
                >
                    <span className={styles.dateNum}>
                        {isToday && !isSelected ? '今天' : dateNum}
                    </span>
                    {/* 选中时的 "住/离" 标识 */}
                    {isSelected && <span className={styles.checkInOut}>住/离</span>}
                </div>
            )
        })

        return (
            <div className={styles.monthBlock} key={`${year}-${month}`}>
                <div className={styles.monthTitle}>{year}年{month + 1}月</div>
                <div className={styles.daysGrid}>
                    {blanks}
                    {days}
                </div>
            </div>
        )
    }

    return (
        <div className={isPopupOnly ? '' : styles.container}>
            {/* 首页触发卡片 - 只保留日期，极简风格 */}
            {!isPopupOnly && (
                <div className={styles.wrapper} onClick={() => setShowPicker(true)}>
                    <div className={styles.dateSection}>
                        <span className={styles.dateValue}>{formatDateLabel(tempDate)}</span>
                        <span className={styles.dateLabel}>{getWeekdayLabel(tempDate)}</span>
                    </div>
                </div>
            )}

            {/* 🌟 2. 核心修改：使用 createPortal 把弹窗传送到 document.body */}
            {isModalVisible && createPortal(
                <>
                    <div className={styles.overlay} onClick={handleClose} />
                    <div className={styles.calendarModal}>
                        <div className={styles.calendarHeader}>
                            <span className={styles.closeBtn} onClick={handleClose}>✕</span>
                            <h3 className={styles.headerTitle}>选择日期</h3>
                        </div>

                        {/* 星期的表头 */}
                        <div className={styles.weekHeader}>
                            <span className={styles.weekend}>日</span>
                            <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span>
                            <span className={styles.weekend}>六</span>
                        </div>

                        <div className={styles.calendarBody}>
                            {/* 动态渲染未来 6 个月 (当月 + 往后推5个月) */}
                            {Array.from({ length: 6 }).map((_, index) => renderMonthCalendar(index))}

                            {/* 底部提示语 */}
                            <div className={styles.bottomTip}>
                                到底了，最长可订6个月内的房量
                            </div>
                        </div>
                    </div>
                </>,
                document.body // 传送的目标位置
            )}
        </div>
    )
}

export default React.memo(DateDurationSelector)