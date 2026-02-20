import React from 'react'
import { HourlyRoomDetail } from '@estay/shared'

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
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginTop: '8px' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>订房必读</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>入离时间</div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
            {customPolicy.checkInTime}。<br />
            {customPolicy.duration}。
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>超时规定</div>
          <div style={{ fontSize: '13px', color: '#666' }}>{customPolicy.overtime}</div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>退改政策</div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            订单确认后不可取消或变更。如未入住，酒店将扣除全额房费。
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDrawerPolicy