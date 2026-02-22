/**
 * RecommendCard 图标库
 */

import React from 'react'

interface IconProps {
  size?: number
  color?: string
}

/**
 * 位置图标 - 坐标针样式
 */
export const LocationIcon: React.FC<IconProps> = ({ size = 12, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 针体 - 上圆下尖 */}
      <circle cx="12" cy="9" r="5.5" fill={color} />
      {/* 针尖 */}
      <path d="M 12 9 L 15.5 18 C 12.8 21 11.2 21 8.5 18 Z" fill={color} />
    </svg>
  )
}

export default {
  LocationIcon,
}
