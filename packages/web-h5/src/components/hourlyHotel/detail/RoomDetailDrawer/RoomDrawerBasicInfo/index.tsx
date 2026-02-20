import React from 'react'
import { HourlyRoomDetail } from '@estay/shared'

interface RoomDrawerBasicInfoProps {
  room: HourlyRoomDetail
  duration: number
  availableTime: string
}

const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps> = ({ room, duration, availableTime }) => {
  const { baseInfo } = room;

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
      <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>基本信息</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '14px', color: '#666' }}>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>房型</span>
          {baseInfo.type}
        </div>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>入住人数</span>
          最多{baseInfo.maxOccupancy}人
        </div>
        <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>有无窗户</span>
          {baseInfo.windowAvailable ? '有窗' : '无窗/内窗'}
        </div>
        {/* 如果后续后端加上了 area 面积字段，可以在这里放开 */}
        {/* <div style={{ width: '45%' }}>
          <span style={{ color: '#999', marginRight: '8px' }}>面积</span>
          {baseInfo.area}
        </div> */}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f0f5ff',
        borderRadius: '8px',
        color: '#1752d4',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <div style={{ marginBottom: '4px' }}>⏱ 可用时段：{availableTime}</div>
        <div>⏳ 入住时长：{duration} 小时</div>
      </div>
    </div>
  )
}

export default RoomDrawerBasicInfo