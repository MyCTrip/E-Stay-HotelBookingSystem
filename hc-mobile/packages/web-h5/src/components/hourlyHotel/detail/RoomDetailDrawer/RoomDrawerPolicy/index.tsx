import React from 'react'
import type { HourlyRoomDetail } from '../../../types'

export interface HourlyCustomPolicy {
  checkInTime: string
  duration: string
  overtime: string
}

interface RoomDrawerPolicyProps {
  room: HourlyRoomDetail
  customPolicy: HourlyCustomPolicy
}

const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps> = ({ room, customPolicy }) => {
  const fallbackPolicy = room.baseInfo.policies?.[0]?.content

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginTop: '8px' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>Booking Policy</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Check-in</div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
            {customPolicy.checkInTime}
            <br />
            {customPolicy.duration}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Overtime</div>
          <div style={{ fontSize: '13px', color: '#666' }}>{customPolicy.overtime}</div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Cancellation</div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {fallbackPolicy || 'After confirmation, cancellation or modification may incur fees.'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPolicy
