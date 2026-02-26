import React from 'react'
import RecommendTypeCard, { RecommendTypeCardProps } from '../RecommendTypeCard'
// 引入我们刚刚建的四个钟点房专属图标
import { HotPickIcon, TimeLimitIcon, CoupleDateIcon, EsportsIcon } from '../RecommendTypeCard/icons'
import styles from './index.module.scss' // 这个样式表也可以直接复用民宿的

export interface RecommendTypesProps {
  items?: RecommendTypeCardProps[]
  columns?: number
  gap?: number | string
  padding?: number | string
  className?: string
}


const HOURLY_RECOMMEND_TYPES: RecommendTypeCardProps[] = [
  {
    id: 'hot-picks',
    title: '热门精选',
    subtitle: '好评盲选不亏',
    icon: <HotPickIcon />,
    backgroundGradient: { from: '#FFEAEA', to: '#FFD6D6' }, // 浅红
    searchParams: { city: '上海', tag: 'hot' },
  },
  {
    id: 'time-limited',
    title: '限时特惠',
    subtitle: '超值特价房源',
    icon: <TimeLimitIcon />,
    backgroundGradient: { from: '#FFF4E6', to: '#FFE1B5' }, // 浅橙
    searchParams: { city: '上海', tag: 'discount' },
  },
  {
    id: 'couple-date',
    title: '情侣约会',
    subtitle: '浪漫氛围升温',
    icon: <CoupleDateIcon />,
    backgroundGradient: { from: '#FCEEF7', to: '#F6D2EC' }, // 浅粉紫
    searchParams: { city: '上海', tag: 'couple' },
  },
  {
    id: 'esports-movie',
    title: '影音电竞',
    subtitle: '大屏组队开黑',
    icon: <EsportsIcon />,
    backgroundGradient: { from: '#E8F4FF', to: '#C4E4FF' }, // 浅蓝
    searchParams: { city: '上海', tag: 'esports' },
  }
]

const RecommendTypes: React.FC<RecommendTypesProps> = ({
  items = HOURLY_RECOMMEND_TYPES,
  columns = 4, // 强制默认排成 4 列
  gap = 8,
  padding = 16,
  className,
}) => {
  const gridStyle = {
    display: 'grid',
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