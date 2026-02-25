/**
 * 房间类型选择模态框
 * 支持作为独立模态框或作为内容嵌入其他容器
 */

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface RoomTypeModalProps {
  visible?: boolean
  guests?: number
  beds?: number
  rooms?: number
  onSelect: (guests: number, beds: number, rooms: number) => void
  onClose: () => void
  usePortal?: boolean // 是否使用 portal（默认 true，设为 false 时可嵌入其他容器）
  showFooter?: boolean // 是否显示底部按钮（嵌入模式下默认 false）
}

const RoomTypeModal: React.FC<RoomTypeModalProps> = ({
  visible = true,
  guests = 1,
  beds = 0,
  rooms = 0,
  onSelect,
  onClose,
  usePortal = true,
  showFooter = false,
}) => {
  const [tempGuests, setTempGuests] = useState(guests)
  const [tempBeds, setTempBeds] = useState(beds)
  const [tempRooms, setTempRooms] = useState(rooms)

  const handleConfirm = () => {
    onSelect(tempGuests, tempBeds, tempRooms)
    onClose()
  }

  const handleReset = () => {
    setTempGuests(1)
    setTempBeds(0)
    setTempRooms(0)
  }

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const CounterRow: React.FC<{
    label: string
    value: number
    onChange: (value: number) => void
  }> = ({ label, value, onChange }) => (
    <div className={styles.counterRow}>
      <span className={styles.counterLabel}>{label}</span>
      <div className={styles.counterControl}>
        <button className={styles.minusBtn} onClick={() => onChange(Math.max(value - 1, 0))}>
          −
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button className={styles.plusBtn} onClick={() => onChange(Math.min(value + 1, 10))}>
          +
        </button>
      </div>
    </div>
  )

  const content = (
    <>
      {/* 内容 */}
      <div className={styles.content}>
        {/* 总人数 */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>总人数</div>
          <div className={styles.guestOptions}>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                className={`${styles.optionBtn} ${tempGuests === num ? styles.active : ''}`}
                onClick={() => setTempGuests(num)}
              >
                {num}人
              </button>
            ))}
          </div>
        </div>

        {/* 床铺数 */}
        <div className={styles.section}>
          <CounterRow label="床铺数" value={tempBeds} onChange={setTempBeds} />
        </div>

        {/* 房间数 */}
        <div className={styles.section}>
          <CounterRow label="房间数" value={tempRooms} onChange={setTempRooms} />
        </div>
      </div>

      {/* 底部按钮 - 仅在 showFooter 为 true 时显示 */}
      {showFooter && (
        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            清空
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            确认
          </button>
        </div>
      )}
    </>
  )

  // 作为独立模态框使用
  if (usePortal) {
    return createPortal(
      <>
        {visible && <div className={styles.overlay} onClick={handleClose}></div>}

        <div className={`${styles.drawer} ${visible ? styles.active : ''}`}>
          {/* 头部 */}
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
            <h2 className={styles.title}>入住条件</h2>
            <div className={styles.placeholder}></div>
          </div>

          {content}
        </div>
      </>,
      document.body
    )
  }

  // 作为内容嵌入使用（不使用 portal）
  return <>{content}</>
}

export default RoomTypeModal
