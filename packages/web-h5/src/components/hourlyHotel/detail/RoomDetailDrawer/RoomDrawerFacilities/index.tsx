import React from 'react'
import { HourlyRoomDetail } from '@estay/shared'

interface RoomDrawerFacilitiesProps {
  room: HourlyRoomDetail
}

const RoomDrawerFacilities: React.FC<RoomDrawerFacilitiesProps> = ({ room }) => {
  const { facilities } = room.baseInfo

  // 如果没有设施数据，直接不渲染该模块
  if (!facilities || facilities.length === 0) {
    return null
  }

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginTop: '8px' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>设施服务</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {facilities.map((fac, index) => {
          // 兼容处理：假设 Facility 是个对象包含 name 属性，或者直接就是 string
          const facName = typeof fac === 'string' ? fac : (fac as any).name || '未知设施'

          return (
            <span
              key={index}
              style={{
                padding: '4px 10px',
                backgroundColor: '#f5f7fa',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#555'
              }}
            >
              {facName}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default RoomDrawerFacilities