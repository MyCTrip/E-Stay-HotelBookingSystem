import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import styles from './index.module.scss'

dayjs.locale('zh-cn')

interface DateDurationSelectorProps {
    date?: Date
    duration?: number
    onChange?: (date: Date, duration: number) => void
    // 🌟 新增：为了在 SearchResult 页面作为纯弹窗受控使用
    visible?: boolean
    onClose?: () => void
    isPopupOnly?: boolean // 为 true 时，不渲染首页的那个展示块，只渲染弹窗
}

const DURATION_OPTIONS = [
    { label: '3小时', value: 3 },
    { label: '4小时', value: 4 },
    { label: '6小时', value: 6 },
    { label: '8小时', value: 8 },
]

const DateDurationSelector: React.FC<DateDurationSelectorProps> = ({
    date,
    duration = 4,
    onChange,
    visible = false,
    onClose,
    isPopupOnly = false,
}) => {
    const [tempDate, setTempDate] = useState<Date>(date || dayjs().toDate())
    const [tempDuration, setTempDuration] = useState<number>(duration)
    const [showPicker, setShowPicker] = useState(false)

    // 🌟 每次弹窗打开时，重置为外部传入的最新状态
    useEffect(() => {
        if (visible || showPicker) {
            setTempDate(date || dayjs().toDate())
            setTempDuration(duration || 4)
        }
    }, [visible, showPicker, date, duration])

    const formatDateLabel = (d: Date): string => dayjs(d).format('M月D日')

    const getWeekdayLabel = (d: Date): string => {
        const targetDate = dayjs(d)
        const today = dayjs()
        const tomorrow = today.add(1, 'day')
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const weekday = days[targetDate.day()]

        if (targetDate.isSame(today, 'day')) return `${weekday} 今天`
        if (targetDate.isSame(tomorrow, 'day')) return `${weekday} 明天`
        return weekday
    }

    const handleClose = () => {
        setShowPicker(false)
        onClose?.()
    }

    const handleConfirm = () => {
        onChange?.(tempDate, tempDuration)
        handleClose()
    }

    const isModalVisible = showPicker || visible
    const todayStr = dayjs().format('YYYY-MM-DD')

    return (
        <div className={isPopupOnly ? '' : styles.container}>
            {/* 🌟 如果不是纯弹窗模式（如在首页），则渲染展示块 */}
            {!isPopupOnly && (
                <div className={styles.wrapper} onClick={() => setShowPicker(true)}>
                    <div className={styles.dateSection}>
                        <div className={styles.dateValue}>{formatDateLabel(tempDate)}</div>
                        <div className={styles.dateLabel}>{getWeekdayLabel(tempDate)}</div>
                    </div>
                    <div className={styles.rightSection}>
                        <div className={styles.nightsInfo}>
                            <span className={styles.nightsLabel}>入住时长{tempDuration}小时</span>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 底部选择弹窗 --- */}
            {isModalVisible && (
                <>
                    <div className={styles.overlay} onClick={handleClose} />
                    <div className={styles.pickerModal}>
                        <div className={styles.pickerHeader}>
                            <h3>选择入住信息</h3>
                        </div>

                        <div className={styles.pickerContainer}>
                            <div className={styles.pickerRow}>
                                <label>日期</label>
                                <input
                                    type="date"
                                    // 修复了你原代码里 class 不匹配的问题（原生用 timeSelect 样式）
                                    className={styles.timeSelect}
                                    value={dayjs(tempDate).format('YYYY-MM-DD')}
                                    min={todayStr}
                                    onChange={(e) => {
                                        if (e.target.value) setTempDate(dayjs(e.target.value).toDate())
                                    }}
                                />
                            </div>

                            <div className={styles.pickerRow}>
                                <label>时长</label>
                                <div className={styles.optionsGroup}>
                                    {DURATION_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={tempDuration === opt.value ? styles.activeOption : styles.optionBtn}
                                            onClick={() => setTempDuration(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.pickerFooter}>
                            <button className={styles.cancelBtn} onClick={handleClose}>取消</button>
                            <button className={styles.confirmBtn} onClick={handleConfirm}>确定</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default React.memo(DateDurationSelector)