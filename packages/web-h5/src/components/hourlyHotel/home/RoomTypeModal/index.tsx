/**
 * 房间类型选择模态框
 * 从网页窗口底部滑入，高度自适应
 */

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface RoomTypeModalProps {
  visible: boolean
  guests?: number
  beds?: number
  rooms?: number
  onSelect: (guests: number, beds: number, rooms: number) => void
  onClose: () => void
}

const RoomTypeModal: React.FC<RoomTypeModalProps> = ({
  visible,
  guests = 1,
  beds = 0,
  rooms = 0,
  onSelect,
  onClose,
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
        <button
          className={styles.minusBtn}
          onClick={() => onChange(Math.max(value - 1, 0))}
        >
          −
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button
          className={styles.plusBtn}
          onClick={() => onChange(Math.min(value + 1, 10))}
        >
          +
        </button>
      </div>
    </div>
  )

  return createPortal(
    <>
      {visible && (
        <div className={styles.overlay} onClick={handleClose}></div>
      )}

      <div className={`${styles.drawer} ${visible ? styles.active : ''}`}>
        {/* 头部 */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <h2 className={styles.title}>入住条件</h2>
          <div className={styles.placeholder}></div>
        </div>

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
            <CounterRow
              label="床铺数"
              value={tempBeds}
              onChange={setTempBeds}
            />
          </div>

          {/* 居室数 */}
          <div className={styles.section}>
            <CounterRow
              label="居室数"
              value={tempRooms}
              onChange={setTempRooms}
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            清空
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            确认
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}

export default RoomTypeModal
