import React from 'react'
import RecommendTypeCard, { RecommendTypeCardProps } from '../RecommendTypeCard'
import { PetFriendlyIcon, QualityHouseIcon, WeekendDealsIcon } from '../RecommendTypeCard/icons'
import styles from './index.module.scss'

export interface RecommendTypesProps {
  items?: RecommendTypeCardProps[]
  columns?: number
  gap?: number | string
  padding?: number | string
  className?: string
}

const DEFAULT_RECOMMEND_TYPES: RecommendTypeCardProps[] = [
  {
    id: 'star-select',
    title: '星级优选',
    subtitle: '高分酒店 品质入住',
    icon: <QualityHouseIcon />,
    backgroundGradient: {
      from: '#FFE4E1',
      to: '#FFC0CB',
    },
    searchParams: {
      city: '上海',
      tag: 'star-select',
    },
  },
  {
    id: 'business-travel',
    title: '商务出行',
    subtitle: '高效通勤 配套完善',
    icon: <PetFriendlyIcon />,
    backgroundGradient: {
      from: '#FFF8DC',
      to: '#FFE4B5',
    },
    searchParams: {
      city: '上海',
      tag: 'business-travel',
    },
  },
  {
    id: 'near-subway',
    title: '近地铁',
    subtitle: '交通便利 轻松抵达',
    icon: <WeekendDealsIcon />,
    backgroundGradient: {
      from: '#E0FFE0',
      to: '#C0FFC0',
    },
    searchParams: {
      city: '上海',
      tag: 'near-subway',
    },
  },
  {
    id: 'special-offer',
    title: '特惠促销',
    subtitle: '限时好价 先订先得',
    icon: <WeekendDealsIcon />,
    backgroundGradient: {
      from: '#E0F2FF',
      to: '#C2E3FF',
    },
    searchParams: {
      city: '上海',
      tag: 'special-offer',
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
