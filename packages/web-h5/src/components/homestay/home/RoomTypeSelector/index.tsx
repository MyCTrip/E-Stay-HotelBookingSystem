/**
 * 房间类型选择组件 - Web H5版本
 * 房间数/床位/人数
 */

import React, { useState } from 'react'
import RoomTypeModal from '../RoomTypeModal'
import styles from './index.module.scss'

interface RoomTypeSelectorProps {
  rooms?: number
  beds?: number
  guests?: number
  onChange?: (guests: number, beds: number, rooms: number) => void
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({
  rooms = 0,
  beds = 0,
  guests = 1,
  onChange,
}) => {
  const [tempGuests, setTempGuests] = useState(guests)
  const [tempBeds, setTempBeds] = useState(beds)
  const [tempRooms, setTempRooms] = useState(rooms)
  const [showModal, setShowModal] = useState(false)

  const handleSelect = (newGuests: number, newBeds: number, newRooms: number) => {
    setTempGuests(newGuests)
    setTempBeds(newBeds)
    setTempRooms(newRooms)
    onChange?.(newGuests, newBeds, newRooms)
  }

  return (
    <div className={styles.container}>
      <div className={styles.displayBox} onClick={() => setShowModal(true)}>
        <div className={styles.text}>
          {tempGuests}人 / {tempBeds}床 / {tempRooms}间
        </div>

        <div className={styles.suffixIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* 房间类型选择模态框 */}
      <RoomTypeModal
        visible={showModal}
        guests={tempGuests}
        beds={tempBeds}
        rooms={tempRooms}
        onSelect={handleSelect}
        showFooter={true}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default React.memo(RoomTypeSelector)
