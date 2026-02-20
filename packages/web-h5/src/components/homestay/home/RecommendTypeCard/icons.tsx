/**
 * 推荐类型的 SVG 图标组件
 */

import React from 'react'

// 品质好房 - 房子图标
export const QualityHouseIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 6L8 18V40H40V18L24 6Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M24 12L10 22V38H38V22L24 12Z"
      fill="white"
      opacity="0.5"
    />
    <rect x="14" y="24" width="8" height="8" fill="currentColor" opacity="0.6" />
    <rect x="26" y="24" width="8" height="8" fill="currentColor" opacity="0.6" />
  </svg>
)

// 携宠出游 - 狗狗图标
export const PetFriendlyIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="18" r="8" />
    <path d="M8 28C8 24 12 22 16 22C19 22 21 24 21 27V36C21 38.2 19.2 40 17 40H15C12.8 40 11 38.2 11 36V28C11 28 8 28 8 28Z" />
    <path d="M40 28C40 24 36 22 32 22C29 22 27 24 27 27V36C27 38.2 28.8 40 31 40H33C35.2 40 37 38.2 37 36V28C37 28 40 28 40 28Z" />
    <ellipse cx="14" cy="14" rx="2.5" ry="3" />
    <ellipse cx="34" cy="14" rx="2.5" ry="3" />
    <path d="M22 8C22 10 23 12 24 12C25 12 26 10 26 8" strokeWidth="1.5" fill="none" stroke="currentColor" />
  </svg>
)

// 周末不加价 - 日历/时间图标
export const WeekendDealsIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="10" width="32" height="28" rx="2" fill="currentColor" opacity="0.8" />
    <rect x="8" y="10" width="32" height="6" rx="2" fill="currentColor" />
    <circle cx="14" cy="22" r="2" fill="white" opacity="0.7" />
    <circle cx="24" cy="22" r="2" fill="white" opacity="0.7" />
    <circle cx="34" cy="22" r="2" fill="white" opacity="0.7" />
    <circle cx="14" cy="30" r="2" fill="white" opacity="0.7" />
    <circle cx="24" cy="30" r="2" fill="white" opacity="0.7" />
    <circle cx="34" cy="30" r="2" fill="white" opacity="0.7" />
  </svg>
)

export default {
  QualityHouseIcon,
  PetFriendlyIcon,
  WeekendDealsIcon,
}
