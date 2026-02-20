import React from 'react'
import { HourlyRoomDetail } from '@estay/shared'

interface RoomDrawerBannerProps {
  room: HourlyRoomDetail
}

const RoomDrawerBanner: React.FC<RoomDrawerBannerProps> = ({ room }) => {
  const { baseInfo } = room
  // 获取第一张图片作为封面
  const coverImage = baseInfo.images && baseInfo.images.length > 0 ? baseInfo.images[0] : ''

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#eee' }}>
      {coverImage ? (
        <img
          src={coverImage}
          alt={baseInfo.type}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          暂无房型图片
        </div>
      )}

      {/* 底部加上一个渐变遮罩，让白色文字更清晰 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px 16px 12px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          {baseInfo.type}
        </h2>
      </div>
    </div>
  )
}

export default RoomDrawerBanner