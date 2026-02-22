import React from 'react'

interface CollectionIconProps {
  collected?: boolean
  size?: number
  className?: string
}

/**
 * 收藏图标
 * - 未收藏: 空心心形
 * - 已收藏: 填充红色心形
 */
export const CollectionIcon: React.FC<CollectionIconProps> = ({
  collected = false,
  size = 24,
  className = '',
}) => {
  const fillColor = collected ? '#FF6B6B' : 'none'
  const strokeColor = collected ? 'none' : '#333333'

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={collected ? '0' : '1.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
