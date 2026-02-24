import React from 'react'
import type { HourlyFacilityItem, HourlyRoomDetail } from '../../../types'

interface RoomDrawerFacilitiesProps {
  room: HourlyRoomDetail
}

const getFacilityName = (facility: HourlyFacilityItem | string): string => {
  if (typeof facility === 'string') {
    return facility
  }

  if (facility.name) {
    return facility.name
  }

  if (facility.content) {
    return facility.content
  }

  return 'Facility'
}

const RoomDrawerFacilities: React.FC<RoomDrawerFacilitiesProps> = ({ room }) => {
  const facilities = room.baseInfo.facilities ?? []

  if (facilities.length === 0) {
    return null
  }

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginTop: '8px' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>Facilities</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {facilities.map((facility, index) => (
          <span
            key={index}
            style={{
              padding: '4px 10px',
              backgroundColor: '#f5f7fa',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#555',
            }}
          >
            {getFacilityName(facility)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default RoomDrawerFacilities
