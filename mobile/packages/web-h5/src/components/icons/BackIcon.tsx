import React from 'react'

interface BackIconProps {
  size?: number
  className?: string
  color?: string
}

/**
 * 返回箭头图标（SVG）
 */
export const BackIcon: React.FC<BackIconProps> = ({
  size = 24,
  className = '',
  color = '#333333',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 左箭头 */}
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill={color} />
    </svg>
  )
}
