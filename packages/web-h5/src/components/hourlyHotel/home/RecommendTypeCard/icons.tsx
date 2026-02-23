/**
 * 钟点房推荐类型的 SVG 图标组件
 */
import React from 'react'

// 热门精选 - 火热图标
export const HotPickIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C16 14 12 22 12 28C12 34.6274 17.3726 40 24 40C30.6274 40 36 34.6274 36 28C36 22 32 14 24 4Z" fill="currentColor" opacity="0.8" />
    <path d="M24 16C20 22 18 26 18 30C18 33.3137 20.6863 36 24 36C27.3137 36 30 33.3137 30 30C30 26 28 22 24 16Z" fill="white" opacity="0.6" />
  </svg>
)

// 限时特惠 - 时钟折扣图标
export const TimeLimitIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.8" />
    <path d="M24 14V24L30 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
  </svg>
)

// 情侣约会 - 浪漫爱心图标
export const CoupleDateIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 14C10.5817 14 7 17.5817 7 22C7 30 24 40 24 40C24 40 41 30 41 22C41 17.5817 37.4183 14 33 14C29.6133 14 26.7167 16.102 25.1328 18.9103L24 20.892L22.8672 18.9103C21.2833 16.102 18.3867 14 15 14Z" fill="currentColor" opacity="0.8" />
    <circle cx="15" cy="20" r="3" fill="white" opacity="0.5" />
    <circle cx="33" cy="20" r="3" fill="white" opacity="0.5" />
  </svg>
)

// 影音电竞 - 游戏手柄图标
export const EsportsIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="40" height="20" rx="10" fill="currentColor" opacity="0.8" />
    <path d="M14 24H22M18 20V28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    <circle cx="32" cy="26" r="3" fill="white" opacity="0.9" />
    <circle cx="28" cy="20" r="3" fill="white" opacity="0.9" />
  </svg>
)