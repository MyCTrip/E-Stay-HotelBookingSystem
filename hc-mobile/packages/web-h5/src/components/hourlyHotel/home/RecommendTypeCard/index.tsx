/**
 * 钟点房推荐类型卡片组件
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss' // 直接复用你发给我的那个样式表就行

export interface RecommendTypeCardProps {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  backgroundGradient: string | { from: string; to: string }
  searchParams?: {
    city?: string
    tag?: string
    [key: string]: string | undefined
  }
  onClick?: () => void
}

const RecommendTypeCard: React.FC<RecommendTypeCardProps> = ({
  title,
  subtitle,
  icon,
  backgroundGradient,
  searchParams = {},
  onClick,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (searchParams && Object.keys(searchParams).length > 0) {
      const queryParams = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
      // ⭐ 这里把 homeStay 改成了 hourlyRoom，适应钟点房模块
      navigate(`/search/hourlyHotel?${queryParams.toString()}`)
    }
  }

  const getBackgroundStyle = () => {
    if (typeof backgroundGradient === 'string') {
      return { background: backgroundGradient }
    }
    return {
      background: `linear-gradient(135deg, ${backgroundGradient.from} 0%, ${backgroundGradient.to} 100%)`,
    }
  }

  return (
    <div className={styles.card} style={getBackgroundStyle()} onClick={handleClick}>
      <div className={styles.textSection}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.iconContainer}>
        {icon}
      </div>
    </div>
  )
}

export default React.memo(RecommendTypeCard)