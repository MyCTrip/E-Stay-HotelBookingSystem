import React, { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import styles from './index.module.scss'

dayjs.locale('zh-cn')

interface DateDurationSelectorProps {
    date?: Date
    duration?: number
    // 注意这里：onChange 的参数里去掉了 startTime
    onChange?: (date: Date, duration: number) => void
}

// 钟点房可用时长选项
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
}) => {
    const [tempDate, setTempDate] = useState<Date>(date || dayjs().toDate())
    const [tempDuration, setTempDuration] = useState<number>(duration)
    const [showPicker, setShowPicker] = useState(false)

    // 格式化主日期 (例如: 2月19日)
    const formatDateLabel = (d: Date): string => {
        return dayjs(d).format('M月D日')
    }

    // 获取周几，如果是今明两天则加上文字后缀
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

    const handleConfirm = () => {
        onChange?.(tempDate, tempDuration) // 确认时只传出日期和时长
        setShowPicker(false)
    }

    const todayStr = dayjs().format('YYYY-MM-DD')

    return (
        <div className={styles.container}>
            {/* --- 外部展示区域 --- */}
            <div className={styles.wrapper} onClick={() => setShowPicker(true)}>
                {/* 左侧：入住日期 + 周几 */}
                <div className={styles.dateSection}>
                    <div className={styles.dateValue}>{formatDateLabel(tempDate)}</div>
                    <div className={styles.dateLabel}>{getWeekdayLabel(tempDate)}</div>
                </div>

                {/* 右侧：入住时长 (只保留时长) */}
                <div className={styles.rightSection}>
                    <div className={styles.nightsInfo}>
                        <span className={styles.nightsLabel}>入住时长{tempDuration}小时</span>
                    </div>
                </div>
            </div>

            {/* --- 底部选择弹窗 --- */}
            {showPicker && (
                <>
                    <div className={styles.overlay} onClick={() => setShowPicker(false)} />
                    <div className={styles.pickerModal}>
                        <div className={styles.pickerHeader}>
                            <h3>选择入住信息</h3>
                        </div>

                        <div className={styles.pickerContainer}>
                            {/* 1. 日期选择：原生 input type="date" */}
                            <div className={styles.pickerRow}>
                                <label>日期</label>
                                <input
                                    type="date"
                                    className={styles.nativeSelect}
                                    value={dayjs(tempDate).format('YYYY-MM-DD')}
                                    min={todayStr}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setTempDate(dayjs(e.target.value).toDate())
                                        }
                                    }}
                                />
                            </div>

                            {/* 2. 时长选择：去掉了预计到店，只留时长 */}
                            <div className={styles.pickerRow}>
                                <label>时长</label>
                                <div className={styles.optionsGroup}>
                                    {DURATION_OPTIONS.map(opt => (
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
                            <button className={styles.cancelBtn} onClick={() => setShowPicker(false)}>取消</button>
                            <button className={styles.confirmBtn} onClick={handleConfirm}>确定</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default React.memo(DateDurationSelector)