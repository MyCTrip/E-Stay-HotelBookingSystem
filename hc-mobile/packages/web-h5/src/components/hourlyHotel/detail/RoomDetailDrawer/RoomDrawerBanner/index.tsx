import React from 'react'
import type { HourlyRoomDetail } from '../../../types'

interface RoomDrawerBannerProps {
  room: HourlyRoomDetail
}

const RoomDrawerBanner: React.FC<RoomDrawerBannerProps> = ({ room }) => {
  const coverImage = room.baseInfo.images?.[0] || ''
  const title = room.baseInfo.type || 'Hourly Room'

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#eee' }}>
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
          }}
        >
          No image available
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 16px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{title}</h2>
      </div>
    </div>
  )
}

export default RoomDrawerBanner
