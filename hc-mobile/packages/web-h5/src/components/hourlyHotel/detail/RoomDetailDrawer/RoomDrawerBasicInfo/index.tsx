import React from 'react'
import type { HourlyRoomDetail } from '../../../types'

interface RoomDrawerBasicInfoProps {
  room: HourlyRoomDetail
  duration: number
  availableTime: string
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ room, duration, availableTime }) => {
  const roomType = room.baseInfo.type || 'Hourly Room'
  const maxOccupancy = room.baseInfo.maxOccupancy ?? 2
  const hasWindow = room.baseInfo.windowAvailable ? 'Yes' : 'No / inner window'

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>Basic Information</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '14px', color: '#666' }}>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>Room Type</span>
          {roomType}
        </div>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>Occupancy</span>
          Up to {maxOccupancy} guests
        </div>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>Window</span>
          {hasWindow}
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f0f5ff',
          borderRadius: '8px',
          color: '#1752d4',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        <div style={{ marginBottom: '4px' }}>Available time: {availableTime}</div>
        <div>Duration: {duration} hour(s)</div>
      </div>
    </div>
  )
}

export default RoomDrawerBasicInfo
