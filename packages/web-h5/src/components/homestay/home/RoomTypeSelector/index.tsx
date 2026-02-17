/**
 * 房间类型选择组件 - Web H5版本
 * 房间数/床位/人数
 */

import React, { useState } from 'react'
import { Popup } from '@nutui/nutui-react'
import styles from './index.module.scss'

interface RoomTypeSelectorProps {
  rooms?: number
  beds?: number
  guests?: number
  onChange?: (rooms: number, beds: number, guests: number) => void
}

interface Counter {
  value: number
  min: number
  max: number
  label: string
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({
  rooms = 1,
  beds = 1,
  guests = 1,
  onChange,
}) => {
  const [tempRooms, setTempRooms] = useState(rooms)
  const [tempBeds, setTempBeds] = useState(beds)
  const [tempGuests, setTempGuests] = useState(guests)
  const [showPicker, setShowPicker] = useState(false)

  const handleConfirm = () => {
    onChange?.(tempRooms, tempBeds, tempGuests)
    setShowPicker(false)
  }

  const handleReset = () => {
    setTempRooms(1)
    setTempBeds(1)
    setTempGuests(1)
  }

  const CounterItem: React.FC<{
    label: string
    value: number
    min?: number
    max?: number
    onChange: (value: number) => void
  }> = ({ label, value, min = 1, max = 10, onChange }) => (
    <div className={styles.counterItem}>
      <span className={styles.label}>{label}</span>
      <div className={styles.counterControl}>
        <button
          className={styles.counterBtn}
          disabled={value <= min}
          onClick={() => onChange(Math.max(value - 1, min))}
        >
          −
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button
          className={styles.counterBtn}
          disabled={value >= max}
          onClick={() => onChange(Math.min(value + 1, max))}
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <div
        className={styles.displayBox}
        onClick={() => setShowPicker(true)}
      >
        <div className={styles.prefixIcon}>
          🛏️
        </div>

        <div className={styles.text}>
          {tempRooms}間 / {tempBeds}床 / {tempGuests}人
        </div>

        <div className={styles.suffixIcon}>
          ▼
        </div>
      </div>

      {/* 选择弹窗 */}
      <Popup
        visible={showPicker}
        position="bottom"
        onClose={() => setShowPicker(false)}
      >
        <div className={styles.pickerContainer}>
          <div className={styles.pickerHeader}>
            <button className={styles.resetBtn} onClick={handleReset}>
              重置
            </button>
            <h3 className={styles.title}>选择房间类型</h3>
            <button className={styles.doneBtn} onClick={handleConfirm}>
              完成
            </button>
          </div>

          <div className={styles.counterList}>
            <CounterItem
              label="房间数"
              value={tempRooms}
              min={1}
              max={10}
              onChange={setTempRooms}
            />
            <CounterItem
              label="床位"
              value={tempBeds}
              min={1}
              max={20}
              onChange={setTempBeds}
            />
            <CounterItem
              label="人数"
              value={tempGuests}
              min={1}
              max={20}
              onChange={setTempGuests}
            />
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default React.memo(RoomTypeSelector)
