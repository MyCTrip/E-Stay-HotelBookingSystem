import React, { useState } from 'react'
import RoomTypeModal from '../RoomTypeModal'
import styles from './index.module.scss'

interface RoomTypeSelectorProps {
  rooms: number
  beds: number
  guests: number
  onChange: (guests: number, beds: number, rooms: number) => void
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({
  rooms,
  beds,
  guests,
  onChange,
}) => {
  const [showModal, setShowModal] = useState(false)

  const handleSelect = (newGuests: number, newBeds: number, newRooms: number) => {
    onChange(newGuests, newBeds, newRooms)
  }

  return (
    <div className={styles.container}>
      <div className={styles.displayBox} onClick={() => setShowModal(true)}>
        <div className={styles.text}>
          {guests}人/ {beds}床/ {rooms}间
        </div>

        <div className={styles.suffixIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <RoomTypeModal
        visible={showModal}
        guests={guests}
        beds={beds}
        rooms={rooms}
        onSelect={handleSelect}
        showFooter={true}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default React.memo(RoomTypeSelector)
