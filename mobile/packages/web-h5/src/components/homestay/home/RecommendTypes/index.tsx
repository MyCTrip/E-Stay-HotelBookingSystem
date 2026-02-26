/**
 * 推荐类型区域组件
 * 展示多个推荐类型卡片的容器，支持灵活的布局配置
 */

import React from 'react'
import RecommendTypeCard, { RecommendTypeCardProps } from '../RecommendTypeCard'
import { QualityHouseIcon, PetFriendlyIcon, WeekendDealsIcon } from '../RecommendTypeCard/icons'
import styles from './index.module.scss'

export interface RecommendTypesProps {
  items?: RecommendTypeCardProps[]
  columns?: number // 列数
  gap?: number | string // 间距
  padding?: number | string // 容器 padding
  className?: string
}

// 默认推荐类型数据
const DEFAULT_RECOMMEND_TYPES: RecommendTypeCardProps[] = [
  {
    id: 'quality-houses',
    title: '品质好房',
    subtitle: '平台甄选 入住无忧',
    icon: <QualityHouseIcon />,
    backgroundGradient: {
      from: '#FFE4E1',
      to: '#FFC0CB',
    },
    searchParams: {
      city: '上海',
      tag: 'quality',
    },
  },
  {
    id: 'pet-friendly',
    title: '携宠出游',
    subtitle: '带毛孩子撒欢',
    icon: <PetFriendlyIcon />,
    backgroundGradient: {
      from: '#FFF8DC',
      to: '#FFE4B5',
    },
    searchParams: {
      city: '上海',
      tag: 'pet-friendly',
    },
  },
  {
    id: 'weekend-deals',
    title: '周末不加价',
    subtitle: '订民宿折上折',
    icon: <WeekendDealsIcon />,
    backgroundGradient: {
      from: '#E0FFE0',
      to: '#C0FFC0',
    },
    searchParams: {
      city: '上海',
      tag: 'weekend-deals',
    },
  },
]

const RecommendTypes: React.FC<RecommendTypesProps> = ({
  items = DEFAULT_RECOMMEND_TYPES,
  columns = 3,
  gap = 8,
  padding = 16,
  className,
}) => {
  // 网格样式
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
  }

  return (
    <div className={`${styles.container} ${className || ''}`} style={gridStyle}>
      {items.map((item) => (
        <RecommendTypeCard key={item.id} {...item} />
      ))}
    </div>
  )
}

export default React.memo(RecommendTypes)
